import { get } from '@/utils/request';
import type { Level, MyLevelInfo } from '@rocketbird/shared';

// 获取所有等级列表
export const getLevelList = () => {
  return get<Level[]>('/levels');
};

// 获取我的等级信息
export const getMyLevelInfo = () => {
  return get<MyLevelInfo>('/levels/my');
};

// 获取等级详情
export const getLevelDetail = (levelId: string) => {
  return get<Level>(`/levels/${levelId}`);
};
