
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

    console.log('Starting processQueue with', uploadQueue.length, 'files');
    
    // Set processing state first
    setIsProcessing(true);
    setShowReview(false);
    setDetectedCards(new Map()); // Clear previous results
    setSelectedCards(new Set());
    
    processingRef.current = new AbortController();

    try {
      const processingToast = toast.loading(`🔍 Analyzing ${uploadQueue.length} images for trading cards...`, {
        description: 'This may take a moment for large images'
      });
      
      // Add a minimum processing time to ensure users see the detection step
      const startTime = Date.now();
      const results = await cardDetectionService.processBatch(uploadQueue);
      const processingTime = Date.now() - startTime;
      
      console.log('Raw processing results:', results);
      
      // Ensure minimum 2 seconds in detection state for better UX
      const minProcessingTime = 2000;
      if (processingTime < minProcessingTime) {
        await new Promise(resolve => setTimeout(resolve, minProcessingTime - processingTime));
      }
      
      // Dismiss the loading toast
      toast.dismiss(processingToast);
      
      // Flatten all detected cards from all results
      const allCards = new Map<string, any>();
      let totalDetected = 0;

      results.forEach((result, resultIndex) => {
        console.log(`Processing result ${resultIndex}:`, result);
        result.cards.forEach((card, cardIndex) => {
          const uniqueId = `${result.sessionId}_${resultIndex}_${cardIndex}`;
          console.log(`Adding card ${uniqueId}:`, card);
          allCards.set(uniqueId, { ...card, id: uniqueId });
          totalDetected++;
        });
      });

      console.log('Final state update:', { 
        totalDetected, 
        allCardsSize: allCards.size,
        allCardsEntries: Array.from(allCards.entries()).length 
      });

      // Update all states synchronously
      setDetectedCards(allCards);
      setUploadQueue([]);
      setProcessingStatus({
        total: uploadQueue.length,
        completed: totalDetected,
        failed: 0,
        inProgress: []
      });

      if (totalDetected > 0) {
        // Auto-select all detected cards for user convenience
        const allCardIds = new Set(Array.from(allCards.keys()));
        console.log('Auto-selecting cards:', Array.from(allCardIds));
        setSelectedCards(allCardIds);
        
        // Important: Set processing to false BEFORE setting showReview
        setIsProcessing(false);
        
        // Set review state with a delay to ensure state updates are processed
        setTimeout(() => {
          console.log('Setting showReview to true after successful detection');
          setShowReview(true);
        }, 200);
        
        toast.success(`🎉 Successfully detected ${totalDetected} cards!`, {
          description: `From ${results.length} images. Review your cards below.`,
          duration: 4000
        });
      } else {
        setIsProcessing(false);
        setShowReview(false);
        toast.warning('No trading cards detected in the uploaded images', {
          description: 'Try uploading clearer images with visible trading cards'
        });
      }
    } catch (error) {
      console.error('Batch processing failed:', error);
      setIsProcessing(false);
      setShowReview(false);
      setDetectedCards(new Map());
      setSelectedCards(new Set());
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
