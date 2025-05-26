
import React from 'react';
import { CardDetectionUploadStep } from './CardDetectionUploadStep';
import { EnhancedExtractedCardsView } from './EnhancedExtractedCardsView';
import { PreciseCardCanvas } from '@/components/card-editor/PreciseCardCanvas';
import { InteractiveCardToolbar } from '@/components/card-editor/InteractiveCardToolbar';
import type { 
  EnhancedDialogStep, 
  ManualRegion, 
  DragState 
} from '../hooks/types';
import type { ExtractedCard } from '@/services/cardExtractor';
import { CardAdjustment } from '@/components/card-editor/InteractiveCardToolbar';

interface DetectedCard extends ManualRegion {
  adjustment: CardAdjustment;
}

interface EnhancedDialogStepContentProps {
  currentStep: EnhancedDialogStep;
  isProcessing: boolean;
  originalImage: HTMLImageElement | null;
  detectedCards: DetectedCard[];
  selectedCardId: string | null;
  activeMode: 'move' | 'crop' | 'rotate' | null;
  extractedCards: ExtractedCard[];
  onImageDrop: (file: File) => void;
  onCardSelect: (cardId: string) => void;
  onCardUpdate: (cardId: string, updates: Partial<DetectedCard>) => void;
  onAdjustmentChange: (adjustment: CardAdjustment) => void;
  onConfirmAdjustment: () => void;
  onCancelAdjustment: () => void;
  setActiveMode: (mode: 'move' | 'crop' | 'rotate' | null) => void;
}

export const EnhancedDialogStepContent = ({
  currentStep,
  isProcessing,
  originalImage,
  detectedCards,
  selectedCardId,
  activeMode,
  extractedCards,
  onImageDrop,
  onCardSelect,
  onCardUpdate,
  onAdjustmentChange,
  onConfirmAdjustment,
  onCancelAdjustment,
  setActiveMode
}: EnhancedDialogStepContentProps) => {
  if (currentStep === 'upload') {
    return (
      <CardDetectionUploadStep 
        isProcessing={isProcessing}
        onImageDrop={onImageDrop}
      />
    );
  }

  if ((currentStep === 'detect' || currentStep === 'refine') && originalImage) {
    const selectedCard = detectedCards.find(c => c.id === selectedCardId);
    
    return (
      <div className="h-full flex">
        {/* Canvas Area */}
        <div className="flex-1 p-4">
          <PreciseCardCanvas
            image={originalImage}
            detectedCards={detectedCards}
            selectedCardId={selectedCardId}
            activeMode={activeMode}
            onCardSelect={onCardSelect}
            onCardUpdate={onCardUpdate}
            className="h-full"
          />
        </div>
        
        {/* Toolbar */}
        <div className="w-80 border-l border-gray-700 bg-gray-800 p-4">
          <h3 className="text-white font-medium mb-4">
            Card Editor
            {selectedCard && (
              <span className="text-sm text-gray-400 block">
                Card {detectedCards.indexOf(selectedCard) + 1} of {detectedCards.length}
              </span>
            )}
          </h3>
          
          {selectedCard ? (
            <InteractiveCardToolbar
              adjustment={selectedCard.adjustment}
              onAdjustmentChange={onAdjustmentChange}
              onConfirm={onConfirmAdjustment}
              onCancel={onCancelAdjustment}
              disabled={isProcessing}
            />
          ) : (
            <div className="text-center text-gray-400 py-8">
              <p>Select a card on the canvas to edit it</p>
            </div>
          )}
          
          {/* Card List */}
          <div className="mt-6">
            <h4 className="text-white text-sm font-medium mb-2">
              Detected Cards ({detectedCards.length})
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {detectedCards.map((card, index) => (
                <div
                  key={card.id}
                  className={`p-2 rounded cursor-pointer transition-colors ${
                    card.id === selectedCardId
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  onClick={() => onCardSelect(card.id)}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Card {index + 1}</span>
                    <span className="text-xs">
                      {Math.round(card.confidence * 100)}%
                    </span>
                  </div>
                  <div className="text-xs opacity-75">
                    {Math.round(card.width)} × {Math.round(card.height)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'extract') {
    return <EnhancedExtractedCardsView extractedCards={extractedCards} />;
  }

  return null;
};
