
import { useCallback, useEffect } from 'react';

interface UseCardNavigationProps {
  cards: any[];
  currentCardIndex: number;
  onCardChange?: (index: number) => void;
  setIsFlipped: (flipped: boolean) => void;
}

export const useCardNavigation = ({
  cards,
  currentCardIndex,
  onCardChange,
  setIsFlipped
}: UseCardNavigationProps) => {
  // Determine if we have multiple cards to navigate
  const hasMultipleCards = cards.length > 1;
  const canGoNext = hasMultipleCards && currentCardIndex < cards.length - 1;
  const canGoPrev = hasMultipleCards && currentCardIndex > 0;

  // Navigation handlers
  const handlePreviousCard = useCallback(() => {
    if (canGoPrev && onCardChange) {
      onCardChange(currentCardIndex - 1);
      setIsFlipped(false); // Reset flip state when changing cards
    }
  }, [canGoPrev, currentCardIndex, onCardChange, setIsFlipped]);

  const handleNextCard = useCallback(() => {
    if (canGoNext && onCardChange) {
      onCardChange(currentCardIndex + 1);
      setIsFlipped(false); // Reset flip state when changing cards
    }
  }, [canGoNext, currentCardIndex, onCardChange, setIsFlipped]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePreviousCard();
      } else if (e.key === 'ArrowRight') {
        handleNextCard();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handlePreviousCard, handleNextCard]);

  return {
    hasMultipleCards,
    canGoNext,
    canGoPrev,
    handlePreviousCard,
    handleNextCard
  };
};
