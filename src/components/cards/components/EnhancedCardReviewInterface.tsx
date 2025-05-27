
import React, { useState } from 'react';
import { CardDetectionResult } from '@/services/cardDetection';
import { ReviewCanvasControls } from './review/ReviewCanvasControls';
import { ReviewCanvas } from './review/ReviewCanvas';
import { ReviewImageNavigation } from './review/ReviewImageNavigation';
import { ReviewCardsSidebar } from './review/ReviewCardsSidebar';
import { useCanvasInteraction } from './review/useCanvasInteraction';

interface EnhancedCardReviewInterfaceProps {
  detectionResults: CardDetectionResult[];
  selectedCards: Set<string>;
  currentImageIndex: number;
  onImageIndexChange: (index: number) => void;
  onToggleCardSelection: (cardId: string) => void;
}

export const EnhancedCardReviewInterface: React.FC<EnhancedCardReviewInterfaceProps> = ({
  detectionResults,
  selectedCards,
  currentImageIndex,
  onImageIndexChange,
  onToggleCardSelection
}) => {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [showAllBoxes, setShowAllBoxes] = useState(true);

  const {
    zoom,
    pan,
    isDragging,
    handleZoomIn,
    handleZoomOut,
    resetView,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = useCanvasInteraction();

  const currentResult = detectionResults[currentImageIndex];
  const currentCards = currentResult?.detectedCards || [];
  const selectedCardsInCurrentImage = currentCards.filter(card => selectedCards.has(card.id)).length;

  const handleCardClick = (cardId: string | null) => {
    setSelectedCardId(cardId);
    if (cardId) {
      onToggleCardSelection(cardId);
    }
  };

  const handleCardSelect = (cardId: string) => {
    setSelectedCardId(cardId);
    onToggleCardSelection(cardId);
  };

  return (
    <div className="h-full flex bg-gray-900">
      <div className="flex-1 flex flex-col">
        <ReviewCanvasControls
          currentImageIndex={currentImageIndex}
          totalImages={detectionResults.length}
          totalCards={currentCards.length}
          selectedCount={selectedCardsInCurrentImage}
          showAllBoxes={showAllBoxes}
          zoom={zoom}
          onToggleShowAll={() => setShowAllBoxes(!showAllBoxes)}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetView={resetView}
        />

        <ReviewCanvas
          currentResult={currentResult}
          selectedCards={selectedCards}
          selectedCardId={selectedCardId}
          showAllBoxes={showAllBoxes}
          zoom={zoom}
          pan={pan}
          isDragging={isDragging}
          onCardClick={handleCardClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />

        <ReviewImageNavigation
          currentImageIndex={currentImageIndex}
          totalImages={detectionResults.length}
          onImageIndexChange={onImageIndexChange}
        />
      </div>

      <ReviewCardsSidebar
        cards={currentCards}
        selectedCards={selectedCards}
        selectedCardId={selectedCardId}
        onCardSelect={handleCardSelect}
      />
    </div>
  );
};
