import { get, post } from '@/utils/request';
import type { GiftRecord, BenefitsList, IPagination } from '@rocketbird/shared';

// 获取我的福利列表
export const getMyBenefits = () => {
  return get<BenefitsList>('/benefits/my');
};

// 获取福利记录
export const getBenefitRecords = (params: { status?: number; page: number; pageSize: number }) => {
  return get<{ list: GiftRecord[]; pagination: IPagination }>('/benefits/records', params);
};

// 领取福利
export const claimBenefit = (recordId: string) => {
  return post<GiftRecord>(`/benefits/${recordId}/claim`);
};

// 获取福利详情
export const getBenefitDetail = (recordId: string) => {
  return get<GiftRecord>(`/benefits/${recordId}`);
};
