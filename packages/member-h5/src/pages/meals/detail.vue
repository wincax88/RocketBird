<template>
  <view class="detail-page" v-if="meal">
    <!-- 封面图 -->
    <image class="cover-image" :src="meal.coverImage" mode="aspectFill" />

    <!-- 基本信息 -->
    <view class="info-section">
      <view class="info-header">
        <text class="meal-name">{{ meal.name }}</text>
        <view class="meal-type" :class="meal.type">{{ getMealTypeText(meal.type) }}</view>
      </view>
      <text class="meal-desc">{{ meal.description }}</text>

      <!-- 营养信息 -->
      <view class="nutrition-card">
        <view class="nutrition-title">营养成分</view>
        <view class="nutrition-grid">
          <view class="nutrition-item">
            <text class="value">{{ meal.calories }}</text>
            <text class="label">卡路里</text>
          </view>
          <view class="nutrition-item">
            <text class="value">{{ meal.protein }}g</text>
            <text class="label">蛋白质</text>
          </view>
          <view class="nutrition-item">
            <text class="value">{{ meal.carbs }}g</text>
            <text class="label">碳水</text>
          </view>
          <view class="nutrition-item">
            <text class="value">{{ meal.fat }}g</text>
            <text class="label">脂肪</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 食材清单 -->
    <view class="section" v-if="meal.ingredients && meal.ingredients.length">
      <view class="section-title">食材清单</view>
      <view class="ingredient-list">
        <view class="ingredient-item" v-for="(item, index) in meal.ingredients" :key="index">
          <text class="ingredient-name">{{ item.name }}</text>
          <text class="ingredient-amount">{{ item.amount }}</text>
        </view>
      </view>
    </view>

    <!-- 制作步骤 -->
    <view class="section" v-if="meal.steps && meal.steps.length">
      <view class="section-title">制作步骤</view>
      <view class="step-list">
        <view class="step-item" v-for="(step, index) in meal.steps" :key="index">
          <view class="step-number">{{ index + 1 }}</view>
          <view class="step-content">
            <text class="step-text">{{ step.description }}</text>
            <image
              v-if="step.image"
              class="step-image"
              :src="step.image"
              mode="aspectFill"
              @click="previewImage(step.image)"
            />
          </view>
        </view>
      </view>
    </view>

    <!-- 小贴士 -->
    <view class="section" v-if="meal.tips">
      <view class="section-title">小贴士</view>
      <view class="tips-content">
        <text>{{ meal.tips }}</text>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <button class="share-btn" @click="handleShare">
        <text class="share-icon">📤</text>
        <text>分享</text>
      </button>
      <button class="collect-btn" :class="{ collected: meal.isCollected }" @click="handleCollect">
        <text class="collect-icon">{{ meal.isCollected ? '❤️' : '🤍' }}</text>
        <text>{{ meal.isCollected ? '已收藏' : '收藏' }}</text>
      </button>
    </view>
  </view>

  <!-- 加载中 -->
  <view class="loading" v-else>
    <text>加载中...</text>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { mealsApi } from '@/api';
import type { Meal } from '@rocketbird/shared';

const meal = ref<Meal | null>(null);

const getMealTypeText = (type: string) => {
  const types: Record<string, string> = {
    breakfast: '早餐',
    lunch: '午餐',
    dinner: '晚餐',
    snack: '加餐',
  };
  return types[type] || type;
};

// 加载详情
const loadDetail = async (mealId: string) => {
  try {
    const res = await mealsApi.getMealDetail(mealId);
    meal.value = res;
  } catch (error) {
    console.error('加载详情失败', error);
    uni.showToast({ title: '加载失败', icon: 'none' });
  }
};

// 预览图片
const previewImage = (url: string) => {
  uni.previewImage({
    urls: [url],
    current: 0,
  });
};

// 分享
const handleShare = async () => {
  if (!meal.value) return;

  try {
    uni.showLoading({ title: '生成海报...' });
    const res = await mealsApi.shareMeal(meal.value.mealId);

    // 预览分享海报
    uni.previewImage({
      urls: [res.posterUrl],
      current: 0,
    });
  } catch (error) {
    console.error('分享失败', error);
    uni.showToast({ title: '分享失败', icon: 'none' });
  } finally {
    uni.hideLoading();
  }
};

// 收藏
const handleCollect = () => {
  if (!meal.value) return;
  meal.value.isCollected = !meal.value.isCollected;
  uni.showToast({
    title: meal.value.isCollected ? '收藏成功' : '已取消收藏',
    icon: 'success',
  });
};

onLoad((options) => {
  if (options?.id) {
    loadDetail(options.id);
  }
});
</script>

<style lang="scss" scoped>
.detail-page {
  min-height: 100vh;
  background: $bg-color;
  padding-bottom: 160rpx;
}

.cover-image {
  width: 100%;
  height: 480rpx;
}

.info-section {
  background: #fff;
  margin: -40rpx 24rpx 24rpx;
  padding: 32rpx;
  border-radius: $radius-lg;
  position: relative;

  .info-header {
    display: flex;
    align-items: center;
    gap: 16rpx;
    margin-bottom: 16rpx;

    .meal-name {
      font-size: 40rpx;
      font-weight: 600;
      color: $text-color;
    }
  }

  .meal-desc {
    font-size: 28rpx;
    color: $text-secondary;
    line-height: 1.6;
  }

  .nutrition-card {
    margin-top: 32rpx;
    padding: 24rpx;
    background: linear-gradient(135deg, rgba(82, 196, 26, 0.1), rgba(82, 196, 26, 0.05));
    border-radius: $radius-md;

    .nutrition-title {
      font-size: 28rpx;
      font-weight: 500;
      color: $text-color;
      margin-bottom: 20rpx;
    }

    .nutrition-grid {
      display: flex;

      .nutrition-item {
        flex: 1;
        text-align: center;

        .value {
          display: block;
          font-size: 36rpx;
          font-weight: 600;
          color: $primary-color;
        }

        .label {
          display: block;
          font-size: 24rpx;
          color: $text-secondary;
          margin-top: 8rpx;
        }
      }
    }
  }
}

.meal-type {
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: $radius-sm;
  color: #fff;

  &.breakfast {
    background: #faad14;
  }

  &.lunch {
    background: #52c41a;
  }

  &.dinner {
    background: #1890ff;
  }

  &.snack {
    background: #eb2f96;
  }
}

.section {
  background: #fff;
  margin: 24rpx;
  padding: 24rpx;
  border-radius: $radius-lg;

  .section-title {
    font-size: 32rpx;
    font-weight: 500;
    color: $text-color;
    margin-bottom: 24rpx;
    padding-left: 16rpx;
    border-left: 6rpx solid $primary-color;
  }
}

.ingredient-list {
  .ingredient-item {
    display: flex;
    justify-content: space-between;
    padding: 16rpx 0;
    border-bottom: 1rpx solid $border-color;

    &:last-child {
      border-bottom: none;
    }

    .ingredient-name {
      font-size: 28rpx;
      color: $text-color;
    }

    .ingredient-amount {
      font-size: 28rpx;
      color: $text-secondary;
    }
  }
}

.step-list {
  .step-item {
    display: flex;
    margin-bottom: 32rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .step-number {
      width: 48rpx;
      height: 48rpx;
      line-height: 48rpx;
      text-align: center;
      background: $primary-color;
      color: #fff;
      border-radius: 50%;
      font-size: 26rpx;
      font-weight: 500;
      flex-shrink: 0;
    }

    .step-content {
      flex: 1;
      margin-left: 20rpx;

      .step-text {
        font-size: 28rpx;
        color: $text-color;
        line-height: 1.6;
      }

      .step-image {
        width: 100%;
        height: 300rpx;
        border-radius: $radius-md;
        margin-top: 16rpx;
      }
    }
  }
}

.tips-content {
  padding: 20rpx;
  background: #fffbe6;
  border-radius: $radius-md;
  border-left: 6rpx solid #faad14;

  text {
    font-size: 28rpx;
    color: $text-secondary;
    line-height: 1.6;
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 24rpx;
  padding: 24rpx 32rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);

  button {
    flex: 1;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8rpx;
    border-radius: $radius-full;
    font-size: 30rpx;
  }

  .share-btn {
    background: $primary-color;
    color: #fff;
  }

  .collect-btn {
    background: #fff;
    border: 2rpx solid $border-color;
    color: $text-color;

    &.collected {
      border-color: #ff4d4f;
      color: #ff4d4f;
    }
  }
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: $text-placeholder;
}
</style>
