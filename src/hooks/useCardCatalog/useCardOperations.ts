
import { useCallback } from 'react';
import { toast } from 'sonner';

interface UseCardOperationsProps {
  detectedCards: Map<string, any>;
  selectedCards: Set<string>;
  setDetectedCards: (cards: Map<string, any>) => void;
  setSelectedCards: (cards: Set<string>) => void;
}

export const useCardOperations = ({ 
  detectedCards, 
  selectedCards, 
  setDetectedCards, 
  setSelectedCards 
}: UseCardOperationsProps) => {
  const selectCard = useCallback((cardId: string) => {
    setSelectedCards(new Set([...selectedCards, cardId]));
  }, [selectedCards, setSelectedCards]);

  const deselectCard = useCallback((cardId: string) => {
    const newSelected = new Set(selectedCards);
    newSelected.delete(cardId);
    setSelectedCards(newSelected);
  }, [selectedCards, setSelectedCards]);

  const toggleCardSelection = useCallback((cardId: string) => {
    const newSelected = new Set(selectedCards);
    if (newSelected.has(cardId)) {
      newSelected.delete(cardId);
    } else {
      newSelected.add(cardId);
    }
    setSelectedCards(newSelected);
  }, [selectedCards, setSelectedCards]);

  const deleteSelected = useCallback(() => {
    const newCards = new Map(detectedCards);
    selectedCards.forEach(cardId => {
      newCards.delete(cardId);
    });
    setDetectedCards(newCards);
    setSelectedCards(new Set());
    toast.success(`Deleted ${selectedCards.size} cards`);
  }, [detectedCards, selectedCards, setDetectedCards, setSelectedCards]);

  const editCardBounds = useCallback((cardId: string, bounds: any) => {
    const newCards = new Map(detectedCards);
    const card = newCards.get(cardId);
    if (card) {
      newCards.set(cardId, { ...card, bounds });
    }
    setDetectedCards(newCards);
  }, [detectedCards, setDetectedCards]);

  const clearDetectedCards = useCallback(() => {
    setDetectedCards(new Map());
    setSelectedCards(new Set());
  }, [setDetectedCards, setSelectedCards]);

  return {
    selectCard,
    deselectCard,
    toggleCardSelection,
    deleteSelected,
    editCardBounds,
    clearDetectedCards
  };
};
