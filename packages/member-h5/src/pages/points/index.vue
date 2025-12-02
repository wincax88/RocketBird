<template>
  <view class="points-page">
    <!-- 积分卡片 -->
    <view class="points-card">
      <view class="points-info">
        <text class="label">可用积分</text>
        <text class="value">{{ availablePoints }}</text>
      </view>
      <view class="actions">
        <view class="action-btn" @click="navigateTo('/pages/points/records')">
          <text>积分明细</text>
        </view>
        <view class="action-btn primary" @click="navigateTo('/pages/points/mall')">
          <text>去兑换</text>
        </view>
      </view>
    </view>

    <!-- 积分获取方式 -->
    <view class="section">
      <view class="section-title">赚取积分</view>
      <view class="earn-list">
        <view class="earn-item" @click="navigateTo('/pages/checkin/index')">
          <view class="icon checkin"></view>
          <view class="info">
            <text class="title">打卡分享</text>
            <text class="desc">每次打卡可获得积分</text>
          </view>
          <text class="points">+10</text>
        </view>
        <view class="earn-item" @click="navigateTo('/pages/referral/index')">
          <view class="icon referral"></view>
          <view class="info">
            <text class="title">推荐好友</text>
            <text class="desc">邀请好友注册得积分</text>
          </view>
          <text class="points">+100</text>
        </view>
      </view>
    </view>

    <!-- 热门兑换 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">热门兑换</text>
        <text class="more" @click="navigateTo('/pages/points/mall')">更多</text>
      </view>
      <view class="product-grid">
        <view class="product-item" v-for="product in hotProducts" :key="product.productId" @click="goProductDetail(product.productId)">
          <image class="product-image" :src="product.coverImage" mode="aspectFill" />
          <text class="product-name">{{ product.name }}</text>
          <view class="product-price">
            <text class="points">{{ product.pointsCost }}</text>
            <text class="unit">积分</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useUserStore } from '@/stores';
import { pointsApi } from '@/api';
import type { IPointsProduct } from '@rocketbird/shared';

const userStore = useUserStore();
const availablePoints = computed(() => userStore.userInfo?.availablePoints || 0);

const hotProducts = ref<IPointsProduct[]>([]);

const navigateTo = (url: string) => {
  uni.navigateTo({ url });
};

const goProductDetail = (productId: string) => {
  uni.navigateTo({ url: `/pages/points/mall?id=${productId}` });
};

const loadProducts = async () => {
  try {
    const res = await pointsApi.getMallProducts({ page: 1, pageSize: 4 });
    hotProducts.value = res.list;
  } catch (error) {
    console.error('加载商品失败', error);
  }
};

onShow(() => {
  loadProducts();
});
</script>

<style lang="scss" scoped>
.points-page {
  min-height: 100vh;
  background: $bg-color;
  padding-bottom: 120rpx;
}

.points-card {
  background: linear-gradient(135deg, $primary-color, $primary-light);
  margin: 24rpx;
  padding: 40rpx;
  border-radius: $radius-lg;
  color: #fff;

  .points-info {
    text-align: center;
    margin-bottom: 32rpx;

    .label {
      display: block;
      font-size: 28rpx;
      opacity: 0.9;
    }

    .value {
      display: block;
      font-size: 72rpx;
      font-weight: 600;
      margin-top: 8rpx;
    }
  }

  .actions {
    display: flex;
    gap: 24rpx;

    .action-btn {
      flex: 1;
      height: 72rpx;
      line-height: 72rpx;
      text-align: center;
      border-radius: $radius-full;
      font-size: 28rpx;
      background: rgba(255, 255, 255, 0.2);

      &.primary {
        background: #fff;
        color: $primary-color;
      }
    }
  }
}

.section {
  background: #fff;
  margin: 24rpx;
  padding: 24rpx;
  border-radius: $radius-lg;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;

    .more {
      font-size: 26rpx;
      color: $text-secondary;
    }
  }

  .section-title {
    font-size: 32rpx;
    font-weight: 500;
    color: $text-color;
    margin-bottom: 24rpx;
  }
}

.earn-list {
  .earn-item {
    display: flex;
    align-items: center;
    padding: 24rpx 0;
    border-bottom: 1rpx solid $border-color;

    &:last-child {
      border-bottom: none;
    }

    .icon {
      width: 80rpx;
      height: 80rpx;
      border-radius: $radius-md;
      margin-right: 24rpx;

      &.checkin {
        background: linear-gradient(135deg, #52c41a, #73d13d);
      }

      &.referral {
        background: linear-gradient(135deg, #1890ff, #40a9ff);
      }
    }

    .info {
      flex: 1;

      .title {
        display: block;
        font-size: 30rpx;
        color: $text-color;
      }

      .desc {
        display: block;
        font-size: 24rpx;
        color: $text-secondary;
        margin-top: 4rpx;
      }
    }

    .points {
      font-size: 32rpx;
      font-weight: 500;
      color: $primary-color;
    }
  }
}

.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;

  .product-item {
    width: calc(50% - 12rpx);

    .product-image {
      width: 100%;
      height: 240rpx;
      border-radius: $radius-md;
    }

    .product-name {
      display: block;
      margin-top: 12rpx;
      font-size: 28rpx;
      color: $text-color;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .product-price {
      margin-top: 8rpx;

      .points {
        font-size: 32rpx;
        font-weight: 500;
        color: $primary-color;
      }

      .unit {
        font-size: 24rpx;
        color: $text-secondary;
        margin-left: 4rpx;
      }
    }
  }
}
</style>
