
import React from "react";

export const CardInfo = () => {
  return (
    <div className="flex-1 space-y-16">
      <div className="space-y-10">
        <h1 className="font-raleway text-4xl font-black">The amazing art</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-1 text-lg font-raleway font-extrabold border-2 border-[#45B26B] text-[#45B26B] rounded">
            2.5 ETH
          </span>
          <span className="px-2 py-1 text-lg font-raleway font-extrabold border-2 border-[#353945] text-[#777E90] rounded">
            $4,429.87
          </span>
          <span className="text-lg font-raleway font-extrabold text-[#777E90]">
            10 in stock
          </span>
        </div>
      </div>

      <p className="text-[#777E90]">
        This NFT Card will give you Access to Special Airdrops. To learn more about UI8 please visit{" "}
        <a href="https://ui8.net" className="text-[#FCFCFD] underline">
          https://ui8.net
        </a>
      </p>
    </div>
  );
};
