
import React from "react";

export const CardBidInfo = () => {
  return (
    <div className="flex flex-col gap-8 px-4 py-4 border border-[#353945] bg-[#23262F] rounded-2xl shadow-[0px_64px_64px_-48px_rgba(31,47,70,0.12)]">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-raleway font-semibold text-[#777E90]">
            Highest bid by
          </span>
          <span className="text-sm font-raleway font-semibold text-white">
            Kohaku Tora
          </span>
          <span className="text-xl font-raleway font-bold text-white">
            1.46 ETH
          </span>
          <span className="text-xl font-raleway font-bold text-[#777E90]">
            $2,764.89
          </span>
        </div>
        <div className="w-12 h-12 rounded-full bg-[#45B26B] relative">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/2d51e97c03168fc86320c5b5288785196fd658cf"
            alt="Bidder Avatar"
            className="w-12 h-[72px] absolute -top-1 left-0"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="flex-1 px-5 py-4 text-lg font-raleway font-extrabold text-white text-center bg-[#3772FF] rounded-[90px]">
          Purchase now
        </span>
        <span className="flex-1 px-5 py-4 text-lg font-raleway font-extrabold text-white text-center border-2 border-[#353945] rounded-[90px]">
          Place a bid
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-poppins text-[#777E90]">
          Service fee
        </span>
        <span className="text-sm font-poppins text-white">1.5%</span>
        <span className="text-sm font-poppins text-[#777E90]">
          2.563 ETH
        </span>
        <span className="text-sm font-poppins text-[#777E90]">
          $4,540.62
        </span>
      </div>
    </div>
  );
};
