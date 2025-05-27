
import React from "react";
import { Button } from "@/components/ui/button";

const formatCredits = (amount: number | string) => {
  const n = typeof amount === "number" ? amount : parseInt(amount);
  return (
    <>
      <span className="align-middle font-extrabold">{n}</span>
      <span className="ml-1">C</span>
    </>
  );
};

export const CardBidInfo = () => {
  const highestBid = 146;
  const usd = 2764;
  const serviceFeeCredits = 256;
  const serviceFeeUsd = 4540;

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
          <span className="text-xl font-raleway font-bold text-white flex items-center gap-1">
            {formatCredits(highestBid)}
          </span>
          <span className="text-xl font-raleway font-bold text-[#777E90]">
            ${usd.toLocaleString()}
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
        <Button className="flex-1 bg-[#3772FF] hover:bg-[#3772FF]/90 text-lg font-raleway font-extrabold rounded-[90px]">
          Purchase now
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 border-2 border-[#353945] text-lg font-raleway font-extrabold rounded-[90px]"
        >
          Place a bid
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-poppins text-[#777E90]">
          Service fee
        </span>
        <span className="text-sm font-poppins text-white">1.5%</span>
        <span className="text-sm font-poppins text-white flex items-center gap-1">
          {formatCredits(serviceFeeCredits)}
        </span>
        <span className="text-sm font-poppins text-[#777E90]">
          ${serviceFeeUsd.toLocaleString()}
        </span>
      </div>
    </div>
  );
};
