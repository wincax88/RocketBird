<template>
  <view class="records-page">
    <!-- 统计信息 -->
    <view class="stats-card">
      <view class="stat-item">
        <text class="value">{{ stats.totalCheckins }}</text>
        <text class="label">累计打卡</text>
      </view>
      <view class="stat-item">
        <text class="value">{{ stats.continuousDays }}</text>
        <text class="label">连续天数</text>
      </view>
      <view class="stat-item">
        <text class="value">{{ stats.totalShares }}</text>
        <text class="label">分享次数</text>
      </view>
      <view class="stat-item">
        <text class="value">{{ stats.totalPoints }}</text>
        <text class="label">获得积分</text>
      </view>
    </view>

    <!-- 日历 -->
    <view class="calendar-section">
      <view class="calendar-header">
        <text class="arrow" @click="prevMonth">‹</text>
        <text class="month-text">{{ currentYear }}年{{ currentMonth }}月</text>
        <text class="arrow" @click="nextMonth">›</text>
      </view>
      <view class="weekday-row">
        <text class="weekday" v-for="day in weekdays" :key="day">{{ day }}</text>
      </view>
      <view class="days-grid">
        <view
          class="day-cell"
          v-for="(day, index) in calendarDays"
          :key="index"
          :class="{ empty: !day.date, today: day.isToday, checked: day.count > 0 }"
        >
          <text class="day-num">{{ day.day }}</text>
          <view class="dot" v-if="day.count > 0"></view>
        </view>
      </view>
    </view>

    <!-- 记录列表 -->
    <view class="record-list">
      <view class="list-title">打卡记录</view>
      <view
        class="record-item"
        v-for="record in records"
        :key="record.recordId"
        @click="showDetail(record)"
      >
        <view class="record-header">
          <text class="theme-name">{{ record.themeName }}</text>
          <text class="reward">+{{ record.rewardPoints }}积分</text>
        </view>
        <view class="record-images" v-if="record.images.length">
          <image
            class="record-image"
            v-for="(img, idx) in record.images.slice(0, 3)"
            :key="idx"
            :src="img"
            mode="aspectFill"
          />
          <view class="more-images" v-if="record.images.length > 3">
            +{{ record.images.length - 3 }}
          </view>
        </view>
        <text class="record-content" v-if="record.content">{{ record.content }}</text>
        <view class="record-footer">
          <text class="record-time">{{ formatDate(record.createdAt) }}</text>
          <view class="record-actions">
            <text class="action share" v-if="!record.isShared" @click.stop="handleShare(record)">
              分享得积分
            </text>
            <text class="action shared" v-else>已分享</text>
          </view>
        </view>
      </view>

      <!-- 加载更多 -->
      <view class="load-more" v-if="hasMore">
        <text @click="loadMore">加载更多</text>
      </view>
      <view class="no-more" v-else-if="records.length > 0">
        <text>没有更多了</text>
      </view>

      <!-- 空状态 -->
      <view class="empty" v-if="!loading && records.length === 0">
        <image src="/static/empty.png" mode="aspectFit" class="empty-image" />
        <text>暂无打卡记录</text>
      </view>
    </view>

    <!-- 详情弹窗 -->
    <view class="detail-modal" v-if="showDetailModal" @click="showDetailModal = false">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">打卡详情</text>
          <text class="close-btn" @click="showDetailModal = false">×</text>
        </view>
        <scroll-view class="modal-body" scroll-y v-if="currentRecord">
          <view class="detail-theme">
            <text class="theme-label">打卡主题</text>
            <text class="theme-value">{{ currentRecord.themeName }}</text>
          </view>
          <view class="detail-images" v-if="currentRecord.images.length">
            <image
              class="detail-image"
              v-for="(img, idx) in currentRecord.images"
              :key="idx"
              :src="img"
              mode="aspectFill"
              @click="previewImages(currentRecord.images, idx)"
            />
          </view>
          <view class="detail-content" v-if="currentRecord.content">
            <text>{{ currentRecord.content }}</text>
          </view>
          <view class="detail-location" v-if="currentRecord.location">
            <text class="location-icon">📍</text>
            <text>{{ currentRecord.location.name }}</text>
          </view>
          <view class="detail-info">
            <view class="info-item">
              <text class="info-label">打卡时间</text>
              <text class="info-value">{{ formatDate(currentRecord.createdAt) }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">获得积分</text>
              <text class="info-value reward">+{{ currentRecord.rewardPoints }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">分享状态</text>
              <text class="info-value" :class="{ shared: currentRecord.isShared }">
                {{ currentRecord.isShared ? '已分享' : '未分享' }}
              </text>
            </view>
          </view>
        </scroll-view>
        <view class="modal-footer" v-if="currentRecord && !currentRecord.isShared">
          <button class="share-btn" @click="handleShare(currentRecord)">分享得积分</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onShow, onReachBottom, onLoad } from '@dcloudio/uni-app';
import { checkinApi } from '@/api';
import { formatDate } from '@rocketbird/shared';
import type { ICheckinRecord } from '@rocketbird/shared';

const loading = ref(false);
const records = ref<ICheckinRecord[]>([]);
const page = ref(1);
const pageSize = 10;
const hasMore = ref(true);

const stats = ref({
  totalCheckins: 0,
  continuousDays: 0,
  totalShares: 0,
  totalPoints: 0,
});

// 日历相关
const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth() + 1);
const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
const calendarData = ref<{ date: string; count: number }[]>([]);

const showDetailModal = ref(false);
const currentRecord = ref<ICheckinRecord | null>(null);

// 计算日历天数
const calendarDays = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();
  const today = new Date();

  const days: { date: string; day: string; isToday: boolean; count: number }[] = [];

  // 填充空白天数
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push({ date: '', day: '', isToday: false, count: 0 });
  }

  // 填充当月天数
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const isToday =
      year === today.getFullYear() && month === today.getMonth() + 1 && i === today.getDate();
    const dayData = calendarData.value.find((d) => d.date === dateStr);
    days.push({
      date: dateStr,
      day: String(i),
      isToday,
      count: dayData?.count || 0,
    });
  }

  return days;
});

// 加载统计
const loadStats = async () => {
  try {
    const res = await checkinApi.getCheckinStats();
    stats.value = res;
  } catch (error) {
    console.error('加载统计失败', error);
  }
};

// 加载日历数据
const loadCalendar = async () => {
  try {
    const res = await checkinApi.getCheckinCalendar({
      year: currentYear.value,
      month: currentMonth.value,
    });
    calendarData.value = res;
  } catch (error) {
    console.error('加载日历失败', error);
  }
};

// 加载记录
const loadRecords = async (refresh = false) => {
  if (loading.value) return;

  try {
    loading.value = true;
    if (refresh) {
      page.value = 1;
      hasMore.value = true;
    }

    const res = await checkinApi.getMyRecords({
      page: page.value,
      pageSize,
    });

    if (refresh) {
      records.value = res.list;
    } else {
      records.value = [...records.value, ...res.list];
    }

    hasMore.value = res.list.length === pageSize;
  } catch (error) {
    console.error('加载记录失败', error);
  } finally {
    loading.value = false;
  }
};

const loadMore = () => {
  if (hasMore.value && !loading.value) {
    page.value++;
    loadRecords();
  }
};

// 切换月份
const prevMonth = () => {
  if (currentMonth.value === 1) {
    currentYear.value--;
    currentMonth.value = 12;
  } else {
    currentMonth.value--;
  }
  loadCalendar();
};

const nextMonth = () => {
  if (currentMonth.value === 12) {
    currentYear.value++;
    currentMonth.value = 1;
  } else {
    currentMonth.value++;
  }
  loadCalendar();
};

// 显示详情
const showDetail = (record: ICheckinRecord) => {
  currentRecord.value = record;
  showDetailModal.value = true;
};

// 预览图片
const previewImages = (urls: string[], current: number) => {
  uni.previewImage({
    urls,
    current,
  });
};

// 分享
const handleShare = async (record: ICheckinRecord) => {
  try {
    uni.showLoading({ title: '生成海报...' });
    const res = await checkinApi.generateSharePoster(record.recordId);

    // 预览分享海报
    uni.previewImage({
      urls: [res.posterUrl],
      current: 0,
    });

    // 分享回调
    await checkinApi.shareCallback(record.recordId);

    // 更新记录状态
    record.isShared = true;

    uni.showToast({ title: '分享成功', icon: 'success' });
    loadStats(); // 刷新统计
  } catch (error) {
    console.error('分享失败', error);
    uni.showToast({ title: '分享失败', icon: 'none' });
  } finally {
    uni.hideLoading();
  }
};

onLoad((options) => {
  // 如果传入了id，显示详情
  if (options?.id) {
    checkinApi.getRecordDetail(options.id).then((record) => {
      currentRecord.value = record;
      showDetailModal.value = true;
    });
  }
});

onShow(() => {
  loadStats();
  loadCalendar();
  loadRecords(true);
});

onReachBottom(() => {
  loadMore();
});
</script>

<style lang="scss" scoped>
.records-page {
  min-height: 100vh;
  background: $bg-color;
  padding-bottom: env(safe-area-inset-bottom);
}

.stats-card {
  display: flex;
  background: linear-gradient(135deg, #52c41a, #73d13d);
  margin: 24rpx;
  padding: 32rpx;
  border-radius: $radius-lg;
  color: #fff;

  .stat-item {
    flex: 1;
    text-align: center;

    .value {
      display: block;
      font-size: 40rpx;
      font-weight: 600;
    }

    .label {
      display: block;
      font-size: 22rpx;
      opacity: 0.9;
      margin-top: 8rpx;
    }
  }
}

.calendar-section {
  background: #fff;
  margin: 24rpx;
  padding: 24rpx;
  border-radius: $radius-lg;

  .calendar-header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 24rpx;

    .arrow {
      width: 60rpx;
      height: 60rpx;
      line-height: 60rpx;
      text-align: center;
      font-size: 40rpx;
      color: $text-secondary;
    }

    .month-text {
      font-size: 32rpx;
      font-weight: 500;
      color: $text-color;
      margin: 0 24rpx;
    }
  }

  .weekday-row {
    display: flex;
    margin-bottom: 16rpx;

    .weekday {
      flex: 1;
      text-align: center;
      font-size: 24rpx;
      color: $text-secondary;
    }
  }

  .days-grid {
    display: flex;
    flex-wrap: wrap;

    .day-cell {
      width: calc(100% / 7);
      height: 80rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .day-num {
        font-size: 28rpx;
        color: $text-color;
      }

      .dot {
        width: 10rpx;
        height: 10rpx;
        background: $primary-color;
        border-radius: 50%;
        margin-top: 4rpx;
      }

      &.empty .day-num {
        visibility: hidden;
      }

      &.today .day-num {
        background: $primary-color;
        color: #fff;
        width: 48rpx;
        height: 48rpx;
        line-height: 48rpx;
        text-align: center;
        border-radius: 50%;
      }

      &.checked .day-num {
        color: $primary-color;
        font-weight: 500;
      }
    }
  }
}

.record-list {
  background: #fff;
  margin: 24rpx;
  padding: 24rpx;
  border-radius: $radius-lg;

  .list-title {
    font-size: 32rpx;
    font-weight: 500;
    color: $text-color;
    margin-bottom: 24rpx;
  }

  .record-item {
    padding: 24rpx 0;
    border-bottom: 1rpx solid $border-color;

    &:last-child {
      border-bottom: none;
    }

    .record-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16rpx;

      .theme-name {
        font-size: 30rpx;
        font-weight: 500;
        color: $text-color;
      }

      .reward {
        font-size: 26rpx;
        color: $primary-color;
      }
    }

    .record-images {
      display: flex;
      gap: 12rpx;
      margin-bottom: 16rpx;

      .record-image {
        width: 160rpx;
        height: 160rpx;
        border-radius: $radius-md;
      }

      .more-images {
        width: 160rpx;
        height: 160rpx;
        background: rgba(0, 0, 0, 0.5);
        border-radius: $radius-md;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 28rpx;
      }
    }

    .record-content {
      font-size: 28rpx;
      color: $text-secondary;
      margin-bottom: 16rpx;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .record-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .record-time {
        font-size: 24rpx;
        color: $text-placeholder;
      }

      .record-actions {
        .action {
          font-size: 24rpx;
          padding: 8rpx 20rpx;
          border-radius: $radius-full;

          &.share {
            color: #fff;
            background: $primary-color;
          }

          &.shared {
            color: $text-placeholder;
          }
        }
      }
    }
  }
}

.load-more,
.no-more {
  text-align: center;
  padding: 32rpx;
  color: $text-placeholder;
  font-size: 26rpx;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
  color: $text-placeholder;

  .empty-image {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 24rpx;
  }
}

// 详情弹窗
.detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;

  .modal-content {
    width: 90%;
    max-height: 80vh;
    background: #fff;
    border-radius: $radius-lg;
    display: flex;
    flex-direction: column;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 32rpx;
    border-bottom: 1rpx solid $border-color;

    .modal-title {
      font-size: 32rpx;
      font-weight: 500;
      color: $text-color;
    }

    .close-btn {
      font-size: 40rpx;
      color: $text-placeholder;
    }
  }

  .modal-body {
    flex: 1;
    padding: 32rpx;

    .detail-theme {
      display: flex;
      justify-content: space-between;
      margin-bottom: 24rpx;

      .theme-label {
        font-size: 28rpx;
        color: $text-secondary;
      }

      .theme-value {
        font-size: 28rpx;
        color: $text-color;
        font-weight: 500;
      }
    }

    .detail-images {
      display: flex;
      flex-wrap: wrap;
      gap: 12rpx;
      margin-bottom: 24rpx;

      .detail-image {
        width: calc((100% - 24rpx) / 3);
        aspect-ratio: 1;
        border-radius: $radius-md;
      }
    }

    .detail-content {
      font-size: 28rpx;
      color: $text-color;
      line-height: 1.6;
      margin-bottom: 24rpx;
      padding: 20rpx;
      background: $bg-color;
      border-radius: $radius-md;
    }

    .detail-location {
      display: flex;
      align-items: center;
      gap: 8rpx;
      font-size: 26rpx;
      color: $text-secondary;
      margin-bottom: 24rpx;
    }

    .detail-info {
      .info-item {
        display: flex;
        justify-content: space-between;
        padding: 16rpx 0;
        border-bottom: 1rpx solid $border-color;

        &:last-child {
          border-bottom: none;
        }

        .info-label {
          font-size: 28rpx;
          color: $text-secondary;
        }

        .info-value {
          font-size: 28rpx;
          color: $text-color;

          &.reward {
            color: $primary-color;
          }

          &.shared {
            color: $success-color;
          }
        }
      }
    }
  }

  .modal-footer {
    padding: 24rpx 32rpx;
    border-top: 1rpx solid $border-color;

    .share-btn {
      width: 100%;
      height: 80rpx;
      line-height: 80rpx;
      background: $primary-color;
      color: #fff;
      font-size: 30rpx;
      border-radius: $radius-full;
    }
  }
}
</style>
