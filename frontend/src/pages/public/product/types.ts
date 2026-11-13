type ProductImage = {
  id: string;
  image_url: string;
  is_primary: boolean;
};
type ProductVariant = {
  id: string;
  size: string;
  color: string;
  initial_quantity: number;
};

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: string | number;
  category: { id: string; name: string };
  brand: { id: string; name: string };
  gender: { id: string; name: string };
  is_favourite: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
};
