
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Image, Plus, FolderOpen, Palette } from "lucide-react";

export const NavLinks = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="flex items-center gap-8">
      <Link 
        to="/" 
        className={`nav-item ${isActive('/') ? 'active' : ''} flex items-center gap-2`}
      >
        <Home className="w-4 h-4" />
        Home
      </Link>
      <Link 
        to="/gallery" 
        className={`nav-item ${isActive('/gallery') ? 'active' : ''} flex items-center gap-2`}
      >
        <Image className="w-4 h-4" />
        Gallery
      </Link>
      <Link 
        to="/cards/enhanced" 
        className={`nav-item ${isActive('/cards/enhanced') ? 'active' : ''} flex items-center gap-2`}
      >
        <Plus className="w-4 h-4" />
        Create
      </Link>
      <Link 
        to="/collections" 
        className={`nav-item ${isActive('/collections') ? 'active' : ''} flex items-center gap-2`}
      >
        <FolderOpen className="w-4 h-4" />
        Collections
      </Link>
      <Link 
        to="/studio" 
        className={`nav-item premium-nav-item ${isActive('/studio') ? 'active' : ''} flex items-center gap-2`}
      >
        <Palette className="w-4 h-4" />
        Studio
      </Link>
    </div>
  );
};
