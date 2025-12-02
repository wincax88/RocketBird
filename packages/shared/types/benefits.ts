/**
 * 会员福利相关类型定义
 */

export interface GiftRule {
  ruleId: string;
  type: GiftType;
  name: string;
  description: string;
  rewardType: RewardType;
  rewardValue: RewardValue;
  rewardDesc: string;
  levelLimit: number[];
  validDays: number;
  status: GiftRuleStatus;
  createdAt: string;
  updatedAt?: string;
}

export enum GiftType {
  Birthday = 'birthday',
  Growth = 'growth',
  NewMember = 'newmember',
}

export enum RewardType {
  Points = 'points',
  Goods = 'goods',
  Coupon = 'coupon',
}

export interface RewardValue {
  points?: number;
  goodsId?: string;
  quantity?: number;
  couponId?: string;
}

export enum GiftRuleStatus {
  Disabled = 0,
  Active = 1,
}

export interface GiftRecord {
  recordId: string;
  userId: string;
  ruleId: string;
  ruleName: string;
  type: GiftType;
  rewardType: RewardType;
  rewardValue: RewardValue;
  rewardDesc: string;
  status: GiftRecordStatus;
  expireAt: string;
  createdAt: string;
  claimedAt?: string;
}

export enum GiftRecordStatus {
  Pending = 0,
  Claimed = 1,
  Expired = 2,
}

export interface BenefitsList {
  pending: GiftRecord[];
  claimed: GiftRecord[];
  expired: GiftRecord[];
}
