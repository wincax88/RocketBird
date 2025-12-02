import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { success } from '../utils/response';

const router = Router();

// GET /api/benefits/available - 获取可用福利列表
router.get('/available', authMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现获取可用福利列表逻辑
    success(res, { message: 'TODO: get available benefits' });
  } catch (error) {
    next(error);
  }
});

// GET /api/benefits/my - 获取我的福利
router.get('/my', authMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现获取我的福利逻辑
    success(res, { message: 'TODO: get my benefits' });
  } catch (error) {
    next(error);
  }
});

// POST /api/benefits/:benefitId/claim - 领取福利
router.post('/:benefitId/claim', authMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现领取福利逻辑
    success(res, { message: 'TODO: claim benefit' });
  } catch (error) {
    next(error);
  }
});

// POST /api/benefits/:benefitId/use - 使用福利
router.post('/:benefitId/use', authMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现使用福利逻辑
    success(res, { message: 'TODO: use benefit' });
  } catch (error) {
    next(error);
  }
});

// GET /api/benefits/birthday - 获取生日福利
router.get('/birthday', authMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现获取生日福利逻辑
    success(res, { message: 'TODO: get birthday benefit' });
  } catch (error) {
    next(error);
  }
});

// GET /api/benefits/growth - 获取成长福利
router.get('/growth', authMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现获取成长福利逻辑
    success(res, { message: 'TODO: get growth benefits' });
  } catch (error) {
    next(error);
  }
});

// GET /api/benefits/records - 获取福利记录
router.get('/records', authMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现获取福利记录逻辑
    success(res, { message: 'TODO: get benefit records' });
  } catch (error) {
    next(error);
  }
});

export default router;
