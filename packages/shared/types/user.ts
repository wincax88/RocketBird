/**
 * 会员相关类型定义
 */

export interface User {
  userId: string;
  openid?: string;
  unionid?: string;
  phone: string;
  nickname: string;
  avatar: string;
  level: number;
  levelName: string;
  points: number;
  totalPoints: number;
  inviteCode: string;
  invitedBy?: string;
  consultantId?: string;
  birthday?: string;
  gender: Gender;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export enum Gender {
  Unknown = 0,
  Male = 1,
  Female = 2,
}

export enum UserStatus {
  Disabled = 0,
  Active = 1,
}

export interface UserProfile {
  userId: string;
  nickname: string;
  avatar: string;
  level: number;
  levelName: string;
  points: number;
  phone: string;
}

export interface UpdateProfileParams {
  nickname?: string;
  avatar?: string;
  birthday?: string;
  gender?: Gender;
}
