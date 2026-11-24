import pool from "../config/database";
import { createHash, randomUUID } from "crypto";
import { CreateOrderPayload } from "../types/order.types";

export class OrderService {
  async create(userId: string, payload: CreateOrderPayload) {
    const client = await pool.connect();

    try {
      // Validate shipping information
      const requiredFields = [
        payload.first_name,
        payload.last_name,
        payload.address,
        payload.city,
        payload.country,
        payload.postal_code,
        payload.email_address
      ];

      if (
        requiredFields.some(
          field => typeof field !== "string" || !field.trim()
        )
      ) {
        throw new Error("All shipping fields are required");
      }

      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email_address)
      ) {
        throw new Error("Invalid email address");
      }

      // Validate payment method
      if (
        payload.payment_method !== "card" &&
        payload.payment_method !== "cash_on_delivery"
      ) {
        throw new Error("Invalid payment method");
      }

      if (
        payload.payment_method === "card" &&
        (
          typeof payload.payment_reference !== "string" ||
          !payload.payment_reference.trim()
        )
      ) {
        throw new Error("Payment reference is required");
      }

      if (
        payload.payment_method === "cash_on_delivery" &&
        payload.payment_reference != null
      ) {
        throw new Error("Cash on Delivery does not require a payment reference");
      }

      await client.query("BEGIN");

      // Lock the customer's cart
      const cartResult = await client.query(
        `SELECT id
         FROM shopping_carts
         WHERE user_id = $1
         FOR UPDATE`,
        [userId]
      );

      if (!cartResult.rows.length) {
        throw new Error("Shopping cart not found");
      }

      const cartId = cartResult.rows[0].id;

      // Retrieve and lock cart items
      const itemsResult = await client.query(
        `SELECT
            sci.id,
            sci.product_variant_id,
            sci.quantity,
            p.price,
            pv.initial_quantity
         FROM shopping_cart_items sci
         JOIN product_variants pv
            ON pv.id = sci.product_variant_id
         JOIN products p
            ON p.id = pv.product_id
         WHERE sci.cart_id = $1
         ORDER BY sci.product_variant_id
         FOR UPDATE OF sci`,
        [cartId]
      );

      const items = itemsResult.rows;

      if (!items.length) {
        throw new Error("Shopping cart is empty");
      }

      // Lock product variants
      const variantIds = [
        ...new Set(items.map(item => item.product_variant_id))
      ].sort();

      await client.query(
        `SELECT id
         FROM product_variants
         WHERE id = ANY($1::uuid[])
         ORDER BY id
         FOR UPDATE`,
        [variantIds]
      );

      // Refresh stock and prices after acquiring locks
      const currentProducts = await client.query(
        `SELECT
            pv.id,
            pv.initial_quantity,
            p.price
         FROM product_variants pv
         JOIN products p ON p.id = pv.product_id
         WHERE pv.id = ANY($1::uuid[])
         ORDER BY p.id, pv.id
         FOR SHARE OF p`,
        [variantIds]
      );

      const productMap = new Map(
        currentProducts.rows.map(row => [row.id, row])
      );

      for (const item of items) {
        const product = productMap.get(item.product_variant_id);

        if (!product) {
          throw new Error("Product variant not found");
        }

        item.price = product.price;
        item.initial_quantity = product.initial_quantity;
      }

      // Calculate quantities sold in confirmed orders
      const soldResult = await client.query(
        `SELECT
            oi.product_variant_id,
            COALESCE(SUM(oi.quantity), 0)::int AS sold
         FROM order_items oi
         JOIN orders o ON o.id = oi.order_id
         WHERE o.status = 'Confirmed'
           AND oi.product_variant_id = ANY($1::uuid[])
         GROUP BY oi.product_variant_id`,
        [variantIds]
      );

      const soldMap = new Map(
        soldResult.rows.map(row => [
          row.product_variant_id,
          Number(row.sold)
        ])
      );

      // Validate stock and calculate total
      let total = 0;

      for (const item of items) {
        const sold = soldMap.get(item.product_variant_id) ?? 0;
        const available = item.initial_quantity - sold;

        if (
          !Number.isInteger(item.quantity) ||
          item.quantity <= 0 ||
          item.quantity > available
        ) {
          throw new Error(
            `Invalid or insufficient stock for variant ${item.product_variant_id}`
          );
        }

        total += Number(item.price) * item.quantity;
      }

      const totalAmount = total.toFixed(2);

      // Validate existing card payment
      let paymentId: string | null = null;

      if (payload.payment_method === "card") {

        // Generate the current cart fingerprint
        const cartData = items
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

        // Retrieve and lock the authorized payment
        const paymentResult = await client.query(
          `SELECT *
           FROM payments
           WHERE reference = $1
             AND user_id = $2
             AND method = 'card'
             AND status = 'authorized'
             AND order_id IS NULL
             AND expires_at > NOW()
           FOR UPDATE`,
          [payload.payment_reference, userId]
        );

        if (!paymentResult.rows.length) {
          throw new Error(
            "Payment authorization is invalid, expired or already used"
          );
        }

        const payment = paymentResult.rows[0];

        if (payment.currency !== "EUR") {
          throw new Error("Invalid payment currency");
        }

        if (Number(payment.amount).toFixed(2) !== totalAmount) {
          throw new Error("Payment amount does not match order total");
        }

        if (payment.cart_fingerprint !== cartFingerprint) {
          throw new Error(
            "Shopping cart has changed. Please authorize payment again"
          );
        }

        paymentId = payment.id;
      }

      // Create order with shipping information
      const orderResult = await client.query(
        `INSERT INTO orders (
            user_id,
            status,
            total_amount,
            first_name,
            last_name,
            address,
            city,
            country,
            postal_code,
            email_address,
            payment_method
         )
         VALUES (
            $1, $2, $3, $4, $5, $6,
            $7, $8, $9, $10, $11
         )
         RETURNING *`,
        [
          userId,
          "Pending",
          totalAmount,
          payload.first_name.trim(),
          payload.last_name.trim(),
          payload.address.trim(),
          payload.city.trim(),
          payload.country.trim(),
          payload.postal_code.trim(),
          payload.email_address.trim(),
          payload.payment_method
        ]
      );

      const order = orderResult.rows[0];

      // Insert order items
      for (const item of items) {
        await client.query(
          `INSERT INTO order_items (
              order_id,
              product_variant_id,
              quantity,
              unit_price
           )
           VALUES ($1, $2, $3, $4)`,
          [
            order.id,
            item.product_variant_id,
            item.quantity,
            item.price
          ]
        );
      }

      // Associate payment with the order
      if (payload.payment_method === "card") {
        await client.query(
          `UPDATE payments
           SET order_id = $1,
               status = 'completed'
           WHERE id = $2`,
          [order.id, paymentId]
        );
      } else {
        // Create Cash on Delivery payment
        await client.query(
          `INSERT INTO payments (
              user_id,
              order_id,
              reference,
              amount,
              currency,
              method,
              status
           )
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            userId,
            order.id,
            `COD-${randomUUID()}`,
            totalAmount,
            "EUR",
            "cash_on_delivery",
            "pending"
          ]
        );
      }

      // Clear only the purchased cart items
      await client.query(
        `DELETE FROM shopping_cart_items
         WHERE cart_id = $1
           AND id = ANY($2::uuid[])`,
        [cartId, items.map(item => item.id)]
      );

      await client.query("COMMIT");

      return {
        ...order,
        total_amount: Number(order.total_amount),
        payment_status:
          payload.payment_method === "card"
            ? "completed"
            : "pending"
      };

    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async getMyOrders(userId: string) {
    const result = await pool.query(
      `SELECT
        o.id,
        o.status,
        o.total_amount,
        o.payment_method,
        p.status AS payment_status,
        o.created_at,
        o.updated_at,
        (
          SELECT COALESCE(SUM(oi.quantity), 0)::int
          FROM order_items oi
          WHERE oi.order_id = o.id
        ) AS total_items
     FROM orders o
     LEFT JOIN payments p ON p.order_id = o.id
     WHERE o.user_id = $1
     ORDER BY o.created_at DESC`,
      [userId]
    );

    return result.rows.map(order => ({
      ...order,
      total_amount: Number(order.total_amount)
    }));
  }

  async getMyOrderById(userId: string, orderId: string) {
    const orderResult = await pool.query(
      `SELECT
        o.*,
        p.status AS payment_status,
        p.reference AS payment_reference,
        p.currency
     FROM orders o
     LEFT JOIN payments p ON p.order_id = o.id
     WHERE o.id = $1 AND o.user_id = $2`,
      [orderId, userId]
    );

    if (!orderResult.rows.length) {
      return null;
    }

    const order = orderResult.rows[0];

    const itemsResult = await pool.query(
      `SELECT
        oi.id,
        oi.product_variant_id,
        oi.quantity,
        oi.unit_price,
        p.id AS product_id,
        p.name,
        b.name AS brand,
        s.name AS size,
        co.name AS color,
        (
          SELECT pi.image_url
          FROM product_images pi
          WHERE pi.product_id = p.id
          ORDER BY pi.is_primary DESC, pi.display_order
          LIMIT 1
        ) AS image_url
     FROM order_items oi
     JOIN product_variants pv
        ON pv.id = oi.product_variant_id
     JOIN products p ON p.id = pv.product_id
     JOIN brands b ON b.id = p.brand_id
     JOIN sizes s ON s.id = pv.size_id
     JOIN colors co ON co.id = pv.color_id
     WHERE oi.order_id = $1
     ORDER BY oi.id`,
      [orderId]
    );

    const items = itemsResult.rows.map(item => ({
      ...item,
      unit_price: Number(item.unit_price),
      line_total: Number(
        (Number(item.unit_price) * item.quantity).toFixed(2)
      )
    }));

    return {
      ...order,
      total_amount: Number(order.total_amount),
      total_items: items.reduce(
        (sum, item) => sum + item.quantity,
        0
      ),
      items
    };
  }
}