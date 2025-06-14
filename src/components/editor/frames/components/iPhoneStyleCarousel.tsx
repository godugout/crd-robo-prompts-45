import React, { useState, useRef } from 'react';
import { FramePreview } from './FramePreview';
import { useSwipeNavigation } from '../hooks/useSwipeNavigation';
import type { MinimalistFrame } from '../data/minimalistFrames';

interface iPhoneStyleCarouselProps {
  frames: MinimalistFrame[];
  currentIndex: number;
  uploadedImage?: string;
  onFrameSelect: (index: number) => void;
  isDragActive: boolean;
}

export const iPhoneStyleCarousel: React.FC<iPhoneStyleCarouselProps> = ({
  frames,
  currentIndex,
  uploadedImage,
  onFrameSelect,
  isDragActive
}) => {
  const [dragOffset, setDragOffset] = useState(0);
  const [dragProgress, setDragProgress] = useState(0);
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
    threshold: 80,
    velocityThreshold: 0.3
  });

  const getFrameStyle = (index: number) => {
    const distance = index - currentIndex;
    const dragFactor = dragProgress * 0.3;
    
    // Base positioning
    let translateX = distance * 100;
    let scale = 1;
    let opacity = 1;
    let zIndex = 1;

    if (distance === 0) {
      // Current frame
      translateX += dragOffset * 0.8;
      scale = 1 - Math.abs(dragProgress) * 0.05;
      zIndex = 10;
    } else if (distance === -1) {
      // Previous frame
      translateX = -85 + dragOffset * 0.8;
      scale = 0.85 + dragProgress * 0.1;
      opacity = 0.7 + dragProgress * 0.3;
      zIndex = 5;
    } else if (distance === 1) {
      // Next frame
      translateX = 85 + dragOffset * 0.8;
      scale = 0.85 - dragProgress * 0.1;
      opacity = 0.7 - dragProgress * 0.3;
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
      transition: dragOffset === 0 ? 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)' : 'none'
    };
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Main carousel container */}
      <div
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center px-8"
        {...handlers}
        style={{ touchAction: 'pan-y pinch-zoom' }}
      >
        {frames.map((frame, index) => {
          const isVisible = Math.abs(index - currentIndex) <= 1;
          
          if (!isVisible) return null;

          return (
            <div
              key={frame.id}
              className="absolute w-72 h-96 cursor-grab active:cursor-grabbing"
              style={getFrameStyle(index)}
            >
              <div className="w-full h-full transform-gpu">
                <FramePreview
                  frame={frame}
                  imageUrl={uploadedImage}
                  size="large"
                  isDragActive={isDragActive && index === currentIndex}
                />
                
                {/* Shadow for depth */}
                <div 
                  className="absolute inset-0 rounded-lg shadow-2xl pointer-events-none"
                  style={{
                    boxShadow: index === currentIndex 
                      ? '0 25px 50px rgba(0, 0, 0, 0.25)'
                      : '0 15px 30px rgba(0, 0, 0, 0.15)'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Subtle page indicators */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 transition-opacity duration-300 ${
        Math.abs(dragOffset) > 10 ? 'opacity-100' : 'opacity-0'
      }`}>
        {frames.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white scale-125'
                : 'bg-white/40 scale-100'
            }`}
          />
        ))}
      </div>

      {/* Edge peek shadows for depth */}
      <div className="absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-black/5 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-black/5 to-transparent pointer-events-none" />
    </div>
  );
};
