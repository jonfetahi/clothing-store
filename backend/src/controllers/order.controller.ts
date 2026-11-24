import { Response } from "express";
import { AuthRequest } from "../types/auth.types";
import { OrderService } from "../services/order.service";

const orderService = new OrderService();

export const OrderController = {
  create: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
        res.status(400).json({ message: "Invalid order payload" });
        return;
      }

      const order = await orderService.create(userId, req.body);

      res.status(201).json(order);
    } catch (error) {
      console.error("Order creation error:", error);

      res.status(400).json({
        message: error instanceof Error
          ? error.message
          : "Failed to create order"
      });
    }
  },
  getMyOrders: async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const orders = await orderService.getMyOrders(userId);

      res.status(200).json(orders);
    } catch (error) {
      console.error("Get orders error:", error);

      res.status(500).json({
        message: "Failed to retrieve orders"
      });
    }
  },

  getMyOrderById: async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      const orderId = req.params.id;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      if (
        typeof orderId !== "string" ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId)
      ) {
        res.status(400).json({ message: "Invalid order ID" });
        return;
      }

      const order = await orderService.getMyOrderById(
        userId,
        orderId
      );

      if (!order) {
        res.status(404).json({
          message: "Order not found"
        });
        return;
      }

      res.status(200).json(order);
    } catch (error) {
      console.error("Get order details error:", error);

      res.status(500).json({
        message: "Failed to retrieve order details"
      });
    }
  }
};