
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { improvedCardDetector } from '@/services/cardDetection/improvedCardDetection';
import type { DetectedCard } from '@/services/cardDetection/improvedCardDetection';

export type ExtractionPhase = 'upload' | 'detect' | 'review' | 'complete';

export interface ExtractedCard extends DetectedCard {
  id: string;
  croppedImageUrl?: string;
}

export interface UseMultiCardExtractionReturn {
  currentPhase: ExtractionPhase;
  uploadedImage: HTMLImageElement | null;
  uploadedFile: File | null;
  detectedCards: ExtractedCard[];
  selectedCards: string[];
  isProcessing: boolean;
  error: string | null;
  uploadImage: (file: File) => Promise<void>;
  runDetection: () => Promise<void>;
  toggleCardSelection: (cardId: string) => void;
  selectAllCards: () => void;
  deselectAllCards: () => void;
  saveSelectedCards: () => Promise<void>;
  resetSession: () => void;
}

export const useMultiCardExtraction = (): UseMultiCardExtractionReturn => {
  const [currentPhase, setCurrentPhase] = useState<ExtractionPhase>('upload');
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [detectedCards, setDetectedCards] = useState<ExtractedCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const img = new Image();
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(file);
      });

      setUploadedImage(img);
      setUploadedFile(file);
      setCurrentPhase('detect');
      
      toast.success('Image uploaded successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const runDetection = useCallback(async () => {
    if (!uploadedImage) {
      toast.error('No image uploaded');
      return;
    }

    setIsProcessing(true);
    setError(null);
    
    const detectionToast = toast.loading('Detecting cards in your image...', {
      description: 'Using advanced AI to identify individual cards'
    });

    try {
      console.log('🚀 Starting card detection...');
      const result = await improvedCardDetector.detectCards(uploadedImage);
      
      console.log('✅ Detection completed:', {
        cardsFound: result.cards.length,
        processingTime: result.debugInfo.processingTime
      });

      // Convert DetectedCard to ExtractedCard with unique IDs
      const extractedCards: ExtractedCard[] = result.cards.map((card, index) => ({
        ...card,
        id: `card-${Date.now()}-${index}`
      }));

      setDetectedCards(extractedCards);
      
      // Auto-select all detected cards by default
      setSelectedCards(extractedCards.map(card => card.id));
      
      setCurrentPhase('review');
      
      toast.dismiss(detectionToast);
      
      if (extractedCards.length > 0) {
        toast.success(`🎯 Detected ${extractedCards.length} cards!`, {
          description: `Analysis completed in ${result.debugInfo.processingTime}ms`
        });
      } else {
        toast.info('🤔 No cards detected in this image', {
          description: 'Try using a different image or adjust the image quality'
        });
      }
    } catch (err) {
      console.error('💥 Detection error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Detection failed';
      setError(errorMessage);
      
      toast.dismiss(detectionToast);
      toast.error('❌ Card detection failed', {
        description: errorMessage
      });
    } finally {
      setIsProcessing(false);
    }
  }, [uploadedImage]);

  const toggleCardSelection = useCallback((cardId: string) => {
    setSelectedCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  }, []);

  const selectAllCards = useCallback(() => {
    setSelectedCards(detectedCards.map(card => card.id));
  }, [detectedCards]);

  const deselectAllCards = useCallback(() => {
    setSelectedCards([]);
  }, []);

  const saveSelectedCards = useCallback(async () => {
    if (selectedCards.length === 0) {
      toast.error('No cards selected');
      return;
    }

    setIsProcessing(true);
    setError(null);
    
    const saveToast = toast.loading(`Saving ${selectedCards.length} cards...`, {
      description: 'Adding cards to your collection'
    });

    try {
      // TODO: In the next phase, we'll implement the actual card saving logic
      // This will involve cropping the selected cards and creating card records
      
      // Simulate processing time for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCurrentPhase('complete');
      
      toast.dismiss(saveToast);
      toast.success(`🎉 Successfully saved ${selectedCards.length} cards!`, {
        description: 'Cards have been added to your collection'
      });
      
      console.log('✅ Cards saved successfully:', selectedCards);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save cards';
      setError(errorMessage);
      
      toast.dismiss(saveToast);
      toast.error('❌ Failed to save cards', {
        description: errorMessage
      });
    } finally {
      setIsProcessing(false);
    }
  }, [selectedCards]);

  const resetSession = useCallback(() => {
    setCurrentPhase('upload');
    setUploadedImage(null);
    setUploadedFile(null);
    setDetectedCards([]);
    setSelectedCards([]);
    setIsProcessing(false);
    setError(null);
    
    console.log('🔄 Session reset');
  }, []);

  return {
    currentPhase,
    uploadedImage,
    uploadedFile,
    detectedCards,
    selectedCards,
    isProcessing,
    error,
    uploadImage,
    runDetection,
    toggleCardSelection,
    selectAllCards,
    deselectAllCards,
    saveSelectedCards,
    resetSession
  };
};
