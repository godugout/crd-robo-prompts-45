
import React from 'react';
import { CardDetectionUploadStep } from './CardDetectionUploadStep';
import { EnhancedCanvasRegionEditor } from './EnhancedCanvasRegionEditor';
import { EnhancedExtractedCardsView } from './EnhancedExtractedCardsView';
import type { 
  EnhancedDialogStep, 
  ManualRegion, 
  DragState 
} from '../hooks/useEnhancedCardDetection';
import type { ExtractedCard } from '@/services/cardExtractor';

interface EnhancedDialogStepContentProps {
  currentStep: EnhancedDialogStep;
  isProcessing: boolean;
  originalImage: HTMLImageElement | null;
  detectedRegions: ManualRegion[];
  selectedRegions: Set<string>;
  isEditMode: boolean;
  dragState: DragState;
  extractedCards: ExtractedCard[];
  onImageDrop: (file: File) => void;
  onRegionToggle: (regionId: string) => void;
  onCanvasMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onCanvasMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onCanvasMouseUp: () => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  setSelectedRegions: (regions: Set<string>) => void;
}

export const EnhancedDialogStepContent = ({
  currentStep,
  isProcessing,
  originalImage,
  detectedRegions,
  selectedRegions,
  isEditMode,
  dragState,
  extractedCards,
  onImageDrop,
  onRegionToggle,
  onCanvasMouseDown,
  onCanvasMouseMove,
  onCanvasMouseUp,
  onSelectAll,
  onClearSelection,
  setSelectedRegions
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
    return (
      <EnhancedCanvasRegionEditor
        originalImage={originalImage}
        detectedRegions={detectedRegions}
        selectedRegions={selectedRegions}
        isEditMode={isEditMode}
        dragState={dragState}
        onRegionSelect={(regionId) => setSelectedRegions(new Set([regionId]))}
        onRegionToggle={onRegionToggle}
        onCanvasMouseDown={onCanvasMouseDown}
        onCanvasMouseMove={onCanvasMouseMove}
        onCanvasMouseUp={onCanvasMouseUp}
        onSelectAll={onSelectAll}
        onClearSelection={onClearSelection}
      />
    );
  }

  if (currentStep === 'extract') {
    return <EnhancedExtractedCardsView extractedCards={extractedCards} />;
  }

  return null;
};
