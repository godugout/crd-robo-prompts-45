
import React from 'react';

interface CarouselBottomIndicatorProps {
  currentIndex: number;
  totalFrames: number;
  onFrameSelect: (index: number) => void;
}

export const CarouselBottomIndicator: React.FC<CarouselBottomIndicatorProps> = ({
  currentIndex,
  totalFrames,
  onFrameSelect
}) => {
  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/40 backdrop-blur-md rounded-full px-4 py-2 flex items-center space-x-3">
      <span className="text-white text-sm font-medium">
        {currentIndex + 1} / {totalFrames}
      </span>
      <div className="w-px h-4 bg-white/30"></div>
      {Array.from({ length: Math.min(5, totalFrames) }).map((_, index) => (
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
      {totalFrames > 5 && (
        <span className="text-white/60 text-xs">...</span>
      )}
    </div>
  );
};
