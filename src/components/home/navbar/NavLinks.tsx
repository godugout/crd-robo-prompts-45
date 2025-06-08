
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Bug, Palette } from "lucide-react";

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
        Create
      </Link>
      <Link 
        to="/studio" 
        className={`nav-item ${isActive('/studio') ? 'active' : ''} flex items-center gap-2`}
      >
        <Palette className="w-4 h-4" />
        Studio
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
        to="/debug-detection" 
        className={`nav-item ${isActive('/debug-detection') ? 'active' : ''} flex items-center gap-2`}
        title="Debug Card Detection"
      >
        <Bug className="w-4 h-4" />
        Debug
      </Link>
    </div>
  );
};
