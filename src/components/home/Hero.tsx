
import React from "react";
import { Link } from "react-router-dom";
import { CRDButton, Typography } from "@/components/ui/design-system";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

export const Hero: React.FC = () => {
  const { containerPadding, isMobile } = useResponsiveLayout();
  
  return (
    <div className={`items-center bg-crd-darkest flex w-full flex-col overflow-hidden text-center pt-32 ${isMobile ? 'px-5' : 'px-[352px]'} max-md:max-w-full max-md:pt-[100px]`}>
      <div className="flex w-full max-w-[736px] flex-col items-center max-md:max-w-full">
        <div className="flex w-full flex-col items-center">
          <Typography 
            variant="caption" 
            className="text-xs font-semibold leading-none uppercase mb-2"
          >
            THE FIRST PRINT & MINT DIGITAL CARD MARKET
          </Typography>
          <Typography 
            as="h1" 
            variant="h1"
            className="text-[40px] font-black leading-[48px] tracking-[-0.4px] mt-2 max-md:max-w-full text-center"
          >
            Create, collect, and trade
            <br />
            card art and digital collectibles.
          </Typography>
        </div>
        <Link to="/cards/create">
          <CRDButton 
            variant="primary"
            size="lg"
            className="self-stretch gap-3 text-lg font-extrabold mt-6 px-6 py-4 rounded-[90px] max-md:px-5"
          >
            Get started
          </CRDButton>
        </Link>
      </div>
    </div>
  );
};
