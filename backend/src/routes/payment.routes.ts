import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/simulate",  authenticate, PaymentController.simulate);

export default router;