
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LogoOption } from '../types/logoTypes';
import { getHeaderLogoStyles } from '../utils/logoUtils';

interface LogoButtonProps {
  selectedLogo: LogoOption;
}

export const LogoButton = React.forwardRef<HTMLAnchorElement, LogoButtonProps>(
  ({ selectedLogo }, ref) => {
    return (
      <Link 
        ref={ref}
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
    );
  }
);

LogoButton.displayName = 'LogoButton';
