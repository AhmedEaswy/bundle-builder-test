"use client";

import { useState } from "react";
import Image from "next/image";
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

            return (
              <div key={category.id}>
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
                        <div className="md:flex flex-wrap justify-center gap-[15px] grid 2xl:grid-cols-4 xl:grid-cols-5 md:grid-cols-3 grid-cols-2">
                          {category.products.map((product) => (
                            <Product key={product.id} product={product} />
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
            <div className="x-card-main__body">test</div>
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
    description: "Cameras",
    products: cameras,
    icon_url: "/icons/camera.svg",
    label: "Choose your cameras",
  },
  {
    id: 2,
    name: "Plans",
    description: "Plans",
    products: plans,
    icon_url: "/icons/shield.svg",
    label: "Choose your plan",
  },
  {
    id: 3,
    name: "Sensors",
    description: "Sensors",
    products: sensors,
    icon_url: "/icons/sensors.svg",
    label: "Choose your sensors",
  },
  {
    id: 4,
    name: "Accessories",
    description: "Accessories",
    products: accessories,
    icon_url: "/icons/extra.svg",
    label: "Choose your accessories",
  },
];

const maxStepLength = categories.length;
