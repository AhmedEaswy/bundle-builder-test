import Image from "next/image";
import { useUUID as createStableKey } from "../composables/useUUID";
import type { CategoryItem, ProductItem, ProductVariant } from "../types/items";

type ShippingItem = {
  id: number;
  name: string;
  price: number;
  old_price?: number;
  image?: string;
};

type ReviewItem = {
  key: string;
  category: CategoryItem;
  product: ProductItem;
  quantity: number;
  variantId?: number;
  variant?: ProductVariant;
  image: string;
};

type ReviewTotals = {
  subtotal: number;
  oldSubtotal: number;
  savings: number;
  monthly: number;
};

type ReviewSidebarProps = {
  categories: CategoryItem[];
  selectedItems: ReviewItem[];
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
};

const getReviewTitle = (item: ReviewItem, isRequired: boolean) => {
  const labels = [
    item.variant ? item.variant.color : null,
    isRequired ? "required" : null,
  ].filter(Boolean);

  if (labels.length === 0) return item.product.name;

  return `${item.product.name} (${labels.join(", ")})`;
};

const getComparableOldPrice = (price: number, oldPrice?: number) =>
  oldPrice && oldPrice > price ? oldPrice : price;

export default function ReviewSidebar({
  categories,
  selectedItems,
  shipping,
  totals,
  formatCurrency,
  isRequiredProduct,
  getProductStock,
  onUpdateQuantity,
}: ReviewSidebarProps) {
  const hasSelectedItems = selectedItems.length > 0;

  return (
    <div className="xl:w-[399px] xl:min-w-[399px] lg:w-full min-w-full max-w-full">
      <div className="x-card-main md">
        <div className="x-card-main__title">Review</div>
        <div className="x-card-main__body">
          <h2 className="text-[22px] text-[#1F1F1F] leading-[1] tracking-[0.6px] font-medium">
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
                      getComparableOldPrice(product.price, product.old_price) *
                      quantity;
                    const lineTotal = product.price * quantity;

                    return (
                      <div key={item.key}>
                        <div className="flex justify-between">
                          <div className="flex items-center gap-3 w-1/2">
                            <Image
                              src={item.image}
                              alt={product.name}
                              width={26}
                              height={26}
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
                                <div className="flex size-5 rounded-[4px] items-center justify-center font-semibold">
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
                                  disabled={isRequired || quantity >= maxQuantity}
                                >
                                  +
                                </button>
                              </div>
                            )}
                            <div className="flex flex-col items-end justify-end gap-[3px] text-end">
                              {oldLineTotal > lineTotal ? (
                                <div className="text-[#6F7882] text-sm leading-[16px] tracking-[0.6px] font-medium line-through">
                                  {formatCurrency(oldLineTotal)}
                                  {category.key === "plans" ? "/mo" : ""}
                                </div>
                              ) : null}
                              <div className="text-[#4E2FD2] text-sm leading-[16px] font-semibold text-end uppercase">
                                {lineTotal === 0
                                  ? "Free"
                                  : formatCurrency(lineTotal)}
                                {category.key === "plans" ? "/mo" : ""}
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
                        src={shipping.image || "/file.svg"}
                        alt={shipping.name}
                        width={26}
                        height={26}
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

          <div className="flex items-start justify-between gap-2">
            <Image
              src="/icons/protection.svg"
              alt="Protection"
              className="size-[78px]"
              width={78}
              height={78}
            />

            <div>
              <span className="mt-[10px] bg-[#4E2FD2] h-[18px] flex items-center font-medium rounded-[3px] py-[5px] px-[8px] text-white tracking-[-5%] leading-[1] text-xs">
                as low as {formatCurrency(totals.monthly)}/mo
              </span>

              <div className="flex items-start gap-2">
                {totals.oldSubtotal > totals.subtotal ? (
                  <span className="text-[#6F7882] text-lg leading-[20px] tracking-[0.25%] font-medium line-through pt-2">
                    {formatCurrency(totals.oldSubtotal)}
                  </span>
                ) : null}
                <span className="font-bold text-xl leading-[32px] leading-[-0.13%] text-[#4E2FD2]">
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
            <button className="x-btn-primary" disabled={!hasSelectedItems}>
              Checkout
            </button>
          </div>
          <button className="text-[#484848] p-0 bg-transparent underline text-sm text-center w-full hover:text-[#4E2FD2] x-transition !italic font-normal">
            Save my system for later
          </button>
        </div>
      </div>
    </div>
  );
}
