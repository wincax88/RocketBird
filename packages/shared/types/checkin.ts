/**
 * 打卡相关类型定义
 */

export interface Checkin {
  checkinId: string;
  userId: string;
  userNickname: string;
  userAvatar: string;
  content: string;
  images: string[];
  theme: string;
  themeId: string;
  location: string;
  storeId?: string;
  storeName?: string;
  likeCount: number;
  shareCount: number;
  status: CheckinStatus;
  rewardPoints: number;
  rejectReason?: string;
  createdAt: string;
  auditAt?: string;
  auditBy?: string;
}

export enum CheckinStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
}

export interface CheckinTheme {
  themeId: string;
  name: string;
  description: string;
  coverImage: string;
  rewardPoints: number;
  shareRewardPoints: number;
  sortOrder: number;
  status: ThemeStatus;
  createdAt: string;
}

export enum ThemeStatus {
  Disabled = 0,
  Active = 1,
}

export interface CreateCheckinParams {
  themeId: string;
  content?: string;
  images: string[];
  location?: string;
}

export interface ShareRule {
  ruleId: string;
  type: ShareType;
  name: string;
  rewardPointsMin: number;
  rewardPointsMax: number;
  dailyLimit: number;
  status: number;
  createdAt: string;
}

export enum ShareType {
  Checkin = 'checkin',
  Meal = 'meal',
  Level = 'level',
  Gift = 'gift',
}

export interface ShareLog {
  logId: string;
  userId: string;
  type: ShareType;
  targetId: string;
  rewardPoints: number;
  createdAt: string;
}
