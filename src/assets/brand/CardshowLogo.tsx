
import React, { useState, useEffect } from 'react';
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
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error' | 'fallback'>('loading');
  const [currentSrc, setCurrentSrc] = useState<string>('');

  // Try multiple logo sources in order of preference
  const logoSources = [
    '/lovable-uploads/e4fec02d-cb72-4dd5-955e-ead1e8e3020c.png',
    '/lovable-uploads/943558d8-6411-4472-821c-40584cf51e6a.png',
    '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png', // Gradient logo
    '/crd-logo-gradient.png', // Fallback in public folder
  ];

  useEffect(() => {
    console.log('CardshowLogo: Starting image load sequence');
    setImageStatus('loading');
    
    const tryLoadImage = (sources: string[], index: number = 0): void => {
      if (index >= sources.length) {
        console.log('CardshowLogo: All image sources failed, using text fallback');
        setImageStatus('fallback');
        return;
      }

      const src = sources[index];
      console.log(`CardshowLogo: Trying to load image ${index + 1}/${sources.length}:`, src);
      
      const img = new Image();
      img.onload = () => {
        console.log('CardshowLogo: Successfully loaded:', src);
        setImageStatus('loaded');
        setCurrentSrc(src);
      };
      
      img.onerror = () => {
        console.warn(`CardshowLogo: Failed to load image ${index + 1}:`, src);
        tryLoadImage(sources, index + 1);
      };
      
      img.src = src;
    };

    tryLoadImage(logoSources);
  }, []);

  const logoClasses = cn(
    sizeClasses[size],
    'object-contain transition-all duration-150',
    animated && 'hover:scale-110 transform',
    className
  );

  // Show loading state
  if (imageStatus === 'loading') {
    return (
      <div className={cn(sizeClasses[size], 'bg-crd-mediumGray animate-pulse rounded', className)}>
        <span className="sr-only">Loading Cardshow logo...</span>
      </div>
    );
  }

  // Show fallback text if all images failed
  if (imageStatus === 'fallback') {
    console.log('CardshowLogo: Rendering enhanced text fallback');
    return (
      <div className={cn(
        'font-bold bg-gradient-to-r from-crd-green to-crd-blue bg-clip-text text-transparent flex items-center justify-center px-2',
        size === 'xs' && 'text-xs',
        size === 'sm' && 'text-sm',
        size === 'md' && 'text-base',
        size === 'lg' && 'text-lg',
        size === 'xl' && 'text-xl',
        animated && 'hover:scale-110 transform transition-all duration-150',
        className
      )}>
        CARDSHOW
      </div>
    );
  }

  // Render image if loaded successfully
  console.log('CardshowLogo: Rendering image:', currentSrc);
  return (
    <img
      src={currentSrc}
      alt="Cardshow"
      className={logoClasses}
      loading="lazy"
      onLoad={() => {
        console.log('CardshowLogo: Image onLoad event fired for:', currentSrc);
      }}
      onError={(e) => {
        console.error('CardshowLogo: Image onError event fired for:', currentSrc, e);
        setImageStatus('fallback');
      }}
    />
  );
};
