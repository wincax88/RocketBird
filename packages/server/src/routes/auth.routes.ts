import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { success } from '../utils/response';

const router = Router();

// POST /api/auth/wechat-login - 微信登录
router.post('/wechat-login', async (req, res, next) => {
  try {
    // TODO: 实现微信登录逻辑
    success(res, { message: 'TODO: wechat-login' });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/send-sms - 发送短信验证码
router.post('/send-sms', async (req, res, next) => {
  try {
    // TODO: 实现发送短信验证码逻辑
    success(res, { message: 'TODO: send-sms' });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/sms-login - 短信登录
router.post('/sms-login', async (req, res, next) => {
  try {
    // TODO: 实现短信登录逻辑
    success(res, { message: 'TODO: sms-login' });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/profile - 获取用户信息
router.get('/profile', authMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现获取用户信息逻辑
    success(res, { userId: req.user?.userId });
  } catch (error) {
    next(error);
  }
});

// PUT /api/auth/profile - 更新用户信息
router.put('/profile', authMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现更新用户信息逻辑
    success(res, { message: 'TODO: update profile' });
  } catch (error) {
    next(error);
  }
});

export default router;
