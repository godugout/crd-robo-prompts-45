
import React from "react";
import { Link } from "react-router-dom";
import { CRDButton, Typography } from "@/components/ui/design-system";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import { Sparkles, Palette } from "lucide-react";

export const EnhancedHero: React.FC = () => {
  const { containerPadding, isMobile } = useResponsiveLayout();
  const { isFeatureEnabled } = useFeatureFlags();
  
  const showOakFeatures = isFeatureEnabled('OAK_FEATURES');
  
  console.log('EnhancedHero component rendering');
  
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
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Link to="/cards/enhanced">
            <CRDButton 
              variant="primary"
              size="lg"
              className="gap-3 text-lg font-extrabold px-6 py-4 rounded-[90px] max-md:px-5 w-full sm:w-auto"
            >
              <Sparkles className="w-5 h-5" />
              Enhanced Studio
            </CRDButton>
          </Link>
          <Link to="/cards/create">
            <CRDButton 
              variant="secondary"
              size="lg"
              className="gap-3 text-lg font-extrabold px-6 py-4 rounded-[90px] max-md:px-5 w-full sm:w-auto"
            >
              <Palette className="w-4 h-4" />
              Quick Create
            </CRDButton>
          </Link>
          {showOakFeatures && (
            <Link to="/oak-memory-creator">
              <CRDButton 
                variant="outline"
                size="lg"
                className="gap-3 text-lg font-extrabold px-6 py-4 rounded-[90px] max-md:px-5 w-full sm:w-auto"
              >
                Try Oakland A's Creator
              </CRDButton>
            </Link>
          )}
        </div>
        <div className="mt-4 text-center">
          <Typography variant="body" className="text-crd-lightGray">
            New Enhanced Studio features premium 3D effects and AI-powered tools
          </Typography>
        </div>
      </div>
    </div>
  );
};
