import { useUUID as createStableKey } from "../composables/useUUID";
import type { CategoryItem, ProductItem } from "../types/items";
import type {
  CartItem,
  CartState,
  PreviewVariantState,
  SavedSystemState,
  SelectedReviewItem,
  ShippingItem,
} from "../types/bundle";

export const savedSystemStorageKey = "bundle-builder.saved-system";

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export const formatProductPeriod = (period?: string) =>
  period ? `/${period.toLowerCase()}` : "";

export const getComparableOldPrice = (price: number, oldPrice?: number) =>
  oldPrice && oldPrice > price ? oldPrice : price;

export const isRequiredProduct = (product: ProductItem) =>
  Boolean(product.required || product.is_required);

export const getCartKey = (
  category: CategoryItem,
  product: ProductItem,
  variantId?: number,
) => createStableKey(`${category.key}-${product.id}-${variantId ?? "default"}`);

export const getSelectedVariant = (product: ProductItem, variantId?: number) =>
  product.variants?.find((variant) => variant.id === variantId);

export const getDefaultVariantId = (product: ProductItem) =>
  product.variants?.[0]?.id;

export const getProductStock = (product: ProductItem, variantId?: number) => {
  const variant = getSelectedVariant(product, variantId);

  return variant?.stock ?? product.stock ?? 0;
};

export const getProductImage = (product: ProductItem, variantId?: number) =>
  getSelectedVariant(product, variantId)?.image ?? product.image ?? "/file.svg";

export const getInitialCart = (categories: CategoryItem[]) =>
  categories.reduce<CartState>((cart, category) => {
    category.products.forEach((product) => {
      if (!isRequiredProduct(product)) return;

      const variantId = getDefaultVariantId(product);
      const stock = getProductStock(product, variantId);
      if (stock <= 0) return;

      cart[getCartKey(category, product, variantId)] = {
        quantity: 1,
        variantId,
      };
    });

    return cart;
  }, {});

export const getSelectedItems = (
  categories: CategoryItem[],
  cart: CartState,
): SelectedReviewItem[] =>
  categories.flatMap((category) =>
    category.products.flatMap((product) => {
      if (product.variants?.length) {
        return product.variants.flatMap((variant) => {
          const key = getCartKey(category, product, variant.id);
          const cartItem = cart[key];
          if (!cartItem?.quantity) return [];

          return [
            {
              key,
              category,
              product,
              quantity: cartItem.quantity,
              variantId: variant.id,
              variant,
              image: variant.image,
            },
          ];
        });
      }

      const key = getCartKey(category, product);
      const cartItem = cart[key];
      if (!cartItem?.quantity) return [];

      return [
        {
          key,
          category,
          product,
          quantity: cartItem.quantity,
          image: getProductImage(product),
        },
      ];
    }),
  );

export const getSelectedCountByCategory = (
  categories: CategoryItem[],
  cart: CartState,
) =>
  categories.reduce<Record<string, number>>((counts, category) => {
    counts[category.key] = category.products.reduce((total, product) => {
      const hasSelectedProduct = product.variants?.length
        ? product.variants.some(
            (variant) =>
              (cart[getCartKey(category, product, variant.id)]?.quantity ?? 0) >
              0,
          )
        : (cart[getCartKey(category, product)]?.quantity ?? 0) > 0;

      return total + (hasSelectedProduct ? 1 : 0);
    }, 0);

    return counts;
  }, {});

export const getBundleTotals = (
  selectedItems: SelectedReviewItem[],
  shipping: ShippingItem,
) => {
  const productsSubtotal = selectedItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );
  const productsOldSubtotal = selectedItems.reduce(
    (total, item) =>
      total +
      getComparableOldPrice(item.product.price, item.product.old_price) *
        item.quantity,
    0,
  );
  const hasSelectedItems = selectedItems.length > 0;
  const subtotal = productsSubtotal + (hasSelectedItems ? shipping.price : 0);
  const oldSubtotal =
    productsOldSubtotal +
    (hasSelectedItems
      ? getComparableOldPrice(shipping.price, shipping.old_price)
      : 0);

  return {
    subtotal,
    oldSubtotal,
    savings: Math.max(oldSubtotal - subtotal, 0),
    monthly: subtotal / 10,
  };
};

const isCartState = (value: unknown): value is CartState => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;

  return Object.values(value).every((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return false;

    const cartItem = item as Partial<CartItem>;
    return (
      typeof cartItem.quantity === "number" &&
      (cartItem.variantId === undefined || typeof cartItem.variantId === "number")
    );
  });
};

const isPreviewVariantState = (value: unknown): value is PreviewVariantState => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;

  return Object.values(value).every((variantId) => typeof variantId === "number");
};

export const parseSavedSystemState = (
  value: string | null,
  maxStepLength: number,
): SavedSystemState | null => {
  if (!value) return null;

  try {
    const savedState = JSON.parse(value) as Partial<SavedSystemState>;
    const currentStep = savedState.currentStep;
    const isCurrentStepValid =
      currentStep === null ||
      (typeof currentStep === "number" &&
        currentStep >= 1 &&
        currentStep <= maxStepLength);

    if (
      !isCartState(savedState.cart) ||
      !isPreviewVariantState(savedState.previewVariants) ||
      !isCurrentStepValid
    ) {
      return null;
    }

    return {
      cart: savedState.cart,
      previewVariants: savedState.previewVariants,
      currentStep,
    };
  } catch {
    return null;
  }
};
