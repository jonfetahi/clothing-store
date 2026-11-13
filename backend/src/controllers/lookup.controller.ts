import { Request, Response } from "express";
import { LookupService } from "../services/lookup.service";
import { AuthRequest } from '../types/auth.types';

export const createLookupController = (table: string) => {
    const service = new LookupService(table);

    return {
        async getAll(req: Request, res: Response) {
            const filters = {
                gender: req.query.gender as string,
                search: req.query.search as string,
            };

            const userId = (req as AuthRequest).user?.id ?? null;
            const results = await service.getAll(filters, userId);
            res.json(results);
        },
        async getById(req: Request, res: Response) {
            const userId = (req as AuthRequest).user?.id ?? null;

            const result = await service.getById(
              req.params.id as string,
              userId
            );

            if (!result) {
                return res.status(404).json({
                    message: "Record not found",
                });
            }

            res.json(result);
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
