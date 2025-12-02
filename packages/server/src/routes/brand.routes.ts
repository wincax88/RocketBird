import { Router } from 'express';
import { success } from '../utils/response';

const router = Router();

// GET /api/brand/info - 获取品牌信息
router.get('/info', async (req, res, next) => {
  try {
    // TODO: 实现获取品牌信息逻辑
    success(res, { message: 'TODO: get brand info' });
  } catch (error) {
    next(error);
  }
});

// GET /api/brand/articles - 获取品牌文章列表
router.get('/articles', async (req, res, next) => {
  try {
    // TODO: 实现获取品牌文章列表逻辑
    success(res, { message: 'TODO: get brand articles' });
  } catch (error) {
    next(error);
  }
});

// GET /api/brand/articles/:articleId - 获取文章详情
router.get('/articles/:articleId', async (req, res, next) => {
  try {
    // TODO: 实现获取文章详情逻辑
    success(res, { message: 'TODO: get article detail' });
  } catch (error) {
    next(error);
  }
});

// GET /api/brand/stores - 获取门店列表
router.get('/stores', async (req, res, next) => {
  try {
    // TODO: 实现获取门店列表逻辑
    success(res, { message: 'TODO: get stores' });
  } catch (error) {
    next(error);
  }
});

// GET /api/brand/stores/:storeId - 获取门店详情
router.get('/stores/:storeId', async (req, res, next) => {
  try {
    // TODO: 实现获取门店详情逻辑
    success(res, { message: 'TODO: get store detail' });
  } catch (error) {
    next(error);
  }
});

// GET /api/brand/banners - 获取轮播图
router.get('/banners', async (req, res, next) => {
  try {
    // TODO: 实现获取轮播图逻辑
    success(res, { message: 'TODO: get banners' });
  } catch (error) {
    next(error);
  }
});

export default router;
