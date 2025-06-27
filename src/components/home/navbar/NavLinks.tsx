
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const NavLinks = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/cards', label: 'Cards' },
    { path: '/studio', label: 'Studio' },
    { path: '/collections', label: 'Collections' },
  ];

  return (
    <div className="hidden md:flex items-center space-x-8">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "nav-item relative px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg",
              isActive 
                ? "text-white bg-white/25 shadow-lg font-semibold" 
                : "text-white/95 hover:text-white hover:bg-white/15 hover:shadow-md"
            )}
          >
            {item.label}
            {isActive && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-sm" />
            )}
          </Link>
        );
      })}
    </div>
  );
};
