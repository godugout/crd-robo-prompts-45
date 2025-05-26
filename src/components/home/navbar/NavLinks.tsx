
import React from "react";
import { Link, useLocation } from "react-router-dom";

export const NavLinks = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="flex items-center gap-8">
      <Link 
        to="/" 
        className={`nav-item ${isActive('/') ? 'active' : ''}`}
      >
        Home
      </Link>
      <Link 
        to="/cards" 
        className={`nav-item ${isActive('/cards') ? 'active' : ''}`}
      >
        Cards
      </Link>
      <Link 
        to="/gallery" 
        className={`nav-item ${isActive('/gallery') ? 'active' : ''}`}
      >
        Gallery
      </Link>
      <Link 
        to="/creators" 
        className={`nav-item ${isActive('/creators') ? 'active' : ''}`}
      >
        Creators
      </Link>
      <Link 
        to="/editor" 
        className={`nav-item ${isActive('/editor') ? 'active' : ''}`}
      >
        Editor
      </Link>
      <Link 
        to="/profile" 
        className={`nav-item ${isActive('/profile') ? 'active' : ''}`}
      >
        Profile
      </Link>
    </div>
  );
};
