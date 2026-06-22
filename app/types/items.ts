export type ProductVariant = {
  id: number;
  color: string;
  stock: number;
  image: string;
};

export type ProductItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  discount_percentage: number;
  image?: string;
  old_price?: number;
  stock?: number;
  required?: boolean;
  is_required?: boolean;
  variants?: ProductVariant[];
};

export type CategoryItem = {
  id: number;
  key: string;
  name: string;
  products: ProductItem[];
  icon_url: string;
  label: string;
};
