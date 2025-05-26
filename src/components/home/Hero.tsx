
import React from "react";
import { Link } from "react-router-dom";
import { CRDButton, Typography } from "@/components/ui/design-system";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

export const Hero: React.FC = () => {
  const { containerPadding, isMobile } = useResponsiveLayout();
  
  return (
    <div className={`items-center bg-gradient-to-b from-white to-crd-gray-50 flex w-full flex-col overflow-hidden text-center pt-32 ${isMobile ? 'px-5' : 'px-[352px]'} max-md:max-w-full max-md:pt-[100px]`}>
      <div className="flex w-full max-w-[736px] flex-col items-center max-md:max-w-full">
        <div className="flex w-full flex-col items-center">
          <Typography 
            variant="caption" 
            className="text-xs font-semibold leading-none uppercase mb-2 text-crd-blue tracking-wider"
          >
            THE FIRST PRINT & MINT DIGITAL CARD MARKET
          </Typography>
          <Typography 
            as="h1" 
            variant="h1"
            className="text-[40px] font-black leading-[48px] tracking-[-0.4px] mt-2 max-md:max-w-full text-center text-crd-gray-900"
          >
            Create, collect, and trade
            <br />
            <span className="bg-gradient-to-r from-crd-orange to-crd-purple bg-clip-text text-transparent">
              card art and digital collectibles
            </span>
          </Typography>
        </div>
        <Link to="/editor">
          <CRDButton 
            variant="primary"
            size="lg"
            className="self-stretch gap-3 text-lg font-extrabold mt-8 px-8 py-4 rounded-full bg-gradient-to-r from-crd-blue to-crd-purple hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Get started
          </CRDButton>
        </Link>
      </div>
    </div>
  );
};
