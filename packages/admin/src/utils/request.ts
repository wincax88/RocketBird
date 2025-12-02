import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'antd';
import { useAuthStore } from '@/stores/auth';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/admin';

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response;
    if (data.code === 0) {
      return data.data;
    }

    if (data.code === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
      return Promise.reject(new Error('未授权'));
    }

    message.error(data.message || '请求失败');
    return Promise.reject(new Error(data.message));
  },
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    } else {
      message.error(error.message || '网络错误');
    }
    return Promise.reject(error);
  }
);

export const request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  return instance.request(config);
};

export const get = <T = any>(url: string, params?: object): Promise<T> => {
  return request({ url, method: 'GET', params });
};

export const post = <T = any>(url: string, data?: object): Promise<T> => {
  return request({ url, method: 'POST', data });
};

export const put = <T = any>(url: string, data?: object): Promise<T> => {
  return request({ url, method: 'PUT', data });
};

export const del = <T = any>(url: string, data?: object): Promise<T> => {
  return request({ url, method: 'DELETE', data });
};

export default instance;
