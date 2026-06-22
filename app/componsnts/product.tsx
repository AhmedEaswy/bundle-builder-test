import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { formatProductPeriod } from "../lib/bundle";
import type { ProductItem } from "../types/items";

type ProductProps = {
  product: ProductItem;
  quantity: number;
  isSelected: boolean;
  previewVariantId?: number;
  hideQuantityActions?: boolean;
  isRequired?: boolean;
  canIncrement: boolean;
  canDecrement: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  onSelectProduct?: () => void;
  onSelectVariant: (variantId: number) => void;
  formatCurrency: (value: number) => string;
};

export default function Product({
  product,
  quantity,
  isSelected,
  previewVariantId,
  hideQuantityActions = false,
  isRequired = false,
  canIncrement,
  canDecrement,
  onIncrement,
  onDecrement,
  onSelectProduct,
  onSelectVariant,
  formatCurrency,
}: ProductProps) {
  const previewVariant = product.variants?.find(
    (variant) => variant.id === previewVariantId,
  );
  const productImage = previewVariant?.image ?? product.image ?? "/file.svg";
  const productPeriod = formatProductPeriod(product.period);

  return (
    <div
      className={`x-product-card ${isSelected ? "active" : ""} ${
        hideQuantityActions ? "cursor-pointer" : ""
      }`}
      onClick={hideQuantityActions ? onSelectProduct : undefined}
      role={hideQuantityActions ? "button" : undefined}
      tabIndex={hideQuantityActions ? 0 : undefined}
      onKeyDown={(event) => {
        if (!hideQuantityActions || !onSelectProduct) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelectProduct();
        }
      }}
    >
      <div className="x-product-card__image">
        <Image
          src={productImage}
          alt={product.name}
          width={101}
          height={137}
          loading="eager"
        />

        {product.discount_percentage > 0 ? (
          <div className="x-product-card__discount">
            Save {product.discount_percentage}%
          </div>
        ) : null}
      </div>
      <div className="x-product-card__content">
        <div className="x-product-card__name">
          {product.name}
          {isRequired ? " (required)" : ""}
        </div>
        <div className="x-product-card__description">
          {product.description} <a href="#">Learn more</a>
        </div>

        {product.variants?.length ? (
          <Swiper
            className="x-product-card__variants"
            slidesPerView="auto"
            spaceBetween={6}
            watchOverflow
            onClick={(swiper, event) => event.stopPropagation()}
          >
            {product.variants.map((variant) => (
              <SwiperSlide
                key={variant.id}
                className="x-product-card__variant-slide"
              >
                <button
                  type="button"
                  className={`x-product-card__variant ${
                    previewVariantId === variant.id ? "active" : ""
                  }`}
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelectVariant(variant.id);
                  }}
                  disabled={variant.stock <= 0}
                >
                  <Image
                    src={variant.image}
                    alt={variant.color}
                    width={20}
                    height={20}
                    loading="eager"
                  />
                  <span>{variant.color}</span>
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : null}

        <div className="flex justify-between items-center ps-[5px] pt-[5px]">
          <div>
          {hideQuantityActions ? null : (
            <div className="flex items-center gap-[4px]">
              <button
                type="button"
                className="x-product-card__quantity-action"
                onClick={(event) => {
                  event.stopPropagation();
                  onDecrement();
                }}
                disabled={!canDecrement}
              >
              <svg
                width="8"
                height="10"
                viewBox="0 0 8 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.33333 5.6H0.666667C0.489856 5.6 0.320286 5.51571 0.195262 5.36569C0.0702379 5.21566 0 5.01217 0 4.8C0 4.58783 0.0702379 4.38434 0.195262 4.23431C0.320286 4.08429 0.489856 4 0.666667 4H7.33333C7.51014 4 7.67971 4.08429 7.80474 4.23431C7.92976 4.38434 8 4.58783 8 4.8C8 5.01217 7.92976 5.21566 7.80474 5.36569C7.67971 5.51571 7.51014 5.6 7.33333 5.6Z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <div className="flex size-5 rounded-[4px] items-center justify-center">
              {quantity}
            </div>
            <button
              type="button"
              className="x-product-card__quantity-action"
              onClick={(event) => {
                event.stopPropagation();
                onIncrement();
              }}
              disabled={!canIncrement}
            >
              <svg
                width="8"
                height="8"
                viewBox="0 0 8 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_68_9817)">
                  <path
                    d="M7.33333 3.33333H4.66667V0.666667C4.66667 0.489856 4.59643 0.320286 4.4714 0.195262C4.34638 0.0702379 4.17681 0 4 0C3.82319 0 3.65362 0.0702379 3.5286 0.195262C3.40357 0.320286 3.33333 0.489856 3.33333 0.666667V3.33333H0.666667C0.489856 3.33333 0.320286 3.40357 0.195262 3.5286C0.0702379 3.65362 0 3.82319 0 4C0 4.17681 0.0702379 4.34638 0.195262 4.4714C0.320286 4.59643 0.489856 4.66667 0.666667 4.66667H3.33333V7.33333C3.33333 7.51014 3.40357 7.67971 3.5286 7.80474C3.65362 7.92976 3.82319 8 4 8C4.17681 8 4.34638 7.92976 4.4714 7.80474C4.59643 7.67971 4.66667 7.51014 4.66667 7.33333V4.66667H7.33333C7.51014 4.66667 7.67971 4.59643 7.80474 4.4714C7.92976 4.34638 8 4.17681 8 4C8 3.82319 7.92976 3.65362 7.80474 3.5286C7.67971 3.40357 7.51014 3.33333 7.33333 3.33333Z"
                    fill="currentColor"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_68_9817">
                    <rect width="8" height="8" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </button>

            </div>
          )}
          </div>

          <div className="flex flex-col items-center gap-[3px]">
            {product?.old_price ? (
              <div className="x-product-card__old-price">
                {formatCurrency(product.old_price)}
                {productPeriod}
              </div>
            ) : null}
            <div className="x-product-card__price">
              {formatCurrency(product.price)}
              {productPeriod}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
