<template>
  <view class="mall-page">
    <!-- 头部 -->
    <view class="header">
      <view class="points-info">
        <text class="label">可用积分</text>
        <text class="value">{{ availablePoints }}</text>
      </view>
      <view class="actions">
        <text class="action" @click="goRecords">积分明细</text>
        <text class="action" @click="goOrders">兑换记录</text>
      </view>
    </view>

    <!-- 分类 -->
    <scroll-view class="category-scroll" scroll-x>
      <view class="category-list">
        <view
          class="category-item"
          :class="{ active: currentCategory === '' }"
          @click="changeCategory('')"
        >
          全部
        </view>
        <view
          class="category-item"
          v-for="cat in categories"
          :key="cat"
          :class="{ active: currentCategory === cat }"
          @click="changeCategory(cat)"
        >
          {{ cat }}
        </view>
      </view>
    </scroll-view>

    <!-- 商品列表 -->
    <view class="product-list">
      <view
        class="product-item"
        v-for="product in products"
        :key="product.productId"
        @click="goDetail(product.productId)"
      >
        <image class="product-image" :src="product.coverImage" mode="aspectFill" />
        <view class="product-info">
          <text class="product-name">{{ product.name }}</text>
          <view class="product-footer">
            <view class="price">
              <text class="points">{{ product.pointsCost }}</text>
              <text class="unit">积分</text>
            </view>
            <text class="stock" v-if="product.stock <= 10 && product.stock > 0">仅剩{{ product.stock }}件</text>
            <text class="stock sold-out" v-if="product.stock === 0">已售罄</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 加载更多 -->
    <view class="load-more" v-if="hasMore">
      <text @click="loadMore">加载更多</text>
    </view>
    <view class="no-more" v-else-if="products.length > 0">
      <text>没有更多了</text>
    </view>

    <!-- 空状态 -->
    <view class="empty" v-if="!loading && products.length === 0">
      <image src="/static/empty.png" mode="aspectFit" class="empty-image" />
      <text>暂无商品</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onShow, onReachBottom } from '@dcloudio/uni-app';
import { pointsApi } from '@/api';
import { useUserStore } from '@/stores';
import type { IPointsProduct } from '@rocketbird/shared';

const userStore = useUserStore();
const availablePoints = computed(() => userStore.userInfo?.availablePoints || 0);

const loading = ref(false);
const products = ref<IPointsProduct[]>([]);
const currentCategory = ref('');
const page = ref(1);
const pageSize = 10;
const hasMore = ref(true);

const categories = ['实物商品', '优惠券', '虚拟商品'];

const loadProducts = async (refresh = false) => {
  if (loading.value) return;

  try {
    loading.value = true;
    if (refresh) {
      page.value = 1;
      hasMore.value = true;
    }

    const res = await pointsApi.getMallProducts({
      category: currentCategory.value || undefined,
      page: page.value,
      pageSize,
    });

    if (refresh) {
      products.value = res.list;
    } else {
      products.value = [...products.value, ...res.list];
    }

    hasMore.value = res.list.length === pageSize;
  } catch (error) {
    console.error('加载商品失败', error);
  } finally {
    loading.value = false;
  }
};

const changeCategory = (cat: string) => {
  currentCategory.value = cat;
  loadProducts(true);
};

const loadMore = () => {
  if (hasMore.value && !loading.value) {
    page.value++;
    loadProducts();
  }
};

const goDetail = (productId: string) => {
  uni.navigateTo({ url: `/pages/points/detail?id=${productId}` });
};

const goRecords = () => {
  uni.navigateTo({ url: '/pages/points/records' });
};

const goOrders = () => {
  uni.navigateTo({ url: '/pages/points/orders' });
};

onShow(() => {
  loadProducts(true);
});

onReachBottom(() => {
  loadMore();
});
</script>

<style lang="scss" scoped>
.mall-page {
  min-height: 100vh;
  background: $bg-color;
  padding-bottom: env(safe-area-inset-bottom);
}

.header {
  background: linear-gradient(135deg, $primary-color, $primary-light);
  padding: 40rpx 32rpx;
  color: #fff;

  .points-info {
    .label {
      font-size: 26rpx;
      opacity: 0.9;
    }

    .value {
      display: block;
      font-size: 56rpx;
      font-weight: 600;
      margin-top: 8rpx;
    }
  }

  .actions {
    display: flex;
    gap: 32rpx;
    margin-top: 24rpx;

    .action {
      font-size: 26rpx;
      opacity: 0.9;
      text-decoration: underline;
    }
  }
}

.category-scroll {
  background: #fff;
  white-space: nowrap;
}

.category-list {
  display: inline-flex;
  padding: 24rpx 32rpx;
  gap: 24rpx;

  .category-item {
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

.product-list {
  display: flex;
  flex-wrap: wrap;
  padding: 24rpx;
  gap: 24rpx;

  .product-item {
    width: calc(50% - 12rpx);
    background: #fff;
    border-radius: $radius-lg;
    overflow: hidden;

    .product-image {
      width: 100%;
      height: 320rpx;
    }

    .product-info {
      padding: 20rpx;

      .product-name {
        display: block;
        font-size: 28rpx;
        color: $text-color;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .product-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 16rpx;

        .price {
          .points {
            font-size: 36rpx;
            font-weight: 600;
            color: $primary-color;
          }

          .unit {
            font-size: 24rpx;
            color: $primary-color;
            margin-left: 4rpx;
          }
        }

        .stock {
          font-size: 22rpx;
          color: $warning-color;

          &.sold-out {
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
  padding: 120rpx 0;
  color: $text-placeholder;

  .empty-image {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 24rpx;
  }
}
</style>
