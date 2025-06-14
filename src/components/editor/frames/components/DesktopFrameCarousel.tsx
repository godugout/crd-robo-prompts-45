
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
    const dragFactor = dragProgress * 0.15;
    
    // Improved positioning with better spacing to prevent overlap
    let translateX = distance * 75; // Increased spacing from 55 to 75
    let scale = 1;
    let opacity = 1;
    let zIndex = 1;
    let blur = 0;

    if (distance === 0) {
      // Current frame - centered and prominent
      translateX += dragOffset * 0.5;
      scale = 1.1 - Math.abs(dragProgress) * 0.03; // Reduced from 1.2 to 1.1
      zIndex = 20;
    } else if (Math.abs(distance) === 1) {
      // Adjacent frames - better spaced
      translateX = distance > 0 
        ? 70 + dragOffset * 0.5  // Increased from 45 to 70
        : -70 + dragOffset * 0.5; // Increased from -45 to -70
      scale = 0.9 + (distance < 0 ? dragProgress * 0.08 : -dragProgress * 0.08);
      opacity = 0.8 + (Math.abs(dragProgress) * 0.2);
      zIndex = 10;
    } else if (Math.abs(distance) === 2) {
      // Second-level frames - more spaced out
      translateX = distance > 0 ? 130 : -130; // Increased from 85 to 130
      scale = 0.75; // Reduced from 0.8 to 0.75
      opacity = 0.3; // Reduced from 0.4 to 0.3
      blur = 1;
      zIndex = 5;
    } else {
      // Hidden frames
      opacity = 0;
      scale = 0.7;
      zIndex = 1;
    }

    // Hover effect for adjacent frames
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
      className="relative w-full h-full overflow-hidden" // Removed max-w-6xl constraint
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
              className="absolute w-80 h-[28rem] xl:w-[22rem] xl:h-[30rem] 2xl:w-[24rem] 2xl:h-[32rem] cursor-grab active:cursor-grabbing" // Reduced sizes
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
                
                {/* Enhanced shadow and glow effects */}
                <div 
                  className="absolute inset-0 rounded-lg pointer-events-none transition-all duration-300"
                  style={{
                    boxShadow: index === currentIndex 
                      ? '0 30px 60px rgba(0, 0, 0, 0.3), 0 0 40px rgba(74, 222, 128, 0.1)' // Reduced shadow intensity
                      : hoveredIndex === index
                      ? '0 20px 40px rgba(0, 0, 0, 0.25), 0 0 20px rgba(74, 222, 128, 0.08)'
                      : '0 15px 30px rgba(0, 0, 0, 0.15)' // Reduced shadow intensity
                  }}
                />

                {/* Frame number indicator for non-current frames */}
                {index !== currentIndex && (
                  <div className="absolute top-4 left-4 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {index + 1}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced navigation arrows */}
      <div className={`absolute inset-y-0 left-0 flex items-center transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-60'
      }`}>
        <button
          onClick={prevFrame}
          className="w-12 h-12 xl:w-14 xl:h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-all duration-200 hover:scale-110 ml-6" // Increased margin
        >
          <ChevronLeft className="w-5 h-5 xl:w-6 xl:h-6" />
        </button>
      </div>

      <div className={`absolute inset-y-0 right-0 flex items-center transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-60'
      }`}>
        <button
          onClick={nextFrame}
          className="w-12 h-12 xl:w-14 xl:h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-all duration-200 hover:scale-110 mr-6" // Increased margin
        >
          <ChevronRight className="w-5 h-5 xl:w-6 xl:h-6" />
        </button>
      </div>

      {/* Frame counter and quick navigation */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/40 backdrop-blur-md rounded-full px-4 py-2 flex items-center space-x-3">
        <span className="text-white text-sm font-medium">
          {currentIndex + 1} / {frames.length}
        </span>
        <div className="w-px h-4 bg-white/30"></div>
        {frames.slice(0, 5).map((_, index) => (
          <button
            key={index}
            onClick={() => onFrameSelect(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 hover:scale-125 ${
              index === currentIndex
                ? 'bg-crd-green scale-125 shadow-lg shadow-crd-green/30'
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
        {frames.length > 5 && (
          <span className="text-white/60 text-xs">...</span>
        )}
      </div>

      {/* Subtle gradient edges for depth */}
      <div className="absolute left-0 top-0 w-20 xl:w-28 h-full bg-gradient-to-r from-black/6 via-black/3 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 w-20 xl:w-28 h-full bg-gradient-to-l from-black/6 via-black/3 to-transparent pointer-events-none" />
    </div>
  );
};
