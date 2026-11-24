import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, OrderController.create);
router.get("/my", authenticate, OrderController.getMyOrders);
router.get("/my/:id", authenticate, OrderController.getMyOrderById);

export default router;