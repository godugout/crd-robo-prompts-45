
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FrameCarouselControlsProps {
  onPrevious: () => void;
  onNext: () => void;
}

export const FrameCarouselControls: React.FC<FrameCarouselControlsProps> = ({
  onPrevious,
  onNext
}) => {
  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
        onClick={onPrevious}
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
        onClick={onNext}
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </>
  );
};
