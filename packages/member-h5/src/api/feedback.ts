import { get, post } from '@/utils/request';
import type { Feedback, SubmitFeedbackParams, IPagination } from '@rocketbird/shared';

// 提交意见反馈
export const submitFeedback = (data: SubmitFeedbackParams) => {
  return post<Feedback>('/feedback', data);
};

// 获取我的反馈列表
export const getMyFeedbacks = (params: { page: number; pageSize: number }) => {
  return get<{ list: Feedback[]; pagination: IPagination }>('/feedback/my', params);
};

// 获取反馈详情
export const getFeedbackDetail = (feedbackId: string) => {
  return get<Feedback>(`/feedback/${feedbackId}`);
};

// 上传图片
export const uploadImage = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${import.meta.env.VITE_API_BASE_URL || '/api'}/upload/image`,
      filePath,
      name: 'file',
      success: (res) => {
        const data = JSON.parse(res.data);
        if (data.code === 0) {
          resolve(data.data.url);
        } else {
          reject(new Error(data.message));
        }
      },
      fail: reject,
    });
  });
};
