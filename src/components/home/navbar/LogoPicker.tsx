
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CardshowLogo } from '@/assets/brand';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LOGO_OPTIONS = [
  {
    id: 'cardshow-main',
    name: 'Cardshow Main',
    src: '/Cardshow_logo.png',
    description: 'Primary Cardshow Logo'
  },
  {
    id: 'gradient-purple',
    name: 'Gradient Purple',
    src: '/lovable-uploads/95a44939-2aae-4c52-94be-6e6d9a5d0853.png',
    description: 'Purple gradient logo'
  },
  {
    id: 'crd-gradient',
    name: 'CRD Gradient',
    src: '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png',
    description: 'CRD gradient design'
  },
  {
    id: 'crd-classic',
    name: 'CRD Classic',
    src: '/crd-logo-gradient.png',
    description: 'Classic CRD logo'
  }
];

export const LogoPicker = () => {
  const [selectedLogo, setSelectedLogo] = useState(LOGO_OPTIONS[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Link 
          to="/" 
          className={cn(
            "flex items-center gap-2 transition-all duration-300 group",
            "hover:brightness-150 hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]"
          )}
        >
          <img
            src={selectedLogo.src}
            alt={selectedLogo.name}
            className="h-10 w-auto object-contain"
            onError={(e) => {
              // Fallback to text if image fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
          <ChevronDown className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
        </Link>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-80 p-4 bg-crd-darkest/95 backdrop-blur-sm border-crd-mediumGray/30"
        align="start"
      >
        <div className="text-sm font-medium text-white mb-3">Choose Logo</div>
        <div className="grid grid-cols-2 gap-3">
          {LOGO_OPTIONS.map((logo) => (
            <button
              key={logo.id}
              onClick={() => setSelectedLogo(logo)}
              className={cn(
                "p-3 rounded-lg border-2 transition-all duration-200 text-left",
                "hover:border-crd-green hover:bg-crd-green/10",
                selectedLogo.id === logo.id 
                  ? "border-crd-green bg-crd-green/20" 
                  : "border-crd-mediumGray/30 bg-crd-mediumGray/10"
              )}
            >
              <div className="flex flex-col items-center gap-2">
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="h-8 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div>
                  <div className="font-medium text-white text-xs">{logo.name}</div>
                  <div className="text-xs text-white/60">{logo.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
