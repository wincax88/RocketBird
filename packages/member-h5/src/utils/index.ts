export * from './request';

/**
 * 显示成功提示
 */
export const showSuccess = (title: string) => {
  uni.showToast({ title, icon: 'success' });
};

/**
 * 显示错误提示
 */
export const showError = (title: string) => {
  uni.showToast({ title, icon: 'none' });
};

/**
 * 显示加载中
 */
export const showLoading = (title = '加载中...') => {
  uni.showLoading({ title, mask: true });
};

/**
 * 隐藏加载中
 */
export const hideLoading = () => {
  uni.hideLoading();
};

/**
 * 确认弹窗
 */
export const confirm = (options: { title?: string; content: string }) => {
  return new Promise<boolean>((resolve) => {
    uni.showModal({
      title: options.title || '提示',
      content: options.content,
      success: (res) => {
        resolve(res.confirm);
      },
    });
  });
};

/**
 * 检查登录状态
 */
export const checkLogin = (): boolean => {
  const token = uni.getStorageSync('token');
  if (!token) {
    uni.navigateTo({ url: '/pages/login/index' });
    return false;
  }
  return true;
};

/**
 * 复制到剪贴板
 */
export const copyText = (text: string) => {
  uni.setClipboardData({
    data: text,
    success: () => {
      showSuccess('复制成功');
    },
  });
};
