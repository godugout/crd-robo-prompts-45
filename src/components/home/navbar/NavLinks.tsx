
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Beaker, Palette, Trophy } from "lucide-react";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";

export const NavLinks = () => {
  const location = useLocation();
  const { isFeatureEnabled } = useFeatureFlags();
  
  const isActive = (path: string) => location.pathname === path;
  const showOakFeatures = isFeatureEnabled('OAK_FEATURES');
  
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
      {showOakFeatures && (
        <Link 
          to="/oak-memory-creator" 
          className={`nav-item ${isActive('/oak-memory-creator') ? 'active' : ''} flex items-center gap-2`}
        >
          <Trophy className="w-4 h-4" />
          Oakland A's
        </Link>
      )}
      <Link 
        to="/gallery" 
        className={`nav-item ${isActive('/gallery') ? 'active' : ''}`}
      >
        Gallery
      </Link>
      <Link 
        to="/collections" 
        className={`nav-item ${isActive('/collections') ? 'active' : ''}`}
      >
        Collections
      </Link>
      <Link 
        to="/labs" 
        className={`nav-item ${isActive('/labs') || location.pathname.startsWith('/labs') ? 'active' : ''} flex items-center gap-2`}
      >
        <Beaker className="w-4 h-4" />
        Labs
      </Link>
    </div>
  );
};
