
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
    description: 'Primary Cardshow Logo',
    has3D: false,
    customWidth: 'w-12' // Wider than default
  },
  {
    id: 'cardshow-vintage-green',
    name: 'Cardshow Vintage Green',
    src: '/lovable-uploads/8aec29c2-2d7a-42a1-8fc8-4a27a7964d41.png',
    description: 'Green vintage baseball style',
    has3D: false
  },
  {
    id: 'cardshow-modern-red',
    name: 'Cardshow Modern Red',
    src: '/lovable-uploads/7546e555-f08f-4ee6-8337-7cc99ed1cfb7.png',
    description: 'Bold red modern design',
    has3D: true
  },
  {
    id: 'cardshow-script-coral',
    name: 'Cardshow Script Coral',
    src: '/lovable-uploads/9a88282e-57be-466e-bc1d-9db4c00af565.png',
    description: 'Coral script typography',
    has3D: true,
    customWidth: 'w-12' // Wider than default
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
          <div className="relative">
            {selectedLogo.has3D && (
              <img
                src={selectedLogo.src}
                alt=""
                className={`h-10 object-contain absolute top-0.5 left-0.5 opacity-60 brightness-0 invert z-0 ${selectedLogo.customWidth || 'w-auto'}`}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <img
              src={selectedLogo.src}
              alt={selectedLogo.name}
              className={`h-10 object-contain relative z-10 ${selectedLogo.customWidth || 'w-auto'}`}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
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
                <div className="relative">
                  {logo.has3D && (
                    <img
                      src={logo.src}
                      alt=""
                      className={`h-8 object-contain absolute top-0.5 left-0.5 opacity-40 brightness-0 invert z-0 ${logo.customWidth || 'w-auto'}`}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <img
                    src={logo.src}
                    alt={logo.name}
                    className={`h-8 object-contain relative z-10 ${logo.customWidth || 'w-auto'}`}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
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
