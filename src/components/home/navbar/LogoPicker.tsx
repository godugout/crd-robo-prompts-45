
import React, { useState, useEffect } from 'react';
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
    name: 'Official',
    src: '/lovable-uploads/5ac69e35-ecd1-4907-b089-318e7828606c.png',
    has3D: false,
    navBgColor: 'bg-crd-darkest',
    dropdownBgColor: 'bg-crd-darkest/95'
  },
  {
    id: 'cardshow-vintage-green',
    name: 'Vintage',
    src: '/lovable-uploads/8aec29c2-2d7a-42a1-8fc8-4a27a7964d41.png',
    has3D: false,
    navBgColor: 'bg-green-900',
    dropdownBgColor: 'bg-green-900/95'
  },
  {
    id: 'cardshow-modern-red',
    name: 'Modern',
    src: '/lovable-uploads/7546e555-f08f-4ee6-8337-7cc99ed1cfb7.png',
    has3D: true,
    navBgColor: 'bg-red-900',
    dropdownBgColor: 'bg-red-900/95'
  },  
  {
    id: 'cardshow-script-coral',
    name: 'Script',
    src: '/lovable-uploads/49b61ce3-8589-45b1-adb7-2594a81ab97b.png',
    has3D: true,
    navBgColor: 'bg-orange-900',
    dropdownBgColor: 'bg-orange-900/95'
  },
  {
    id: 'cardshow-gradient-crd',
    name: 'Gradient',
    src: '/lovable-uploads/b4e234d6-d956-4a58-b701-5243e21a43da.png',
    has3D: false,
    navBgColor: 'bg-purple-900',
    dropdownBgColor: 'bg-purple-900/95'
  },
  {
    id: 'cardshow-red-blue-script',
    name: 'Red & Blue',
    src: '/lovable-uploads/0dbff635-a494-4ce4-b6b7-cadd563ff383.png',
    has3D: false,
    navBgColor: 'bg-blue-900',
    dropdownBgColor: 'bg-blue-900/95'
  },
  {
    id: 'cardshow-blue-script',
    name: 'Blue',
    src: '/lovable-uploads/113582de-fb26-49d8-9e53-15aedd6d36ae.png',
    has3D: false,
    navBgColor: 'bg-blue-800',
    dropdownBgColor: 'bg-blue-800/95'
  },
  {
    id: 'cardshow-bold-black',
    name: 'Bold Black',
    src: '/lovable-uploads/50e48a4f-d7f6-46df-b6bb-93287588484d.png',
    has3D: false,
    navBgColor: 'bg-gray-900',
    dropdownBgColor: 'bg-gray-900/95'
  },
  {
    id: 'cardshow-blue-gold',
    name: 'Blue & Gold',
    src: '/lovable-uploads/dedb3bf8-117e-4ae8-ab0d-1fe32f10eb39.png',
    has3D: false,
    navBgColor: 'bg-blue-900',
    dropdownBgColor: 'bg-blue-900/95'
  }
];

interface LogoPickerProps {
  onLogoChange?: (logoId: string, navBgColor: string) => void;
}

export const LogoPicker = ({ onLogoChange }: LogoPickerProps) => {
  const [selectedLogo, setSelectedLogo] = useState(LOGO_OPTIONS[0]);

  useEffect(() => {
    onLogoChange?.(selectedLogo.id, selectedLogo.navBgColor);
  }, [selectedLogo, onLogoChange]);

  const handleLogoSelect = (logo: typeof LOGO_OPTIONS[0]) => {
    setSelectedLogo(logo);
    onLogoChange?.(logo.id, logo.navBgColor);
  };

  const getHeaderLogoStyles = (logoId: string) => {
    switch (logoId) {
      case 'cardshow-modern-red':
        return 'bg-white rounded px-1 py-0.5';
      case 'cardshow-red-blue-script':
      case 'cardshow-blue-script':
        return 'drop-shadow-[0_0_4px_rgba(255,255,255,0.9)] filter [text-shadow:_0_0_6px_rgba(255,255,255,0.8)]';
      default:
        return '';
    }
  };

  const getDropdownBgClass = (logoId: string) => {
    const logo = LOGO_OPTIONS.find(l => l.id === logoId);
    return logo?.dropdownBgColor || 'bg-crd-darkest/95';
  };

  return (
    <div className={cn(
      selectedLogo.id === 'cardshow-red-blue-script' || selectedLogo.id === 'cardshow-blue-script' 
        ? 'bg-gray-700' 
        : 'bg-crd-darkest'
    )}>
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
                className={cn(
                  "h-10 object-contain relative z-10 w-auto",
                  getHeaderLogoStyles(selectedLogo.id)
                )}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <ChevronDown className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
          </Link>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          className={cn(
            "w-80 p-4 backdrop-blur-sm border-crd-mediumGray/30 scrollbar-themed",
            getDropdownBgClass(selectedLogo.id)
          )}
          align="start"
        >
          <div className="text-sm font-medium text-white mb-3">Choose Logo</div>
          <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto scrollbar-themed">
            {LOGO_OPTIONS.map((logo) => (
              <button
                key={logo.id}
                onClick={() => handleLogoSelect(logo)}
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
                      className={cn(
                        "object-contain relative z-10 w-auto",
                        logo.id === 'cardshow-bold-black' || logo.id === 'cardshow-blue-gold' 
                          ? "h-6" 
                          : "h-8"
                      )}
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
    </div>
  );
};
