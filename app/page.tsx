"use client";

import { useEffect, useMemo, useState } from "react";
import BundleSkeleton from "./componsnts/BundleSkeleton";
import BundleStep from "./componsnts/BundleStep";
import ReviewSidebar from "./componsnts/ReviewSidebar";
import {
  formatCurrency,
  getBundleTotals,
  getCartKey,
  getDefaultVariantId,
  getInitialCart,
  getProductStock,
  getSelectedCountByCategory,
  getSelectedItems,
  isRequiredProduct,
  parseSavedSystemState,
  savedSystemStorageKey,
} from "./lib/bundle";
import type {
  BundleApiResponse,
  BundleData,
  CartState,
  PreviewVariantState,
  ReviewTotals,
  SavedSystemState,
} from "./types/bundle";
import type { CategoryItem, ProductItem } from "./types/items";

const emptyTotals: ReviewTotals = {
  subtotal: 0,
  oldSubtotal: 0,
  savings: 0,
  monthly: 0,
};

const fetchBundle = async () => {
  const response = await fetch("/api/bundle");
  if (!response.ok) {
    throw new Error("Unable to load bundle data.");
  }

  const apiResponse = (await response.json()) as BundleApiResponse;
  if (apiResponse.status !== "success") {
    throw new Error(apiResponse.message);
  }

  return apiResponse.results;
};

export default function Home() {
  const [currentStep, setCurrentStep] = useState<number | null>(1);
  const [bundle, setBundle] = useState<BundleData | null>(null);
  const [bundleError, setBundleError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartState>({});
  const [previewVariants, setPreviewVariants] = useState<PreviewVariantState>(
    {},
  );
  const [hasSavedSystem, setHasSavedSystem] = useState(false);

  const categories = useMemo(() => bundle?.categories ?? [], [bundle]);
  const shipping = bundle?.shipping;
  const maxStepLength = categories.length;

  useEffect(() => {
    let isMounted = true;

    const loadBundle = async () => {
      try {
        const nextBundle = await fetchBundle();
        const savedState = parseSavedSystemState(
          window.localStorage.getItem(savedSystemStorageKey),
          nextBundle.categories.length,
        );

        if (!isMounted) return;

        setBundle(nextBundle);
        setBundleError(null);

        if (savedState) {
          setCart(savedState.cart);
          setPreviewVariants(savedState.previewVariants);
          setCurrentStep(savedState.currentStep);
          setHasSavedSystem(true);
          return;
        }

        setCart(getInitialCart(nextBundle.categories));
        setPreviewVariants({});
        setCurrentStep(1);
        setHasSavedSystem(false);
      } catch (error) {
        if (!isMounted) return;

        setBundleError(
          error instanceof Error ? error.message : "Unable to load bundle data.",
        );
      }
    };

    loadBundle();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedItems = useMemo(
    () => getSelectedItems(categories, cart),
    [cart, categories],
  );

  const selectedCountByCategory = useMemo(
    () => getSelectedCountByCategory(categories, cart),
    [cart, categories],
  );

  const totals = useMemo(
    () => (shipping ? getBundleTotals(selectedItems, shipping) : emptyTotals),
    [selectedItems, shipping],
  );

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
    setPreviewVariants((previousVariants) => ({
      ...previousVariants,
      [getCartKey(category, product)]: variantId,
    }));
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

  const saveSystemForLater = () => {
    const stateToSave: SavedSystemState = {
      cart,
      previewVariants,
      currentStep,
    };

    window.localStorage.setItem(
      savedSystemStorageKey,
      JSON.stringify(stateToSave),
    );
    setHasSavedSystem(true);
  };

  const clearSavedSystem = () => {
    window.localStorage.removeItem(savedSystemStorageKey);
    setHasSavedSystem(false);
  };

  if (bundleError) {
    return (
      <section className="px-5 py-10 text-center text-[#D8392B]">
        {bundleError}
      </section>
    );
  }

  if (!bundle || !shipping) {
    return <BundleSkeleton />;
  }

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
            const nextCategory = currentStep
              ? categories[currentStep]
              : undefined;

            return (
              <BundleStep
                key={category.id}
                category={category}
                stepNumber={stepNumber}
                maxStepLength={maxStepLength}
                isActive={isActiveStep}
                selectedCount={selectedCountByCategory[category.key] ?? 0}
                nextCategoryLabel={nextCategory?.label}
                cart={cart}
                previewVariants={previewVariants}
                onToggleStep={() =>
                  setCurrentStep(isActiveStep ? null : stepNumber)
                }
                onNextStep={goToNextStep}
                formatCurrency={formatCurrency}
                onUpdateQuantity={updateQuantity}
                onPreviewVariant={previewVariant}
                onTogglePlan={togglePlan}
              />
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
          hasSavedSystem={hasSavedSystem}
          onSaveSystem={saveSystemForLater}
          onClearSavedSystem={clearSavedSystem}
        />
      </div>
    </section>
  );
}
