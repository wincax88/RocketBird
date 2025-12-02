import mongoose, { Schema, Document } from 'mongoose';

// 意见反馈
export interface IFeedback extends Document {
  feedbackId: string;
  userId: string;
  userNickname: string;
  userPhone?: string;
  type: string;
  content: string;
  images: string[];
  contact?: string;
  status: number;
  replyContent?: string;
  replyAt?: Date;
  replyBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    feedbackId: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    userNickname: { type: String, required: true },
    userPhone: { type: String },
    type: { type: String, required: true }, // suggestion/bug/complaint/other
    content: { type: String, required: true },
    images: { type: [String], default: [] },
    contact: { type: String },
    status: { type: Number, default: 0 }, // 0待处理 1处理中 2已回复 3已关闭
    replyContent: { type: String },
    replyAt: { type: Date },
    replyBy: { type: String },
  },
  {
    timestamps: true,
    collection: 'feedbacks',
  }
);

FeedbackSchema.index({ status: 1, createdAt: -1 });

export const Feedback = mongoose.model<IFeedback>('Feedback', FeedbackSchema);
