import { useState } from "react";
import Image from "next/image";
import ReviewDialog, { type ReviewDialogType } from "./ReviewDialog";
import { useUUID as createStableKey } from "../composables/useUUID";
import {
  formatProductPeriod,
  getComparableOldPrice,
  getPublicAssetPath,
} from "../lib/bundle";
import type {
  ReviewTotals,
  SelectedReviewItem,
  ShippingItem,
} from "../types/bundle";
import type { CategoryItem, ProductItem } from "../types/items";

type ReviewSidebarProps = {
  categories: CategoryItem[];
  selectedItems: SelectedReviewItem[];
  shipping: ShippingItem;
  totals: ReviewTotals;
  formatCurrency: (value: number) => string;
  isRequiredProduct: (product: ProductItem) => boolean;
  getProductStock: (product: ProductItem, variantId?: number) => number;
  onUpdateQuantity: (
    category: CategoryItem,
    product: ProductItem,
    direction: 1 | -1,
    variantId?: number,
  ) => void;
  hasSavedSystem: boolean;
  onSaveSystem: () => void;
  onClearSavedSystem: () => void;
};

const getReviewTitle = (item: SelectedReviewItem, isRequired: boolean) => {
  const labels = [
    item.variant ? item.variant.color : null,
    isRequired ? "required" : null,
  ].filter(Boolean);

  if (labels.length === 0) return item.product.name;

  return `${item.product.name} (${labels.join(", ")})`;
};

export default function ReviewSidebar({
  categories,
  selectedItems,
  shipping,
  totals,
  formatCurrency,
  isRequiredProduct,
  getProductStock,
  onUpdateQuantity,
  hasSavedSystem,
  onSaveSystem,
  onClearSavedSystem,
}: ReviewSidebarProps) {
  const hasSelectedItems = selectedItems.length > 0;
  const [reviewDialog, setReviewDialog] = useState<ReviewDialogType>(null);
  const selectedPlanPeriod = formatProductPeriod(
    selectedItems.find((item) => item.category.key === "plans")?.product.period,
  );

  const closeReviewDialog = () => {
    setReviewDialog(null);
  };

  const confirmCheckout = () => {
    setReviewDialog("checkout-success");
  };

  const saveSystemForLater = () => {
    onSaveSystem();
    setReviewDialog("save-success");
  };

  const clearSavedSystem = () => {
    onClearSavedSystem();
    closeReviewDialog();
  };

  return (
    <div className="xl:w-[399px] xl:min-w-[399px] lg:w-full min-w-full max-w-full">
      <div className="x-card-main md">
        <div className="x-card-main__title xl:flex md:hidden sm:flex flex font-semibold">
          Review
        </div>
        <div className="x-card-main__body xl:!p-5 lg:!px-[61px] !px-5 lg:!py-[35px] !py-5 xl:gap-0 lg:gap-[52px] md:gap-0 gap-0 grid xl:grid-cols-1 lg:grid-cols-2 md:grid-cols-1 grid-cols-1">
          <div>
            <h2 className="text-[22px] text-[#1F1F1F] leading-[1] tracking-[0.6px] font-semibold">
              Your security system
            </h2>
            <p className="text-[#1F1F1FBF] text-sm leading-[130%] tracking-[0.6px] font-medium !mt-[5px] mb-[10px]">
              Review your personalized protection system designed to keep what
              matters most safe.
            </p>

            {categories.map((category) => {
              const categoryItems = selectedItems.filter(
                (item) => item.category.key === category.key,
              );
              if (categoryItems.length === 0) return null;

              return (
                <div
                  key={createStableKey(category.id)}
                  className="border-t border-[#CED6DE] pt-[15px] pb-[10px]"
                >
                  <h3 className="text-[#A8B2BD] text-xs leading-[130%] tracking-[0.6px] font-normal uppercase">
                    {category.name}
                  </h3>

                  <div className="mt-2 flex flex-col gap-3 justify-between">
                    {categoryItems.map((item) => {
                      const { product, quantity } = item;
                      const isRequired = isRequiredProduct(product);
                      const minQuantity = isRequired ? 1 : 0;
                      const maxQuantity = getProductStock(
                        product,
                        item.variantId,
                      );
                      const oldLineTotal =
                        getComparableOldPrice(
                          product.price,
                          product.old_price,
                        ) * quantity;
                      const lineTotal = product.price * quantity;
                      const productPeriod = formatProductPeriod(product.period);

                      return (
                        <div key={item.key}>
                          <div className="flex justify-between">
                            <div className="flex items-center gap-3 w-1/2">
                              <Image
                                src={getPublicAssetPath(item.image)}
                                alt={product.name}
                                width={26}
                                height={26}
                                loading="eager"
                                className={`object-cover object-center ${
                                  category.key === "plans"
                                    ? "h-[23px] w-auto"
                                    : "bg-white rounded-[5px] size-[41px]"
                                }`}
                              />

                              {category.key === "plans" ? null : (
                                <div className="text-sm leading-[16px] text-[#0B0D10]">
                                  {getReviewTitle(item, isRequired)}
                                </div>
                              )}
                            </div>

                            <div className="flex items-end gap-4 justify-end">
                              {category.key === "plans" ? null : (
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    className="x-product-card__quantity-action !bg-white hover:!bg-gray-50 disabled:!border-[#CED6DE] disabled:!bg-[#F1F1F2] !text-[#575757]"
                                    onClick={() =>
                                      onUpdateQuantity(
                                        category,
                                        product,
                                        -1,
                                        item.variantId,
                                      )
                                    }
                                    disabled={quantity <= minQuantity}
                                  >
                                    -
                                  </button>
                                  <div className="flex size-5 rounded-[4px] items-center justify-center font-semibold text-sm">
                                    {quantity}
                                  </div>
                                  <button
                                    type="button"
                                    className="x-product-card__quantity-action !bg-white hover:!bg-gray-50 disabled:!border-[#CED6DE] disabled:!bg-[#F1F1F2] !text-[#575757]"
                                    onClick={() =>
                                      onUpdateQuantity(
                                        category,
                                        product,
                                        1,
                                        item.variantId,
                                      )
                                    }
                                    disabled={
                                      isRequired || quantity >= maxQuantity
                                    }
                                  >
                                    +
                                  </button>
                                </div>
                              )}
                              <div className="flex flex-col items-end justify-end gap-[3px] text-end">
                                {oldLineTotal > lineTotal ? (
                                  <div className="text-[#6F7882] text-sm leading-[16px] tracking-[0.6px] font-medium line-through">
                                    {formatCurrency(oldLineTotal)}
                                    <span className="lowercase">
                                      {productPeriod}
                                    </span>
                                  </div>
                                ) : null}
                                <div className="text-[#4E2FD2] text-sm leading-[16px] font-semibold text-end uppercase">
                                  {lineTotal === 0
                                    ? "Free"
                                    : formatCurrency(lineTotal)}
                                  <span className="lowercase">
                                    {productPeriod}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {hasSelectedItems ? (
              <div className="border-t border-[#CED6DE] pt-[15px] pb-[10px]">
                <div className="flex flex-col gap-3 justify-between">
                  <div>
                    <div className="flex justify-between">
                      <div className="flex items-center gap-3 w-1/2">
                        <Image
                          src={getPublicAssetPath(shipping.image)}
                          alt={shipping.name}
                          width={26}
                          height={26}
                          loading="eager"
                          className="object-cover object-center bg-white rounded-[5px] size-[41px]"
                        />

                        <div className="text-sm leading-[16px] text-[#0B0D10]">
                          {shipping.name}
                        </div>
                      </div>

                      <div className="flex items-end gap-4 justify-end">
                        <div className="flex flex-col items-end justify-end gap-[3px] text-end">
                          {shipping?.old_price ? (
                            <div className="text-[#6F7882] text-sm leading-[16px] tracking-[0.6px] font-medium line-through">
                              {formatCurrency(shipping.old_price)}
                            </div>
                          ) : null}
                          <div className="text-[#4E2FD2] text-sm leading-[16px] font-semibold text-end uppercase">
                            {shipping.price === 0
                              ? "Free"
                              : formatCurrency(shipping.price)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div>
            <div className="flex xl:flex-row lg:flex-col md:flex-row flex-row items-start justify-between xl:gap-2 lg:gap-4 md:gap-2 gap-2">
              <div className="flex items-center gap-[25px]">
                <Image
                  src={getPublicAssetPath("/icons/protection.svg")}
                  alt="Protection"
                  className="xl:size-[78px] lg:size-[131px] md:size-[78px] size-[78px]"
                  width={78}
                  height={78}
                  loading="eager"
                />
                <div className="text-lg text-[#1F1F1F] leading-[110%] tracking-[0.6px] xl:hidden lg:inline-block md:hidden hidden">
                  <h3 className="font-semibold m-0">30-day hassle-free returns</h3>
                  <br />
                  <p className="font-normal">
                    If you&apos;re not totally in love with the product, we will refund you 100%.
                  </p>
                </div>
              </div>

              <div className="flex gap-2 xl:justify-start lg:justify-between md:justify-start justify-start xl:w-fit lg:w-full md:w-fit w-fit xl:flex-col lg:flex-row md:flex-col flex-col xl:items-end lg:items-center md:items-end items-end">
                <span className="w-fit text-end xl:mt-[10px] lg:mt-0 md:mt-[10px] mt-[10px] bg-[#4E2FD2] h-[18px] flex items-center font-medium rounded-[3px] py-[5px] px-[8px] text-white tracking-[-5%] leading-[1] text-xs">
                  as low as {formatCurrency(totals.monthly)}
                  {selectedPlanPeriod}
                </span>

                <div className="flex items-start gap-2">
                  {totals.oldSubtotal > totals.subtotal ? (
                    <span className="text-[#6F7882] text-lg leading-[20px] tracking-[0.25%] font-medium line-through pt-2">
                      {formatCurrency(totals.oldSubtotal)}
                    </span>
                  ) : null}
                  <span className="font-bold text-2xl leading-[32px] leading-[-0.13%] text-[#4E2FD2]">
                    {formatCurrency(totals.subtotal)}
                  </span>
                </div>
              </div>
            </div>

            {totals.savings > 0 ? (
              <div className="text-[#0AA288] text-xs leading-[1] font-semibold text-center mt-[14px] mb-[4px]">
                Congrats! You’re saving {formatCurrency(totals.savings)} on your
                security bundle!
              </div>
            ) : null}

            <div>
              <button
                type="button"
                className="x-btn-primary"
                disabled={!hasSelectedItems}
                onClick={() => setReviewDialog("checkout-confirm")}
              >
                Checkout
              </button>
            </div>
            <div className="flex justify-center mt-2">
              <button
                type="button"
                className="text-[#484848] p-0 bg-transparent underline text-sm text-center hover:text-[#4E2FD2] x-transition !italic font-normal"
                disabled={!hasSelectedItems}
                onClick={saveSystemForLater}
              >
                Save my system for later
              </button>
            </div>
            <div className="flex justify-center">
              {hasSavedSystem ? (
                <button
                  type="button"
                  className="mt-3 flex mx-auto items-center justify-center gap-2 bg-transparent p-0 text-center text-sm font-semibold text-[#aab4c3] x-transition hover:text-[#9b241b]"
                  onClick={() => setReviewDialog("clear-confirm")}
                >
                  <svg
                    className="size-4 icon icon-tabler icons-tabler-outline icon-tabler-trash"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M4 7l16 0" />
                    <path d="M10 11l0 6" />
                    <path d="M14 11l0 6" />
                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                  </svg>
                  <span>Clear my saved system data</span>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <ReviewDialog
        dialog={reviewDialog}
        subtotalLabel={formatCurrency(totals.subtotal)}
        onClose={closeReviewDialog}
        onConfirmCheckout={confirmCheckout}
        onClearSavedSystem={clearSavedSystem}
      />
    </div>
  );
}
