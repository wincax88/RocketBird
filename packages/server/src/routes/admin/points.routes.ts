import { Router } from 'express';
import { adminAuthMiddleware } from '../../middlewares/admin-auth.middleware';
import { success } from '../../utils/response';

const router = Router();

// GET /api/admin/points/products - 获取积分商品列表
router.get('/products', adminAuthMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现获取积分商品列表逻辑
    success(res, { message: 'TODO: get products list' });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/points/products - 创建积分商品
router.post('/products', adminAuthMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现创建积分商品逻辑
    success(res, { message: 'TODO: create product' });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/points/products/:productId - 更新积分商品
router.put('/products/:productId', adminAuthMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现更新积分商品逻辑
    success(res, { message: 'TODO: update product' });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/points/products/:productId - 删除积分商品
router.delete('/products/:productId', adminAuthMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现删除积分商品逻辑
    success(res, { message: 'TODO: delete product' });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/points/orders - 获取兑换订单列表
router.get('/orders', adminAuthMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现获取兑换订单列表逻辑
    success(res, { message: 'TODO: get orders list' });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/points/orders/:orderId/verify - 核销订单
router.put('/orders/:orderId/verify', adminAuthMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现核销订单逻辑
    success(res, { message: 'TODO: verify order' });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/points/records - 获取积分流水
router.get('/records', adminAuthMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现获取积分流水逻辑
    success(res, { message: 'TODO: get points records' });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/points/stats - 积分统计
router.get('/stats', adminAuthMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现积分统计逻辑
    success(res, { message: 'TODO: get points stats' });
  } catch (error) {
    next(error);
  }
});

export default router;
