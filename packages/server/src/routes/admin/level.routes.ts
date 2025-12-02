import { Router } from 'express';
import { adminAuthMiddleware } from '../../middlewares/admin-auth.middleware';
import { success } from '../../utils/response';

const router = Router();

// GET /api/admin/levels - 获取等级规则列表
router.get('/', adminAuthMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现获取等级规则列表逻辑
    success(res, { message: 'TODO: get level rules' });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/levels - 创建等级规则
router.post('/', adminAuthMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现创建等级规则逻辑
    success(res, { message: 'TODO: create level rule' });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/levels/:levelId - 更新等级规则
router.put('/:levelId', adminAuthMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现更新等级规则逻辑
    success(res, { message: 'TODO: update level rule' });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/levels/:levelId - 删除等级规则
router.delete('/:levelId', adminAuthMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现删除等级规则逻辑
    success(res, { message: 'TODO: delete level rule' });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/levels/stats - 等级分布统计
router.get('/stats', adminAuthMiddleware, async (req, res, next) => {
  try {
    // TODO: 实现等级分布统计逻辑
    success(res, { message: 'TODO: get level stats' });
  } catch (error) {
    next(error);
  }
});

export default router;
