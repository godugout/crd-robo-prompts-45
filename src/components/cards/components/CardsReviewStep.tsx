
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { DetectedCardsReview } from '@/components/catalog/DetectedCardsReview';
import { DetectedCard } from '@/services/cardCatalog/types';

interface CardsReviewStepProps {
  detectedCards: DetectedCard[];
  selectedCards: Set<string>;
  onCardToggle: (cardId: string) => void;
  onCardEdit: (cardId: string, bounds: DetectedCard['bounds']) => void;
  onReviewComplete: () => void;
  onStartOver: () => void;
}

export const CardsReviewStep: React.FC<CardsReviewStepProps> = ({
  detectedCards,
  selectedCards,
  onCardToggle,
  onCardEdit,
  onReviewComplete,
  onStartOver
}) => {
  console.log('CardsReviewStep rendering with:', {
    detectedCardsLength: detectedCards.length,
    selectedCardsSize: selectedCards.size
  });

  if (!detectedCards || detectedCards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-crd-lightGray mb-4">No cards detected to review</p>
        <Button
          variant="outline"
          onClick={onStartOver}
          className="text-crd-lightGray border-crd-mediumGray hover:text-white"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Review Detected Cards</h3>
        <p className="text-crd-lightGray mb-4">
          Found {detectedCards.length} cards! Select the ones you want to add to your collection.
        </p>
        <Button
          variant="outline"
          onClick={onStartOver}
          className="text-crd-lightGray border-crd-mediumGray hover:text-white"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Start Over
        </Button>
      </div>

      <DetectedCardsReview
        detectedCards={detectedCards}
        selectedCards={selectedCards}
        onCardToggle={onCardToggle}
        onCardEdit={onCardEdit}
        onCreateSelected={onReviewComplete}
        onClearAll={onStartOver}
      />
    </div>
  );
};
