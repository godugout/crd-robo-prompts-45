
import React from "react";
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="self-stretch flex gap-2 text-lg text-[#F4F5F6] font-black whitespace-nowrap tracking-[-0.36px] leading-8 my-auto">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/c58b524115847cb6bae550e7e8d188319790873e?placeholderIfAbsent=true"
        className="aspect-[1.34] object-contain w-[43px] shrink-0"
        alt="Logo"
      />
      <div className="w-[123px]">CARDSHOW</div>
    </Link>
  );
};
