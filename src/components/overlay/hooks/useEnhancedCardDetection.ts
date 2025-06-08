
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { enhancedCardDetection } from '@/services/cardExtractor/enhancedDetection';
import { useImageProcessing } from './useImageProcessing';
import type { ExtractedCard } from '@/services/cardExtractor';
import type { EnhancedDialogStep, ManualRegion, DragState } from './types';
import { CardAdjustment } from '@/components/card-editor/InteractiveCardToolbar';

interface DetectedCard extends ManualRegion {
  adjustment: CardAdjustment;
  edgeStrength?: number;
  geometryScore?: number;
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
    setCurrentStep('detect');
    
    try {
      const img = await processImageFile(file);
      if (!img) return;

      setOriginalImage(img);
      
      // Run enhanced detection
      console.log('🔍 Starting detection process...');
      
      const detectionToast = toast.loading('🧠 Analyzing image for cards...', {
        description: 'Using improved detection algorithm'
      });
      
      try {
        const regions = await enhancedCardDetection(img, file);
        toast.dismiss(detectionToast);
        
        // Convert regions to detected cards with proper scaling and positioning
        const cards: DetectedCard[] = regions.map((region, index) => ({
          ...region,
          id: `card-${index}`,
          isManual: false,
          adjustment: {
            x: 0,
            y: 0,
            width: 100,
            height: 140,
            rotation: 0,
            scale: 1
          },
          edgeStrength: region.edgeStrength || 0,
          geometryScore: region.geometryScore || 0
        }));
        
        setDetectedCards(cards);
        
        if (cards.length > 0) {
          setSelectedCardId(cards[0].id);
          setCurrentStep('refine');
          toast.success(`🎯 Detected ${cards.length} card regions!`, {
            description: 'Review and adjust the crop areas before saving'
          });
        } else {
          setCurrentStep('refine');
          toast.info('🤔 No cards detected automatically', {
            description: 'You can manually draw card regions'
          });
        }
      } catch (detectionError) {
        toast.dismiss(detectionToast);
        console.error('Detection error:', detectionError);
        
        toast.warning('⚠️ Detection failed', {
          description: 'You can still manually select card regions'
        });
        
        setCurrentStep('refine');
        setDetectedCards([]);
      }
      
    } catch (error) {
      console.error('Image processing failed:', error);
      toast.error('Failed to process image. Please try a different file.');
      setCurrentStep('upload');
    } finally {
      setIsProcessing(false);
    }
  }, [processImageFile, setOriginalImage]);

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

  // NEW: This function now only extracts cards when user explicitly approves
  const handleExtractCards = useCallback(async () => {
    if (!originalImage || detectedCards.length === 0) {
      toast.error('No cards to extract');
      return;
    }

    setIsProcessing(true);
    setCurrentStep('extract');
    
    try {
      const extractionToast = toast.loading('✂️ Creating final card images...', {
        description: 'Processing approved crop areas'
      });
      
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
          const adjustmentX = (card.adjustment.width - 100) * (card.width / 100);
          const adjustmentY = (card.adjustment.height - 140) * (card.height / 140);
          
          const finalX = Math.max(0, card.x + card.adjustment.x);
          const finalY = Math.max(0, card.y + card.adjustment.y);
          const finalWidth = Math.min(
            originalImage.width - finalX,
            Math.max(card.width + adjustmentX, 100)
          );
          const finalHeight = Math.min(
            originalImage.height - finalY,
            Math.max(card.height + adjustmentY, 140)
          );

          if (finalWidth < 100 || finalHeight < 140) {
            console.warn(`Skipping card ${card.id} - dimensions too small`);
            continue;
          }

          // Create crop canvas
          const cropCanvas = document.createElement('canvas');
          const cropCtx = cropCanvas.getContext('2d');
          if (!cropCtx) continue;

          const targetWidth = 420;
          const targetHeight = 588;
          
          cropCanvas.width = targetWidth;
          cropCanvas.height = targetHeight;

          cropCtx.save();
          cropCtx.imageSmoothingEnabled = true;
          cropCtx.imageSmoothingQuality = 'high';
          
          cropCtx.translate(targetWidth / 2, targetHeight / 2);
          cropCtx.rotate((card.adjustment.rotation * Math.PI) / 180);
          cropCtx.scale(card.adjustment.scale, card.adjustment.scale);
          cropCtx.translate(-targetWidth / 2, -targetHeight / 2);

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

      toast.dismiss(extractionToast);
      
      if (extracted.length > 0) {
        setExtractedCards(extracted);
        setCurrentStep('extract');
        toast.success(`🎉 Created ${extracted.length} final card images!`, {
          description: 'Ready to save to your collection'
        });
      } else {
        toast.error('Failed to create final images. Please check the regions.');
        setCurrentStep('refine');
      }
      
    } catch (error) {
      console.error('Extraction failed:', error);
      toast.error('Failed to create final images. Please try adjusting the regions.');
      setCurrentStep('refine');
    } finally {
      setIsProcessing(false);
    }
  }, [originalImage, detectedCards]);

  const handleUseCards = useCallback(() => {
    if (extractedCards.length === 0) {
      toast.error('No final card images to save');
      return;
    }
    
    console.log('🎴 Saving cards to collection:', extractedCards.length);
    onCardsExtracted(extractedCards);
    
    toast.success(`🚀 Added ${extractedCards.length} cards to your collection!`, {
      description: 'Cards have been saved successfully'
    });
  }, [extractedCards, onCardsExtracted]);

  const deleteSelectedCards = useCallback(() => {
    if (!selectedCardId) return;
    
    setDetectedCards(prev => prev.filter(card => card.id !== selectedCardId));
    setSelectedCardId(null);
    toast.success('Card region deleted');
  }, [selectedCardId]);

  const goBack = useCallback(() => {
    if (currentStep === 'refine') {
      setCurrentStep('upload');
      setDetectedCards([]);
      setSelectedCardId(null);
    } else if (currentStep === 'extract') {
      setCurrentStep('refine');
      setExtractedCards([]);
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
    deleteSelectedCards,
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
