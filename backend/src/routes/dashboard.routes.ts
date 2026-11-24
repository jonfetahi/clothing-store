import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import {
  authenticate,
  authorize,
} from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate, authorize('Admin'));

router.get('/summary', DashboardController.getSummary);
router.get('/earnings', DashboardController.getEarnings);
router.get('/top-selling-products', DashboardController.getTopSellingProducts,);
router.get("/recent-orders", DashboardController.getRecentOrders);

export default router;