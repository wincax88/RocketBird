import mongoose, { Schema, Document } from 'mongoose';

// 邀请记录
export interface IInviteRecord extends Document {
  recordId: string;
  inviterId: string;
  inviterNickname: string;
  inviteeId: string;
  inviteeNickname: string;
  inviteePhone?: string;
  inviteCode: string;
  rewardPoints: number;
  status: number;
  rewardedAt?: Date;
  createdAt: Date;
}

const InviteRecordSchema = new Schema<IInviteRecord>(
  {
    recordId: { type: String, required: true, unique: true },
    inviterId: { type: String, required: true, index: true },
    inviterNickname: { type: String, required: true },
    inviteeId: { type: String, required: true, unique: true },
    inviteeNickname: { type: String, required: true },
    inviteePhone: { type: String },
    inviteCode: { type: String, required: true },
    rewardPoints: { type: Number, default: 0 },
    status: { type: Number, default: 0 }, // 0待奖励 1已奖励 2已失效
    rewardedAt: { type: Date },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'invite_records',
  }
);

InviteRecordSchema.index({ inviterId: 1, createdAt: -1 });

export const InviteRecord = mongoose.model<IInviteRecord>('InviteRecord', InviteRecordSchema);

// 邀请规则
export interface IInviteRule extends Document {
  ruleId: string;
  name: string;
  description: string;
  inviterReward: number;
  inviteeReward: number;
  rewardCondition: string;
  maxInvitesPerDay: number;
  maxInvitesTotal: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

const InviteRuleSchema = new Schema<IInviteRule>(
  {
    ruleId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    inviterReward: { type: Number, required: true },
    inviteeReward: { type: Number, default: 0 },
    rewardCondition: { type: String, default: 'register' }, // register/first_purchase
    maxInvitesPerDay: { type: Number, default: 0 }, // 0=不限
    maxInvitesTotal: { type: Number, default: 0 }, // 0=不限
    status: { type: Number, default: 1 },
  },
  {
    timestamps: true,
    collection: 'invite_rules',
  }
);

export const InviteRule = mongoose.model<IInviteRule>('InviteRule', InviteRuleSchema);
