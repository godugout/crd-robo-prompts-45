
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FullPageOverlay } from '@/components/overlay/FullPageOverlay';
import { EnhancedCardReviewInterface } from './EnhancedCardReviewInterface';
import { CardDetectionResult } from '@/services/cardDetection';

interface CleanCardsReviewPhaseProps {
  detectionResults: CardDetectionResult[];
  selectedCards: Set<string>;
  onToggleCardSelection: (cardId: string) => void;
  onCreateSelectedCards: () => void;
  onStartOver: () => void;
}

export const CleanCardsReviewPhase: React.FC<CleanCardsReviewPhaseProps> = ({
  detectionResults,
  selectedCards,
  onToggleCardSelection,
  onCreateSelectedCards,
  onStartOver
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(true);

  if (!detectionResults.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-4">No detection results to review</p>
        <Button onClick={onStartOver} variant="outline">
          Start Over
        </Button>
      </div>
    );
  }

  const allDetectedCards = detectionResults.flatMap(result => result.detectedCards);
  const selectedCount = allDetectedCards.filter(card => selectedCards.has(card.id)).length;

  const handleSelectAll = () => {
    allDetectedCards.forEach(card => {
      if (!selectedCards.has(card.id)) {
        onToggleCardSelection(card.id);
      }
    });
  };

  const handleDeselectAll = () => {
    allDetectedCards.forEach(card => {
      if (selectedCards.has(card.id)) {
        onToggleCardSelection(card.id);
      }
    });
  };

  return (
    <>
      {/* Compact Summary View */}
      <div className="p-6 text-center">
        <h3 className="text-2xl font-semibold text-white mb-4">Review Detected Cards</h3>
        <p className="text-crd-lightGray mb-6">
          Found {allDetectedCards.length} cards across {detectionResults.length} images • {selectedCount} selected
        </p>
        
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => setIsFullScreenOpen(true)}
            className="bg-crd-green hover:bg-crd-green/90 text-black"
          >
            Open Full Review Interface
          </Button>
          <Button
            variant="outline"
            onClick={onStartOver}
            className="text-crd-lightGray border-crd-mediumGray"
          >
            Start Over
          </Button>
        </div>
      </div>

      {/* Full-Screen Enhanced Review Interface */}
      <FullPageOverlay
        isOpen={isFullScreenOpen}
        onClose={() => setIsFullScreenOpen(false)}
        title="Card Detection Review"
        actions={
          <div className="flex items-center gap-4">
            <span className="text-gray-300 text-sm">
              {selectedCount} of {allDetectedCards.length} cards selected
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="text-gray-300"
            >
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeselectAll}
              className="text-gray-300"
            >
              Deselect All
            </Button>
            <Button
              onClick={onCreateSelectedCards}
              disabled={selectedCount === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              Create {selectedCount} Cards
            </Button>
          </div>
        }
      >
        <EnhancedCardReviewInterface
          detectionResults={detectionResults}
          selectedCards={selectedCards}
          currentImageIndex={currentImageIndex}
          onImageIndexChange={setCurrentImageIndex}
          onToggleCardSelection={onToggleCardSelection}
        />
      </FullPageOverlay>
    </>
  );
};
