
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

    console.log('🎯 Starting processQueue with', uploadQueue.length, 'files');
    
    // Clear previous state and set processing
    setDetectedCards(new Map());
    setSelectedCards(new Set());
    setShowReview(false);
    setIsProcessing(true);
    
    processingRef.current = new AbortController();

    try {
      const processingToast = toast.loading(`🔍 Analyzing ${uploadQueue.length} images for trading cards...`, {
        description: 'This may take a moment for large images'
      });
      
      console.log('🔄 Processing started, calling cardDetectionService...');
      const startTime = Date.now();
      const results = await cardDetectionService.processBatch(uploadQueue);
      const processingTime = Date.now() - startTime;
      
      console.log('📊 Raw processing results:', results);
      
      // Ensure minimum 2 seconds in detection state for better UX
      const minProcessingTime = 2000;
      if (processingTime < minProcessingTime) {
        console.log('⏱️ Waiting for minimum processing time...');
        await new Promise(resolve => setTimeout(resolve, minProcessingTime - processingTime));
      }
      
      // Dismiss the loading toast
      toast.dismiss(processingToast);
      
      // Flatten all detected cards from all results
      const allCards = new Map<string, any>();
      let totalDetected = 0;

      results.forEach((result, resultIndex) => {
        console.log(`📋 Processing result ${resultIndex}:`, result);
        result.cards.forEach((card, cardIndex) => {
          const uniqueId = `${result.sessionId}_${resultIndex}_${cardIndex}`;
          console.log(`➕ Adding card ${uniqueId}:`, card);
          allCards.set(uniqueId, { ...card, id: uniqueId });
          totalDetected++;
        });
      });

      console.log('🎯 Final detection results:', { 
        totalDetected, 
        allCardsSize: allCards.size,
        allCardsKeys: Array.from(allCards.keys())
      });

      // Update processing status first
      setProcessingStatus({
        total: uploadQueue.length,
        completed: totalDetected,
        failed: 0,
        inProgress: []
      });

      if (totalDetected > 0) {
        // Auto-select all detected cards
        const allCardIds = new Set(Array.from(allCards.keys()));
        console.log('✅ Auto-selecting cards:', Array.from(allCardIds));
        
        // Update states in sequence to ensure proper propagation
        setDetectedCards(allCards);
        setSelectedCards(allCardIds);
        setUploadQueue([]);
        
        // Small delay to ensure state updates are processed
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Set processing to false BEFORE enabling review
        setIsProcessing(false);
        
        // Enable review state after another small delay
        setTimeout(() => {
          console.log('🎉 Setting showReview to true - should trigger review step');
          setShowReview(true);
        }, 200);
        
        toast.success(`🎉 Successfully detected ${totalDetected} cards!`, {
          description: `From ${results.length} images. Review your cards below.`,
          duration: 4000
        });
      } else {
        console.log('❌ No cards detected');
        setIsProcessing(false);
        setShowReview(false);
        setDetectedCards(new Map());
        setSelectedCards(new Set());
        setUploadQueue([]);
        toast.warning('No trading cards detected in the uploaded images', {
          description: 'Try uploading clearer images with visible trading cards'
        });
      }
    } catch (error) {
      console.error('💥 Batch processing failed:', error);
      setIsProcessing(false);
      setShowReview(false);
      setDetectedCards(new Map());
      setSelectedCards(new Set());
      setUploadQueue([]);
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
