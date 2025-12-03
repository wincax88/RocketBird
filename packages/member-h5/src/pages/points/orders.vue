<template>
  <view class="orders-page">
    <!-- 筛选 -->
    <view class="filter-bar">
      <view
        class="filter-item"
        :class="{ active: currentStatus === undefined }"
        @click="changeStatus(undefined)"
      >
        全部
      </view>
      <view
        class="filter-item"
        :class="{ active: currentStatus === 0 }"
        @click="changeStatus(0)"
      >
        待核销
      </view>
      <view
        class="filter-item"
        :class="{ active: currentStatus === 1 }"
        @click="changeStatus(1)"
      >
        已使用
      </view>
      <view
        class="filter-item"
        :class="{ active: currentStatus === 2 }"
        @click="changeStatus(2)"
      >
        已过期
      </view>
    </view>

    <!-- 订单列表 -->
    <view class="order-list">
      <view class="order-item" v-for="order in orders" :key="order.orderId">
        <view class="order-header">
          <text class="order-no">订单号: {{ order.orderId }}</text>
          <text class="order-status" :class="getStatusClass(order.status)">
            {{ getStatusText(order.status) }}
          </text>
        </view>
        <view class="order-content">
          <image class="product-image" :src="order.coverImage" mode="aspectFill" />
          <view class="product-info">
            <text class="product-name">{{ order.productName }}</text>
            <view class="product-meta">
              <text class="points">{{ order.pointsCost }} 积分</text>
              <text class="quantity">x{{ order.quantity }}</text>
            </view>
          </view>
        </view>
        <view class="order-footer">
          <text class="order-time">{{ formatDateTime(order.createdAt) }}</text>
          <view class="order-actions">
            <button
              v-if="order.status === 0"
              class="btn-use"
              @click="showQrCode(order)"
            >
              出示核销码
            </button>
          </view>
        </view>
      </view>
    </view>

    <!-- 加载更多 -->
    <view class="load-more" v-if="hasMore" @click="loadMore">
      <text>加载更多</text>
    </view>
    <view class="no-more" v-else-if="orders.length > 0">
      <text>没有更多了</text>
    </view>

    <!-- 空状态 -->
    <view class="empty" v-if="!loading && orders.length === 0">
      <text>暂无兑换记录</text>
      <button class="btn-go-mall" @click="goMall">去兑换</button>
    </view>

    <!-- 核销码弹窗 -->
    <view class="qrcode-modal" v-if="showModal" @click="showModal = false">
      <view class="modal-content" @click.stop>
        <text class="modal-title">核销码</text>
        <image class="qrcode-image" :src="currentOrder?.qrCode" mode="aspectFit" v-if="currentOrder?.qrCode" />
        <text class="order-code">{{ currentOrder?.orderId }}</text>
        <text class="modal-tip">请出示此码给工作人员扫描核销</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onShow, onReachBottom } from '@dcloudio/uni-app';
import { pointsApi } from '@/api';
import type { IExchangeOrder } from '@rocketbird/shared';

const loading = ref(false);
const orders = ref<IExchangeOrder[]>([]);
const currentStatus = ref<number | undefined>(undefined);
const page = ref(1);
const pageSize = 20;
const hasMore = ref(true);

const showModal = ref(false);
const currentOrder = ref<IExchangeOrder | null>(null);

const formatDateTime = (dateStr?: string) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const getStatusText = (status: number) => {
  const statusMap: Record<number, string> = {
    0: '待核销',
    1: '已使用',
    2: '已过期',
  };
  return statusMap[status] || '未知';
};

const getStatusClass = (status: number) => {
  return {
    pending: status === 0,
    used: status === 1,
    expired: status === 2,
  };
};

const loadOrders = async (refresh = false) => {
  if (loading.value) return;

  try {
    loading.value = true;
    if (refresh) {
      page.value = 1;
      hasMore.value = true;
    }

    const res = await pointsApi.getExchangeOrders({
      status: currentStatus.value,
      page: page.value,
      pageSize,
    });

    if (refresh) {
      orders.value = res.list;
    } else {
      orders.value = [...orders.value, ...res.list];
    }

    hasMore.value = res.list.length === pageSize;
  } catch (error) {
    console.error('加载订单失败', error);
  } finally {
    loading.value = false;
  }
};

const changeStatus = (status: number | undefined) => {
  currentStatus.value = status;
  loadOrders(true);
};

const loadMore = () => {
  if (hasMore.value && !loading.value) {
    page.value++;
    loadOrders();
  }
};

const showQrCode = (order: IExchangeOrder) => {
  currentOrder.value = order;
  showModal.value = true;
};

const goMall = () => {
  uni.navigateTo({ url: '/pages/points/mall' });
};

onShow(() => {
  loadOrders(true);
});

onReachBottom(() => {
  loadMore();
});
</script>

<style lang="scss" scoped>
.orders-page {
  min-height: 100vh;
  background: $bg-color;
}

.filter-bar {
  display: flex;
  background: #fff;
  padding: 24rpx 32rpx;
  gap: 24rpx;

  .filter-item {
    padding: 12rpx 24rpx;
    font-size: 26rpx;
    color: $text-secondary;
    background: $bg-color;
    border-radius: $radius-full;

    &.active {
      color: #fff;
      background: $primary-color;
    }
  }
}

.order-list {
  padding: 24rpx;

  .order-item {
    background: #fff;
    border-radius: $radius-lg;
    margin-bottom: 24rpx;
    overflow: hidden;

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20rpx 24rpx;
      border-bottom: 1rpx solid $border-color;

      .order-no {
        font-size: 24rpx;
        color: $text-placeholder;
      }

      .order-status {
        font-size: 26rpx;

        &.pending {
          color: $primary-color;
        }

        &.used {
          color: $success-color;
        }

        &.expired {
          color: $text-placeholder;
        }
      }
    }

    .order-content {
      display: flex;
      padding: 24rpx;

      .product-image {
        width: 160rpx;
        height: 160rpx;
        border-radius: $radius-md;
      }

      .product-info {
        flex: 1;
        margin-left: 24rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .product-name {
          font-size: 28rpx;
          color: $text-color;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }

        .product-meta {
          display: flex;
          justify-content: space-between;

          .points {
            font-size: 28rpx;
            color: $primary-color;
            font-weight: 500;
          }

          .quantity {
            font-size: 26rpx;
            color: $text-placeholder;
          }
        }
      }
    }

    .order-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20rpx 24rpx;
      border-top: 1rpx solid $border-color;

      .order-time {
        font-size: 24rpx;
        color: $text-placeholder;
      }

      .btn-use {
        padding: 12rpx 32rpx;
        font-size: 26rpx;
        color: #fff;
        background: $primary-color;
        border-radius: $radius-full;
        border: none;
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
  padding: 120rpx 0;
  color: $text-placeholder;

  .btn-go-mall {
    margin-top: 32rpx;
    padding: 16rpx 48rpx;
    font-size: 28rpx;
    color: #fff;
    background: $primary-color;
    border-radius: $radius-full;
    border: none;
  }
}

.qrcode-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;

  .modal-content {
    width: 80%;
    max-width: 600rpx;
    background: #fff;
    border-radius: $radius-lg;
    padding: 48rpx;
    text-align: center;

    .modal-title {
      font-size: 32rpx;
      font-weight: 500;
      color: $text-color;
    }

    .qrcode-image {
      width: 320rpx;
      height: 320rpx;
      margin: 32rpx 0;
    }

    .order-code {
      display: block;
      font-size: 28rpx;
      color: $text-color;
      font-weight: 500;
      letter-spacing: 4rpx;
    }

    .modal-tip {
      display: block;
      font-size: 24rpx;
      color: $text-placeholder;
      margin-top: 24rpx;
    }
  }
}
</style>
