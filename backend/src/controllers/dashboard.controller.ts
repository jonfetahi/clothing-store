import { Request, Response } from "express";
import { DashboardService } from "../services/dashboard.service";

const dashboardService = new DashboardService();

export const DashboardController = {

  getSummary: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const summary = await dashboardService.getSummary();

      res.status(200).json(summary);
    } catch (error) {
      console.error("Dashboard summary error:", error);

      res.status(500).json({
        message: "Failed to retrieve dashboard summary"
      });
    }
  },

  getEarnings: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const period = req.query.period ?? "daily";

      if (period !== "daily" && period !== "monthly") {
        res.status(400).json({
          message: "Period must be daily or monthly"
        });
        return;
      }

      const earnings = await dashboardService.getEarnings(period);

      res.status(200).json(earnings);
    } catch (error) {
      console.error("Dashboard earnings error:", error);

      res.status(500).json({
        message: "Failed to retrieve earnings"
      });
    }
  },

  getTopSellingProducts: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const limit = Number(req.query.limit ?? 5);

      if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
        res.status(400).json({
          message: "Limit must be between 1 and 100"
        });
        return;
      }

      const products =
        await dashboardService.getTopSellingProducts(limit);

      res.status(200).json(products);
    } catch (error) {
      console.error("Top-selling products error:", error);

      res.status(500).json({
        message: "Failed to retrieve top-selling products"
      });
    }
  },

  getRecentOrders: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const limit = Number(req.query.limit ?? 5);

      if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
        res.status(400).json({
          message: "Limit must be between 1 and 100"
        });
        return;
      }

      const orders =
        await dashboardService.getRecentOrders(limit);

      res.status(200).json(orders);
    } catch (error) {
      console.error("Recent orders error:", error);

      res.status(500).json({
        message: "Failed to retrieve recent orders"
      });
    }
  }
};