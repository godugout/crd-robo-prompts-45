
import React from 'react';

interface DotIndicatorsProps {
  totalFrames: number;
  currentIndex: number;
  onDotClick: (index: number) => void;
}

export const DotIndicators: React.FC<DotIndicatorsProps> = ({
  totalFrames,
  currentIndex,
  onDotClick
}) => {
  return (
    <div className="flex justify-center mt-8">
      <div className="flex space-x-3">
        {Array.from({ length: totalFrames }, (_, index) => (
          <button
            key={index}
            onClick={() => onDotClick(index)}
            className={`w-3 h-3 rounded-full transition-all duration-500 ease-out transform hover:scale-125 ${
              index === currentIndex
                ? 'bg-crd-green shadow-lg scale-110 animate-pulse'
                : 'bg-crd-mediumGray hover:bg-crd-lightGray opacity-60 hover:opacity-100'
            }`}
            style={{ 
              willChange: 'transform, opacity',
              transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
            aria-label={`Go to frame ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
