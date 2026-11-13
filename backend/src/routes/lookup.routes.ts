import { Router } from "express";
import { createLookupController } from "../controllers/lookup.controller";
import { authenticate } from "../middleware/auth.middleware";
import { TABLES } from '../services/constants';

export const createLookupRoutes = (table: string) => {
    const router = Router();
    const controller = createLookupController(table);

    if (table === TABLES.PRODUCTS) {
        router.get("/", authenticate, controller.getAll);
        router.get("/:id", authenticate, controller.getById);
    } else {
        router.get("/", controller.getAll);
        router.get("/:id", controller.getById);
    }
    router.post("/", controller.create);
    router.put("/:id", controller.update);
    router.delete("/:id", controller.delete);

    return router;
};
