/**
 * 意见反馈相关类型定义
 */

export interface Feedback {
  feedbackId: string;
  userId: string;
  userNickname: string;
  userPhone?: string;
  userAvatar?: string;
  category: FeedbackCategory;
  content: string;
  images: string[];
  reply?: string;
  status: FeedbackStatus;
  priority: FeedbackPriority;
  createdAt: string;
  replyAt?: string;
  replyBy?: string;
  replyByName?: string;
}

export enum FeedbackCategory {
  Suggestion = 'suggestion',
  Complaint = 'complaint',
  Bug = 'bug',
  Other = 'other',
}

export enum FeedbackStatus {
  Pending = 0,
  Processing = 1,
  Replied = 2,
  Closed = 3,
}

export enum FeedbackPriority {
  Low = 1,
  Medium = 2,
  High = 3,
}

export interface SubmitFeedbackParams {
  category: FeedbackCategory;
  content: string;
  images?: string[];
  phone?: string;
}

export interface FeedbackStats {
  total: number;
  byStatus: Record<string, number>;
  byCategory: Record<string, number>;
  avgResponseTime: string;
}
