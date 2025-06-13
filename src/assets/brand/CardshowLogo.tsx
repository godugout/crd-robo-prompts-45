
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

  const primaryLogoUrl = '/lovable-uploads/e4fec02d-cb72-4dd5-955e-ead1e8e3020c.png';
  const fallbackLogoUrl = '/lovable-uploads/943558d8-6411-4472-821c-40584cf51e6a.png';

  useEffect(() => {
    console.log('CardshowLogo: Starting image load sequence');
    setImageStatus('loading');
    setCurrentSrc(primaryLogoUrl);
    
    // Test primary image
    const primaryImg = new Image();
    primaryImg.onload = () => {
      console.log('CardshowLogo: Primary image loaded successfully:', primaryLogoUrl);
      setImageStatus('loaded');
      setCurrentSrc(primaryLogoUrl);
    };
    
    primaryImg.onerror = () => {
      console.error('CardshowLogo: Primary image failed to load:', primaryLogoUrl);
      
      // Try fallback image
      const fallbackImg = new Image();
      fallbackImg.onload = () => {
        console.log('CardshowLogo: Fallback image loaded successfully:', fallbackLogoUrl);
        setImageStatus('loaded');
        setCurrentSrc(fallbackLogoUrl);
      };
      
      fallbackImg.onerror = () => {
        console.error('CardshowLogo: Fallback image also failed to load:', fallbackLogoUrl);
        setImageStatus('fallback');
        setCurrentSrc('');
      };
      
      fallbackImg.src = fallbackLogoUrl;
    };
    
    primaryImg.src = primaryLogoUrl;
  }, []);

  const logoClasses = cn(
    sizeClasses[size],
    'object-contain transition-all duration-150',
    animated && 'hover:scale-110 transform',
    className
  );

  // Show loading state
  if (imageStatus === 'loading') {
    console.log('CardshowLogo: Rendering loading state');
    return (
      <div className={cn(sizeClasses[size], 'bg-crd-mediumGray animate-pulse rounded', className)}>
        <span className="sr-only">Loading Cardshow logo...</span>
      </div>
    );
  }

  // Show fallback text if both images failed
  if (imageStatus === 'fallback') {
    console.log('CardshowLogo: Rendering text fallback');
    return (
      <div className={cn(
        'font-bold text-crd-green flex items-center justify-center px-2',
        size === 'xs' && 'text-xs',
        size === 'sm' && 'text-sm',
        size === 'md' && 'text-base',
        size === 'lg' && 'text-lg',
        size === 'xl' && 'text-xl',
        animated && 'hover:scale-110 transform transition-all duration-150',
        className
      )}>
        CRD
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
        // This shouldn't happen since we pre-test images, but just in case
        setImageStatus('error');
      }}
    />
  );
};
