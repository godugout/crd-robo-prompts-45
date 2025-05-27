
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
      toast.info(`Processing ${uploadQueue.length} images...`);
      
      const results = await cardDetectionService.processBatch(uploadQueue);
      
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
      setShowReview(totalDetected > 0);
      setProcessingStatus({
        total: uploadQueue.length,
        completed: totalDetected,
        failed: 0,
        inProgress: []
      });

      toast.success(`Successfully detected ${totalDetected} cards from ${results.length} images!`);
    } catch (error) {
      console.error('Batch processing failed:', error);
      setIsProcessing(false);
      toast.error('Processing failed. Please try again.');
    }
  }, [uploadQueue, setDetectedCards, setUploadQueue, setIsProcessing, setShowReview, setProcessingStatus]);

  const createSelectedCards = useCallback((detectedCards: Map<string, any>, selectedCards: Set<string>) => {
    const selectedCardData = Array.from(detectedCards.values())
      .filter(card => selectedCards.has(card.id));
    
    // TODO: Integrate with card creation service
    toast.success(`Creating ${selectedCardData.length} cards...`);
    
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
