
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselNavigationArrowsProps {
  isHovered: boolean;
  onPrevFrame: () => void;
  onNextFrame: () => void;
}

export const CarouselNavigationArrows: React.FC<CarouselNavigationArrowsProps> = ({
  isHovered,
  onPrevFrame,
  onNextFrame
}) => {
  return (
    <>
      {/* Left Arrow */}
      <div className={`absolute inset-y-0 left-0 flex items-center transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-60'
      }`}>
        <button
          onClick={onPrevFrame}
          className="w-12 h-12 xl:w-14 xl:h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-all duration-200 hover:scale-110 ml-8"
        >
          <ChevronLeft className="w-5 h-5 xl:w-6 xl:h-6" />
        </button>
      </div>

      {/* Right Arrow */}
      <div className={`absolute inset-y-0 right-0 flex items-center transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-60'
      }`}>
        <button
          onClick={onNextFrame}
          className="w-12 h-12 xl:w-14 xl:h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-all duration-200 hover:scale-110 mr-8"
        >
          <ChevronRight className="w-5 h-5 xl:w-6 xl:h-6" />
        </button>
      </div>
    </>
  );
};
