
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, RotateCcw, Save } from 'lucide-react';
import { toast } from 'sonner';
import type { CardDetectionResult } from '@/services/cardDetection';

interface DetectedCardsGridProps {
  results: CardDetectionResult[];
  onStartOver: () => void;
}

export const DetectedCardsGrid: React.FC<DetectedCardsGridProps> = ({
  results,
  onStartOver
}) => {
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  
  const totalCards = results.reduce((sum, result) => sum + result.detectedCards.length, 0);

  const toggleCardSelection = (cardId: string) => {
    setSelectedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    const allCardIds = results.flatMap(result => 
      result.detectedCards.map(card => card.id)
    );
    setSelectedCards(new Set(allCardIds));
  };

  const clearSelection = () => {
    setSelectedCards(new Set());
  };

  const saveSelectedCards = () => {
    if (selectedCards.size === 0) {
      toast.warning('Please select at least one card to save');
      return;
    }
    
    toast.success(`Saving ${selectedCards.size} selected cards to your collection...`);
    // Here you would implement the actual save functionality
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Detected Cards</h2>
        <p className="text-crd-lightGray">
          Found {totalCards} trading cards across {results.length} images
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={selectAll}
            className="text-white border-crd-mediumGray hover:border-crd-green"
          >
            Select All ({totalCards})
          </Button>
          <Button
            variant="outline"
            onClick={clearSelection}
            className="text-white border-crd-mediumGray hover:border-red-500"
          >
            Clear Selection
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onStartOver}
            className="text-white border-crd-mediumGray hover:border-crd-green"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Start Over
          </Button>
          <Button
            onClick={saveSelectedCards}
            className="bg-crd-green hover:bg-crd-green/90 text-black"
            disabled={selectedCards.size === 0}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Selected ({selectedCards.size})
          </Button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {results.map((result) =>
          result.detectedCards.map((card) => {
            const isSelected = selectedCards.has(card.id);
            
            return (
              <Card
                key={card.id}
                className={`relative cursor-pointer transition-all ${
                  isSelected 
                    ? 'ring-2 ring-crd-green bg-crd-green/10' 
                    : 'hover:ring-1 hover:ring-crd-lightGray'
                }`}
                onClick={() => toggleCardSelection(card.id)}
              >
                <div className="aspect-[2.5/3.5] bg-black rounded-lg overflow-hidden">
                  <img
                    src={card.croppedImageUrl}
                    alt={`Detected card ${card.id}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="w-6 h-6 text-crd-green bg-black rounded-full" />
                    </div>
                  )}
                  
                  {/* Confidence Badge */}
                  <div className="absolute bottom-2 left-2">
                    <span className="px-2 py-1 bg-black/80 text-white text-xs rounded">
                      {Math.round(card.confidence * 100)}%
                    </span>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Summary */}
      <div className="text-center text-crd-lightGray text-sm">
        <p>
          {selectedCards.size} of {totalCards} cards selected
        </p>
      </div>
    </div>
  );
};
