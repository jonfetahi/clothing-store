
import pool from "../config/database";

export class ShoppingCartService {
  private async getOrCreateCart(userId: string) {
    const result = await pool.query(`
            INSERT INTO shopping_carts (user_id)
            VALUES ($1)
            ON CONFLICT (user_id)
            DO UPDATE SET user_id = EXCLUDED.user_id
            RETURNING id
        `, [userId]);

    return result.rows[0].id as string;
  }

  async getAll(userId: string) {
    const result = await pool.query(`
            SELECT
                sci.id,
                sci.product_variant_id,
                sci.quantity,
                p.id AS product_id,
                p.name,
                p.price,
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
            FROM shopping_cart_items sci
            JOIN shopping_carts sc ON sc.id = sci.cart_id
            JOIN product_variants pv ON pv.id = sci.product_variant_id
            JOIN products p ON p.id = pv.product_id
            JOIN brands b ON b.id = p.brand_id
            JOIN sizes s ON s.id = pv.size_id
            JOIN colors co ON co.id = pv.color_id
            WHERE sc.user_id = $1
            ORDER BY sci.created_at DESC
        `, [userId]);

    const items = result.rows.map(item => ({
      ...item,
      price: Number(item.price),
      line_total: Number(item.price) * item.quantity
    }));

    const subtotal = items.reduce(
      (sum, item) => sum + item.line_total, 0
    );

    return {
      items,
      subtotal: Number(subtotal.toFixed(2)),
      total_items: items.reduce(
        (sum, item) => sum + item.quantity, 0
      )
    };
  }

  async add(userId: string, variantId: string, quantity: number) {
    const cartId = await this.getOrCreateCart(userId);

    const result = await pool.query(`
            INSERT INTO shopping_cart_items (
                cart_id, product_variant_id, quantity
            )
            VALUES ($1, $2, $3)
            ON CONFLICT (cart_id, product_variant_id)
            DO UPDATE SET
                quantity = shopping_cart_items.quantity + EXCLUDED.quantity
            RETURNING *
        `, [cartId, variantId, quantity]);

    return result.rows[0];
  }

  async update(userId: string, itemId: string, quantity: number) {
    const result = await pool.query(`
            UPDATE shopping_cart_items sci
            SET quantity = $1
            FROM shopping_carts sc
            WHERE sci.cart_id = sc.id
              AND sc.user_id = $2
              AND sci.id = $3
            RETURNING sci.*
        `, [quantity, userId, itemId]);

    return result.rows[0] ?? null;
  }

  async remove(userId: string, itemId: string) {
    const result = await pool.query(`
            DELETE FROM shopping_cart_items sci
            USING shopping_carts sc
            WHERE sci.cart_id = sc.id
              AND sc.user_id = $1
              AND sci.id = $2
        `, [userId, itemId]);

    return (result.rowCount ?? 0) > 0;
  }

  async clear(userId: string) {
    await pool.query(`
            DELETE FROM shopping_cart_items sci
            USING shopping_carts sc
            WHERE sci.cart_id = sc.id
              AND sc.user_id = $1
        `, [userId]);
  }
}
