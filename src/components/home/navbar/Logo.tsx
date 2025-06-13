
import React from "react";
import { Link } from "react-router-dom";
import { useEasterEgg } from "@/hooks/useEasterEgg";
import { CardshowLogo } from "@/assets/brand";
import { cn } from "@/lib/utils";

export const Logo = () => {
  const { clickCount, showScriptLogo, showFlash, isTransitioning, handleClick, resetEasterEgg } = useEasterEgg();

  return (
    <Link 
      to="/" 
      className={cn(
        "self-stretch flex items-center transition-all duration-300 relative",
        showFlash && "brightness-150 drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]"
      )}
      onClick={handleClick}
    >
      <div className="relative h-32 flex items-center">
        {/* Normal Cardshow Logo */}
        <div 
          className={cn(
            "absolute inset-0 transition-all duration-400 ease-in-out",
            showScriptLogo && !isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100",
            isTransitioning && showScriptLogo ? "opacity-0 scale-95" : ""
          )}
        >
          <CardshowLogo 
            size="xl"
            animated={showFlash}
            className="h-32 w-auto"
          />
        </div>

        {/* Script Logo (Easter Egg) */}
        <div 
          className={cn(
            "absolute inset-0 flex items-center transition-all duration-400 ease-in-out",
            !showScriptLogo && !isTransitioning ? "opacity-0 scale-95 pointer-events-none" : "",
            showScriptLogo && !isTransitioning ? "opacity-100 scale-100" : "",
            isTransitioning && !showScriptLogo ? "opacity-0 scale-95" : ""
          )}
        >
          <img
            src="/lovable-uploads/bcb3a676-7a9a-49f6-a43d-cd4be4963620.png"
            alt="Cardshow Script"
            className={cn(
              "h-12 w-auto object-contain transition-all duration-300",
              "hover:scale-110 transform",
              showFlash && "scale-110"
            )}
            onError={() => {
              // Fallback to normal logo if script image fails
              console.warn('Script logo failed to load, keeping normal logo');
              resetEasterEgg();
            }}
          />
        </div>
      </div>
      
      {/* Progress indicator for easter egg (subtle) */}
      {clickCount > 0 && clickCount < 7 && !showScriptLogo && (
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#4ade80] rounded-full opacity-60 animate-pulse" />
      )}
    </Link>
  );
};
