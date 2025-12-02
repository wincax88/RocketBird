import { get, post } from '@/utils/request';
import type { ICheckinTheme, ICheckinRecord, IPagination } from '@rocketbird/shared';

// 获取打卡主题列表
export const getThemes = () => {
  return get<ICheckinTheme[]>('/checkin/themes');
};

// 获取主题详情
export const getThemeDetail = (themeId: string) => {
  return get<ICheckinTheme>(`/checkin/themes/${themeId}`);
};

// 创建打卡记录
export const createCheckin = (data: {
  themeId: string;
  content?: string;
  images?: string[];
  location?: { name: string; latitude: number; longitude: number };
}) => {
  return post<ICheckinRecord>('/checkin/create', data);
};

// 获取我的打卡记录
export const getMyRecords = (params: { page: number; pageSize: number }) => {
  return get<{ list: ICheckinRecord[]; pagination: IPagination }>('/checkin/my-records', params);
};

// 获取打卡详情
export const getRecordDetail = (recordId: string) => {
  return get<ICheckinRecord>(`/checkin/records/${recordId}`);
};

// 生成分享海报
export const generateSharePoster = (recordId: string) => {
  return post<{ posterUrl: string }>(`/checkin/records/${recordId}/share`);
};

// 分享回调
export const shareCallback = (recordId: string) => {
  return post<{ rewardPoints: number }>(`/checkin/records/${recordId}/share-callback`);
};

// 获取打卡统计
export const getCheckinStats = () => {
  return get<{
    totalCheckins: number;
    totalShares: number;
    totalPoints: number;
    continuousDays: number;
  }>('/checkin/stats');
};

// 获取打卡日历
export const getCheckinCalendar = (params: { year: number; month: number }) => {
  return get<{ date: string; count: number }[]>('/checkin/calendar', params);
};
