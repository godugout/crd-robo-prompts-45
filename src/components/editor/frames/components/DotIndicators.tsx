
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
    <div className="flex justify-center space-x-2 mb-6">
      {Array.from({ length: totalFrames }, (_, index) => (
        <button
          key={index}
          className={`w-3 h-3 rounded-full transition-all ${
            index === currentIndex ? 'bg-crd-green' : 'bg-gray-600 hover:bg-gray-500'
          }`}
          onClick={() => onDotClick(index)}
        />
      ))}
    </div>
  );
};
