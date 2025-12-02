import mongoose, { Schema, Document } from 'mongoose';

// 等级规则
export interface ILevelRule extends Document {
  levelId: string;
  name: string;
  code: string;
  minGrowth: number;
  maxGrowth: number;
  icon: string;
  color: string;
  benefits: string[];
  sortOrder: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

const LevelRuleSchema = new Schema<ILevelRule>(
  {
    levelId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    minGrowth: { type: Number, required: true },
    maxGrowth: { type: Number, required: true },
    icon: { type: String, default: '' },
    color: { type: String, default: '#000000' },
    benefits: { type: [String], default: [] },
    sortOrder: { type: Number, default: 0 },
    status: { type: Number, default: 1 }, // 0禁用 1启用
  },
  {
    timestamps: true,
    collection: 'level_rules',
  }
);

export const LevelRule = mongoose.model<ILevelRule>('LevelRule', LevelRuleSchema);

// 等级变动记录
export interface ILevelChangeLog extends Document {
  logId: string;
  userId: string;
  beforeLevelId: string;
  beforeLevelName: string;
  afterLevelId: string;
  afterLevelName: string;
  changeType: string;
  reason: string;
  operatorId?: string;
  operatorName?: string;
  createdAt: Date;
}

const LevelChangeLogSchema = new Schema<ILevelChangeLog>(
  {
    logId: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    beforeLevelId: { type: String, required: true },
    beforeLevelName: { type: String, required: true },
    afterLevelId: { type: String, required: true },
    afterLevelName: { type: String, required: true },
    changeType: { type: String, required: true }, // upgrade/downgrade/manual
    reason: { type: String, default: '' },
    operatorId: { type: String },
    operatorName: { type: String },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'level_change_logs',
  }
);

export const LevelChangeLog = mongoose.model<ILevelChangeLog>('LevelChangeLog', LevelChangeLogSchema);
