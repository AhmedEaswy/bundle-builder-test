import Image from "next/image";
import Product from "./product";
import {
  getCartKey,
  getDefaultVariantId,
  getProductStock,
  isRequiredProduct,
} from "../lib/bundle";
import type { CartState, PreviewVariantState } from "../types/bundle";
import type { CategoryItem, ProductItem } from "../types/items";

type BundleStepProps = {
  category: CategoryItem;
  stepNumber: number;
  maxStepLength: number;
  isActive: boolean;
  selectedCount: number;
  nextCategoryLabel?: string;
  cart: CartState;
  previewVariants: PreviewVariantState;
  onToggleStep: () => void;
  onNextStep: () => void;
  formatCurrency: (value: number) => string;
  onUpdateQuantity: (
    category: CategoryItem,
    product: ProductItem,
    direction: 1 | -1,
    variantId?: number,
  ) => void;
  onPreviewVariant: (
    category: CategoryItem,
    product: ProductItem,
    variantId: number,
  ) => void;
  onTogglePlan: (category: CategoryItem, product: ProductItem) => void;
};

export default function BundleStep({
  category,
  stepNumber,
  maxStepLength,
  isActive,
  selectedCount,
  nextCategoryLabel,
  cart,
  previewVariants,
  onToggleStep,
  onNextStep,
  formatCurrency,
  onUpdateQuantity,
  onPreviewVariant,
  onTogglePlan,
}: BundleStepProps) {
  return (
    <div
      className="transition-[padding-top] duration-300 ease-in-out"
      style={{
        paddingTop: isActive && stepNumber > 1 ? 13 : 0,
      }}
    >
      <div
        className={`x-card-main ${isActive ? "" : "outline"}`}
        aria-expanded={isActive}
      >
        <div className="x-card-main__title">{`Step ${stepNumber} of ${maxStepLength}`}</div>
        <div className="x-card-main__body">
          <div
            className={`flex justify-between cursor-pointer ${isActive ? "pb-[15px]" : ""}`}
            onClick={onToggleStep}
          >
            <div className="flex items-center gap-2">
              <Image
                src={category.icon_url}
                alt={category.name}
                width={26}
                height={26}
                loading="eager"
              />
              <h2 className="text-[#0B0D10] lg:text-[22px] text-lg font-semibold">
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
                className={`rotate-180 h-[7px] w-[10px] ${isActive ? "rotate-90" : ""}`}
                width={10}
                height={7}
                loading="eager"
              />
            </button>
          </div>

          <div
            className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
              isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
            aria-hidden={!isActive}
            inert={!isActive}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="md:flex sm:grid grid grid-cols-2 flex-wrap justify-center gap-[15px]">
                {category.products.map((product) => {
                  const previewVariantId =
                    previewVariants[getCartKey(category, product)] ??
                    getDefaultVariantId(product);
                  const totalProductQuantity = product.variants?.length
                    ? product.variants.reduce(
                        (total, variant) =>
                          total +
                          (cart[getCartKey(category, product, variant.id)]
                            ?.quantity ?? 0),
                        0,
                      )
                    : (cart[getCartKey(category, product)]?.quantity ?? 0);
                  const previewCartKey = getCartKey(
                    category,
                    product,
                    previewVariantId,
                  );
                  const previewQuantity = cart[previewCartKey]?.quantity ?? 0;
                  const previewStock = getProductStock(
                    product,
                    previewVariantId,
                  );
                  const canIncrement =
                    !isRequiredProduct(product) &&
                    previewQuantity < previewStock;
                  const canDecrement =
                    previewQuantity > 0 &&
                    (!isRequiredProduct(product) || totalProductQuantity > 1);

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
                        onUpdateQuantity(category, product, 1, previewVariantId)
                      }
                      onDecrement={() =>
                        onUpdateQuantity(category, product, -1, previewVariantId)
                      }
                      onSelectProduct={() => onTogglePlan(category, product)}
                      onSelectVariant={(variantId) =>
                        onPreviewVariant(category, product, variantId)
                      }
                      formatCurrency={formatCurrency}
                    />
                  );
                })}
              </div>

              <div className="flex flex-wrap justify-center gap-3 mt-[15px]">
                {nextCategoryLabel ? (
                  <button
                    type="button"
                    className="x-btn-outline"
                    onClick={onNextStep}
                  >
                    Next: {nextCategoryLabel}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
