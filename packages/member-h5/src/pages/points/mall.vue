<template>
  <view class="mall-page">
    <view class="header">
      <text class="title">积分商城</text>
      <text class="points">可用积分: {{ availablePoints }}</text>
    </view>
    <!-- TODO: 实现积分商城页面 -->
    <view class="placeholder">
      <text>积分商城开发中...</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores';

const userStore = useUserStore();
const availablePoints = computed(() => userStore.userInfo?.availablePoints || 0);
</script>

<style lang="scss" scoped>
.mall-page {
  min-height: 100vh;
  background: $bg-color;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  background: #fff;
}

.placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400rpx;
  color: $text-placeholder;
}
</style>
