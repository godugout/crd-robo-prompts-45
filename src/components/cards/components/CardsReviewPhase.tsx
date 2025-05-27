
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { CardDetectionResult } from '@/services/cardDetection';

interface CardsReviewPhaseProps {
  detectionResults: CardDetectionResult[];
  selectedCards: Set<string>;
  onToggleCardSelection: (cardId: string) => void;
  onCreateSelectedCards: () => void;
  onStartOver: () => void;
}

export const CardsReviewPhase: React.FC<CardsReviewPhaseProps> = ({
  detectionResults,
  selectedCards,
  onToggleCardSelection,
  onCreateSelectedCards,
  onStartOver
}) => {
  const allDetectedCards = detectionResults.flatMap(result => result.detectedCards);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-semibold text-white mb-2">Review Detected Cards</h3>
          <p className="text-crd-lightGray">
            Found {allDetectedCards.length} cards • {selectedCards.size} selected
          </p>
          <p className="text-crd-lightGray text-sm mt-1">
            Cards have been automatically cropped to standard dimensions
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onStartOver}
            className="text-crd-lightGray border-crd-mediumGray"
          >
            Start Over
          </Button>
          <Button
            onClick={onCreateSelectedCards}
            disabled={selectedCards.size === 0}
            className="bg-crd-green hover:bg-crd-green/90 text-black"
          >
            Create {selectedCards.size} Cards
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allDetectedCards.map((card) => {
          const isSelected = selectedCards.has(card.id);
          
          return (
            <div
              key={card.id}
              className={`relative group border-2 rounded-lg transition-all p-4 ${
                isSelected 
                  ? 'border-crd-green bg-crd-green/10' 
                  : 'border-crd-mediumGray hover:border-crd-green/50'
              }`}
            >
              {/* Original vs Cropped comparison */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-crd-lightGray text-xs mb-1">Original</p>
                  <div className="aspect-video bg-editor-tool rounded overflow-hidden">
                    <img
                      src={card.originalImageUrl}
                      alt="Original"
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay showing detection bounds */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div 
                        className="absolute border-2 border-crd-green bg-crd-green/20"
                        style={{
                          left: `${(card.bounds.x / 800) * 100}%`,
                          top: `${(card.bounds.y / 600) * 100}%`,
                          width: `${(card.bounds.width / 800) * 100}%`,
                          height: `${(card.bounds.height / 600) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-crd-lightGray text-xs mb-1">Cropped Card</p>
                  <div className="aspect-[3/4] bg-editor-tool rounded overflow-hidden">
                    <img
                      src={card.croppedImageUrl}
                      alt={`Cropped card ${card.id}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Card info */}
              <div className="mb-3">
                <p className="text-white text-sm font-medium">{card.metadata.cardType || 'Card'}</p>
                <p className="text-crd-lightGray text-xs">
                  {Math.round(card.confidence * 100)}% confidence
                </p>
                <p className="text-crd-lightGray text-xs">
                  Dimensions: {Math.round(card.bounds.width)}×{Math.round(card.bounds.height)}px
                </p>
              </div>

              {/* Selection controls */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => onToggleCardSelection(card.id)}
                  className={`flex items-center gap-2 px-3 py-1 rounded text-sm transition-all ${
                    isSelected 
                      ? 'bg-crd-green text-black' 
                      : 'bg-crd-mediumGray text-white hover:bg-crd-lightGray'
                  }`}
                >
                  {isSelected ? <Check className="w-4 h-4" /> : <div className="w-4 h-4 border border-white rounded" />}
                  {isSelected ? 'Selected' : 'Select'}
                </button>

                <button
                  className="text-crd-lightGray hover:text-white text-xs opacity-50 cursor-not-allowed"
                  disabled
                  title="Crop adjustment coming soon"
                >
                  Adjust Crop
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
