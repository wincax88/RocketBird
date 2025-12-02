import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  userId: string;
  openId: string;
  unionId?: string;
  phone?: string;
  nickname: string;
  avatar: string;
  gender: number;
  birthday?: Date;
  province?: string;
  city?: string;
  levelId: string;
  levelName: string;
  growthValue: number;
  totalPoints: number;
  availablePoints: number;
  inviteCode: string;
  invitedBy?: string;
  registerSource: string;
  status: number;
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    openId: { type: String, required: true, unique: true, index: true },
    unionId: { type: String, sparse: true, index: true },
    phone: { type: String, sparse: true, index: true },
    nickname: { type: String, required: true },
    avatar: { type: String, default: '' },
    gender: { type: Number, default: 0 }, // 0未知 1男 2女
    birthday: { type: Date },
    province: { type: String },
    city: { type: String },
    levelId: { type: String, required: true },
    levelName: { type: String, required: true },
    growthValue: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    availablePoints: { type: Number, default: 0 },
    inviteCode: { type: String, required: true, unique: true, index: true },
    invitedBy: { type: String, index: true },
    registerSource: { type: String, default: 'miniapp' },
    status: { type: Number, default: 1 }, // 0禁用 1正常
    lastLoginAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

export const User = mongoose.model<IUser>('User', UserSchema);
