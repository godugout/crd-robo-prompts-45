
import React from "react";
import { Link } from "react-router-dom";
import { useEasterEgg } from "@/hooks/useEasterEgg";
import { EasterEggModal } from "@/components/easter-egg/EasterEggModal";
import { CardshowLogo } from "@/assets/brand";
import { cn } from "@/lib/utils";

export const Logo = () => {
  const { clickCount, isActivated, showFlash, handleClick, resetEasterEgg } = useEasterEgg();

  return (
    <>
      <Link 
        to="/" 
        className={cn(
          "self-stretch flex items-center transition-all duration-150",
          showFlash && "brightness-150 drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]"
        )}
        onClick={handleClick}
      >
        <CardshowLogo 
          size="md"
          animated={showFlash}
          className={showFlash ? "scale-110" : ""}
        />
        
        {/* Progress indicator for easter egg (subtle) */}
        {clickCount > 0 && clickCount < 7 && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#4ade80] rounded-full opacity-60 animate-pulse" />
        )}
      </Link>
      
      <EasterEggModal 
        isOpen={isActivated} 
        onClose={resetEasterEgg} 
      />
    </>
  );
};
