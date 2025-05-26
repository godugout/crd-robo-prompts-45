
import React from "react";
import { Logo } from "./navbar/Logo";
import { NavLinks } from "./navbar/NavLinks";
import { NavActions } from "./navbar/NavActions";

export const Navbar: React.FC = () => {
  return (
    <div className="bg-[#141416] w-full overflow-hidden">
      <div className="flex w-full items-center justify-between flex-wrap px-40 py-5 max-md:max-w-full max-md:px-5">
        <div className="self-stretch flex min-w-60 items-center gap-8 flex-wrap my-auto max-md:max-w-full">
          <Logo />
          <div className="bg-[#353945] self-stretch flex w-0.5 shrink-0 h-10 my-auto rounded-sm" />
          <NavLinks />
        </div>
        <NavActions />
      </div>
      <div className="bg-[#353945] flex min-h-px w-full" />
    </div>
  );
};
