
import { Request, Response } from "express";
import { FavouritesService } from "../services/favourites.service";
import { AuthRequest } from "../types/auth.types";

const service = new FavouritesService();

export const FavouritesController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const userId = (req as AuthRequest).user!.id;
      console.log(userId);
      const data = await service.getAll(userId);

      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  add: async (req: Request, res: Response) => {
    const { product_id } = req.body ?? {};

    if (typeof product_id !== "string" ) {
      res.status(400).json({ message: "Valid product_id is required" });
      return;
    }

    try {
      const userId = (req as AuthRequest).user!.id;
      const item = await service.add(userId, product_id);

      if (!item) {
        res.status(409).json({ message: "Already in favourites" });
        return;
      }

      res.status(201).json(item);
    } catch (error: any) {
      if (error.code === "23503") {
        res.status(404).json({ message: "Product not found" });
        return;
      }

      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  remove: async (req: Request, res: Response) => {
    const productId = String(req.params.productId);

    if (!productId) {
      res.status(400).json({ message: "Invalid product ID" });
      return;
    }

    try {
      const userId = (req as AuthRequest).user!.id;
      const deleted = await service.remove(userId, productId);

      if (!deleted) {
        res.status(404).json({ message: "Favourite not found" });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
