import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { success } from '../utils/response';

const router = Router();

// POST /api/feedback/submit - 提交意见反馈
router.post('/submit', authMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现提交意见反馈逻辑
    success(res, { message: 'TODO: submit feedback' });
  } catch (error) {
    next(error);
  }
});

// GET /api/feedback/my - 获取我的反馈列表
router.get('/my', authMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现获取我的反馈列表逻辑
    success(res, { message: 'TODO: get my feedbacks' });
  } catch (error) {
    next(error);
  }
});

// GET /api/feedback/:feedbackId - 获取反馈详情
router.get('/:feedbackId', authMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现获取反馈详情逻辑
    success(res, { message: 'TODO: get feedback detail' });
  } catch (error) {
    next(error);
  }
});

// GET /api/feedback/types - 获取反馈类型列表
router.get('/types', async (req, res, next) => {
  try {
    // TODO: 实现获取反馈类型列表逻辑
    success(res, { message: 'TODO: get feedback types' });
  } catch (error) {
    next(error);
  }
});

export default router;
