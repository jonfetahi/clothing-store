
export const CUSTOM_QUERIES: Record<string, {
    getAll?: string;
    getById?: string;
}> = {
    products: {
        getAll: `
      SELECT
        p.*,
        json_build_object(
          'id', c.id,
          'name', c.name
        ) AS category,

        json_build_object(
          'id', b.id,
          'name', b.name
        ) AS brand,

        json_build_object(
          'id', g.id,
          'name', g.name
        ) AS gender,

        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', pi.id,
                'image_url', pi.image_url,
                'is_primary', pi.is_primary
              )
              ORDER BY pi.display_order, pi.id
            )
            FROM product_images pi
            WHERE pi.product_id = p.id
          ),
          '[]'::json
        ) AS images,

        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', pv.id,
                'size', s.name,
                'color', co.name,
                'initial_quantity', pv.initial_quantity
              )
            )
            FROM product_variants pv
            JOIN sizes s ON s.id = pv.size_id
            JOIN colors co ON co.id = pv.color_id
            WHERE pv.product_id = p.id
          ),
          '[]'::json
        ) AS variants

      FROM products p
      JOIN categories c ON c.id = p.category_id
      JOIN brands b ON b.id = p.brand_id
      JOIN genders g ON g.id = p.gender_id
      ORDER BY p.created_at DESC
    `,

        getById: `
      SELECT
        p.*,

        json_build_object(
          'id', c.id,
          'name', c.name
        ) AS category,

        json_build_object(
          'id', b.id,
          'name', b.name
        ) AS brand,

        json_build_object(
          'id', g.id,
          'name', g.name
        ) AS gender,

        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', pi.id,
                'image_url', pi.image_url,
                'is_primary', pi.is_primary
              )
              ORDER BY pi.display_order, pi.id
            )
            FROM product_images pi
            WHERE pi.product_id = p.id
          ),
          '[]'::json
        ) AS images,

        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', pv.id,
                'size', s.name,
                'color', co.name,
                'initial_quantity', pv.initial_quantity
              )
            )
            FROM product_variants pv
            JOIN sizes s ON s.id = pv.size_id
            JOIN colors co ON co.id = pv.color_id
            WHERE pv.product_id = p.id
          ),
          '[]'::json
        ) AS variants

      FROM products p
      JOIN categories c ON c.id = p.category_id
      JOIN brands b ON b.id = p.brand_id
      JOIN genders g ON g.id = p.gender_id
      WHERE p.id = $1
    `
    }
};
