
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './navbar/Logo';
import { NavLinks } from './navbar/NavLinks';
import { NavActions } from './navbar/NavActions';
import { cn } from '@/lib/utils';

export const Navbar = () => {
  // Initialize with gradient background to match gradient logo default
  const [navBgColor, setNavBgColor] = useState('bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500');

  const handleLogoChange = (logoId: string, bgColor: string) => {
    console.log('Navbar: Logo changed to:', logoId, 'with background:', bgColor);
    setNavBgColor(bgColor);
  };

  console.log('Navbar: Current background class:', navBgColor);

  return (
    <nav className={cn(
      navBgColor,
      "border-b border-white/20 sticky top-0 z-50 transition-colors duration-300"
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
