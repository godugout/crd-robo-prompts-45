
import React from "react";
import { Link, useLocation } from "react-router-dom";

export const NavLinks = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Custom style for the Gallery link
  const galleryBase = "relative font-extrabold px-2 transition-all duration-200";
  const galleryActive =
    "text-[#FFD700] underline underline-offset-4 after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-yellow-400 after:to-orange-400 after:rounded-full";
  const galleryInactive =
    "text-[#b1b5c3] hover:text-[#FFD700] hover:scale-105 hover:brightness-125";

  return (
    <div className="text-[#b1b5c3] text-center text-sm font-extrabold leading-none self-stretch my-auto">
      <Link 
        to="/cards" 
        className={isActive('/cards') ? "underline text-[#EA6E48]" : "font-semibold text-[#BDBDBD] hover:text-[#EA6E48]"}
      >
        CARDS
      </Link>{" "}
      <Link 
        to="/gallery" 
        className={
          galleryBase +
          " " +
          (isActive('/gallery') 
            ? galleryActive 
            : galleryInactive)
        }
        style={{
          textShadow: isActive('/gallery') ? "0 0 10px #FFD700, 0 1px 24px #fff2, 0 0 2px #FFA500" : undefined
        }}
      >
        GALLERY
      </Link>{" "}
      <Link 
        to="/creators" 
        className={isActive('/creators') ? "underline text-[#EA6E48]" : "font-semibold text-[#BDBDBD] hover:text-[#EA6E48]"}
      >
        CREATORS
      </Link>
    </div>
  );
};
