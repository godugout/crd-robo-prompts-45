
import React from "react";
import { Link, useLocation } from "react-router-dom";

export const NavLinks = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Base styles for all nav links
  const baseStyle = "relative font-bold px-3 py-1 transition-all duration-200";
  
  // Custom style for active and inactive states
  const activeStyle = "text-[#EA6E48] underline underline-offset-4";
  const inactiveStyle = "text-[#777E90] hover:text-[#EA6E48]";
  
  // Custom style for the Gallery link (golden special styling)
  const galleryBase = "relative font-extrabold px-2 transition-all duration-200";
  const galleryActive =
    "text-[#FFD700] underline underline-offset-4 after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-yellow-400 after:to-orange-400 after:rounded-full";
  const galleryInactive =
    "text-[#777E90] hover:text-[#FFD700] hover:scale-105 hover:brightness-125";

  return (
    <div className="text-center flex space-x-6 items-center">
      <Link
        to="/cards"
        className={`${baseStyle} ${isActive('/cards') ? activeStyle : inactiveStyle}`}
      >
        CARDS
      </Link>
      
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
          textShadow: isActive('/gallery')
            ? "0 0 10px #FFD700, 0 1px 24px #fff2, 0 0 2px #FFA500"
            : undefined
        }}
      >
        GALLERY
      </Link>
      
      <Link
        to="/creators"
        className={`${baseStyle} ${isActive('/creators') ? activeStyle : inactiveStyle}`}
      >
        CREATORS
      </Link>
      
      <Link
        to="/collections"
        className={`${baseStyle} ${isActive('/collections') ? activeStyle : inactiveStyle}`}
      >
        COLLECTIONS
      </Link>
    </div>
  );
};
