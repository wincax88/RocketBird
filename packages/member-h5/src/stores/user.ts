import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { IUser } from '@rocketbird/shared';

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref<string>('');
  const userInfo = ref<IUser | null>(null);
  const isLoggedIn = computed(() => !!token.value);

  // 登录
  const login = (data: { token: string; userInfo: IUser }) => {
    token.value = data.token;
    userInfo.value = data.userInfo;
    uni.setStorageSync('token', data.token);
    uni.setStorageSync('userInfo', data.userInfo);
  };

  // 登出
  const logout = () => {
    token.value = '';
    userInfo.value = null;
    uni.removeStorageSync('token');
    uni.removeStorageSync('userInfo');
  };

  // 初始化 - 从本地存储恢复
  const init = () => {
    const savedToken = uni.getStorageSync('token');
    const savedUserInfo = uni.getStorageSync('userInfo');
    if (savedToken) {
      token.value = savedToken;
    }
    if (savedUserInfo) {
      userInfo.value = savedUserInfo;
    }
  };

  // 更新用户信息
  const updateUserInfo = (info: Partial<IUser>) => {
    if (userInfo.value) {
      userInfo.value = { ...userInfo.value, ...info };
      uni.setStorageSync('userInfo', userInfo.value);
    }
  };

  // 更新积分
  const updatePoints = (points: number) => {
    if (userInfo.value) {
      userInfo.value.availablePoints = points;
      uni.setStorageSync('userInfo', userInfo.value);
    }
  };

  return {
    token,
    userInfo,
    isLoggedIn,
    login,
    logout,
    init,
    updateUserInfo,
    updatePoints,
  };
});
