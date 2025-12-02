import mongoose, { Schema, Document } from 'mongoose';

// 福利规则
export interface IBenefitRule extends Document {
  ruleId: string;
  name: string;
  type: string;
  description: string;
  rewardType: string;
  rewardValue: number;
  rewardUnit: string;
  conditions: {
    levelIds?: string[];
    minGrowth?: number;
    isNewMember?: boolean;
    memberDays?: number;
  };
  validDays: number;
  autoGrant: boolean;
  sortOrder: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

const BenefitRuleSchema = new Schema<IBenefitRule>(
  {
    ruleId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, required: true }, // birthday/growth/new_member/level_upgrade
    description: { type: String, default: '' },
    rewardType: { type: String, required: true }, // points/coupon/gift
    rewardValue: { type: Number, required: true },
    rewardUnit: { type: String, default: '' },
    conditions: {
      levelIds: { type: [String] },
      minGrowth: { type: Number },
      isNewMember: { type: Boolean },
      memberDays: { type: Number },
    },
    validDays: { type: Number, default: 30 },
    autoGrant: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    status: { type: Number, default: 1 },
  },
  {
    timestamps: true,
    collection: 'benefit_rules',
  }
);

export const BenefitRule = mongoose.model<IBenefitRule>('BenefitRule', BenefitRuleSchema);

// 福利记录
export interface IBenefitRecord extends Document {
  recordId: string;
  userId: string;
  userNickname: string;
  ruleId: string;
  ruleName: string;
  type: string;
  rewardType: string;
  rewardValue: number;
  rewardUnit: string;
  status: number;
  claimedAt?: Date;
  usedAt?: Date;
  expireAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BenefitRecordSchema = new Schema<IBenefitRecord>(
  {
    recordId: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    userNickname: { type: String, required: true },
    ruleId: { type: String, required: true },
    ruleName: { type: String, required: true },
    type: { type: String, required: true },
    rewardType: { type: String, required: true },
    rewardValue: { type: Number, required: true },
    rewardUnit: { type: String, default: '' },
    status: { type: Number, default: 0 }, // 0待领取 1已领取 2已使用 3已过期
    claimedAt: { type: Date },
    usedAt: { type: Date },
    expireAt: { type: Date, required: true },
  },
  {
    timestamps: true,
    collection: 'benefit_records',
  }
);

BenefitRecordSchema.index({ userId: 1, status: 1 });
BenefitRecordSchema.index({ expireAt: 1 });

export const BenefitRecord = mongoose.model<IBenefitRecord>('BenefitRecord', BenefitRecordSchema);
