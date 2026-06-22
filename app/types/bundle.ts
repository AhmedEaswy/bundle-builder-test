import type { CategoryItem, ProductItem, ProductVariant } from "./items";

export type ShippingItem = {
  id: number;
  name: string;
  price: number;
  old_price?: number;
  image?: string;
};

export type BundleData = {
  shipping: ShippingItem;
  categories: CategoryItem[];
};

export type BundleApiResponse = {
  message: string;
  results: BundleData;
  status: "success" | "error";
};

export type CartItem = {
  quantity: number;
  variantId?: number;
};

export type CartState = Record<string, CartItem>;
export type PreviewVariantState = Record<string, number>;

export type SavedSystemState = {
  cart: CartState;
  previewVariants: PreviewVariantState;
  currentStep: number | null;
};

export type SelectedReviewItem = {
  key: string;
  category: CategoryItem;
  product: ProductItem;
  quantity: number;
  variantId?: number;
  variant?: ProductVariant;
  image: string;
};

export type ReviewTotals = {
  subtotal: number;
  oldSubtotal: number;
  savings: number;
  monthly: number;
};
