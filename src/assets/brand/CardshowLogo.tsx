
import React from 'react';
import { cn } from '@/lib/utils';
import { LogoProps, LogoSize } from './types';

const sizeClasses: Record<LogoSize, string> = {
  xs: 'h-4 w-auto',
  sm: 'h-5 w-auto', 
  md: 'h-6 w-auto',
  lg: 'h-8 w-auto',
  xl: 'h-10 w-auto',
};

export const CardshowLogo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'default',
  className = '',
  animated = false,
}) => {
  const logoClasses = cn(
    sizeClasses[size],
    'object-contain transition-all duration-150',
    animated && 'hover:scale-110 transform',
    className
  );

  // Use the proper storage URL for the logo from our static-assets bucket
  const logoUrl = 'https://wxlwhqlbxyuyujhqeyur.supabase.co/storage/v1/object/public/static-assets/cardshow-logo.png';

  return (
    <img
      src={logoUrl}
      alt="Cardshow"
      className={logoClasses}
      loading="lazy"
      onError={(e) => {
        // Fallback to the existing lovable upload if the new one fails
        (e.target as HTMLImageElement).src = "/lovable-uploads/943558d8-6411-4472-821c-40584cf51e6a.png";
      }}
    />
  );
};
