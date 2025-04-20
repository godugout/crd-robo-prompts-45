
import React from "react";
import { CardHeader } from "@/components/card/CardHeader";
import { CardInfo } from "@/components/card/CardInfo";
import { CardPreview } from "@/components/card/CardPreview";
import { CardBidInfo } from "@/components/card/CardBidInfo";

export default function CardDetail() {
  return (
    <div className="bg-[#141416] min-h-screen text-[#FCFCFD] font-poppins">
      <CardHeader />
      <div className="flex flex-col md:flex-row gap-16 px-4 py-16 md:px-32">
        <CardPreview />
        <div className="flex-1 space-y-16">
          <CardInfo />
          <CardBidInfo />
        </div>
      </div>
    </div>
  );
}
