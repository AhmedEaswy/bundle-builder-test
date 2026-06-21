"use client";

import { useState } from "react";
import Image from "next/image";
import { useUUID as createStableKey } from "./composables/useUUID";
import Product from "./componsnts/product";
import type { CategoryItem, ProductItem } from "./types/items";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);

  const goToNextStep = () => {
    setCurrentStep((step) => Math.min(step + 1, maxStepLength));
  };

  const goToPreviousStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 1));
  };

  return (
    <section>
      <h1 className="lg:text-[31.88px] text-[31.88px] font-normal text-center lg:hidden flex px-[21px] pt-[31px] pb-[20px] tracking-[-0.06px]">
        Let’s get started!
      </h1>

      <div className="max-w-[1196px] mx-auto my-[49.36px] flex lg:flex-row md:flex-col flex-col lg:gap-[29px] gap-0 overflow-hidden">
        <div className="w-full">
          {categories.map((category, index) => {
            const stepNumber = index + 1;
            const isActiveStep = stepNumber === currentStep;
            const previousCategory = categories[currentStep - 2];
            const nextCategory = categories[currentStep];
            const categoryKey = createStableKey(category.id, category.name);

            return (
              <div key={categoryKey}>
                <div
                  className={`x-card-main ${isActiveStep ? "" : "outline"}`}
                  aria-expanded={isActiveStep}
                >
                  <div className="x-card-main__title">{`Step ${stepNumber} of ${maxStepLength}`}</div>
                  <div className="x-card-main__body">
                    {/* Step title */}
                    <div
                      className={`flex justify-between ${isActiveStep ? "pb-[15px]" : ""}`}
                    >
                      <div className="flex items-center gap-2">
                        <Image
                          src={category.icon_url}
                          alt={category.name}
                          width={26}
                          height={26}
                        />
                        <h2 className="text-[#484848] lg:text-[22px] text-lg font-medium">
                          {category.label}
                        </h2>
                      </div>

                      <div className="text-[#4E2FD2] text-sm font-medium flex items-center gap-1">
                        <span>{category.products.length}</span>
                        <span>selected</span>
                        <Image
                          src="/icons/arrow.svg"
                          alt="Arrow right"
                          className={`rotate-180 h-[7px] w-[10px] ${isActiveStep ? "rotate-90" : ""}`}
                          width={10}
                          height={7}
                        />
                      </div>
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
                        <div className="md:flex flex-wrap justify-center gap-[15px] grid 2xl:grid-cols-4 xl:grid-cols-5 md:grid-cols-3 grid-cols-1">
                          {category.products.map((product) => (
                            <Product
                              key={createStableKey(
                                `${category.id}-${product.id}`,
                                product.name,
                              )}
                              product={product}
                            />
                          ))}
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

        <div className="md:w-[399px] md:min-w-[399px] max-w-full">
          <div className="x-card-main mdl">
            <div className="x-card-main__title">Review</div>
            <div className="x-card-main__body">
              <h2 className="text-[22px] text-[#1F1F1F] leading-[1] tracking-[0.6px] font-medium">
                Your security system
              </h2>
              <p className="text-[#1F1F1FBF] text-sm leading-[130%] tracking-[0.6px] font-medium !mt-[5px] mb-[10px]">
                Review your personalized protection system designed to keep what
                matters most safe.
              </p>

              {categories.map((category) => (
                <div
                  key={createStableKey(category.id)}
                  className="border-t border-[#CED6DE] pt-[15px] pb-[10px]"
                >
                  <h3 className="text-[#A8B2BD] text-xs leading-[130%] tracking-[0.6px] font-normal uppercase">
                    {category.name}
                  </h3>

                  <div className="mt-2 flex flex-col gap-3 justify-between">
                    {category.products.map((product) => (
                      <div key={createStableKey(product.id)}>
                        <div className="flex justify-between">
                          <div className="flex items-center gap-3 w-1/2">
                            <Image
                              src={product.image || "/file.svg"}
                              alt={product.name}
                              width={26}
                              height={26}
                              className={`object-cover object-center ${category.key === "plans" ? "h-[23px] w-auto" :  "bg-white rounded-[5px] size-[41px]"}`}
                            />

                            {category.key === "plans" ? null : (
                            <div className="text-sm leading-[16px] text-[#0B0D10]">
                                {product.name}
                              </div>
                            )}
                          </div>

                          <div className="flex items-end gap-4 justify-end">
                            <div className="flex items-center gap-2">
                              <button className="x-product-card__quantity-action !bg-white hover:!bg-gray-50 disabled:!border-[#CED6DE] disabled:!bg-[#F1F1F2] !text-[#575757]">
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
                                      fill="#525963"
                                    />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_68_9817">
                                      <rect width="8" height="8" fill="white" />
                                    </clipPath>
                                  </defs>
                                </svg>
                              </button>
                              <div className="flex size-5 rounded-[4px] items-center justify-center">
                                0
                              </div>
                              <button className="x-product-card__quantity-action !bg-white hover:!bg-gray-50 disabled:!border-[#CED6DE] disabled:!bg-[#F1F1F2] !text-[#575757]">
                                <svg
                                  width="8"
                                  height="10"
                                  viewBox="0 0 8 10"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M7.33333 5.6H0.666667C0.489856 5.6 0.320286 5.51571 0.195262 5.36569C0.0702379 5.21566 0 5.01217 0 4.8C0 4.58783 0.0702379 4.38434 0.195262 4.23431C0.320286 4.08429 0.489856 4 0.666667 4H7.33333C7.51014 4 7.67971 4.08429 7.80474 4.23431C7.92976 4.38434 8 4.58783 8 4.8C8 5.01217 7.92976 5.21566 7.80474 5.36569C7.67971 5.51571 7.51014 5.6 7.33333 5.6Z"
                                    fill="#CED6DE"
                                  />
                                </svg>
                              </button>
                            </div>
                            <div className="flex flex-col items-end justify-end gap-[3px] text-end">
                              {product?.old_price ? (
                                <div className="text-[#6F7882] text-sm leading-[16px] tracking-[0.6px] font-normal line-through">
                                  ${product.old_price}{category.key === "plans" ? "/mo" : ""}
                                </div>
                              ) : null}
                              <div className="text-[#4E2FD2] text-sm leading-[16px] font-medium text-end">
                               {product.price === 0 ? "Free" : `$${product.price}`}{category.key === "plans" ? "/mo" : ""}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const cameras: ProductItem[] = [
  {
    id: 1,
    name: "Wyze Cam v4",
    image: "/images/Wyze-Cam-v4.png",
    description: "The clearest Wyze Cam ever made",
    price: 27.98,
    old_price: 35.98,
    discount_percentage: 22,
    variants: [
      {
        id: 1,
        color: "white",
        stock: 20,
        image: "/images/Wyze Cam v4.png",
      },
      {
        id: 2,
        color: "grey",
        stock: 20,
        image: "/images/Wyze Cam v4-1.png",
      },
      {
        id: 3,
        color: "black",
        stock: 20,
        image: "/images/Wyze Cam v4-2.png",
      },
    ],
  },
  {
    id: 2,
    name: "Wyze Cam Pan v3",
    image: "/images/Wyze-Cam-Pan v3.png",
    description: "360° pan and 180° tilt security camera",
    price: 34.98,
    old_price: 39.98,
    discount_percentage: 22,
    variants: [
      {
        id: 1,
        color: "white",
        stock: 20,
        image: "/images/Wyze Cam Pan v3 white.png",
      },
      {
        id: 2,
        color: "black",
        stock: 20,
        image: "/images/Wyze Cam Pan v3 black.png",
      },
    ],
  },
  {
    id: 3,
    name: "Wyze Cam Floodlight v2",
    image: "/images/Wyze-Cam Floodlight-v2.png",
    description:
      "2K floodlight camera with a 160° wide-angle view for your garage.",
    price: 69.98,
    old_price: 89.98,
    discount_percentage: 22,
    variants: [
      {
        id: 1,
        color: "white",
        stock: 20,
        image: "/images/Wyze Cam Floodlight v2 white.png",
      },
      {
        id: 2,
        color: "black",
        stock: 20,
        image: "/images/Wyze Cam Floodlight v2 black.png",
      },
    ],
  },
  {
    id: 4,
    name: "Wyze Duo Cam Doorbell",
    image: "/images/Wyze-Duo-Cam Doorbell.png",
    description: "Two cameras. Two views. Double the porch protection.",
    price: 69.98,
    old_price: 0,
    discount_percentage: 0,
    stock: 20,
  },
  {
    id: 5,
    name: "Wyze Cam v4",
    image: "/images/Wyze-Battery-Cam-Pro.png",
    description:
      "Protect anywhere. See everything in 2.5K HDR. No power outlet or electrician needed.",
    price: 89.98,
    discount_percentage: 0,
  },
];

const plans: ProductItem[] = [
  {
    id: 1,
    name: "Cam Unlimited",
    description: "Wyze Cam v4",
    price: 9.99,
    old_price: 12.99,
    discount_percentage: 22,
    stock: 20,
    image: '/images/plan.svg',
  },
];

const sensors: ProductItem[] = [
  {
    id: 1,
    name: "Wyze Sense Motion Sensor",
    description: "Wyze Sense Motion Sensor",
    price: 59.98,
    old_price: 0,
    discount_percentage: 0,
    stock: 20,
    required: false,
  },
  {
    id: 2,
    name: "Wyze Sense Motion Sensor",
    description: "Wyze Sense Motion Sensor",
    price: 0,
    old_price: 29.92,
    discount_percentage: 0,
    stock: 20,
    required: true,
  },
];

const accessories: ProductItem[] = [
  {
    id: 1,
    name: "Wyze MicroSD Card (256GB)",
    description: "Fast, reliable storage for your Wyze Cam v4",
    price: 19.98,
    old_price: 0,
    discount_percentage: 0,
    stock: 20,
    required: false,
  },
];

const categories: CategoryItem[] = [
  {
    id: 1,
    name: "Cameras",
    key: "cameras",
    products: cameras,
    icon_url: "/icons/camera.svg",
    label: "Choose your cameras",
  },
  {
    id: 2,
    name: "Plans",
    key: "plans",
    products: plans,
    icon_url: "/icons/shield.svg",
    label: "Choose your plan",
  },
  {
    id: 3,
    name: "Sensors",
    key: "sensors",
    products: sensors,
    icon_url: "/icons/sensors.svg",
    label: "Choose your sensors",
  },
  {
    id: 4,
    name: "Accessories",
    key: "accessories",
    products: accessories,
    icon_url: "/icons/extra.svg",
    label: "Choose your accessories",
  },
];

const maxStepLength = categories.length;
