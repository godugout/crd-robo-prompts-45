
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const NavLinks = () => {
  const location = useLocation();

  const links = [
    { href: '/create', label: 'Create' },
    { href: '/cards/enhanced', label: 'Enhanced Studio' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/profile', label: 'Profile' }
  ];

  return (
    <nav className="hidden md:flex items-center space-x-8">
      {links.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-white",
            location.pathname === link.href 
              ? "text-white" 
              : "text-gray-300"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};
