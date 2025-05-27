
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface DetectedCardsReviewHeaderProps {
  totalCards: number;
  selectedCardsCount: number;
  onSelectAll: () => void;
  onClearAll: () => void;
  onCreateSelected: () => void;
}

export const DetectedCardsReviewHeader: React.FC<DetectedCardsReviewHeaderProps> = ({
  totalCards,
  selectedCardsCount,
  onSelectAll,
  onClearAll,
  onCreateSelected
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-white font-medium text-lg mb-2">
          Review Detected Cards ({totalCards})
        </h3>
        <p className="text-crd-lightGray text-sm">
          Select cards to create and adjust detection boundaries if needed
        </p>
      </div>
      
      <div className="flex gap-3">
        <Button
          onClick={onSelectAll}
          variant="outline"
          className="border-editor-border text-white"
        >
          Select All
        </Button>
        <Button
          onClick={onClearAll}
          variant="outline"
          className="border-red-500 text-red-500 hover:bg-red-500/10"
        >
          Clear All
        </Button>
        <Button
          onClick={onCreateSelected}
          disabled={selectedCardsCount === 0}
          className="bg-crd-green hover:bg-crd-green/80 text-black font-medium"
        >
          <Check className="w-4 h-4 mr-2" />
          Create {selectedCardsCount} Cards
        </Button>
      </div>
    </div>
  );
};
