
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationControlsProps {
  onPrevious: () => void;
  onNext: () => void;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  onPrevious,
  onNext
}) => {
  return (
    <>
      <button
        onClick={onPrevious}
        className="fixed left-4 top-1/2 transform -translate-y-1/2 z-20 p-4 bg-black/20 hover:bg-black/40 rounded-full transition-all duration-300 opacity-50 hover:opacity-100 backdrop-blur-sm border border-white/10 hover:scale-110 group"
        style={{ willChange: 'transform, opacity' }}
      >
        <ChevronLeft className="w-6 h-6 text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
      </button>
      
      <button
        onClick={onNext}
        className="fixed right-4 top-1/2 transform -translate-y-1/2 z-20 p-4 bg-black/20 hover:bg-black/40 rounded-full transition-all duration-300 opacity-50 hover:opacity-100 backdrop-blur-sm border border-white/10 hover:scale-110 group"
        style={{ willChange: 'transform, opacity' }}
      >
        <ChevronRight className="w-6 h-6 text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
      </button>
    </>
  );
};
