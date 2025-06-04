
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CardNavigationControlsProps {
  hasMultipleCards: boolean;
  canGoPrev: boolean;
  canGoNext: boolean;
  currentCardIndex: number;
  totalCards: number;
  onPreviousCard: () => void;
  onNextCard: () => void;
}

export const CardNavigationControls: React.FC<CardNavigationControlsProps> = ({
  hasMultipleCards,
  canGoPrev,
  canGoNext,
  currentCardIndex,
  totalCards,
  onPreviousCard,
  onNextCard
}) => {
  if (!hasMultipleCards) return null;

  return (
    <div className="absolute bottom-4 right-4 z-10">
      <div className="flex items-center space-x-2 bg-black bg-opacity-80 backdrop-blur-lg rounded-lg p-3 border border-white/10">
        <Button
          variant="ghost"
          size="sm"
          onClick={onPreviousCard}
          disabled={!canGoPrev}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <div className="text-white text-sm px-3">
          {currentCardIndex + 1} / {totalCards}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onNextCard}
          disabled={!canGoNext}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
