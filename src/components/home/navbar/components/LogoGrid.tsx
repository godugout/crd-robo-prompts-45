
import React from 'react';
import { cn } from '@/lib/utils';
import { LOGO_OPTIONS } from '../constants/logoOptions';
import { LogoOption } from '../types/logoTypes';

interface LogoGridProps {
  selectedLogo: LogoOption;
  onLogoSelect: (logo: LogoOption) => void;
}

export const LogoGrid: React.FC<LogoGridProps> = ({ selectedLogo, onLogoSelect }) => {
  return (
    <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto scrollbar-themed">
      {LOGO_OPTIONS.map((logo) => (
        <button
          key={logo.id}
          onClick={() => onLogoSelect(logo)}
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
  );
};
