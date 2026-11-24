export type PaymentMethod = "card" | "cash_on_delivery";

export interface CreateOrderPayload {
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  country: string;
  postal_code: string;
  email_address: string;
  payment_method: PaymentMethod;
  payment_reference: string | null;
}