export interface OrderItem {
  id: string;
  product_variant_id: string;
  quantity: number;
  unit_price: number;
  product_id: string;
  name: string;
  brand?: string;
  size?: string;
  color?: string;
  image_url: string;
  line_total: number;
}

export interface OrderDetails {
  id: string;
  user_id?: string;
  status: string;
  total_amount: number;
  created_at: string;
  updated_at?: string;
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  country: string;
  postal_code: string;
  email_address: string;
  payment_method: string;
  payment_status: string;
  payment_reference?: string;
  currency?: string;
  total_items?: number;
  items: OrderItem[];
}