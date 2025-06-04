
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CardNavigationControlsProps {
  currentCardIndex: number;
  totalCards: number;
  onPreviousCard: () => void;
  onNextCard: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

export const CardNavigationControls: React.FC<CardNavigationControlsProps> = ({
  currentCardIndex,
  totalCards,
  onPreviousCard,
  onNextCard,
  canGoPrev,
  canGoNext
}) => {
  if (totalCards <= 1) return null;

  return (
    <div className="bg-black bg-opacity-80 backdrop-blur-lg rounded-lg p-3 border border-white/10">
      <div className="flex items-center space-x-2">
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
