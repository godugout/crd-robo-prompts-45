
import { useCallback } from 'react';
import { toast } from 'sonner';
import { detectCardsInImages } from '@/services/cardDetection';
import type { 
  UploadedImage, 
  CreatedCard, 
  WorkflowPhase, 
  UseCardOperationsReturn 
} from '../types';
import type { CardDetectionResult } from '@/services/cardDetection';

export const useCardOperations = (): UseCardOperationsReturn => {
  const startDetection = useCallback(async (
    images: UploadedImage[],
    setPhase: (phase: WorkflowPhase) => void,
    setDetectionResults: React.Dispatch<React.SetStateAction<CardDetectionResult[]>>,
    setSelectedCards: React.Dispatch<React.SetStateAction<Set<string>>>
  ): Promise<void> => {
    setPhase('detecting');
    toast.loading('Detecting cards in images...');

    try {
      const files = images.map(img => img.file);
      const results = await detectCardsInImages(files);
      
      setDetectionResults(results);
      
      // Auto-select all detected cards
      const allCardIds = results.flatMap(result => 
        result.detectedCards.map(card => card.id)
      );
      setSelectedCards(new Set(allCardIds));
      
      toast.dismiss();
      toast.success(`Detected ${allCardIds.length} cards across ${results.length} images`);
      setPhase('reviewing');
    } catch (error) {
      console.error('Detection failed:', error);
      toast.dismiss();
      toast.error('Card detection failed');
      setPhase('idle');
    }
  }, []);

  const createSelectedCards = useCallback(async (
    detectionResults: CardDetectionResult[],
    selectedCards: Set<string>,
    setPhase: (phase: WorkflowPhase) => void,
    setCreatedCards: (updater: (prev: CreatedCard[]) => CreatedCard[]) => void,
    clearSession: () => void
  ): Promise<void> => {
    if (selectedCards.size === 0) {
      toast.error('Please select at least one card');
      return;
    }

    setPhase('creating');
    toast.loading('Creating cards...');

    try {
      const allDetectedCards = detectionResults.flatMap(result => result.detectedCards);
      const cardsToCreate = allDetectedCards.filter(card => selectedCards.has(card.id));
      const newCreatedCards: CreatedCard[] = [];

      // Process each selected card
      for (let i = 0; i < cardsToCreate.length; i++) {
        const card = cardsToCreate[i];
        
        // Save card to persistent storage (simulated with localStorage for now)
        const createdCard = {
          id: `created-${card.id}`,
          title: `${card.metadata.cardType || 'Card'} ${i + 1}`,
          image: card.croppedImageUrl,
          confidence: card.confidence,
          metadata: card.metadata,
          createdAt: new Date()
        };

        // Save to localStorage as a simple persistence layer
        const existingCards = JSON.parse(localStorage.getItem('cardshow_created_cards') || '[]');
        existingCards.push(createdCard);
        localStorage.setItem('cardshow_created_cards', JSON.stringify(existingCards));

        newCreatedCards.push(createdCard);

        // Show progress
        toast.dismiss();
        toast.loading(`Creating cards... ${i + 1}/${cardsToCreate.length}`);
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      setCreatedCards(prev => [...prev, ...newCreatedCards]);
      
      toast.dismiss();
      toast.success(`Created ${newCreatedCards.length} cards and saved to collection!`);
      setPhase('complete');
      
      // Auto-reset after showing success
      setTimeout(() => {
        clearSession();
      }, 3000);
    } catch (error) {
      console.error('Card creation failed:', error);
      toast.dismiss();
      toast.error('Failed to create cards');
    }
  }, []);

  return {
    startDetection,
    createSelectedCards
  };
};
