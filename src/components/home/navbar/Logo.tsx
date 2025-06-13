import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useEasterEgg } from "@/hooks/useEasterEgg";
import { CardshowLogo } from "@/assets/brand";
import { cn } from "@/lib/utils";

export const Logo = () => {
  const { clickCount, showScriptLogo, isTransitioning, handleClick, resetEasterEgg } = useEasterEgg();
  const [imagePreloaded, setImagePreloaded] = useState(false);

  // Use your uploaded CRD gradient logo for the easter egg
  const easterEggImageUrl = "/lovable-uploads/2235150b-53f4-4c6b-ac80-7aa963784c10.png";

  // Preload the script logo image for smooth transitions
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      console.log('Easter egg image preloaded successfully');
      setImagePreloaded(true);
    };
    img.onerror = (e) => {
      console.error('Failed to preload easter egg image:', e);
    };
    img.src = easterEggImageUrl;
  }, [easterEggImageUrl]);

  // Debug logging
  useEffect(() => {
    console.log('Logo state:', { clickCount, showScriptLogo, imagePreloaded });
  }, [clickCount, showScriptLogo, imagePreloaded]);

  return (
    <Link 
      to="/" 
      className={cn(
        "flex items-center transition-all duration-300 relative",
        "hover:brightness-150 hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]"
      )}
      onClick={handleClick}
    >
      <div className="relative">
        
        {/* Normal Cardshow Logo - Made slightly smaller */}
        <div 
          className={cn(
            "transition-all duration-600 ease-in-out transform flex items-center",
            showScriptLogo ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
          )}
          style={{
            transitionProperty: 'opacity, transform',
            transitionDuration: '600ms',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <CardshowLogo 
            size="xl"
            className="h-10 w-auto"
          />
        </div>

        {/* Script Logo (Easter Egg) - Positioned absolutely to overlay */}
        {showScriptLogo && (
          <div 
            className={cn(
              "absolute top-0 left-0 flex items-center transition-all duration-600 ease-in-out transform",
              "opacity-100 scale-100"
            )}
            style={{
              transitionProperty: 'opacity, transform',
              transitionDuration: '600ms',
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {imagePreloaded ? (
              <img
                src={easterEggImageUrl}
                alt="CRD Script Logo"
                className="h-10 w-auto object-contain transition-all duration-300 hover:scale-110 transform rounded"
                onLoad={() => {
                  console.log('CRD easter egg logo displayed successfully');
                }}
                onError={(e) => {
                  console.error('CRD logo failed to display:', e);
                  resetEasterEgg();
                }}
              />
            ) : (
              <div className="h-10 w-20 bg-crd-green/20 rounded animate-pulse flex items-center justify-center">
                <span className="text-xs text-crd-green">CRD</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Progress indicator for easter egg (subtle) */}
      {clickCount > 0 && clickCount < 7 && !showScriptLogo && (
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#4ade80] rounded-full opacity-60 animate-pulse" />
      )}
    </Link>
  );
};
