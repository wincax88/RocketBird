import { Router } from 'express';
import { adminAuthMiddleware } from '../../middlewares/admin-auth.middleware';
import { success } from '../../utils/response';

const router = Router();

// GET /api/admin/members - 获取会员列表
router.get('/', adminAuthMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现获取会员列表逻辑
    success(res, { message: 'TODO: get members list' });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/members/:userId - 获取会员详情
router.get('/:userId', adminAuthMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现获取会员详情逻辑
    success(res, { message: 'TODO: get member detail' });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/members/:userId - 更新会员信息
router.put('/:userId', adminAuthMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现更新会员信息逻辑
    success(res, { message: 'TODO: update member' });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/members/:userId/status - 更新会员状态
router.put('/:userId/status', adminAuthMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现更新会员状态逻辑
    success(res, { message: 'TODO: update member status' });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/members/:userId/level - 调整会员等级
router.put('/:userId/level', adminAuthMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现调整会员等级逻辑
    success(res, { message: 'TODO: adjust member level' });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/members/:userId/points - 调整会员积分
router.post('/:userId/points', adminAuthMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现调整会员积分逻辑
    success(res, { message: 'TODO: adjust member points' });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/members/export - 导出会员数据
router.get('/export', adminAuthMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现导出会员数据逻辑
    success(res, { message: 'TODO: export members' });
  } catch (error) {
    next(error);
  }
});

export default router;
