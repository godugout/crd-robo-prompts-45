
import { useCallback } from 'react';
import { toast } from 'sonner';
import type { ExtractedCard } from '@/services/cardExtractor';
import { useDialogState } from './useDialogState';
import { useImageProcessing } from './useImageProcessing';
import { useCardExtraction } from './useCardExtraction';

export type { EnhancedDialogStep, ManualRegion, DragState } from './types';

export const useEnhancedCardDetection = (onCardsExtracted: (cards: ExtractedCard[]) => void) => {
  const dialogState = useDialogState();
  const imageProcessing = useImageProcessing();
  const cardExtraction = useCardExtraction();

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
    imageProcessing.setDetectedRegions(prev => 
      prev.filter(region => !imageProcessing.selectedRegions.has(region.id))
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
    // State from all hooks
    ...dialogState,
    ...imageProcessing,
    ...cardExtraction,
    
    // Actions
    handleImageDrop,
    handleExtractCards,
    handleUseCards,
    deleteSelectedRegions,
    resetDialog
  };
};
