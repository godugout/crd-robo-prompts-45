
import React from 'react';
import { EnhancedUploadZone } from './EnhancedUploadZone';
import { EnhancedDetectionView } from './EnhancedDetectionView';
import { ManualAdjustmentInterface } from '@/components/cards/detection/ManualAdjustmentInterface';
import { ExtractedCardsPreview } from './ExtractedCardsPreview';
import type { ExtractedCard } from '@/services/cardExtractor';
import { CardAdjustment } from '@/components/card-editor/InteractiveCardToolbar';

interface DetectedCard {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  adjustment: CardAdjustment;
  edgeStrength?: number;
  geometryScore?: number;
}

interface EnhancedDialogStepContentProps {
  currentStep: 'upload' | 'detect' | 'refine' | 'extract';
  isProcessing: boolean;
  originalImage: HTMLImageElement | null;
  detectedCards: DetectedCard[];
  selectedCardId: string | null;
  activeMode: 'move' | 'crop' | 'rotate' | null;
  extractedCards: ExtractedCard[];
  onImageDrop: (file: File) => void;
  onCardSelect: (cardId: string | null) => void;
  onCardUpdate: (cardId: string, updates: Partial<DetectedCard>) => void;
  onAdjustmentChange: (adjustment: CardAdjustment) => void;
  onConfirmAdjustment: () => void;
  onCancelAdjustment: () => void;
  setActiveMode: (mode: 'move' | 'crop' | 'rotate' | null) => void;
}

export const EnhancedDialogStepContent: React.FC<EnhancedDialogStepContentProps> = ({
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
}) => {
  if (currentStep === 'upload') {
    return (
      <EnhancedUploadZone
        onImageDrop={onImageDrop}
        isProcessing={isProcessing}
      />
    );
  }

  if (currentStep === 'detect') {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-crd-green border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="text-white font-medium">Running Advanced Card Detection</div>
          <div className="text-crd-lightGray text-sm">
            Using edge detection, contour analysis, and perspective correction...
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'refine') {
    if (!originalImage) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-crd-lightGray">No image loaded</div>
        </div>
      );
    }

    return (
      <div className="h-full">
        <ManualAdjustmentInterface
          image={originalImage}
          regions={detectedCards}
          selectedRegionId={selectedCardId}
          onRegionUpdate={onCardUpdate}
          onRegionSelect={onCardSelect}
          onConfirmAdjustment={onConfirmAdjustment}
          onCancelAdjustment={onCancelAdjustment}
        />
      </div>
    );
  }

  if (currentStep === 'extract') {
    return (
      <ExtractedCardsPreview
        extractedCards={extractedCards}
        isProcessing={isProcessing}
      />
    );
  }

  return null;
};
