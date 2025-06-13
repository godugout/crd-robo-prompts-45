
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
          src="/crd-logo-gradient.png"
          className={cn(
            "h-8 object-contain transition-all duration-150",
            showFlash && "scale-110"
          )}
          alt="CRD Gradient Logo"
          onError={(e) => {
            console.error('Logo failed to load:', e);
            // Fallback to the uploaded image if the public file doesn't work
            (e.target as HTMLImageElement).src = "/lovable-uploads/4b5f3591-e7ce-4903-ba12-be85faf3d44d.png";
          }}
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
