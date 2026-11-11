import { Router } from "express";
import { FavouritesController } from "../controllers/favourites.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/", FavouritesController.getAll);
router.post("/", FavouritesController.add);
router.delete("/:productId", FavouritesController.remove);

export default router;