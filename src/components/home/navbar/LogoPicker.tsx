
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LOGO_OPTIONS } from './constants/logoOptions';
import { LogoPickerProps } from './types/logoTypes';
import { getDropdownBgClass, getContainerBgClass } from './utils/logoUtils';
import { LogoButton } from './components/LogoButton';
import { LogoGrid } from './components/LogoGrid';

export const LogoPicker: React.FC<LogoPickerProps> = ({ onLogoChange }) => {
  // Initialize with the gradient logo as default (first in array)
  const [selectedLogo, setSelectedLogo] = useState(LOGO_OPTIONS[0]);

  useEffect(() => {
    // Ensure the gradient logo is selected by default and notify parent
    const gradientLogo = LOGO_OPTIONS[0]; // This is the gradient logo
    setSelectedLogo(gradientLogo);
    onLogoChange?.(gradientLogo.id, gradientLogo.navBgColor);
  }, [onLogoChange]);

  const handleLogoSelect = (logo: typeof LOGO_OPTIONS[0]) => {
    setSelectedLogo(logo);
    onLogoChange?.(logo.id, logo.navBgColor);
  };

  return (
    <div className={cn(getContainerBgClass(selectedLogo.id))}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <LogoButton selectedLogo={selectedLogo} />
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          className={cn(
            "w-80 p-4 backdrop-blur-sm border-white/30 scrollbar-themed",
            getDropdownBgClass(selectedLogo.id)
          )}
          align="start"
        >
          <div className="text-sm font-medium text-white mb-3">Choose Logo</div>
          <LogoGrid 
            selectedLogo={selectedLogo} 
            onLogoSelect={handleLogoSelect} 
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
