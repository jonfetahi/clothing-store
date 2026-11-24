import { createHash, randomUUID } from "crypto";
import pool from "../config/database";
import { ShoppingCartService } from "./shopping-cart.service";
import { simulatePayment } from "../config/payment-simulation";

export class PaymentService {
  private cartService = new ShoppingCartService();

  async simulate(userId: string, cardNumber: string) {
    const cart = await this.cartService.getAll(userId);

    if (!cart.items.length) {
      throw new Error("Shopping cart is empty");
    }

    if (
      cart.items.some(
        item =>
          !Number.isInteger(item.quantity) ||
          item.quantity <= 0
      )
    ) {
      throw new Error("Shopping cart contains invalid quantities");
    }

    const paymentResult = simulatePayment(cardNumber);

    const cartData = cart.items
      .map(item => ({
        variant_id: item.product_variant_id,
        quantity: item.quantity,
        price: Number(item.price).toFixed(2)
      }))
      .sort((a, b) =>
        a.variant_id.localeCompare(b.variant_id)
      );

    const cartFingerprint = createHash("sha256")
      .update(JSON.stringify(cartData))
      .digest("hex");

    const amount = cart.subtotal.toFixed(2);
    const reference = `SIM-${randomUUID()}`;

    const result = await pool.query(
      `
        INSERT INTO payments (
          user_id,
          reference,
          amount,
          currency,
          method,
          status,
          cart_fingerprint,
          expires_at
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          NOW() + INTERVAL '15 minutes'
        )
        RETURNING
          reference,
          amount,
          currency,
          status,
          expires_at
      `,
      [
        userId,
        reference,
        amount,
        "EUR",
        "card",
        paymentResult.status,
        cartFingerprint
      ]
    );

    const payment = result.rows[0];

    return {
      success: paymentResult.success,
      message: paymentResult.message,
      status: payment.status,
      payment_reference: paymentResult.success
        ? payment.reference
        : null,
      amount: Number(payment.amount),
      currency: payment.currency,
      expires_at: paymentResult.success
        ? payment.expires_at
        : null
    };
  }
}