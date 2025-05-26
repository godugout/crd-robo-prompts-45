
import React from "react";
import { Link, useLocation } from "react-router-dom";

export const NavLinks = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Base styles for all nav links
  const baseStyle = "relative font-semibold px-3 py-2 transition-all duration-200 rounded-md";
  
  // Clean modern styling
  const activeStyle = "bg-crd-orange text-white";
  const inactiveStyle = "text-crd-gray-600 hover:text-crd-gray-900 hover:bg-crd-gray-100";
  
  // Special styling for Gallery link
  const galleryBase = "relative font-bold px-3 py-2 transition-all duration-200 rounded-md";
  const galleryActive = "bg-gradient-to-r from-crd-gold to-yellow-500 text-white shadow-lg";
  const galleryInactive = "text-crd-gray-600 hover:text-crd-gold hover:bg-yellow-50 hover:scale-105";

  return (
    <div className="flex space-x-2 items-center">
      <Link
        to="/cards"
        className={`${baseStyle} ${isActive('/cards') ? activeStyle : inactiveStyle}`}
      >
        CARDS
      </Link>
      
      <Link
        to="/gallery"
        className={`${galleryBase} ${isActive('/gallery') ? galleryActive : galleryInactive}`}
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
