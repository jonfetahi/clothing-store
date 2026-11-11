
import pool from "../config/database";

export class FavouritesService {
  async getAll(userId: string) {
    const result = await pool.query(`
            SELECT
                f.id,
                f.product_id,
                f.created_at,
                p.name,
                p.price,
                b.name AS brand,
                (
                    SELECT pi.image_url
                    FROM product_images pi
                    WHERE pi.product_id = p.id
                    ORDER BY pi.is_primary DESC, pi.display_order
                    LIMIT 1
                ) AS image_url
            FROM favourites f
            JOIN products p ON p.id = f.product_id
            JOIN brands b ON b.id = p.brand_id
            WHERE f.user_id = $1
            ORDER BY f.created_at DESC
        `, [userId]);

    return result.rows;
  }

  async add(userId: string, productId: string) {
    const result = await pool.query(`
            INSERT INTO favourites (user_id, product_id)
            VALUES ($1, $2)
            ON CONFLICT (user_id, product_id)
            DO NOTHING
            RETURNING *
        `, [userId, productId]);

    return result.rows[0] ?? null;
  }

  async remove(userId: string, productId: string) {
    const result = await pool.query(`
            DELETE FROM favourites
            WHERE user_id = $1 AND product_id = $2
        `, [userId, productId]);

    return (result.rowCount ?? 0) > 0;
  }
}
