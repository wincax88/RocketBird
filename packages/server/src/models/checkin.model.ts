import mongoose, { Schema, Document } from 'mongoose';

// 打卡主题
export interface ICheckinTheme extends Document {
  themeId: string;
  name: string;
  description: string;
  coverImage: string;
  bgImage?: string;
  templateImages: string[];
  stickerImages: string[];
  rewardPoints: number;
  shareRewardPoints: number;
  maxDailyCheckin: number;
  sortOrder: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

const CheckinThemeSchema = new Schema<ICheckinTheme>(
  {
    themeId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    coverImage: { type: String, required: true },
    bgImage: { type: String },
    templateImages: { type: [String], default: [] },
    stickerImages: { type: [String], default: [] },
    rewardPoints: { type: Number, default: 0 },
    shareRewardPoints: { type: Number, default: 0 },
    maxDailyCheckin: { type: Number, default: 1 },
    sortOrder: { type: Number, default: 0 },
    status: { type: Number, default: 1 }, // 0禁用 1启用
  },
  {
    timestamps: true,
    collection: 'checkin_themes',
  }
);

export const CheckinTheme = mongoose.model<ICheckinTheme>('CheckinTheme', CheckinThemeSchema);

// 打卡记录
export interface ICheckinRecord extends Document {
  recordId: string;
  userId: string;
  userNickname: string;
  userAvatar: string;
  themeId: string;
  themeName: string;
  content?: string;
  images: string[];
  location?: {
    name: string;
    latitude: number;
    longitude: number;
  };
  posterUrl?: string;
  rewardPoints: number;
  shareRewardPoints: number;
  isShared: boolean;
  sharedAt?: Date;
  shareCount: number;
  reviewStatus: number;
  reviewReason?: string;
  reviewedAt?: Date;
  reviewedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CheckinRecordSchema = new Schema<ICheckinRecord>(
  {
    recordId: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    userNickname: { type: String, required: true },
    userAvatar: { type: String, default: '' },
    themeId: { type: String, required: true, index: true },
    themeName: { type: String, required: true },
    content: { type: String },
    images: { type: [String], default: [] },
    location: {
      name: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
    },
    posterUrl: { type: String },
    rewardPoints: { type: Number, default: 0 },
    shareRewardPoints: { type: Number, default: 0 },
    isShared: { type: Boolean, default: false },
    sharedAt: { type: Date },
    shareCount: { type: Number, default: 0 },
    reviewStatus: { type: Number, default: 1 }, // 0待审核 1通过 2拒绝
    reviewReason: { type: String },
    reviewedAt: { type: Date },
    reviewedBy: { type: String },
  },
  {
    timestamps: true,
    collection: 'checkin_records',
  }
);

CheckinRecordSchema.index({ userId: 1, createdAt: -1 });
CheckinRecordSchema.index({ themeId: 1, createdAt: -1 });

export const CheckinRecord = mongoose.model<ICheckinRecord>('CheckinRecord', CheckinRecordSchema);

// 分享规则
export interface IShareRule extends Document {
  ruleId: string;
  name: string;
  description: string;
  rewardPoints: number;
  dailyLimit: number;
  totalLimit: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

const ShareRuleSchema = new Schema<IShareRule>(
  {
    ruleId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    rewardPoints: { type: Number, required: true },
    dailyLimit: { type: Number, default: 0 }, // 0=不限制
    totalLimit: { type: Number, default: 0 }, // 0=不限制
    status: { type: Number, default: 1 },
  },
  {
    timestamps: true,
    collection: 'share_rules',
  }
);

export const ShareRule = mongoose.model<IShareRule>('ShareRule', ShareRuleSchema);
