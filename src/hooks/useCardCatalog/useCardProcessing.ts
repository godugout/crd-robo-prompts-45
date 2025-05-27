
import { useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { cardDetectionService } from '@/services/cardCatalog/CardDetectionService';

interface UseCardProcessingProps {
  uploadQueue: File[];
  setUploadQueue: (files: File[]) => void;
  setDetectedCards: (cards: Map<string, any>) => void;
  setSelectedCards: (cards: Set<string>) => void;
  setIsProcessing: (processing: boolean) => void;
  setShowReview: (show: boolean) => void;
  setProcessingStatus: (status: any) => void;
}

export const useCardProcessing = ({
  uploadQueue,
  setUploadQueue,
  setDetectedCards,
  setSelectedCards,
  setIsProcessing,
  setShowReview,
  setProcessingStatus
}: UseCardProcessingProps) => {
  const processingRef = useRef<AbortController | null>(null);

  const processQueue = useCallback(async () => {
    if (uploadQueue.length === 0) {
      toast.warning('No files in queue to process');
      return;
    }

    setIsProcessing(true);
    processingRef.current = new AbortController();

    try {
      const processingToast = toast.loading(`🔍 Analyzing ${uploadQueue.length} images for trading cards...`, {
        description: 'This may take a moment for large images'
      });
      
      const results = await cardDetectionService.processBatch(uploadQueue);
      
      // Dismiss the loading toast
      toast.dismiss(processingToast);
      
      // Flatten all detected cards from all results
      const allCards = new Map<string, any>();
      let totalDetected = 0;

      results.forEach(result => {
        result.cards.forEach(card => {
          allCards.set(card.id, card);
          totalDetected++;
        });
      });

      setDetectedCards(allCards);
      setUploadQueue([]);
      setIsProcessing(false);
      setProcessingStatus({
        total: uploadQueue.length,
        completed: totalDetected,
        failed: 0,
        inProgress: []
      });

      if (totalDetected > 0) {
        setShowReview(true);
        // Auto-select all detected cards for user convenience
        const allCardIds = new Set(Array.from(allCards.keys()));
        setSelectedCards(allCardIds);
        
        toast.success(`🎉 Successfully detected ${totalDetected} cards!`, {
          description: `From ${results.length} images. Redirecting to review...`,
          duration: 4000
        });
      } else {
        toast.warning('No trading cards detected in the uploaded images', {
          description: 'Try uploading clearer images with visible trading cards'
        });
      }
    } catch (error) {
      console.error('Batch processing failed:', error);
      setIsProcessing(false);
      toast.error('Processing failed. Please try again.', {
        description: 'Make sure your images are clear and contain trading cards'
      });
    }
  }, [uploadQueue, setDetectedCards, setUploadQueue, setIsProcessing, setShowReview, setProcessingStatus, setSelectedCards]);

  const createSelectedCards = useCallback((detectedCards: Map<string, any>, selectedCards: Set<string>) => {
    const selectedCardData = Array.from(detectedCards.values())
      .filter(card => selectedCards.has(card.id));
    
    if (selectedCardData.length === 0) {
      toast.warning('No cards selected', {
        description: 'Please select at least one card to add to your collection'
      });
      return;
    }
    
    toast.success(`🎴 Adding ${selectedCardData.length} cards to your collection...`, {
      description: 'Your cards are being processed and added'
    });
    
    // Clear after creation
    setDetectedCards(new Map());
    setSelectedCards(new Set());
    setShowReview(false);
  }, [setDetectedCards, setSelectedCards, setShowReview]);

  return {
    processQueue,
    createSelectedCards
  };
};
