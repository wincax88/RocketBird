/**
 * 推荐好友相关类型定义
 */

export interface InviteRecord {
  recordId: string;
  inviterId: string;
  inviterNickname?: string;
  inviteeId: string;
  inviteeNickname?: string;
  inviteePhone: string;
  inviteCode: string;
  rewardPoints: number;
  status: InviteStatus;
  createdAt: string;
  rewardedAt?: string;
}

export enum InviteStatus {
  Pending = 0,
  Rewarded = 1,
  Invalid = 2,
}

export interface InviteRule {
  ruleId: string;
  name: string;
  description: string;
  inviterReward: number;
  inviteeReward: number;
  rewardCondition: RewardCondition;
  maxInvitesPerDay: number;
  maxInvitesTotal: number;
  status: number;
  createdAt: string;
}

export enum RewardCondition {
  Register = 'register',
  FirstPurchase = 'first_purchase',
}

export interface MyInviteCode {
  inviteCode: string;
  inviteUrl: string;
  rule: {
    inviterReward: number;
    inviteeReward: number;
    rewardCondition: RewardCondition;
    description: string;
  };
}

export interface InviteStats {
  totalInvites: number;
  successInvites: number;
  totalRewardPoints: number;
  todayInvites: number;
  todayLimit: number;
}
