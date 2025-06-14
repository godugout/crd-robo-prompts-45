
import React, { useState, useRef } from 'react';
import { FramePreview } from './FramePreview';
import { CarouselNavigationArrows } from './CarouselNavigationArrows';
import { CarouselBottomIndicator } from './CarouselBottomIndicator';
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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
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
    threshold: 120,
    velocityThreshold: 0.3
  });

  const getFrameStyle = (index: number) => {
    const distance = index - currentIndex;
    
    // Better spacing calculations for non-overlapping frames
    let translateX = distance * 85; // Increased base spacing
    let scale = 1;
    let opacity = 1;
    let zIndex = 1;
    let blur = 0;

    if (distance === 0) {
      // Current frame
      translateX += dragOffset * 0.5;
      scale = 1.05;
      zIndex = 20;
    } else if (Math.abs(distance) === 1) {
      // Adjacent frames
      translateX = distance > 0 ? 80 + dragOffset * 0.5 : -80 + dragOffset * 0.5;
      scale = 0.85;
      opacity = 0.7;
      zIndex = 10;
    } else if (Math.abs(distance) === 2) {
      // Second-level frames
      translateX = distance > 0 ? 140 : -140;
      scale = 0.7;
      opacity = 0.4;
      blur = 1;
      zIndex = 5;
    } else {
      // Hidden frames
      opacity = 0;
      scale = 0.6;
      zIndex = 1;
    }

    // Hover effect
    if (hoveredIndex === index && distance !== 0) {
      scale += 0.05;
      opacity = Math.min(1, opacity + 0.2);
    }

    return {
      transform: `translateX(${translateX}%) scale(${scale})`,
      opacity,
      zIndex,
      filter: blur > 0 ? `blur(${blur}px)` : 'none',
      transition: dragOffset === 0 && hoveredIndex !== index 
        ? 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)' 
        : hoveredIndex === index 
        ? 'all 0.2s ease-out'
        : 'none'
    };
  };

  return (
    <div 
      className="relative w-full h-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredIndex(null);
      }}
    >
      {/* Main carousel container */}
      <div
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center"
        {...handlers}
        style={{ touchAction: 'pan-y pinch-zoom' }}
      >
        {frames.map((frame, index) => {
          const isVisible = Math.abs(index - currentIndex) <= 2;
          
          if (!isVisible) return null;

          return (
            <div
              key={frame.id}
              className="absolute w-72 h-96 xl:w-80 xl:h-[26rem] 2xl:w-[22rem] 2xl:h-[28rem] cursor-grab active:cursor-grabbing"
              style={getFrameStyle(index)}
              onClick={() => index !== currentIndex && onFrameSelect(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="w-full h-full transform-gpu relative">
                <FramePreview
                  frame={frame}
                  imageUrl={uploadedImage}
                  size="large"
                  isDragActive={isDragActive && index === currentIndex}
                />
                
                {/* Enhanced shadow effects */}
                <div 
                  className="absolute inset-0 rounded-lg pointer-events-none transition-all duration-300"
                  style={{
                    boxShadow: index === currentIndex 
                      ? '0 25px 50px rgba(0, 0, 0, 0.25), 0 0 30px rgba(74, 222, 128, 0.08)'
                      : hoveredIndex === index
                      ? '0 15px 30px rgba(0, 0, 0, 0.2), 0 0 15px rgba(74, 222, 128, 0.05)'
                      : '0 10px 20px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <CarouselNavigationArrows
        isHovered={isHovered}
        onPrevFrame={prevFrame}
        onNextFrame={nextFrame}
      />

      <CarouselBottomIndicator
        currentIndex={currentIndex}
        totalFrames={frames.length}
        onFrameSelect={onFrameSelect}
      />

      {/* Subtle gradient edges */}
      <div className="absolute left-0 top-0 w-24 xl:w-32 h-full bg-gradient-to-r from-black/6 via-black/3 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 w-24 xl:w-32 h-full bg-gradient-to-l from-black/6 via-black/3 to-transparent pointer-events-none" />
    </div>
  );
};
