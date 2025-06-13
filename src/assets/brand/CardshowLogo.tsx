
import React from 'react';
import { cn } from '@/lib/utils';
import { LogoProps, LogoSize } from './types';
import { LOGO_SIZES } from './constants';

const sizeClasses: Record<LogoSize, string> = {
  xs: 'h-5 w-5',
  sm: 'h-6 w-6', 
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
  xl: 'h-12 w-12',
};

const textSizeClasses: Record<LogoSize, string> = {
  xs: 'text-sm',
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-xl',
  xl: 'text-2xl',
};

export const CardshowLogo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'default',
  className = '',
  showText = true,
  animated = false,
}) => {
  const logoClasses = cn(
    sizeClasses[size],
    'object-contain transition-all duration-150',
    animated && 'hover:scale-110',
    className
  );

  const textClasses = cn(
    textSizeClasses[size],
    'font-black text-crd-lightGray ml-2',
    variant === 'light' && 'text-white',
    variant === 'dark' && 'text-gray-900'
  );

  return (
    <div className="flex items-center">
      <img
        src="/lovable-uploads/4b5f3591-e7ce-4903-ba12-be85faf3d44d.png"
        alt="Cardshow Logo"
        className={logoClasses}
        loading="lazy"
      />
      {showText && (
        <span className={textClasses}>
          CARDSHOW
        </span>
      )}
    </div>
  );
};
