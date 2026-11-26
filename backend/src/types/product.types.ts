export interface ProductImagePayload {
  image_url: string;
  public_id: string;
  is_primary: boolean;
  display_order: number;
}

export interface ProductVariantPayload {
  size_id: string;
  color_id: string;
  initial_quantity: number;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  category_id: string;
  brand_id: string;
  gender_id: string;
  images: ProductImagePayload[];
  variants: ProductVariantPayload[];
}