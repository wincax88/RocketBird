import { get } from '@/utils/request';
import type { InviteRecord, MyInviteCode, InviteStats, IPagination } from '@rocketbird/shared';

// 获取我的邀请码
export const getMyInviteCode = () => {
  return get<MyInviteCode>('/referral/code');
};

// 获取邀请统计
export const getInviteStats = () => {
  return get<InviteStats>('/referral/stats');
};

// 获取邀请记录列表
export const getInviteRecords = (params: { page: number; pageSize: number }) => {
  return get<{ list: InviteRecord[]; pagination: IPagination }>('/referral/records', params);
};

// 生成分享海报
export const generateSharePoster = () => {
  return get<{ posterUrl: string }>('/referral/poster');
};
