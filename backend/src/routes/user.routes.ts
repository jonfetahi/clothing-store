import { Router } from "express";
import { UsersController } from "../controllers/users.controller";
import {
  authenticate,
  authorize
} from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);
router.use(authorize("Admin"));

router.get("/", UsersController.getAll);
router.get("/:id", UsersController.getById);
router.put("/:id/role", UsersController.updateRole);
router.put("/:id", UsersController.update);

export default router;
