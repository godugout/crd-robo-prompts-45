
import React from 'react';
import { ViewerControls } from './ViewerControls';
import { CardNavigationControls } from './CardNavigationControls';

interface ViewerTopControlsProps {
  showEffects: boolean;
  autoRotate: boolean;
  onToggleEffects: () => void;
  onToggleAutoRotate: () => void;
  onReset: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  currentCardIndex: number;
  totalCards: number;
  onPreviousCard: () => void;
  onNextCard: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

export const ViewerTopControls: React.FC<ViewerTopControlsProps> = ({
  showEffects,
  autoRotate,
  onToggleEffects,
  onToggleAutoRotate,
  onReset,
  onZoomIn,
  onZoomOut,
  currentCardIndex,
  totalCards,
  onPreviousCard,
  onNextCard,
  canGoPrev,
  canGoNext
}) => {
  return (
    <div className="absolute top-4 left-4 right-4 z-10 flex items-start justify-between">
      {/* Basic Controls - Top Left */}
      <ViewerControls
        showEffects={showEffects}
        autoRotate={autoRotate}
        onToggleEffects={onToggleEffects}
        onToggleAutoRotate={onToggleAutoRotate}
        onReset={onReset}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
      />

      {/* Card Navigation Controls - Top Right */}
      <CardNavigationControls
        currentCardIndex={currentCardIndex}
        totalCards={totalCards}
        onPreviousCard={onPreviousCard}
        onNextCard={onNextCard}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
      />
    </div>
  );
};
