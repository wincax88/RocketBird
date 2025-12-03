<template>
  <view class="benefits-page">
    <!-- 福利统计 -->
    <view class="stats-card">
      <view class="stat-item">
        <text class="value">{{ benefitStats.total }}</text>
        <text class="label">全部福利</text>
      </view>
      <view class="stat-item">
        <text class="value">{{ benefitStats.pending }}</text>
        <text class="label">待领取</text>
      </view>
      <view class="stat-item">
        <text class="value">{{ benefitStats.claimed }}</text>
        <text class="label">已领取</text>
      </view>
      <view class="stat-item">
        <text class="value">{{ benefitStats.used }}</text>
        <text class="label">已使用</text>
      </view>
    </view>

    <!-- 筛选 -->
    <view class="filter-bar">
      <view
        class="filter-item"
        :class="{ active: currentFilter === 'all' }"
        @click="changeFilter('all')"
      >
        全部
      </view>
      <view
        class="filter-item"
        :class="{ active: currentFilter === 'pending' }"
        @click="changeFilter('pending')"
      >
        待领取
      </view>
      <view
        class="filter-item"
        :class="{ active: currentFilter === 'claimed' }"
        @click="changeFilter('claimed')"
      >
        已领取
      </view>
      <view
        class="filter-item"
        :class="{ active: currentFilter === 'used' }"
        @click="changeFilter('used')"
      >
        已使用
      </view>
    </view>

    <!-- 福利列表 -->
    <view class="benefit-list">
      <view
        class="benefit-item"
        v-for="record in records"
        :key="record.recordId"
        :class="{ disabled: record.status === 3 || record.status === 4 }"
      >
        <view class="benefit-icon">{{ getGiftIcon(record.giftType) }}</view>
        <view class="benefit-info">
          <text class="benefit-name">{{ record.giftName }}</text>
          <text class="benefit-desc">{{ record.description }}</text>
          <text class="benefit-time">
            {{ record.status === 0 ? '待领取' : `有效期至 ${formatDate(record.expireAt)}` }}
          </text>
        </view>
        <view class="benefit-action">
          <button
            class="claim-btn"
            v-if="record.status === 0"
            @click="handleClaim(record)"
          >
            领取
          </button>
          <button
            class="use-btn"
            v-else-if="record.status === 1"
            @click="handleUse(record)"
          >
            使用
          </button>
          <text class="status-text" v-else-if="record.status === 2">已使用</text>
          <text class="status-text expired" v-else-if="record.status === 3">已过期</text>
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
        <text>暂无福利</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onShow, onReachBottom } from '@dcloudio/uni-app';
import { benefitsApi } from '@/api';
import { formatDate } from '@rocketbird/shared';
import type { GiftRecord } from '@rocketbird/shared';

const loading = ref(false);
const records = ref<GiftRecord[]>([]);
const page = ref(1);
const pageSize = 10;
const hasMore = ref(true);
const currentFilter = ref('all');

const benefitStats = ref({
  total: 0,
  pending: 0,
  claimed: 0,
  used: 0,
});

const getStatusValue = computed(() => {
  const map: Record<string, number | undefined> = {
    all: undefined,
    pending: 0,
    claimed: 1,
    used: 2,
  };
  return map[currentFilter.value];
});

const getGiftIcon = (type: string) => {
  const icons: Record<string, string> = {
    coupon: '🎫',
    points: '💎',
    gift: '🎁',
    voucher: '🏷️',
    membership: '👑',
  };
  return icons[type] || '🎁';
};

// 加载福利统计
const loadStats = async () => {
  try {
    const res = await benefitsApi.getMyBenefits();
    benefitStats.value = {
      total: res.total || 0,
      pending: res.pending || 0,
      claimed: res.claimed || 0,
      used: res.used || 0,
    };
  } catch (error) {
    console.error('加载统计失败', error);
  }
};

// 加载福利记录
const loadRecords = async (refresh = false) => {
  if (loading.value) return;

  try {
    loading.value = true;
    if (refresh) {
      page.value = 1;
      hasMore.value = true;
    }

    const res = await benefitsApi.getBenefitRecords({
      status: getStatusValue.value,
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

const changeFilter = (filter: string) => {
  currentFilter.value = filter;
  loadRecords(true);
};

// 领取福利
const handleClaim = async (record: GiftRecord) => {
  try {
    uni.showLoading({ title: '领取中...' });
    await benefitsApi.claimBenefit(record.recordId);
    record.status = 1;
    uni.showToast({ title: '领取成功', icon: 'success' });
    loadStats();
  } catch (error) {
    console.error('领取失败', error);
    uni.showToast({ title: '领取失败', icon: 'none' });
  } finally {
    uni.hideLoading();
  }
};

// 使用福利
const handleUse = (record: GiftRecord) => {
  // 根据福利类型跳转到不同页面
  if (record.giftType === 'coupon') {
    uni.navigateTo({ url: '/pages/points/mall' });
  } else {
    uni.showToast({ title: '请到对应页面使用', icon: 'none' });
  }
};

onShow(() => {
  loadStats();
  loadRecords(true);
});

onReachBottom(() => {
  loadMore();
});
</script>

<style lang="scss" scoped>
.benefits-page {
  min-height: 100vh;
  background: $bg-color;
  padding-bottom: env(safe-area-inset-bottom);
}

.stats-card {
  display: flex;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  margin: 24rpx;
  padding: 40rpx;
  border-radius: $radius-lg;
  color: #fff;

  .stat-item {
    flex: 1;
    text-align: center;

    .value {
      display: block;
      font-size: 48rpx;
      font-weight: 600;
    }

    .label {
      display: block;
      font-size: 24rpx;
      opacity: 0.9;
      margin-top: 8rpx;
    }
  }
}

.filter-bar {
  display: flex;
  background: #fff;
  margin: 0 24rpx;
  padding: 16rpx;
  border-radius: $radius-lg;
  gap: 16rpx;

  .filter-item {
    flex: 1;
    text-align: center;
    padding: 16rpx;
    font-size: 28rpx;
    color: $text-secondary;
    border-radius: $radius-md;

    &.active {
      color: #fff;
      background: $primary-color;
    }
  }
}

.benefit-list {
  margin: 24rpx;

  .benefit-item {
    display: flex;
    align-items: center;
    background: #fff;
    padding: 24rpx;
    border-radius: $radius-lg;
    margin-bottom: 16rpx;

    &.disabled {
      opacity: 0.6;
    }

    .benefit-icon {
      width: 100rpx;
      height: 100rpx;
      line-height: 100rpx;
      text-align: center;
      font-size: 48rpx;
      background: $bg-color;
      border-radius: $radius-md;
    }

    .benefit-info {
      flex: 1;
      margin-left: 20rpx;

      .benefit-name {
        display: block;
        font-size: 30rpx;
        color: $text-color;
        font-weight: 500;
      }

      .benefit-desc {
        display: block;
        font-size: 26rpx;
        color: $text-secondary;
        margin-top: 8rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .benefit-time {
        display: block;
        font-size: 24rpx;
        color: $text-placeholder;
        margin-top: 8rpx;
      }
    }

    .benefit-action {
      .claim-btn,
      .use-btn {
        padding: 12rpx 32rpx;
        font-size: 26rpx;
        border-radius: $radius-full;
      }

      .claim-btn {
        background: $primary-color;
        color: #fff;
      }

      .use-btn {
        background: #ff6b6b;
        color: #fff;
      }

      .status-text {
        font-size: 26rpx;
        color: $text-placeholder;

        &.expired {
          color: #ff4d4f;
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
  padding: 120rpx 0;
  color: $text-placeholder;

  .empty-image {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 24rpx;
  }
}
</style>
