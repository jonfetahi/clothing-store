export type ShoppingCartItem = {
  id: string,
  product_id: string,
  name: string,
  brand: string,
  image_url: string,
  price: number,
  quantity: number,
  size: string,
  color: string,
}


export type ShoppingCartTypes = {
  items: ShoppingCartItem[];
  subtotal: number;
  total_items: number;
}