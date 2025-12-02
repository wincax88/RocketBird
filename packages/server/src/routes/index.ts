import { Router } from 'express';
import authRoutes from './auth.routes';
import levelRoutes from './level.routes';
import pointsRoutes from './points.routes';
import checkinRoutes from './checkin.routes';
import benefitsRoutes from './benefits.routes';
import mealsRoutes from './meals.routes';
import referralRoutes from './referral.routes';
import feedbackRoutes from './feedback.routes';
import brandRoutes from './brand.routes';
import adminRoutes from './admin';

const router = Router();

// 会员端路由
router.use('/auth', authRoutes);
router.use('/level', levelRoutes);
router.use('/points', pointsRoutes);
router.use('/checkin', checkinRoutes);
router.use('/benefits', benefitsRoutes);
router.use('/meals', mealsRoutes);
router.use('/referral', referralRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/brand', brandRoutes);

// 管理后台路由
router.use('/admin', adminRoutes);

export default router;
