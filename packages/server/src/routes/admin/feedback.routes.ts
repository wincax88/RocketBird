import { Router } from 'express';
import { adminAuthMiddleware } from '../../middlewares/admin-auth.middleware';
import { success } from '../../utils/response';

const router = Router();

// GET /api/admin/feedback - 获取反馈列表
router.get('/', adminAuthMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现获取反馈列表逻辑
    success(res, { message: 'TODO: get feedback list' });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/feedback/:feedbackId - 获取反馈详情
router.get('/:feedbackId', adminAuthMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现获取反馈详情逻辑
    success(res, { message: 'TODO: get feedback detail' });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/feedback/:feedbackId/reply - 回复反馈
router.put('/:feedbackId/reply', adminAuthMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现回复反馈逻辑
    success(res, { message: 'TODO: reply feedback' });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/feedback/:feedbackId/status - 更新反馈状态
router.put('/:feedbackId/status', adminAuthMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现更新反馈状态逻辑
    success(res, { message: 'TODO: update feedback status' });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/feedback/stats - 反馈统计
router.get('/stats', adminAuthMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现反馈统计逻辑
    success(res, { message: 'TODO: get feedback stats' });
  } catch (error) {
    next(error);
  }
});

export default router;
