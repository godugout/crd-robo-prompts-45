
import { useEffect } from 'react';

interface UseCarouselKeyboardNavigationProps {
  currentIndex: number;
  totalFrames: number;
  viewMode: 'carousel' | 'gallery' | 'showcase';
  isMobile: boolean;
  onFrameSelect: (index: number) => void;
}

export const useCarouselKeyboardNavigation = ({
  currentIndex,
  totalFrames,
  viewMode,
  isMobile,
  onFrameSelect
}: UseCarouselKeyboardNavigationProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (viewMode === 'gallery') return;
      
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        const newIndex = currentIndex === 0 ? totalFrames - 1 : currentIndex - 1;
        onFrameSelect(newIndex);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        const newIndex = (currentIndex + 1) % totalFrames;
        onFrameSelect(newIndex);
      } else if (event.key >= '1' && event.key <= '9') {
        const frameIndex = parseInt(event.key) - 1;
        if (frameIndex < totalFrames) {
          onFrameSelect(frameIndex);
        }
      }
    };

    const handleWheel = (event: WheelEvent) => {
      if (viewMode === 'gallery' || isMobile) return;
      
      // Only handle wheel events when over the carousel
      const target = event.target as Element;
      if (!target.closest('[data-carousel-area]')) return;
      
      event.preventDefault();
      const direction = event.deltaY > 0 ? 1 : -1;
      const newIndex = direction > 0 
        ? (currentIndex + 1) % totalFrames
        : currentIndex === 0 ? totalFrames - 1 : currentIndex - 1;
      onFrameSelect(newIndex);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [currentIndex, viewMode, isMobile, totalFrames, onFrameSelect]);
};
