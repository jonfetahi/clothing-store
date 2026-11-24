import pool from "../config/database";

export class DashboardService {

  // DASHBOARD STATISTICS
  async getSummary() {
    const result = await pool.query(`
      WITH sold_quantities AS (
        SELECT
          oi.product_variant_id,
          SUM(oi.quantity) AS sold
        FROM order_items oi
        JOIN orders o ON o.id = oi.order_id
        WHERE o.status = 'Confirmed'
        GROUP BY oi.product_variant_id
      )
      SELECT
        (
          SELECT COALESCE(SUM(total_amount), 0)
          FROM orders
          WHERE status = 'Confirmed'
        ) AS total_revenue,

        (
          SELECT COUNT(*) FROM orders
        ) AS total_orders,

        (
          SELECT COUNT(*) FROM products
        ) AS total_products,

        (
          SELECT COUNT(DISTINCT user_id) FROM orders
        ) AS total_customers,

        (
          SELECT COUNT(*) FROM orders
          WHERE status = 'Pending'
        ) AS pending_orders,

        (
          SELECT COUNT(*) FROM orders
          WHERE status = 'Confirmed'
        ) AS confirmed_orders,

        (
          SELECT COUNT(*) FROM orders
          WHERE status = 'Cancelled'
        ) AS cancelled_orders,

        (
          SELECT COUNT(*)
          FROM product_variants pv
          LEFT JOIN sold_quantities sq
            ON sq.product_variant_id = pv.id
          WHERE pv.initial_quantity - COALESCE(sq.sold, 0) <= 5
        ) AS low_stock_variants
    `);

    const summary = result.rows[0];

    return {
      total_revenue: Number(summary.total_revenue),
      total_orders: Number(summary.total_orders),
      total_products: Number(summary.total_products),
      total_customers: Number(summary.total_customers),
      pending_orders: Number(summary.pending_orders),
      confirmed_orders: Number(summary.confirmed_orders),
      cancelled_orders: Number(summary.cancelled_orders),
      low_stock_variants: Number(summary.low_stock_variants)
    };
  }

  // DAILY AND MONTHLY EARNINGS
  async getEarnings(period: "daily" | "monthly") {
    const isDaily = period === "daily";

    const dateUnit = isDaily ? "day" : "month";
    const dateFormat = isDaily ? "YYYY-MM-DD" : "YYYY-MM";
    const range = isDaily ? "29 days" : "11 months";
    const step = isDaily ? "1 day" : "1 month";

    const result = await pool.query(`
      WITH periods AS (
        SELECT generate_series(
          DATE_TRUNC(
            $1::text,
            NOW() AT TIME ZONE 'Europe/Skopje'
          ) - $3::interval,
          DATE_TRUNC(
            $1::text,
            NOW() AT TIME ZONE 'Europe/Skopje'
          ),
          $4::interval
        ) AS period_date
      ),
      earnings AS (
        SELECT
          DATE_TRUNC(
            $1::text,
            created_at AT TIME ZONE 'Europe/Skopje'
          ) AS period_date,
          COUNT(*) AS total_orders,
          SUM(total_amount) AS revenue
        FROM orders
        WHERE status = 'Confirmed'
        GROUP BY 1
      )
      SELECT
        TO_CHAR(p.period_date, $2::text) AS date,
        COALESCE(e.total_orders, 0) AS total_orders,
        COALESCE(e.revenue, 0) AS revenue
      FROM periods p
      LEFT JOIN earnings e
        ON e.period_date = p.period_date
      ORDER BY p.period_date ASC
    `, [dateUnit, dateFormat, range, step]);

    return result.rows.map(row => ({
      date: row.date,
      total_orders: Number(row.total_orders),
      revenue: Number(row.revenue)
    }));
  }

  // TOP-SELLING PRODUCTS
  async getTopSellingProducts(limit: number = 5) {
    const result = await pool.query(`
      SELECT
        p.id AS product_id,
        p.name,

        (
          SELECT pi.image_url
          FROM product_images pi
          WHERE pi.product_id = p.id
          ORDER BY pi.is_primary DESC, pi.display_order
          LIMIT 1
        ) AS image_url,

        SUM(oi.quantity) AS total_sold,
        SUM(oi.quantity * oi.unit_price) AS total_revenue

      FROM order_items oi
      JOIN orders o
        ON o.id = oi.order_id
      JOIN product_variants pv
        ON pv.id = oi.product_variant_id
      JOIN products p
        ON p.id = pv.product_id

      WHERE o.status = 'Confirmed'

      GROUP BY p.id, p.name
      ORDER BY total_sold DESC, total_revenue DESC, p.id
      LIMIT $1
    `, [limit]);

    return result.rows.map(product => ({
      ...product,
      total_sold: Number(product.total_sold),
      total_revenue: Number(product.total_revenue)
    }));
  }

  // RECENT ORDERS
  async getRecentOrders(limit: number = 5) {
    const result = await pool.query(`
      SELECT
        o.id,
        o.first_name,
        o.last_name,
        o.status,
        o.payment_method,
        p.status AS payment_status,
        o.total_amount,
        o.created_at,

        (
          SELECT COALESCE(SUM(oi.quantity), 0)
          FROM order_items oi
          WHERE oi.order_id = o.id
        ) AS total_items

      FROM orders o
      LEFT JOIN payments p
        ON p.order_id = o.id

      ORDER BY o.created_at DESC, o.id
      LIMIT $1
    `, [limit]);

    return result.rows.map(order => ({
      ...order,
      total_amount: Number(order.total_amount),
      total_items: Number(order.total_items)
    }));
  }
}