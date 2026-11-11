import { Request, Response } from "express";
import { ShoppingCartService } from "../services/shopping-cart.service";
import { AuthRequest } from "../types/auth.types";

const service = new ShoppingCartService();

export const ShoppingCartController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const userId = (req as AuthRequest)?.user!.id;
      const data = await service.getAll(userId);

      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  add: async (req: Request, res: Response) => {
    const { product_variant_id, quantity } = req.body ?? {};

    if (
      typeof product_variant_id !== "string" ||
      !product_variant_id ||
      !Number.isSafeInteger(quantity) ||
      quantity <= 0
    ) {
      res.status(400).json({
        message: "Valid product_variant_id and positive integer quantity are required"
      });
      return;
    }

    try {
      const userId = (req as AuthRequest)?.user!.id;
      const item = await service.add(
        userId, product_variant_id, quantity
      );

      res.status(201).json(item);
    } catch (error: any) {
      if (error.code === "23503") {
        res.status(404).json({
          message: "Product variant not found"
        });
        return;
      }

      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  update: async (req: Request, res: Response) => {
    const itemId = String(req.params.itemId);
    const { quantity } = req.body ?? {};

    if (!itemId ||
      !Number.isSafeInteger(quantity) ||
      quantity <= 0
    ) {
      res.status(400).json({
        message: "Valid item ID and positive integer quantity are required"
      });
      return;
    }

    try {
      const userId = (req as AuthRequest)?.user!.id;
      const item = await service.update(userId, itemId, quantity);

      if (!item) {
        res.status(404).json({ message: "Cart item not found" });
        return;
      }

      res.status(200).json(item);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  remove: async (req: Request, res: Response) => {
    const itemId = String(req.params.itemId);

    if (!itemId) {
      res.status(400).json({ message: "Invalid item ID" });
      return;
    }

    try {
      const userId = (req as AuthRequest)?.user!.id;
      const deleted = await service.remove(userId, itemId);

      if (!deleted) {
        res.status(404).json({ message: "Cart item not found" });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  clear: async (req: Request, res: Response) => {
    try {
      const userId = (req as AuthRequest)?.user!.id;
      await service.clear(userId);

      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
