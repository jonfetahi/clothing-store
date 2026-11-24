export type EarningsPeriod = "daily" | "monthly";

export type OrderStatus = "Pending" | "Confirmed" | "Cancelled";

export type PaymentMethod = "card" | "cash_on_delivery";

export type PaymentStatus =
  | "authorized"
  | "completed"
  | "pending"
  | "declined"
  | "cancelled";

export interface DashboardSummary {
  total_revenue: number;
  total_orders: number;
  total_products: number;
  total_customers: number;
  pending_orders: number;
  confirmed_orders: number;
  cancelled_orders: number;
  low_stock_variants: number;
}

export interface DashboardEarnings {
  date: string;
  total_orders: number;
  revenue: number;
}

export interface DashboardTopProduct {
  product_id: string;
  name: string;
  image_url: string | null;
  total_sold: number;
  total_revenue: number;
}

export interface DashboardRecentOrder {
  id: string;
  first_name: string | null;
  last_name: string | null;
  status: OrderStatus;
  payment_method: PaymentMethod | null;
  payment_status: PaymentStatus | null;
  total_amount: number;
  total_items: number;
  created_at: string;
}

export interface DashboardEarningsParams {
  period?: EarningsPeriod;
}

export interface DashboardLimitParams {
  limit?: number;
}