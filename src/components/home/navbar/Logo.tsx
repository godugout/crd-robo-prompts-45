
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
          "self-stretch flex gap-2 text-lg text-[#F4F5F6] font-black whitespace-nowrap tracking-[-0.36px] leading-8 my-auto transition-all duration-150",
          showFlash && "brightness-150 drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]"
        )}
        onClick={handleClick}
      >
        <img
          src="https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/c58b524115847cb6bae550e7e8d188319790873e?placeholderIfAbsent=true"
          className={cn(
            "aspect-[1.34] object-contain w-[43px] shrink-0 transition-all duration-150",
            showFlash && "scale-110"
          )}
          alt="Logo"
        />
        <div className="w-[123px]">CARDSHOW</div>
        
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
