
import React from "react";
import { Link } from "react-router-dom";
import { useEasterEgg } from "@/hooks/useEasterEgg";
import { EasterEggModal } from "@/components/easter-egg/EasterEggModal";
import { cn } from "@/lib/utils";

export const Logo = () => {
  const { clickCount, isActivated, showFlash, handleClick, resetEasterEgg } = useEasterEgg();

  return (
    <>
      <Link 
        to="/" 
        className={cn(
          "self-stretch flex items-center transition-all duration-150",
          showFlash && "brightness-150 drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]"
        )}
        onClick={handleClick}
      >
        {/* Using a simple SVG placeholder since the uploaded image is not accessible */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn(
            "h-8 w-8 transition-all duration-150",
            showFlash && "scale-110"
          )}
        >
          <rect width="32" height="32" rx="8" fill="#74EB5E"/>
          <path d="M8 12h16v2H8v-2zm0 4h16v2H8v-2zm0 4h12v2H8v-2z" fill="white"/>
          <circle cx="20" cy="20" r="3" fill="#8B5CF6"/>
        </svg>
        
        <span className="ml-2 text-lg font-black text-crd-lightGray">
          CARDSHOW
        </span>
        
        {/* Progress indicator for easter egg (subtle) */}
        {clickCount > 0 && clickCount < 7 && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#ffd700] rounded-full opacity-60 animate-pulse" />
        )}
      </Link>
      
      <EasterEggModal 
        isOpen={isActivated} 
        onClose={resetEasterEgg} 
      />
    </>
  );
};
