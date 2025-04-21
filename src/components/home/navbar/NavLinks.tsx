
import React from "react";
import { Link, useLocation } from "react-router-dom";

export const NavLinks = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="text-[#b1b5c3] text-center text-sm font-extrabold leading-none self-stretch my-auto">
      <Link 
        to="/cards" 
        className={isActive('/cards') ? "underline text-[#EA6E48]" : "font-semibold text-[#BDBDBD] hover:text-[#EA6E48]"}
      >
        CARDS
      </Link>{" "}
      <Link 
        to="/shop" 
        className={isActive('/shop') ? "underline text-[#EA6E48]" : "font-semibold text-[#BDBDBD] hover:text-[#EA6E48]"}
      >
        CRD SHOP
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
