
import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './navbar/Logo';
import { NavLinks } from './navbar/NavLinks';
import { NavActions } from './navbar/NavActions';

export const Navbar = () => {
  return (
    <nav className="bg-crd-darkest border-b border-crd-mediumGray/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="-ml-4"> {/* Negative margin to pull logo closer to edge */}
              <Logo />
            </div>
            <NavLinks />
          </div>
          <NavActions />
        </div>
      </div>
    </nav>
  );
};
