import { Router } from 'express';
import { adminAuthMiddleware } from '../../middlewares/admin-auth.middleware';
import { success } from '../../utils/response';

const router = Router();

// POST /api/admin/auth/login - 管理员登录
router.post('/login', async (req, res, next) => {
  try {
    // TODO: 实现管理员登录逻辑
    success(res, { message: 'TODO: admin login' });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/auth/logout - 管理员登出
router.post('/logout', adminAuthMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现管理员登出逻辑
    success(res, { message: 'TODO: admin logout' });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/auth/profile - 获取当前管理员信息
router.get('/profile', adminAuthMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现获取管理员信息逻辑
    success(res, { message: 'TODO: get admin profile' });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/auth/profile - 更新个人信息
router.put('/profile', adminAuthMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现更新管理员信息逻辑
    success(res, { message: 'TODO: update admin profile' });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/auth/password - 修改密码
router.put('/password', adminAuthMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现修改密码逻辑
    success(res, { message: 'TODO: change password' });
  } catch (error) {
    next(error);
  }
});

export default router;
