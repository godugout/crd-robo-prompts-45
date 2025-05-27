
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
    console.log('🎯 processQueue called with uploadQueue length:', uploadQueue.length);
    
    if (uploadQueue.length === 0) {
      console.log('❌ No files to process');
      toast.warning('No files in queue to process');
      return;
    }

    console.log('🔄 Starting processing workflow...');
    
    // Clear previous state
    setDetectedCards(new Map());
    setSelectedCards(new Set());
    setShowReview(false);
    setIsProcessing(true);
    
    console.log('✅ Initial state cleared, processing started');

    try {
      const processingToast = toast.loading(`🔍 Analyzing ${uploadQueue.length} images...`);
      
      console.log('📡 Calling cardDetectionService.processBatch...');
      const results = await cardDetectionService.processBatch(uploadQueue);
      console.log('📊 processBatch results:', results);
      
      toast.dismiss(processingToast);
      
      // Process results
      const allCards = new Map<string, any>();
      let totalDetected = 0;

      results.forEach((result, resultIndex) => {
        console.log(`📋 Processing result ${resultIndex}:`, result);
        if (result.cards && Array.isArray(result.cards)) {
          result.cards.forEach((card, cardIndex) => {
            const uniqueId = `${result.sessionId}_${resultIndex}_${cardIndex}`;
            console.log(`➕ Adding card ${uniqueId}:`, card);
            allCards.set(uniqueId, { ...card, id: uniqueId });
            totalDetected++;
          });
        }
      });

      console.log('🎯 Final processing results:', { 
        totalDetected, 
        allCardsSize: allCards.size,
        allCardsKeys: Array.from(allCards.keys())
      });

      // Update processing status
      setProcessingStatus({
        total: uploadQueue.length,
        completed: totalDetected,
        failed: 0,
        inProgress: []
      });

      if (totalDetected > 0) {
        // Auto-select all detected cards
        const allCardIds = new Set(Array.from(allCards.keys()));
        
        console.log('✅ Setting detected cards and selected cards...');
        setDetectedCards(allCards);
        setSelectedCards(allCardIds);
        
        console.log('🧹 Clearing upload queue...');
        setUploadQueue([]);
        
        console.log('⏹️ Setting processing to false...');
        setIsProcessing(false);
        
        // Short delay before enabling review
        setTimeout(() => {
          console.log('👀 Enabling review mode...');
          setShowReview(true);
        }, 100);
        
        toast.success(`🎉 Successfully detected ${totalDetected} cards!`);
      } else {
        console.log('❌ No cards detected - cleaning up state');
        setIsProcessing(false);
        setShowReview(false);
        setDetectedCards(new Map());
        setSelectedCards(new Set());
        setUploadQueue([]);
        toast.warning('No trading cards detected in the uploaded images');
      }
    } catch (error) {
      console.error('💥 Processing failed:', error);
      setIsProcessing(false);
      setShowReview(false);
      setDetectedCards(new Map());
      setSelectedCards(new Set());
      setUploadQueue([]);
      toast.error('Processing failed. Please try again.');
    }
  }, [uploadQueue, setDetectedCards, setUploadQueue, setIsProcessing, setShowReview, setProcessingStatus, setSelectedCards]);

  const createSelectedCards = useCallback((detectedCards: Map<string, any>, selectedCards: Set<string>) => {
    console.log('🎴 createSelectedCards called with:', {
      detectedCardsSize: detectedCards.size,
      selectedCardsSize: selectedCards.size
    });
    
    const selectedCardData = Array.from(detectedCards.values())
      .filter(card => selectedCards.has(card.id));
    
    if (selectedCardData.length === 0) {
      toast.warning('No cards selected');
      return;
    }
    
    toast.success(`🎴 Adding ${selectedCardData.length} cards to your collection...`);
    
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
