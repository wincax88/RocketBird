import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { success } from '../utils/response';

const router = Router();

// GET /api/points/balance - 获取积分余额
router.get('/balance', authMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现获取积分余额逻辑
    success(res, { message: 'TODO: get points balance' });
  } catch (error) {
    next(error);
  }
});

// GET /api/points/records - 获取积分明细
router.get('/records', authMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现获取积分明细逻辑
    success(res, { message: 'TODO: get points records' });
  } catch (error) {
    next(error);
  }
});

// GET /api/points/mall/products - 获取积分商品列表
router.get('/mall/products', authMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现获取积分商品列表逻辑
    success(res, { message: 'TODO: get mall products' });
  } catch (error) {
    next(error);
  }
});

// GET /api/points/mall/products/:productId - 获取商品详情
router.get('/mall/products/:productId', authMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现获取商品详情逻辑
    success(res, { message: 'TODO: get product detail' });
  } catch (error) {
    next(error);
  }
});

// POST /api/points/mall/exchange - 积分兑换
router.post('/mall/exchange', authMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现积分兑换逻辑
    success(res, { message: 'TODO: exchange product' });
  } catch (error) {
    next(error);
  }
});

// GET /api/points/mall/orders - 获取兑换订单列表
router.get('/mall/orders', authMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现获取兑换订单列表逻辑
    success(res, { message: 'TODO: get exchange orders' });
  } catch (error) {
    next(error);
  }
});

// GET /api/points/mall/orders/:orderId - 获取订单详情
router.get('/mall/orders/:orderId', authMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现获取订单详情逻辑
    success(res, { message: 'TODO: get order detail' });
  } catch (error) {
    next(error);
  }
});

// POST /api/points/mall/orders/:orderId/use - 核销订单
router.post('/mall/orders/:orderId/use', authMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现核销订单逻辑
    success(res, { message: 'TODO: use order' });
  } catch (error) {
    next(error);
  }
});

export default router;
