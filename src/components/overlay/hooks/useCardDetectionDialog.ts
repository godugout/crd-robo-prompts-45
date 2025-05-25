
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { extractCardsFromImage, type ExtractedCard } from '@/services/cardExtractor';

export type DialogStep = 'upload' | 'review';

export const useCardDetectionDialog = (onCardsExtracted: (cards: ExtractedCard[]) => void) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedCards, setExtractedCards] = useState<ExtractedCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'large'>('grid');
  const [currentStep, setCurrentStep] = useState<DialogStep>('upload');

  const processImage = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setIsProcessing(true);
    try {
      toast.info('Analyzing image for trading cards...');
      const cards = await extractCardsFromImage(file);
      
      if (cards.length === 0) {
        toast.warning('No trading cards detected in the image');
        setCurrentStep('upload');
      } else {
        toast.success(`Found ${cards.length} potential trading cards!`);
        setExtractedCards(cards);
        setSelectedCards(new Set(cards.map((_, index) => index)));
        setCurrentStep('review');
      }
    } catch (error) {
      console.error('Card extraction error:', error);
      toast.error('Failed to analyze image for cards');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const toggleCardSelection = useCallback((index: number) => {
    const newSelected = new Set(selectedCards);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedCards(newSelected);
  }, [selectedCards]);

  const handleUseSelected = useCallback(() => {
    const selectedCardData = extractedCards.filter((_, index) => selectedCards.has(index));
    onCardsExtracted(selectedCardData);
    toast.success(`Using ${selectedCardData.length} extracted cards`);
  }, [extractedCards, selectedCards, onCardsExtracted]);

  const resetDialog = useCallback(() => {
    setCurrentStep('upload');
    setExtractedCards([]);
    setSelectedCards(new Set());
    setIsProcessing(false);
  }, []);

  const goBackToUpload = useCallback(() => {
    setCurrentStep('upload');
    setExtractedCards([]);
    setSelectedCards(new Set());
  }, []);

  return {
    isProcessing,
    extractedCards,
    selectedCards,
    viewMode,
    currentStep,
    processImage,
    toggleCardSelection,
    handleUseSelected,
    resetDialog,
    goBackToUpload,
    setViewMode,
    setSelectedCards
  };
};
