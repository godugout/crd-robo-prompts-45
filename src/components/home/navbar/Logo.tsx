
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useEasterEgg } from "@/hooks/useEasterEgg";
import { CardshowLogo } from "@/assets/brand";
import { cn } from "@/lib/utils";

export const Logo = () => {
  const { clickCount, showScriptLogo, isTransitioning, handleClick, resetEasterEgg } = useEasterEgg();
  const [imagePreloaded, setImagePreloaded] = useState(false);

  // Preload the script logo image for smooth transitions
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImagePreloaded(true);
    img.src = "/lovable-uploads/bcb3a676-7a9a-49f6-a43d-cd4be4963620.png";
  }, []);

  return (
    <Link 
      to="/" 
      className={cn(
        "flex items-center transition-all duration-300 relative mt-1", // Added mt-1 for slight downward alignment
        "hover:brightness-150 hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]" // Yellow glow on hover
      )}
      onClick={handleClick}
    >
      {/* Fixed container that maintains consistent left alignment */}
      <div className="relative flex items-center">
        
        {/* Normal Cardshow Logo - 6x larger (672x168) - Left aligned */}
        <div 
          className={cn(
            "absolute top-0 left-0 transition-all duration-600 ease-in-out transform flex items-center",
            showScriptLogo ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
          )}
          style={{
            transitionProperty: 'opacity, transform',
            transitionDuration: '600ms',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <CardshowLogo 
            size="sm"
            className="h-42 w-auto"
            style={{ width: '672px', height: '168px' }}
          />
        </div>

        {/* Script Logo (Easter Egg) - Left aligned at same position */}
        <div 
          className={cn(
            "absolute top-0 left-0 flex items-center transition-all duration-600 ease-in-out transform",
            !showScriptLogo ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
          )}
          style={{
            transitionProperty: 'opacity, transform',
            transitionDuration: '600ms',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {imagePreloaded && (
            <img
              src="/lovable-uploads/bcb3a676-7a9a-49f6-a43d-cd4be4963620.png"
              alt="Cardshow Script"
              className="h-14 w-auto object-contain transition-all duration-300 hover:scale-110 transform"
              onError={() => {
                // Fallback to normal logo if script image fails
                console.warn('Script logo failed to load, keeping normal logo');
                resetEasterEgg();
              }}
            />
          )}
        </div>

        {/* Invisible spacer to maintain layout - uses the larger logo's dimensions */}
        <div 
          className="invisible flex items-center"
          style={{ width: '672px', height: '168px' }}
        />
      </div>
      
      {/* Progress indicator for easter egg (subtle) */}
      {clickCount > 0 && clickCount < 7 && !showScriptLogo && (
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#4ade80] rounded-full opacity-60 animate-pulse" />
      )}
    </Link>
  );
};
