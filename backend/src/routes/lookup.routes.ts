import { Router } from "express";
import { createLookupController } from "../controllers/lookup.controller";

export const createLookupRoutes = (table: string) => {
    const router = Router();
    const controller = createLookupController(table);

    router.get("/", controller.getAll);
    router.get("/:id", controller.getById);
    router.post("/", controller.create);
    router.put("/:id", controller.update);
    router.delete("/:id", controller.delete);

    return router;
};
