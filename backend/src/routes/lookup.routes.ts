import { Router } from "express";
import { createLookupController } from "../controllers/lookup.controller";
import { authenticate } from "../middleware/auth.middleware";
import { TABLES } from '../services/constants';

export const createLookupRoutes = (table: string) => {
    const router = Router();
    const controller = createLookupController(table);

    router.get("/", controller.getAll);
    router.get("/:id", controller.getById);
    if (table === TABLES.PRODUCTS) {
        router.post("/", authenticate, controller.create);
        router.put("/:id", authenticate, controller.update);
        router.delete("/:id", authenticate, controller.delete);
    } else {
        router.post("/", controller.create);
        router.put("/:id", controller.update);
        router.delete("/:id", controller.delete);

    }


    return router;
};
