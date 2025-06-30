
import React from "react";
import { Link } from "react-router-dom";
import { CRDButton, Typography } from "@/components/ui/design-system";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

export const Hero: React.FC = () => {
  const { containerPadding, isMobile } = useResponsiveLayout();
  const { isFeatureEnabled } = useFeatureFlags();
  const { theme } = useTheme();
  
  const showOakFeatures = isFeatureEnabled('OAK_FEATURES');
  
  console.log('Hero component rendering');
  
  return (
    <div className={cn(
      "items-center flex w-full flex-col overflow-hidden text-center pt-32",
      isMobile ? 'px-5' : 'px-[352px]',
      "max-md:max-w-full max-md:pt-[100px]",
      "theme-bg-primary"
    )}>
      <div className="flex w-full max-w-[736px] flex-col items-center max-md:max-w-full">
        <div className="flex w-full flex-col items-center">
          <Typography 
            variant="caption" 
            className="text-xs font-semibold leading-none uppercase mb-2 theme-text-secondary"
          >
            THE FIRST PRINT & MINT DIGITAL CARD MARKET
          </Typography>
          <Typography 
            as="h1" 
            variant="h1"
            className="text-[40px] font-black leading-[48px] tracking-[-0.4px] mt-2 max-md:max-w-full text-center theme-text-primary"
          >
            Create, collect, and trade
            <br />
            card art and digital collectibles.
          </Typography>
        </div>
        <div className="flex gap-4 mt-6">
          <Link to="/cards/enhanced">
            <CRDButton 
              variant="primary"
              size="lg"
              className="gap-3 text-lg font-extrabold px-6 py-4 rounded-[90px] max-md:px-5"
            >
              Get started
            </CRDButton>
          </Link>
          {showOakFeatures && (
            <Link to="/oak-memory-creator">
              <CRDButton 
                variant="secondary"
                size="lg"
                className="gap-3 text-lg font-extrabold px-6 py-4 rounded-[90px] max-md:px-5"
              >
                Try Oakland A's Creator
              </CRDButton>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
