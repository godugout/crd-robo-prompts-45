
import React from 'react';
import { CardDetectionReviewControls } from './CardDetectionReviewControls';
import { CardDetectionGrid } from './CardDetectionGrid';
import { ExtractedCard } from '@/services/cardExtractor';

interface CardDetectionReviewStepProps {
  extractedCards: ExtractedCard[];
  selectedCards: Set<number>;
  viewMode: 'grid' | 'large';
  onCardToggle: (index: number) => void;
  onViewModeToggle: () => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
}

export const CardDetectionReviewStep = ({
  extractedCards,
  selectedCards,
  viewMode,
  onCardToggle,
  onViewModeToggle,
  onSelectAll,
  onClearSelection
}: CardDetectionReviewStepProps) => {
  return (
    <div className="h-full flex flex-col">
      <CardDetectionReviewControls
        extractedCards={extractedCards}
        selectedCards={selectedCards}
        viewMode={viewMode}
        onViewModeToggle={onViewModeToggle}
        onSelectAll={onSelectAll}
        onClearSelection={onClearSelection}
      />
      <CardDetectionGrid
        extractedCards={extractedCards}
        selectedCards={selectedCards}
        viewMode={viewMode}
        onCardToggle={onCardToggle}
      />
    </div>
  );
};
