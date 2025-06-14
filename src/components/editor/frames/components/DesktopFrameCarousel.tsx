import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FramePreview } from './FramePreview';
import { useSwipeNavigation } from '../hooks/useSwipeNavigation';
import type { MinimalistFrame } from '../data/minimalistFrames';

interface DesktopFrameCarouselProps {
  frames: MinimalistFrame[];
  currentIndex: number;
  uploadedImage?: string;
  onFrameSelect: (index: number) => void;
  isDragActive: boolean;
}

export const DesktopFrameCarousel: React.FC<DesktopFrameCarouselProps> = ({
  frames,
  currentIndex,
  uploadedImage,
  onFrameSelect,
  isDragActive
}) => {
  const [dragOffset, setDragOffset] = useState(0);
  const [dragProgress, setDragProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const nextFrame = () => {
    const newIndex = (currentIndex + 1) % frames.length;
    onFrameSelect(newIndex);
  };

  const prevFrame = () => {
    const newIndex = currentIndex === 0 ? frames.length - 1 : currentIndex - 1;
    onFrameSelect(newIndex);
  };

  const handleDragUpdate = (deltaX: number, progress: number) => {
    setDragOffset(deltaX);
    setDragProgress(progress);
  };

  const { handlers } = useSwipeNavigation({
    onSwipeLeft: nextFrame,
    onSwipeRight: prevFrame,
    onDragUpdate: handleDragUpdate,
    threshold: 100,
    velocityThreshold: 0.3
  });

  const getFrameStyle = (index: number) => {
    const distance = index - currentIndex;
    const dragFactor = dragProgress * 0.2;
    
    // Base positioning - more subtle spacing for desktop
    let translateX = distance * 70;
    let scale = 1;
    let opacity = 1;
    let zIndex = 1;

    if (distance === 0) {
      // Current frame - larger on desktop
      translateX += dragOffset * 0.6;
      scale = 1.1 - Math.abs(dragProgress) * 0.05;
      zIndex = 10;
    } else if (distance === -1) {
      // Previous frame
      translateX = -60 + dragOffset * 0.6;
      scale = 0.9 + dragProgress * 0.1;
      opacity = 0.6 + dragProgress * 0.4;
      zIndex = 5;
    } else if (distance === 1) {
      // Next frame
      translateX = 60 + dragOffset * 0.6;
      scale = 0.9 - dragProgress * 0.1;
      opacity = 0.6 - dragProgress * 0.4;
      zIndex = 5;
    } else {
      // Other frames
      opacity = 0;
      scale = 0.8;
      zIndex = 1;
    }

    return {
      transform: `translateX(${translateX}%) scale(${scale})`,
      opacity,
      zIndex,
      transition: dragOffset === 0 ? 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)' : 'none'
    };
  };

  return (
    <div 
      className="relative w-full h-full max-w-4xl overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main carousel container */}
      <div
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center"
        {...handlers}
        style={{ touchAction: 'pan-y pinch-zoom' }}
      >
        {frames.map((frame, index) => {
          const isVisible = Math.abs(index - currentIndex) <= 1;
          
          if (!isVisible) return null;

          return (
            <div
              key={frame.id}
              className="absolute w-96 h-[28rem] cursor-grab active:cursor-grabbing"
              style={getFrameStyle(index)}
              onClick={() => index !== currentIndex && onFrameSelect(index)}
            >
              <div className="w-full h-full transform-gpu">
                <FramePreview
                  frame={frame}
                  imageUrl={uploadedImage}
                  size="large"
                  isDragActive={isDragActive && index === currentIndex}
                />
                
                {/* Enhanced shadow for desktop */}
                <div 
                  className="absolute inset-0 rounded-lg shadow-2xl pointer-events-none"
                  style={{
                    boxShadow: index === currentIndex 
                      ? '0 30px 60px rgba(0, 0, 0, 0.3), 0 0 40px rgba(74, 222, 128, 0.1)'
                      : '0 20px 40px rgba(0, 0, 0, 0.2)'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop navigation arrows */}
      <div className={`absolute inset-y-0 left-4 flex items-center transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}>
        <button
          onClick={prevFrame}
          className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/40 transition-all duration-200 hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      <div className={`absolute inset-y-0 right-4 flex items-center transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}>
        <button
          onClick={nextFrame}
          className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/40 transition-all duration-200 hover:scale-110"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Desktop page indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {frames.map((_, index) => (
          <button
            key={index}
            onClick={() => onFrameSelect(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
              index === currentIndex
                ? 'bg-crd-green scale-125 shadow-lg shadow-crd-green/30'
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Subtle gradient edges */}
      <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-black/10 via-black/5 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-black/10 via-black/5 to-transparent pointer-events-none" />
    </div>
  );
};
