
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const NavLinks = () => {
  const location = useLocation();

  const links = [
    { href: '/create', label: 'Create' },
    { href: '/studio', label: 'Studio' },
    { href: '/collections', label: 'Collections' },
    { href: '/community', label: 'Community' },
    { href: '/creator-dashboard', label: 'Dashboard' }
  ];

  return (
    <nav className="hidden md:flex items-center space-x-6">
      {links.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-white px-3 py-2 rounded-md",
            location.pathname === link.href 
              ? "text-white bg-white/10" 
              : "text-gray-300 hover:bg-white/5"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};
