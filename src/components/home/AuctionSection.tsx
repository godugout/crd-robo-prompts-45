import React from "react";

export const AuctionSection: React.FC = () => {
  return (
    <div className="bg-[#141416] flex gap-[40px_128px] overflow-hidden flex-wrap pt-32 pb-[136px] px-40 max-md:max-w-full max-md:px-5 max-md:py-[100px]">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/2f51f5ce6dec54b50c288984942e2ab16e04c6fd?placeholderIfAbsent=true"
        className="aspect-[0.8] object-contain w-[640px] min-w-60 max-md:max-w-full"
        alt="Featured auction"
      />
      <div className="flex min-w-60 flex-col items-stretch w-[352px]">
        <div className="w-full max-w-[352px]">
          <h2 className="text-[#FCFCFD] text-[64px] font-extrabold leading-none tracking-[-1.28px] max-md:text-[40px]">
            the Shot<span className="text-2xl tracking-[-0.48px]">️</span>
          </h2>
          <div className="flex w-full items-center gap-[33px] mt-5">
            <div className="self-stretch flex items-center gap-2 whitespace-nowrap flex-1 shrink basis-[0%] my-auto">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/0b62b35063f623a69a7f1fae19987ef6be84b3c9?placeholderIfAbsent=true"
                className="aspect-[1] object-contain w-10 self-stretch shrink-0 my-auto rounded-[64px]"
                alt="Owner"
              />
              <div className="self-stretch my-auto">
                <div className="text-[#777E90] text-xs font-normal leading-loose">
                  Owner
                </div>
                <div className="text-[#FCFCFD] text-sm font-medium leading-6">
                  @jbp
                </div>
              </div>
            </div>
            <div className="self-stretch flex items-center gap-2 flex-1 shrink basis-[0%] my-auto">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/cabfe04f66de62ed037fe6f8248a334d3c078ab7?placeholderIfAbsent=true"
                className="aspect-[1] object-contain w-10 self-stretch shrink-0 my-auto"
                alt="Price"
              />
              <div className="self-stretch my-auto">
                <div className="text-[#777E90] text-xs font-normal leading-loose">
                  Instant price
                </div>
                <div className="text-[#FCFCFD] text-sm font-medium leading-6">
                  4.4 ETH
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="justify-center items-center shadow-[0px_64px_64px_-48px_rgba(31,47,70,0.12)] bg-[#23262F] flex max-w-full w-[352px] flex-col overflow-hidden text-center mt-10 p-8 rounded-3xl max-md:px-5">
          <div className="flex w-[198px] max-w-full flex-col text-[#FCFCFD] font-bold">
            <div className="text-base font-semibold">Current Bid</div>
            <div className="text-5xl leading-none tracking-[-0.96px] max-md:text-[40px]">
              1.00 ETH
            </div>
            <div className="text-[#777E90] text-2xl leading-none">
              $3,618.36
            </div>
          </div>
          <div className="flex w-[231px] max-w-full flex-col items-stretch mt-6 rounded-3xl">
            <div className="text-[#FCFCFD] text-base font-semibold">
              Auction ending in
            </div>
            <div className="flex w-full items-center gap-[19px] whitespace-nowrap justify-between mt-2">
              <div className="self-stretch flex flex-col w-16 my-auto">
                <div className="text-[#FCFCFD] text-[32px] font-bold leading-none tracking-[-0.32px]">
                  19
                </div>
                <div className="text-[#777E90] text-base font-semibold">
                  Hrs
                </div>
              </div>
              <div className="self-stretch flex flex-col w-16 my-auto">
                <div className="text-[#FCFCFD] text-[32px] font-bold leading-none tracking-[-0.32px]">
                  24
                </div>
                <div className="text-[#777E90] text-base font-semibold">
                  mins
                </div>
              </div>
              <div className="self-stretch flex flex-col w-16 my-auto">
                <div className="text-[#FCFCFD] text-[32px] font-bold leading-none tracking-[-0.32px]">
                  19
                </div>
                <div className="text-[#777E90] text-base font-semibold">
                  secs
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[352px] text-lg text-[#FCFCFD] font-extrabold text-center leading-none mt-10">
          <button className="self-stretch bg-[#EA6E48] w-full gap-3 px-6 py-4 rounded-[90px] max-md:px-5">
            Place your bid
          </button>
          <button className="self-stretch w-full gap-3 mt-2 px-6 py-4 rounded-[90px] max-md:px-5">
            View card
          </button>
        </div>

        <div className="flex gap-2 mt-10">
          <button className="flex gap-2.5 w-10 p-2 rounded-[40px]">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/a634456f2f665b93045f6a817c79159c94b55353?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-6"
              alt="Previous"
            />
          </button>
          <button className="items-center flex gap-2.5 w-10 h-10 p-2 rounded-[40px]">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/383525dbc8a15dc754c80a44d3eb6153844d0aed?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-6"
              alt="Next"
            />
          </button>
        </div>
      </div>
    </div>
  );
};
