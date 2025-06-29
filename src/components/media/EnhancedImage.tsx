
import React, { useState, useEffect, useRef } from 'react';
import { MediaManager } from '@/lib/storage/MediaManager';
import { cn } from '@/lib/utils';
import { Loader2, ImageIcon } from 'lucide-react';

interface EnhancedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallback?: string;
  loading?: 'lazy' | 'eager';
  quality?: number;
  useThumbnail?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export const EnhancedImage: React.FC<EnhancedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  fallback = '/placeholder.svg',
  loading = 'lazy',
  quality = 85,
  useThumbnail = false,
  onLoad,
  onError
}) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [optimizedSrc, setOptimizedSrc] = useState<string>(src);
  const [isVisible, setIsVisible] = useState(loading === 'eager');
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver>();

  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (loading === 'lazy' && imgRef.current) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observerRef.current?.disconnect();
          }
        },
        { rootMargin: '50px' }
      );
      
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [loading]);

  // Load and cache optimized image
  useEffect(() => {
    if (!isVisible || !src) return;

    let isMounted = true;

    const loadOptimizedImage = async () => {
      try {
        // Try to get cached version first
        const cachedUrl = await MediaManager.getCachedImageUrl(src);
        
        if (isMounted) {
          setOptimizedSrc(cachedUrl);
        }
      } catch (error) {
        console.warn('Failed to load optimized image:', error);
        if (isMounted) {
          setOptimizedSrc(src);
        }
      }
    };

    loadOptimizedImage();

    return () => {
      isMounted = false;
    };
  }, [src, isVisible]);

  const handleImageLoad = () => {
    setImageState('loaded');
    onLoad?.();
  };

  const handleImageError = () => {
    setImageState('error');
    setOptimizedSrc(fallback);
    onError?.();
  };

  const shouldShowPlaceholder = imageState === 'loading' || !isVisible;
  const shouldShowImage = isVisible && optimizedSrc;

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Loading placeholder */}
      {shouldShowPlaceholder && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          {imageState === 'loading' ? (
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          ) : (
            <ImageIcon className="w-6 h-6 text-gray-400" />
          )}
        </div>
      )}
      
      {/* Main image */}
      {shouldShowImage && (
        <img
          ref={imgRef}
          src={optimizedSrc}
          alt={alt}
          width={width}
          height={height}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={cn(
            'transition-opacity duration-300',
            imageState === 'loaded' ? 'opacity-100' : 'opacity-0',
            className
          )}
          loading={loading}
          decoding="async"
        />
      )}
      
      {/* Error state */}
      {imageState === 'error' && optimizedSrc === fallback && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-xs text-gray-500">Failed to load image</p>
          </div>
        </div>
      )}
    </div>
  );
};
