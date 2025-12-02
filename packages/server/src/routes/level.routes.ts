import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { success } from '../utils/response';

const router = Router();

// GET /api/level/current - 获取当前等级信息
router.get('/current', authMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现获取当前等级信息逻辑
    success(res, { message: 'TODO: get current level' });
  } catch (error) {
    next(error);
  }
});

// GET /api/level/rules - 获取等级规则
router.get('/rules', async (req, res, next) => {
  try {
    // TODO: 实现获取等级规则逻辑
    success(res, { message: 'TODO: get level rules' });
  } catch (error) {
    next(error);
  }
});

// GET /api/level/progress - 获取升级进度
router.get('/progress', authMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现获取升级进度逻辑
    success(res, { message: 'TODO: get level progress' });
  } catch (error) {
    next(error);
  }
});

// GET /api/level/history - 获取等级变动历史
router.get('/history', authMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现获取等级变动历史逻辑
    success(res, { message: 'TODO: get level history' });
  } catch (error) {
    next(error);
  }
});

export default router;
