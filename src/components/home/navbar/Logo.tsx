
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
        <img
          src="/lovable-uploads/3adf916a-0f96-4c37-a1bb-72235f0a299f.png"
          className={cn(
            "h-8 object-contain transition-all duration-150",
            showFlash && "scale-110"
          )}
          alt="Cardshow Logo"
        />
        
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
