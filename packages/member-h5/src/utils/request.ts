import { useUserStore } from '@/stores';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: Record<string, any>;
  header?: Record<string, string>;
  showLoading?: boolean;
  showError?: boolean;
}

interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

export const request = <T = any>(options: RequestOptions): Promise<T> => {
  const { url, method = 'GET', data, header = {}, showLoading = true, showError = true } = options;

  const userStore = useUserStore();

  // 添加 token
  if (userStore.token) {
    header['Authorization'] = `Bearer ${userStore.token}`;
  }

  if (showLoading) {
    uni.showLoading({ title: '加载中...', mask: true });
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + url,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...header,
      },
      success: (res) => {
        if (showLoading) {
          uni.hideLoading();
        }

        const response = res.data as ApiResponse<T>;

        if (response.code === 0) {
          resolve(response.data);
        } else if (response.code === 401) {
          // token 过期，跳转登录
          userStore.logout();
          uni.navigateTo({ url: '/pages/login/index' });
          reject(new Error(response.message || '请先登录'));
        } else {
          if (showError) {
            uni.showToast({ title: response.message || '请求失败', icon: 'none' });
          }
          reject(new Error(response.message));
        }
      },
      fail: (err) => {
        if (showLoading) {
          uni.hideLoading();
        }
        if (showError) {
          uni.showToast({ title: '网络错误', icon: 'none' });
        }
        reject(err);
      },
    });
  });
};

// 快捷方法
export const get = <T = any>(url: string, data?: Record<string, any>, options?: Partial<RequestOptions>) => {
  return request<T>({ url, method: 'GET', data, ...options });
};

export const post = <T = any>(url: string, data?: Record<string, any>, options?: Partial<RequestOptions>) => {
  return request<T>({ url, method: 'POST', data, ...options });
};

export const put = <T = any>(url: string, data?: Record<string, any>, options?: Partial<RequestOptions>) => {
  return request<T>({ url, method: 'PUT', data, ...options });
};

export const del = <T = any>(url: string, data?: Record<string, any>, options?: Partial<RequestOptions>) => {
  return request<T>({ url, method: 'DELETE', data, ...options });
};
