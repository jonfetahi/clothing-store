import pool from "../config/database";
import { CreateProductPayload } from "../types/product.types";

type CreateHandler = (payload: any) => Promise<any>;

export const CUSTOM_CREATE: Record<string, CreateHandler> = {
  products: async (payload: CreateProductPayload) => {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const productResult = await client.query(
        `INSERT INTO products (
                    name,
                    description,
                    price,
                    category_id,
                    brand_id,
                    gender_id
                )
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *`,
        [
          payload.name,
          payload.description,
          payload.price,
          payload.category_id,
          payload.brand_id,
          payload.gender_id
        ]
      );

      const product = productResult.rows[0];

      for (const image of payload.images ?? []) {
        await client.query(
          `INSERT INTO product_images (
                        product_id,
                        image_url,
                        is_primary,
                        display_order
                    )
                    VALUES ($1, $2, $3, $4)`,
          [
            product.id,
            image.image_url,
            image.is_primary,
            image.display_order
          ]
        );
      }

      for (const variant of payload.variants ?? []) {
        await client.query(
          `INSERT INTO product_variants (
                        product_id,
                        size_id,
                        color_id,
                        initial_quantity
                    )
                    VALUES ($1, $2, $3, $4)`,
          [
            product.id,
            variant.size_id,
            variant.color_id,
            variant.initial_quantity
          ]
        );
      }

      await client.query("COMMIT");

      return product;

    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
};