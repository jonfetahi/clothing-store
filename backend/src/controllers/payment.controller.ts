import { Response } from "express";
import { AuthRequest } from "../types/auth.types";
import { PaymentService } from "../services/payment.service";

const paymentService = new PaymentService();

export const PaymentController = {
  simulate: async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      const { card_number } = req.body ?? {};

      if (!userId) {
        res.status(401).json({
          message: "Authentication required"
        });
        return;
      }

      if (typeof card_number !== "string") {
        res.status(400).json({
          message: "Demo card number is required"
        });
        return;
      }

      const result = await paymentService.simulate(
        userId,
        card_number
      );

      res.status(200).json(result);
    } catch (error) {
      console.error("Payment simulation error:", error);

      res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Payment simulation failed"
      });
    }
  }
};