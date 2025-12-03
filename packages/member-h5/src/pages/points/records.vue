<template>
  <view class="records-page">
    <!-- 积分余额 -->
    <view class="balance-card">
      <view class="balance-item">
        <text class="value">{{ balance.availablePoints }}</text>
        <text class="label">可用积分</text>
      </view>
      <view class="balance-item">
        <text class="value">{{ balance.totalPoints }}</text>
        <text class="label">累计获得</text>
      </view>
    </view>

    <!-- 筛选 -->
    <view class="filter-bar">
      <view
        class="filter-item"
        :class="{ active: currentType === '' }"
        @click="changeType('')"
      >
        全部
      </view>
      <view
        class="filter-item"
        :class="{ active: currentType === 'earn' }"
        @click="changeType('earn')"
      >
        获得
      </view>
      <view
        class="filter-item"
        :class="{ active: currentType === 'consume' }"
        @click="changeType('consume')"
      >
        消费
      </view>
    </view>

    <!-- 记录列表 -->
    <view class="record-list">
      <view class="record-item" v-for="record in records" :key="record.recordId">
        <view class="record-info">
          <text class="record-title">{{ record.description }}</text>
          <text class="record-time">{{ formatDateTime(record.createdAt) }}</text>
        </view>
        <text class="record-points" :class="{ positive: record.type === 'earn' }">
          {{ record.type === 'earn' ? '+' : '-' }}{{ record.points }}
        </text>
      </view>
    </view>

    <!-- 加载更多 -->
    <view class="load-more" v-if="hasMore" @click="loadMore">
      <text>加载更多</text>
    </view>
    <view class="no-more" v-else-if="records.length > 0">
      <text>没有更多了</text>
    </view>

    <!-- 空状态 -->
    <view class="empty" v-if="!loading && records.length === 0">
      <text>暂无积分记录</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onShow, onReachBottom } from '@dcloudio/uni-app';
import { pointsApi } from '@/api';
import type { IPointsRecord } from '@rocketbird/shared';

const loading = ref(false);
const records = ref<IPointsRecord[]>([]);
const currentType = ref('');
const page = ref(1);
const pageSize = 20;
const hasMore = ref(true);

const balance = ref({
  totalPoints: 0,
  availablePoints: 0,
});

const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const loadBalance = async () => {
  try {
    const res = await pointsApi.getPointsBalance();
    balance.value = res;
  } catch (error) {
    console.error('加载余额失败', error);
  }
};

const loadRecords = async (refresh = false) => {
  if (loading.value) return;

  try {
    loading.value = true;
    if (refresh) {
      page.value = 1;
      hasMore.value = true;
    }

    const res = await pointsApi.getPointsRecords({
      type: currentType.value || undefined,
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

const changeType = (type: string) => {
  currentType.value = type;
  loadRecords(true);
};

const loadMore = () => {
  if (hasMore.value && !loading.value) {
    page.value++;
    loadRecords();
  }
};

onShow(() => {
  loadBalance();
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
}

.balance-card {
  display: flex;
  background: linear-gradient(135deg, $primary-color, $primary-light);
  margin: 24rpx;
  padding: 40rpx;
  border-radius: $radius-lg;
  color: #fff;

  .balance-item {
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
  padding: 24rpx 32rpx;
  gap: 24rpx;

  .filter-item {
    padding: 12rpx 32rpx;
    font-size: 28rpx;
    color: $text-secondary;
    background: $bg-color;
    border-radius: $radius-full;

    &.active {
      color: #fff;
      background: $primary-color;
    }
  }
}

.record-list {
  background: #fff;
  margin: 24rpx;
  border-radius: $radius-lg;
  padding: 0 24rpx;

  .record-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 28rpx 0;
    border-bottom: 1rpx solid $border-color;

    &:last-child {
      border-bottom: none;
    }

    .record-info {
      .record-title {
        display: block;
        font-size: 28rpx;
        color: $text-color;
      }

      .record-time {
        display: block;
        font-size: 24rpx;
        color: $text-placeholder;
        margin-top: 8rpx;
      }
    }

    .record-points {
      font-size: 32rpx;
      font-weight: 500;
      color: $text-secondary;

      &.positive {
        color: $success-color;
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
  text-align: center;
  padding: 120rpx 0;
  color: $text-placeholder;
}
</style>
