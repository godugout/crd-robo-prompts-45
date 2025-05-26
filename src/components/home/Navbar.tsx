
import React from "react";
import { Logo } from "./navbar/Logo";
import { NavLinks } from "./navbar/NavLinks";
import { NavActions } from "./navbar/NavActions";

export const Navbar: React.FC = () => {
  return (
    <nav className="crd-nav w-full">
      <div className="crd-container">
        <div className="flex w-full items-center justify-between h-16 lg:h-20">
          <div className="flex items-center gap-6 lg:gap-8 min-w-0 flex-1">
            <Logo />
            <div className="hidden md:block w-px h-8 bg-crd-gray-300" />
            <div className="hidden md:block">
              <NavLinks />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <NavActions />
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-crd-gray-200 bg-white">
        <div className="crd-container py-3">
          <NavLinks />
        </div>
      </div>
    </nav>
  );
};
