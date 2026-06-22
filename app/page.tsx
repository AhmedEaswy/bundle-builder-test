"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useUUID as createStableKey } from "./composables/useUUID";
import Product from "./componsnts/product";
import ReviewSidebar from "./componsnts/ReviewSidebar";
import bundleData from "./data/bundle.json";
import type { CategoryItem, ProductItem, ProductVariant } from "./types/items";

type CartItem = {
  quantity: number;
  variantId?: number;
};

type CartState = Record<string, CartItem>;
type PreviewVariantState = Record<string, number>;

type SelectedReviewItem = {
  key: string;
  category: CategoryItem;
  product: ProductItem;
  quantity: number;
  variantId?: number;
  variant?: ProductVariant;
  image: string;
};

const shipping = bundleData.shipping;
const categories = bundleData.categories as CategoryItem[];
const maxStepLength = categories.length;

const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

const getComparableOldPrice = (price: number, oldPrice?: number) =>
  oldPrice && oldPrice > price ? oldPrice : price;

const isRequiredProduct = (product: ProductItem) =>
  Boolean(product.required || product.is_required);

const getCartKey = (
  category: CategoryItem,
  product: ProductItem,
  variantId?: number,
) => createStableKey(`${category.key}-${product.id}-${variantId ?? "default"}`);

const getSelectedVariant = (product: ProductItem, variantId?: number) =>
  product.variants?.find((variant) => variant.id === variantId);

const getDefaultVariantId = (product: ProductItem) => product.variants?.[0]?.id;

const getProductStock = (product: ProductItem, variantId?: number) => {
  const variant = getSelectedVariant(product, variantId);

  return variant?.stock ?? product.stock ?? 0;
};

const getProductImage = (product: ProductItem, variantId?: number) =>
  getSelectedVariant(product, variantId)?.image ?? product.image ?? "/file.svg";

const getInitialCart = () =>
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

export default function Home() {
  const [currentStep, setCurrentStep] = useState<number | null>(1);
  const [cart, setCart] = useState<CartState>(() => getInitialCart());
  const [previewVariants, setPreviewVariants] = useState<PreviewVariantState>(
    {},
  );

  const selectedItems = useMemo<SelectedReviewItem[]>(
    () =>
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
      ),
    [cart],
  );

  const selectedCountByCategory = useMemo(
    () =>
      categories.reduce<Record<string, number>>((counts, category) => {
        counts[category.key] = category.products.reduce((total, product) => {
          const hasSelectedProduct = product.variants?.length
            ? product.variants.some(
                (variant) =>
                  (cart[getCartKey(category, product, variant.id)]?.quantity ??
                    0) > 0,
              )
            : (cart[getCartKey(category, product)]?.quantity ?? 0) > 0;

          return total + (hasSelectedProduct ? 1 : 0);
        }, 0);

        return counts;
      }, {}),
    [cart],
  );

  const totals = useMemo(() => {
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
  }, [selectedItems]);

  const updateQuantity = (
    category: CategoryItem,
    product: ProductItem,
    direction: 1 | -1,
    variantId?: number,
  ) => {
    setCart((previousCart) => {
      if (direction === 1 && isRequiredProduct(product)) {
        return previousCart;
      }

      const variantTarget = product.variants?.find((variant) => {
        const quantity =
          previousCart[getCartKey(category, product, variant.id)]?.quantity ??
          0;

        return direction === 1 ? quantity < variant.stock : quantity > 0;
      });
      const selectedVariantId =
        variantId ??
        (product.variants?.length
          ? (variantTarget?.id ?? getDefaultVariantId(product))
          : undefined);
      const key = getCartKey(category, product, selectedVariantId);
      const currentItem = previousCart[key];
      const maxQuantity = getProductStock(product, selectedVariantId);
      const totalProductQuantity = product.variants?.length
        ? product.variants.reduce(
            (total, variant) =>
              total +
              (previousCart[getCartKey(category, product, variant.id)]
                ?.quantity ?? 0),
            0,
          )
        : (currentItem?.quantity ?? 0);
      const minQuantity =
        isRequiredProduct(product) && totalProductQuantity <= 1 ? 1 : 0;
      const nextQuantity = Math.min(
        Math.max((currentItem?.quantity ?? 0) + direction, minQuantity),
        maxQuantity,
      );

      if (maxQuantity <= 0 || nextQuantity <= 0) {
        const nextCart = { ...previousCart };
        delete nextCart[key];
        return nextCart;
      }

      return {
        ...previousCart,
        [key]: {
          quantity: nextQuantity,
          variantId: selectedVariantId,
        },
      };
    });
  };

  const previewVariant = (
    category: CategoryItem,
    product: ProductItem,
    variantId: number,
  ) => {
    setPreviewVariants((previousVariants) => {
      return {
        ...previousVariants,
        [getCartKey(category, product)]: variantId,
      };
    });
  };

  const togglePlan = (category: CategoryItem, product: ProductItem) => {
    setCart((previousCart) => {
      const key = getCartKey(category, product);
      const isSelected = (previousCart[key]?.quantity ?? 0) > 0;
      const variantId = getDefaultVariantId(product);
      const maxQuantity = getProductStock(product, variantId);
      if (maxQuantity <= 0) return previousCart;

      const nextCart = { ...previousCart };

      category.products.forEach((categoryProduct) => {
        delete nextCart[getCartKey(category, categoryProduct)];
        categoryProduct.variants?.forEach((variant) => {
          delete nextCart[getCartKey(category, categoryProduct, variant.id)];
        });
      });

      if (isSelected && !isRequiredProduct(product)) {
        return nextCart;
      }

      nextCart[key] = {
        quantity: 1,
        variantId,
      };

      return nextCart;
    });
  };

  const goToNextStep = () => {
    setCurrentStep((step) => Math.min((step ?? 0) + 1, maxStepLength));
  };

  const goToPreviousStep = () => {
    setCurrentStep((step) => Math.max((step ?? 2) - 1, 1));
  };

  return (
    <section>
      <h1 className="lg:text-[31.88px] text-[31.88px] font-bold text-center md:hidden block px-[21px] pt-[31px] pb-[20px] tracking-[-0.06px]">
        Let’s get started!
      </h1>

      <div className="xl:max-w-[1196px] lg:max-w-[1213px] w-full mx-auto md:my-[49.36px] my-0 flex xl:flex-row lg:flex-col flex-col xl:gap-[29px] lg:gap-[33px] gap-0 overflow-hidden">
        <div className="w-full">
          {categories.map((category, index) => {
            const stepNumber = index + 1;
            const isActiveStep = stepNumber === currentStep;
            const previousCategory = currentStep
              ? categories[currentStep - 2]
              : undefined;
            const nextCategory = currentStep
              ? categories[currentStep]
              : undefined;
            const categoryKey = createStableKey(category.id, category.name);
            const selectedCount = selectedCountByCategory[category.key] ?? 0;

            return (
              <div
                key={categoryKey}
                className="transition-[padding-top] duration-300 ease-in-out"
                style={{
                  paddingTop: isActiveStep && index > 0 ? 13 : 0,
                }}
              >
                {" "}
                <div
                  className={`x-card-main ${isActiveStep ? "" : "outline"}`}
                  aria-expanded={isActiveStep}
                >
                  <div className="x-card-main__title">{`Step ${stepNumber} of ${maxStepLength}`}</div>
                  <div className="x-card-main__body">
                    {/* Step title */}
                    <div
                      className={`flex justify-between cursor-pointer ${isActiveStep ? "pb-[15px]" : ""}`}
                      onClick={() =>
                        setCurrentStep(isActiveStep ? null : stepNumber)
                      }
                    >
                      <div className="flex items-center gap-2">
                        <Image
                          src={category.icon_url}
                          alt={category.name}
                          width={26}
                          height={26}
                        />
                        <h2 className="text-[#484848] lg:text-[22px] text-lg font-semibold">
                          {category.label}
                        </h2>
                      </div>

                      <button
                        type="button"
                        className="text-[#4E2FD2] text-sm font-medium flex items-center gap-1 bg-transparent p-0"
                        aria-label={`Show ${category.name} step`}
                      >
                        {selectedCount > 0 ? (
                          <>
                            <span>{selectedCount}</span>
                            <span>selected</span>
                          </>
                        ) : null}
                        <Image
                          src="/icons/arrow.svg"
                          alt="Arrow right"
                          className={`rotate-180 h-[7px] w-[10px] ${isActiveStep ? "rotate-90" : ""}`}
                          width={10}
                          height={7}
                        />
                      </button>
                    </div>

                    {/* Step content */}
                    <div
                      className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                        isActiveStep
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                      aria-hidden={!isActiveStep}
                      inert={!isActiveStep}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <div className="md:flex sm:grid grid grid-cols-2 flex-wrap justify-center gap-[15px]">
                          {category.products.map((product) => {
                            const previewVariantId =
                              previewVariants[getCartKey(category, product)] ??
                              getDefaultVariantId(product);
                            const totalProductQuantity = product.variants
                              ?.length
                              ? product.variants.reduce(
                                  (total, variant) =>
                                    total +
                                    (cart[
                                      getCartKey(category, product, variant.id)
                                    ]?.quantity ?? 0),
                                  0,
                                )
                              : (cart[getCartKey(category, product)]
                                  ?.quantity ?? 0);
                            const previewCartKey = getCartKey(
                              category,
                              product,
                              previewVariantId,
                            );
                            const previewQuantity =
                              cart[previewCartKey]?.quantity ?? 0;
                            const previewStock = getProductStock(
                              product,
                              previewVariantId,
                            );
                            const canIncrement =
                              !isRequiredProduct(product) &&
                              previewQuantity < previewStock;
                            const canDecrement =
                              previewQuantity > 0 &&
                              (!isRequiredProduct(product) ||
                                totalProductQuantity > 1);

                            return (
                              <Product
                                key={getCartKey(category, product)}
                                product={product}
                                quantity={previewQuantity}
                                isSelected={totalProductQuantity > 0}
                                previewVariantId={previewVariantId}
                                hideQuantityActions={category.key === "plans"}
                                isRequired={isRequiredProduct(product)}
                                canIncrement={canIncrement}
                                canDecrement={canDecrement}
                                onIncrement={() =>
                                  updateQuantity(
                                    category,
                                    product,
                                    1,
                                    previewVariantId,
                                  )
                                }
                                onDecrement={() =>
                                  updateQuantity(
                                    category,
                                    product,
                                    -1,
                                    previewVariantId,
                                  )
                                }
                                onSelectProduct={() =>
                                  togglePlan(category, product)
                                }
                                onSelectVariant={(variantId) =>
                                  previewVariant(category, product, variantId)
                                }
                              />
                            );
                          })}
                        </div>

                        <div className="flex justify-center gap-3 mt-[15px]">
                          {previousCategory ? (
                            <button
                              type="button"
                              className="x-btn-outline"
                              onClick={goToPreviousStep}
                            >
                              Previous: {previousCategory.label}
                            </button>
                          ) : null}

                          {nextCategory ? (
                            <button
                              type="button"
                              className="x-btn-outline"
                              onClick={goToNextStep}
                            >
                              Next: {nextCategory.label}
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <ReviewSidebar
          categories={categories}
          selectedItems={selectedItems}
          shipping={shipping}
          totals={totals}
          formatCurrency={formatCurrency}
          isRequiredProduct={isRequiredProduct}
          getProductStock={getProductStock}
          onUpdateQuantity={updateQuantity}
        />
      </div>
    </section>
  );
}
