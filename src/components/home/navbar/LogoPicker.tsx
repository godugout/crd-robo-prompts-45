
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
    name: 'Main',
    src: '/lovable-uploads/5ac69e35-ecd1-4907-b089-318e7828606c.png',
    has3D: false
  },
  {
    id: 'cardshow-vintage-green',
    name: 'Vintage',
    src: '/lovable-uploads/8aec29c2-2d7a-42a1-8fc8-4a27a7964d41.png',
    has3D: false
  },
  {
    id: 'cardshow-modern-red',
    name: 'Modern',
    src: '/lovable-uploads/7546e555-f08f-4ee6-8337-7cc99ed1cfb7.png',
    has3D: true
  },  
  {
    id: 'cardshow-script-coral',
    name: 'Script',
    src: '/lovable-uploads/49b61ce3-8589-45b1-adb7-2594a81ab97b.png',
    has3D: true
  },
  {
    id: 'cardshow-gradient-crd',
    name: 'Gradient',
    src: '/lovable-uploads/b4e234d6-d956-4a58-b701-5243e21a43da.png',
    has3D: false
  },
  {
    id: 'cardshow-blue-script',
    name: 'Blue Script',
    src: '/lovable-uploads/113582de-fb26-49d8-9e53-15aedd6d36ae.png',
    has3D: false
  },
  {
    id: 'cardshow-red-blue-script',
    name: 'Red & Blue',
    src: '/lovable-uploads/0dbff635-a494-4ce4-b6b7-cadd563ff383.png',
    has3D: false
  },
  {
    id: 'cardshow-bold-black',
    name: 'Bold Black',
    src: '/lovable-uploads/50e48a4f-d7f6-46df-b6bb-93287588484d.png',
    has3D: false
  },
  {
    id: 'cardshow-blue-gold',
    name: 'Blue & Gold',
    src: '/lovable-uploads/dedb3bf8-117e-4ae8-ab0d-1fe32f10eb39.png',
    has3D: false
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
                className="h-10 object-contain absolute top-0.5 left-0.5 opacity-60 brightness-0 invert z-0 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <img
              src={selectedLogo.src}
              alt={selectedLogo.name}
              className="h-10 object-contain relative z-10 w-auto"
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
        <div className="grid grid-cols-3 gap-3">
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
                      className="h-8 object-contain absolute top-0.5 left-0.5 opacity-40 brightness-0 invert z-0 w-auto"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <img
                    src={logo.src}
                    alt={logo.name}
                    className="h-8 object-contain relative z-10 w-auto"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div className="font-medium text-white text-xs">{logo.name}</div>
              </div>
            </button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
