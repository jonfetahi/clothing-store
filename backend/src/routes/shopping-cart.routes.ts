import { Router } from "express";
import { ShoppingCartController } from "../controllers/shopping-cart.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/", ShoppingCartController.getAll);
router.post("/", ShoppingCartController.add);
router.put("/:itemId", ShoppingCartController.update);
router.delete("/:itemId", ShoppingCartController.remove);
router.delete("/", ShoppingCartController.clear);

export default router;