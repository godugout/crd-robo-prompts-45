
import type { ExtractedCard } from '@/services/cardExtractor';
import { useCardDetectionState } from './useCardDetectionState';
import { useCardDetectionActions } from './useCardDetectionActions';

export type { EnhancedDialogStep, ManualRegion, DragState } from './types';

export const useEnhancedCardDetection = (onCardsExtracted: (cards: ExtractedCard[]) => void) => {
  const state = useCardDetectionState();
  const actions = useCardDetectionActions({
    dialogState: state.dialogState,
    imageProcessing: state.imageProcessing,
    cardExtraction: state.cardExtraction,
    onCardsExtracted
  });

  return {
    // State from all hooks
    ...state,
    
    // Actions
    ...actions
  };
};
