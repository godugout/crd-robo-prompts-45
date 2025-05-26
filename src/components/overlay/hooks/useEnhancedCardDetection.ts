
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { enhancedCardDetection } from '@/services/cardExtractor/enhancedDetection';
import { useImageProcessing } from './useImageProcessing';
import type { ExtractedCard } from '@/services/cardExtractor';
import type { EnhancedDialogStep, ManualRegion, DragState } from './types';
import { CardAdjustment } from '@/components/card-editor/InteractiveCardToolbar';

interface DetectedCard extends ManualRegion {
  adjustment: CardAdjustment;
}

export const useEnhancedCardDetection = (onCardsExtracted: (cards: ExtractedCard[]) => void) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<EnhancedDialogStep>('upload');
  const [detectedCards, setDetectedCards] = useState<DetectedCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [extractedCards, setExtractedCards] = useState<ExtractedCard[]>([]);
  const [dragState, setDragState] = useState<DragState>({ 
    isDragging: false, 
    startX: 0, 
    startY: 0 
  });
  const [activeMode, setActiveMode] = useState<'move' | 'crop' | 'rotate' | null>(null);

  const {
    originalImage,
    setOriginalImage,
    processImageFile,
    runEnhancedDetection
  } = useImageProcessing();

  const handleImageDrop = useCallback(async (file: File) => {
    setIsProcessing(true);
    try {
      const img = await processImageFile(file);
      if (!img) return;

      setOriginalImage(img);
      
      // Run enhanced detection
      const regions = await runEnhancedDetection(img, file);
      
      // Convert regions to detected cards with adjustment data
      const cards: DetectedCard[] = regions.map((region, index) => ({
        ...region,
        id: `card-${index}`,
        adjustment: {
          x: 0,
          y: 0,
          width: 100, // Base width (will be added to actual width)
          height: 140, // Base height (will be added to actual height)
          rotation: 0,
          scale: 1
        }
      }));
      
      setDetectedCards(cards);
      
      if (cards.length > 0) {
        setSelectedCardId(cards[0].id);
        setCurrentStep('refine');
        toast.success(`Detected ${cards.length} potential cards. Use the toolbar to refine them.`);
      } else {
        toast.info('No cards detected automatically. You can manually add card regions.');
        setCurrentStep('refine');
      }
      
    } catch (error) {
      console.error('Detection failed:', error);
      toast.error('Card detection failed. Please try a different image.');
    } finally {
      setIsProcessing(false);
    }
  }, [processImageFile, setOriginalImage, runEnhancedDetection]);

  const handleCardUpdate = useCallback((cardId: string, updates: Partial<DetectedCard>) => {
    setDetectedCards(prev => 
      prev.map(card => 
        card.id === cardId ? { ...card, ...updates } : card
      )
    );
  }, []);

  const handleAdjustmentChange = useCallback((adjustment: CardAdjustment) => {
    if (!selectedCardId) return;
    handleCardUpdate(selectedCardId, { adjustment });
  }, [selectedCardId, handleCardUpdate]);

  const handleExtractCards = useCallback(async () => {
    if (!originalImage || detectedCards.length === 0) {
      toast.error('No cards to extract');
      return;
    }

    setIsProcessing(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      canvas.width = originalImage.width;
      canvas.height = originalImage.height;
      ctx.drawImage(originalImage, 0, 0);

      const extracted: ExtractedCard[] = [];

      for (const card of detectedCards) {
        try {
          // Apply adjustments to get final crop area
          const finalX = Math.max(0, card.x + card.adjustment.x);
          const finalY = Math.max(0, card.y + card.adjustment.y);
          const finalWidth = Math.min(
            originalImage.width - finalX,
            card.width + (card.adjustment.width - 100)
          );
          const finalHeight = Math.min(
            originalImage.height - finalY,
            card.height + (card.adjustment.height - 140)
          );

          // Create crop canvas
          const cropCanvas = document.createElement('canvas');
          const cropCtx = cropCanvas.getContext('2d');
          if (!cropCtx) continue;

          // Standard card dimensions (2.5" x 3.5" at 140 DPI)
          const targetWidth = 350;
          const targetHeight = 490;
          
          cropCanvas.width = targetWidth;
          cropCanvas.height = targetHeight;

          // Apply transformations
          cropCtx.save();
          cropCtx.translate(targetWidth / 2, targetHeight / 2);
          cropCtx.rotate((card.adjustment.rotation * Math.PI) / 180);
          cropCtx.scale(card.adjustment.scale, card.adjustment.scale);
          cropCtx.translate(-targetWidth / 2, -targetHeight / 2);

          // Draw the cropped and transformed image
          cropCtx.drawImage(
            canvas,
            finalX, finalY, finalWidth, finalHeight,
            0, 0, targetWidth, targetHeight
          );

          cropCtx.restore();

          // Convert to blob
          const blob = await new Promise<Blob>((resolve, reject) => {
            cropCanvas.toBlob(
              (blob) => blob ? resolve(blob) : reject(new Error('Failed to create blob')),
              'image/jpeg',
              0.95
            );
          });

          extracted.push({
            imageBlob: blob,
            confidence: card.confidence,
            bounds: { 
              x: finalX, 
              y: finalY, 
              width: finalWidth, 
              height: finalHeight 
            },
            originalImage: URL.createObjectURL(blob)
          });
        } catch (error) {
          console.error(`Failed to extract card ${card.id}:`, error);
        }
      }

      setExtractedCards(extracted);
      setCurrentStep('extract');
      toast.success(`Successfully extracted ${extracted.length} cards!`);
      
    } catch (error) {
      console.error('Extraction failed:', error);
      toast.error('Failed to extract cards');
    } finally {
      setIsProcessing(false);
    }
  }, [originalImage, detectedCards]);

  const handleUseCards = useCallback(() => {
    onCardsExtracted(extractedCards);
  }, [extractedCards, onCardsExtracted]);

  const deleteSelectedCards = useCallback(() => {
    if (!selectedCardId) return;
    
    setDetectedCards(prev => prev.filter(card => card.id !== selectedCardId));
    setSelectedCardId(null);
    toast.success('Card deleted');
  }, [selectedCardId]);

  const goBack = useCallback(() => {
    if (currentStep === 'refine') {
      setCurrentStep('upload');
    } else if (currentStep === 'extract') {
      setCurrentStep('refine');
    }
  }, [currentStep]);

  const resetDialog = useCallback(() => {
    setCurrentStep('upload');
    setDetectedCards([]);
    setSelectedCardId(null);
    setIsEditMode(false);
    setExtractedCards([]);
    setDragState({ isDragging: false, startX: 0, startY: 0 });
    setActiveMode(null);
    setOriginalImage(null);
  }, [setOriginalImage]);

  return {
    isProcessing,
    currentStep,
    originalImage,
    detectedCards,
    selectedCardId,
    isEditMode,
    extractedCards,
    dragState,
    activeMode,
    handleImageDrop,
    handleExtractCards,
    handleUseCards,
    deleteSelectedCards: deleteSelectedCards,
    goBack,
    resetDialog,
    setDetectedCards,
    setSelectedCardId,
    setIsEditMode,
    setDragState,
    setActiveMode,
    handleCardUpdate,
    handleAdjustmentChange
  };
};
