import { Router } from "express";
import { upload } from "../middleware/upload.middleware";
import { uploadProductImage } from "../controllers/image.controller";

const router = Router();

router.post("/upload", upload.single("image"), uploadProductImage);

export default router;
