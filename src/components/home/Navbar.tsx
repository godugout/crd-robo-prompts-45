
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './navbar/Logo';
import { NavLinks } from './navbar/NavLinks';
import { NavActions } from './navbar/NavActions';
import { cn } from '@/lib/utils';

export const Navbar = () => {
  const [navBgColor, setNavBgColor] = useState('bg-crd-darkest');

  const handleLogoChange = (logoId: string, bgColor: string) => {
    setNavBgColor(bgColor);
  };

  return (
    <nav className={cn(
      navBgColor,
      "border-b border-crd-mediumGray/20 sticky top-0 z-50 transition-colors duration-300"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Logo onLogoChange={handleLogoChange} />
            <NavLinks />
          </div>
          <NavActions />
        </div>
      </div>
    </nav>
  );
};
