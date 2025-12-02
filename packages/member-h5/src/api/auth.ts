import { post, get, put } from '@/utils/request';
import type { IUser } from '@rocketbird/shared';

// 微信登录
export const wechatLogin = (code: string) => {
  return post<{ token: string; userInfo: IUser }>('/auth/wechat-login', { code });
};

// 发送短信验证码
export const sendSms = (phone: string) => {
  return post<{ success: boolean }>('/auth/send-sms', { phone });
};

// 短信登录
export const smsLogin = (phone: string, code: string, inviteCode?: string) => {
  return post<{ token: string; userInfo: IUser }>('/auth/sms-login', { phone, code, inviteCode });
};

// 获取用户信息
export const getProfile = () => {
  return get<IUser>('/auth/profile');
};

// 更新用户信息
export const updateProfile = (data: Partial<IUser>) => {
  return put<IUser>('/auth/profile', data);
};
