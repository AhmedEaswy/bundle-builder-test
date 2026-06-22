const skeletonProducts = ["camera", "sensor", "extra"];
const skeletonSteps = ["Sensors", "Plans"];
const skeletonReviewItems = ["review-one", "review-two", "review-three"];

export default function BundleSkeleton() {
  return (
    <section aria-label="Loading bundle builder" aria-busy="true">
      <h1 className="lg:text-[31.88px] text-[31.88px] font-bold text-center md:hidden block px-[21px] pt-[31px] pb-[20px] tracking-[-0.06px]">
        Let’s get started!
      </h1>

      <div className="xl:max-w-[1196px] lg:max-w-[1213px] w-full mx-auto md:my-[49.36px] my-0 flex xl:flex-row lg:flex-col flex-col xl:gap-[29px] lg:gap-[33px] gap-0 overflow-hidden">
        <div className="w-full">
          <div className="x-card-main">
            <div className="x-card-main__title">
              <div className="x-skeleton h-3 w-[94px]" />
            </div>
            <div className="x-card-main__body">
              <div className="mb-[15px] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="x-skeleton size-[26px] rounded-full" />
                  <div className="x-skeleton h-6 w-[210px]" />
                </div>
                <div className="x-skeleton h-4 w-[72px]" />
              </div>

              <div className="md:flex sm:grid grid grid-cols-2 flex-wrap justify-center gap-[15px]">
                {skeletonProducts.map((item) => (
                  <div
                    key={item}
                    className="x-product-card pointer-events-none"
                  >
                    <div className="x-skeleton xl:w-[101px] xl:min-w-[101px] w-full h-[137px] rounded-[8px]" />
                    <div className="w-full">
                      <div className="x-skeleton h-4 w-3/4" />
                      <div className="x-skeleton mt-2 h-3 w-full" />
                      <div className="x-skeleton mt-2 h-3 w-2/3" />
                      <div className="mt-[10px] flex gap-[6px]">
                        <div className="x-skeleton h-[26px] w-[72px] rounded-[2px]" />
                        <div className="x-skeleton h-[26px] w-[64px] rounded-[2px]" />
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="x-skeleton h-5 w-[68px]" />
                        <div className="x-skeleton h-5 w-[52px]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {skeletonSteps.map((item) => (
            <div key={item} className="x-card-main outline">
              <div className="x-card-main__title">
                <div className="x-skeleton h-3 w-[94px]" />
              </div>
              <div className="x-card-main__body">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="x-skeleton size-[26px] rounded-full" />
                    <div className="x-skeleton h-6 w-[180px]" />
                  </div>
                  <div className="x-skeleton h-4 w-[80px]" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="xl:w-[399px] xl:min-w-[399px] lg:w-full min-w-full max-w-full">
          <div className="x-card-main md">
            <div className="x-card-main__body">
              <div className="x-skeleton h-6 w-[190px]" />
              <div className="x-skeleton mt-3 h-3 w-full" />
              <div className="x-skeleton mt-2 h-3 w-4/5" />

              <div className="mt-5 flex flex-col gap-4 border-t border-[#CED6DE] pt-4">
                {skeletonReviewItems.map((item) => (
                  <div key={item} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="x-skeleton size-[41px] rounded-[5px]" />
                      <div className="x-skeleton h-4 w-[130px]" />
                    </div>
                    <div className="x-skeleton h-4 w-[56px]" />
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between">
                <div className="x-skeleton size-[78px] rounded-[8px]" />
                <div className="flex flex-col items-end gap-2">
                  <div className="x-skeleton h-[18px] w-[130px]" />
                  <div className="x-skeleton h-7 w-[92px]" />
                </div>
              </div>
              <div className="x-skeleton mt-5 h-[48px] w-full rounded-[4px]" />
              <div className="x-skeleton mx-auto mt-4 h-4 w-[150px]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
