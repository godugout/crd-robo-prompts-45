
import React, { useState, useEffect } from 'react';
import { thumbnailCache } from '@/lib/thumbnailCache';

interface CachedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  loading?: 'lazy' | 'eager';
  onError?: () => void;
}

export const CachedImage: React.FC<CachedImageProps> = ({
  src,
  alt,
  className,
  fallback = '/placeholder.svg',
  loading = 'lazy',
  onError
}) => {
  const [cachedSrc, setCachedSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) {
      setCachedSrc(fallback);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    
    const loadCachedImage = async () => {
      try {
        const cached = await thumbnailCache.getThumbnail(src);
        if (isMounted) {
          setCachedSrc(cached);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setCachedSrc(fallback);
          setIsLoading(false);
          setHasError(true);
          onError?.();
        }
      }
    };

    loadCachedImage();

    return () => {
      isMounted = false;
    };
  }, [src, fallback, onError]);

  const handleError = () => {
    if (!hasError) {
      setCachedSrc(fallback);
      setHasError(true);
      onError?.();
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={`relative ${className || ''}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      <img
        src={cachedSrc}
        alt={alt}
        className={className}
        loading={loading}
        onError={handleError}
        onLoad={handleLoad}
        style={isLoading ? { opacity: 0 } : { opacity: 1 }}
      />
    </div>
  );
};
