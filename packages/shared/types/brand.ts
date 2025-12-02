/**
 * 品牌内容相关类型定义
 */

export interface BrandContent {
  contentId: string;
  type: BrandContentType;
  title: string;
  subtitle?: string;
  content: string;
  summary?: string;
  coverImage?: string;
  images: string[];
  videoUrl?: string;
  videoCover?: string;
  author?: string;
  tags: string[];
  sortOrder: number;
  viewCount: number;
  status: BrandContentStatus;
  publishAt?: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
}

export enum BrandContentType {
  Story = 'story',
  Slogan = 'slogan',
  Video = 'video',
  News = 'news',
  Honor = 'honor',
  Culture = 'culture',
}

export enum BrandContentStatus {
  Hidden = 0,
  Visible = 1,
}
