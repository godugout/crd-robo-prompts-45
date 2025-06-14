
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FrameCarouselControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  position?: 'center' | 'edge';
}

export const FrameCarouselControls: React.FC<FrameCarouselControlsProps> = ({
  onPrevious,
  onNext,
  position = 'edge'
}) => {
  if (position === 'edge') {
    return (
      <>
        <button
          onClick={onPrevious}
          className="fixed left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black/30 hover:bg-black/50 rounded-full transition-all opacity-60 hover:opacity-100"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        
        <button
          onClick={onNext}
          className="fixed right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black/30 hover:bg-black/50 rounded-full transition-all opacity-60 hover:opacity-100"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </>
    );
  }

  // Fallback to center positioning if needed
  return (
    <>
      <button
        onClick={onPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </>
  );
};
