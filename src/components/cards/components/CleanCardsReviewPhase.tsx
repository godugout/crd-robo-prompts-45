
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardDetectionInterface } from './CardDetectionInterface';
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

  const currentResult = detectionResults[currentImageIndex];
  const allDetectedCards = detectionResults.flatMap(result => result.detectedCards);

  const handleCardUpdate = (cardId: string, bounds: any) => {
    // Update card bounds - you can implement this based on your data structure
    console.log('Updating card bounds:', cardId, bounds);
  };

  const detectedCardsWithSelection = currentResult.detectedCards.map(card => ({
    ...card,
    selected: selectedCards.has(card.id)
  }));

  return (
    <div className="h-[80vh]">
      {/* Navigation for multiple images */}
      {detectionResults.length > 1 && (
        <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
          <h3 className="text-white font-medium">
            Image {currentImageIndex + 1} of {detectionResults.length}
          </h3>
          <div className="flex gap-2">
            {detectionResults.map((_, index) => (
              <Button
                key={index}
                variant={index === currentImageIndex ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentImageIndex(index)}
                className={index === currentImageIndex ? "bg-blue-600" : ""}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </div>
      )}

      <CardDetectionInterface
        originalImageUrl={currentResult.originalImageUrl}
        detectedCards={detectedCardsWithSelection}
        onCardUpdate={handleCardUpdate}
        onCardToggle={onToggleCardSelection}
        onFinalize={onCreateSelectedCards}
      />
    </div>
  );
};
