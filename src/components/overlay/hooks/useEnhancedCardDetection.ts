
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { extractCardsFromImage, type ExtractedCard } from '@/services/cardExtractor';
import { enhancedCardDetection } from '@/services/cardExtractor/enhancedDetection';

export type EnhancedDialogStep = 'upload' | 'detect' | 'refine' | 'extract';

export interface ManualRegion {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isManual: boolean;
}

export interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  currentRegion?: ManualRegion;
}

export const useEnhancedCardDetection = (onCardsExtracted: (cards: ExtractedCard[]) => void) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<EnhancedDialogStep>('upload');
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [detectedRegions, setDetectedRegions] = useState<ManualRegion[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<Set<string>>(new Set());
  const [isEditMode, setIsEditMode] = useState(false);
  const [extractedCards, setExtractedCards] = useState<ExtractedCard[]>([]);
  const [dragState, setDragState] = useState<DragState>({ 
    isDragging: false, 
    startX: 0, 
    startY: 0 
  });

  const handleImageDrop = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Add file size check
    if (file.size > 15 * 1024 * 1024) {
      toast.error('Image file is too large. Please use an image smaller than 15MB.');
      return;
    }

    setIsProcessing(true);
    setCurrentStep('detect');
    
    try {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        handleEnhancedDetection(img, file);
      };
      img.onerror = () => {
        toast.error('Failed to load image');
        setIsProcessing(false);
        setCurrentStep('upload');
      };
      img.src = URL.createObjectURL(file);
    } catch (error) {
      console.error('Error loading image:', error);
      toast.error('Failed to load image');
      setIsProcessing(false);
      setCurrentStep('upload');
    }
  }, []);

  const handleEnhancedDetection = async (img: HTMLImageElement, file: File) => {
    let detectionTimeout: NodeJS.Timeout | null = null;
    
    try {
      toast.info('Running enhanced card detection...');
      
      // Set a timeout to prevent hanging
      detectionTimeout = setTimeout(() => {
        toast.error('Detection is taking too long. Please try with a smaller image.');
        setIsProcessing(false);
        setCurrentStep('upload');
      }, 20000); // 20 second timeout
      
      const regions = await enhancedCardDetection(img, file);
      
      if (detectionTimeout) {
        clearTimeout(detectionTimeout);
        detectionTimeout = null;
      }
      
      const manualRegions: ManualRegion[] = regions.map((region, index) => ({
        id: `region-${index}`,
        x: region.x,
        y: region.y,
        width: region.width,
        height: region.height,
        isManual: false
      }));
      
      setDetectedRegions(manualRegions);
      setSelectedRegions(new Set(manualRegions.map(r => r.id)));
      setCurrentStep('refine');
      
      if (manualRegions.length > 0) {
        toast.success(`Detected ${regions.length} potential cards. You can now refine the boundaries.`);
      } else {
        toast.info('No cards detected automatically. You can manually draw card regions.');
      }
    } catch (error) {
      if (detectionTimeout) {
        clearTimeout(detectionTimeout);
      }
      
      console.error('Enhanced detection error:', error);
      
      if (error instanceof Error && error.message.includes('timeout')) {
        toast.error('Detection timed out. Please try with a smaller or simpler image.');
      } else {
        toast.error('Detection failed. You can manually draw card regions.');
      }
      
      setDetectedRegions([]);
      setCurrentStep('refine');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExtractCards = async () => {
    if (!originalImage || selectedRegions.size === 0) return;
    
    setIsProcessing(true);
    setCurrentStep('extract');
    
    try {
      const selectedRegionData = detectedRegions.filter(region => 
        selectedRegions.has(region.id)
      );
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Cannot get canvas context');
      
      canvas.width = originalImage.width;
      canvas.height = originalImage.height;
      ctx.drawImage(originalImage, 0, 0);
      
      const cards: ExtractedCard[] = [];
      
      for (const region of selectedRegionData) {
        const cardCanvas = document.createElement('canvas');
        const cardCtx = cardCanvas.getContext('2d');
        if (!cardCtx) continue;
        
        const cardWidth = 350;
        const cardHeight = 490;
        
        cardCanvas.width = cardWidth;
        cardCanvas.height = cardHeight;
        
        cardCtx.drawImage(
          canvas,
          region.x, region.y, region.width, region.height,
          0, 0, cardWidth, cardHeight
        );
        
        const blob = await new Promise<Blob>((resolve, reject) => {
          cardCanvas.toBlob(
            (blob) => blob ? resolve(blob) : reject(new Error('Failed to create blob')),
            'image/jpeg',
            0.95
          );
        });
        
        cards.push({
          imageBlob: blob,
          confidence: region.isManual ? 1.0 : 0.8,
          bounds: region,
          originalImage: originalImage.src
        });
      }
      
      setExtractedCards(cards);
      toast.success(`Extracted ${cards.length} cards successfully!`);
    } catch (error) {
      console.error('Card extraction error:', error);
      toast.error('Failed to extract cards');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUseCards = () => {
    onCardsExtracted(extractedCards);
  };

  const deleteSelectedRegions = () => {
    setDetectedRegions(prev => prev.filter(region => !selectedRegions.has(region.id)));
    setSelectedRegions(new Set());
  };

  const goBack = () => {
    if (currentStep === 'detect') setCurrentStep('upload');
    else if (currentStep === 'refine') setCurrentStep('detect');
    else if (currentStep === 'extract') setCurrentStep('refine');
  };

  const resetDialog = () => {
    setCurrentStep('upload');
    setOriginalImage(null);
    setProcessedImage(null);
    setDetectedRegions([]);
    setSelectedRegions(new Set());
    setExtractedCards([]);
    setIsEditMode(false);
    setIsProcessing(false);
    setDragState({ isDragging: false, startX: 0, startY: 0 });
  };

  return {
    // State
    isProcessing,
    currentStep,
    originalImage,
    processedImage,
    detectedRegions,
    selectedRegions,
    isEditMode,
    extractedCards,
    dragState,
    
    // Actions
    handleImageDrop,
    handleExtractCards,
    handleUseCards,
    deleteSelectedRegions,
    goBack,
    resetDialog,
    setDetectedRegions,
    setSelectedRegions,
    setIsEditMode,
    setDragState
  };
};
