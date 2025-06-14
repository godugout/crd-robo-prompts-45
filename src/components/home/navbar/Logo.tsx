
import React from "react";
import { Link } from "react-router-dom";
import { CardshowLogo } from "@/assets/brand";
import { cn } from "@/lib/utils";

export const Logo = () => {
  return (
    <Link 
      to="/" 
      className={cn(
        "flex items-center transition-all duration-300",
        "hover:brightness-150 hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]"
      )}
    >
      <CardshowLogo 
        size="xl"
        className="h-10 w-auto"
      />
    </Link>
  );
};
