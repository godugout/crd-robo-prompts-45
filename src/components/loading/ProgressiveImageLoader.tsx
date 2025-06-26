
import React, { useState, useEffect, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { errorLogger } from '@/utils/errorLogger';

interface ProgressiveImageLoaderProps {
  src: string;
  alt: string;
  className?: string;
  lowQualitySrc?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export const ProgressiveImageLoader: React.FC<ProgressiveImageLoaderProps> = ({
  src,
  alt,
  className = '',
  lowQualitySrc,
  onLoad,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc || src);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    
    const img = new Image();
    
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoading(false);
      onLoad?.();
    };
    
    img.onerror = () => {
      const error = new Error(`Failed to load image: ${src}`);
      errorLogger.logResourceError('ProgressiveImageLoader', src, error);
      setHasError(true);
      setIsLoading(false);
      onError?.(error);
    };
    
    img.src = src;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, onLoad, onError]);

  if (hasError) {
    return (
      <div className={`bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-4">
          <div className="text-gray-400 text-sm">Failed to load image</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <Skeleton className="absolute inset-0 bg-gray-800" />
      )}
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        style={{ filter: currentSrc === lowQualitySrc ? 'blur(2px)' : 'none' }}
      />
    </div>
  );
};
