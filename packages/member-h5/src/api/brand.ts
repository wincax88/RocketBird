import { get } from '@/utils/request';
import type { BrandContent, BrandContentType } from '@rocketbird/shared';

// 获取品牌内容列表
export const getBrandContents = (params?: { type?: BrandContentType }) => {
  return get<BrandContent[]>('/brand/contents', params);
};

// 获取品牌内容详情
export const getBrandContentDetail = (contentId: string) => {
  return get<BrandContent>(`/brand/contents/${contentId}`);
};

// 获取品牌故事
export const getBrandStory = () => {
  return get<BrandContent>('/brand/story');
};

// 获取品牌视频
export const getBrandVideos = () => {
  return get<BrandContent[]>('/brand/videos');
};
