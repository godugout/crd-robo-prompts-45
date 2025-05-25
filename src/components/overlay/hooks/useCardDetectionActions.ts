
import { useCallback } from 'react';
import type { ExtractedCard } from '@/services/cardExtractor';
import type { ManualRegion } from './types';

interface UseCardDetectionActionsProps {
  dialogState: {
    setIsProcessing: (processing: boolean) => void;
    setCurrentStep: (step: 'upload' | 'detect' | 'refine' | 'extract') => void;
    resetDialog: () => void;
  };
  imageProcessing: {
    processImageFile: (file: File) => Promise<HTMLImageElement | null>;
    setOriginalImage: (image: HTMLImageElement | null) => void;
    runEnhancedDetection: (img: HTMLImageElement, file: File) => Promise<ManualRegion[]>;
    originalImage: HTMLImageElement | null;
    selectedRegions: Set<string>;
    detectedRegions: ManualRegion[];
    setDetectedRegions: (regions: ManualRegion[]) => void;
    setSelectedRegions: (regions: Set<string>) => void;
  };
  cardExtraction: {
    extractCardsFromRegions: (
      originalImage: HTMLImageElement,
      selectedRegionIds: Set<string>,
      detectedRegions: ManualRegion[]
    ) => Promise<ExtractedCard[] | undefined>;
    extractedCards: ExtractedCard[];
    setExtractedCards: (cards: ExtractedCard[]) => void;
  };
  onCardsExtracted: (cards: ExtractedCard[]) => void;
}

export const useCardDetectionActions = ({
  dialogState,
  imageProcessing,
  cardExtraction,
  onCardsExtracted
}: UseCardDetectionActionsProps) => {
  const handleImageDrop = useCallback(async (file: File) => {
    dialogState.setIsProcessing(true);
    dialogState.setCurrentStep('detect');
    
    try {
      const img = await imageProcessing.processImageFile(file);
      if (img) {
        imageProcessing.setOriginalImage(img);
        await imageProcessing.runEnhancedDetection(img, file);
        dialogState.setCurrentStep('refine');
      }
    } catch (error) {
      console.error('Error processing image:', error);
      dialogState.setCurrentStep('upload');
    } finally {
      dialogState.setIsProcessing(false);
    }
  }, [dialogState, imageProcessing]);

  const handleExtractCards = useCallback(async () => {
    if (!imageProcessing.originalImage || imageProcessing.selectedRegions.size === 0) return;
    
    dialogState.setIsProcessing(true);
    dialogState.setCurrentStep('extract');
    
    try {
      await cardExtraction.extractCardsFromRegions(
        imageProcessing.originalImage,
        imageProcessing.selectedRegions,
        imageProcessing.detectedRegions
      );
    } finally {
      dialogState.setIsProcessing(false);
    }
  }, [dialogState, imageProcessing, cardExtraction]);

  const handleUseCards = useCallback(() => {
    onCardsExtracted(cardExtraction.extractedCards);
  }, [onCardsExtracted, cardExtraction.extractedCards]);

  const deleteSelectedRegions = useCallback(() => {
    imageProcessing.setDetectedRegions(
      imageProcessing.detectedRegions.filter(region => 
        !imageProcessing.selectedRegions.has(region.id)
      )
    );
    imageProcessing.setSelectedRegions(new Set());
  }, [imageProcessing]);

  const resetDialog = useCallback(() => {
    dialogState.resetDialog();
    imageProcessing.setOriginalImage(null);
    imageProcessing.setDetectedRegions([]);
    imageProcessing.setSelectedRegions(new Set());
    cardExtraction.setExtractedCards([]);
  }, [dialogState, imageProcessing, cardExtraction]);

  return {
    handleImageDrop,
    handleExtractCards,
    handleUseCards,
    deleteSelectedRegions,
    resetDialog
  };
};
