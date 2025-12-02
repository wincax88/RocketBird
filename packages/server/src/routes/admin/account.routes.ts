import { Router } from 'express';
import { adminAuthMiddleware } from '../../middlewares/admin-auth.middleware';
import { success } from '../../utils/response';

const router = Router();

// GET /api/admin/accounts - 获取管理员列表
router.get('/', adminAuthMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现获取管理员列表逻辑
    success(res, { message: 'TODO: get admins list' });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/accounts - 创建管理员
router.post('/', adminAuthMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现创建管理员逻辑
    success(res, { message: 'TODO: create admin' });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/accounts/:adminId - 获取管理员详情
router.get('/:adminId', adminAuthMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现获取管理员详情逻辑
    success(res, { message: 'TODO: get admin detail' });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/accounts/:adminId - 更新管理员
router.put('/:adminId', adminAuthMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现更新管理员逻辑
    success(res, { message: 'TODO: update admin' });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/accounts/:adminId - 删除管理员
router.delete('/:adminId', adminAuthMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现删除管理员逻辑
    success(res, { message: 'TODO: delete admin' });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/accounts/:adminId/reset-password - 重置密码
router.post('/:adminId/reset-password', adminAuthMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现重置密码逻辑
    success(res, { message: 'TODO: reset admin password' });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/accounts/:adminId/status - 更新管理员状态
router.put('/:adminId/status', adminAuthMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现更新管理员状态逻辑
    success(res, { message: 'TODO: update admin status' });
  } catch (error) {
    next(error);
  }
});

export default router;
