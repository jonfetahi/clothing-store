import { Request, Response } from "express";
import { LookupService } from "../services/lookup.service";

export const createLookupController = (table: string) => {
    const service = new LookupService(table);

    return {
        getAll: async (req: Request, res: Response) => {
            try {
                const gender =
                  typeof req.query.gender === "string"
                    ? req.query.gender
                    : undefined;

                const search =
                  typeof req.query.search === "string"
                    ? req.query.search
                    : undefined;

                const data = await service.getAll({
                    gender,
                    search
                });
                res.status(200).json(data);
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    message: "Internal server error"
                });
            }
        },


        getById: async (req: Request, res: Response) => {
            try {
                const item = await service.getById(String(req.params.id));

                if (!item) {
                    res.status(404).json({ message: "Not found" });
                    return;
                }

                res.status(200).json(item);
            } catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        },

        create: async (req: Request, res: Response) => {
            try {
                const name = req.body?.name;

                if (typeof name !== "string" || !name.trim()) {
                    res.status(400).json({ message: "Name is required" });
                    return;
                }

                const item = await service.create(name.trim());
                res.status(201).json(item);
            } catch (error: any) {
                if (error.code === "23505") {
                    res.status(409).json({ message: "Name already exists" });
                    return;
                }

                res.status(500).json({ message: "Internal server error" });
            }
        },

        update: async (req: Request, res: Response) => {
            try {
                const name = req.body?.name;

                if (typeof name !== "string" || !name.trim()) {
                    res.status(400).json({ message: "Name is required" });
                    return;
                }

                const item = await service.update(
                    String(req.params.id),
                    name.trim()
                );

                if (!item) {
                    res.status(404).json({ message: "Not found" });
                    return;
                }

                res.status(200).json(item);
            } catch (error: any) {
                if (error.code === "23505") {
                    res.status(409).json({ message: "Name already exists" });
                    return;
                }

                res.status(500).json({ message: "Internal server error" });
            }
        },

        delete: async (req: Request, res: Response) => {
            try {
                const deleted = await service.delete(
                    String(req.params.id)
                );

                if (!deleted) {
                    res.status(404).json({ message: "Not found" });
                    return;
                }

                res.status(204).send();
            } catch (error: any) {
                if (error.code === "23503") {
                    res.status(409).json({
                        message: "Cannot delete an item that is in use"
                    });
                    return;
                }

                res.status(500).json({ message: "Internal server error" });
            }
        }
    };
};
