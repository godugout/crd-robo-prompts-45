
import React from "react";
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="self-stretch flex gap-2 text-lg text-[#F4F5F6] font-black whitespace-nowrap tracking-[-0.36px] leading-8 my-auto">
      <img
        src="/lovable-uploads/f8aeaf57-4a95-4ebe-8874-2df97ff6adf6.png"
        className="aspect-[1.34] object-contain w-[43px] shrink-0"
        alt="CRD Logo"
      />
      <div className="w-[123px]">CARDSHOW</div>
    </Link>
  );
};
