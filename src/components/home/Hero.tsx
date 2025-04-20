
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Hero: React.FC = () => {
  return (
    <div className="items-center bg-[#141416] flex w-full flex-col overflow-hidden text-center pt-32 px-[352px] max-md:max-w-full max-md:pt-[100px] max-md:px-5">
      <div className="flex w-full max-w-[736px] flex-col items-center max-md:max-w-full">
        <div className="flex w-full flex-col items-center">
          <div className="text-[#777E90] text-xs font-semibold leading-none uppercase">
            THE FIRST PRINT & MINT DIGITAL CARD MARKET
          </div>
          <h1 className="text-[#FCFCFD] text-[40px] font-black leading-[48px] tracking-[-0.4px] mt-2 max-md:max-w-full">
            Create, collect, and trade
            <br />
            card art and digital collectibles.
          </h1>
        </div>
        <Link to="/editor">
          <Button className="self-stretch bg-[#2D9CDB] gap-3 text-lg text-[#FCFCFD] font-extrabold leading-none mt-6 px-6 py-4 rounded-[90px] max-md:px-5">
            Get started
          </Button>
        </Link>
      </div>
    </div>
  );
};
