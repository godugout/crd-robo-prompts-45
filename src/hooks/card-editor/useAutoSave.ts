
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { CardData } from './types';

export const useAutoSave = (
  cardData: CardData,
  isDirty: boolean,
  saveCard: () => Promise<boolean>,
  autoSave: boolean,
  autoSaveInterval: number
) => {
  useEffect(() => {
    if (!autoSave || !isDirty) return;
    
    const timer = setTimeout(() => {
      if (isDirty) {
        saveCard();
      }
    }, autoSaveInterval);
    
    return () => clearTimeout(timer);
  }, [cardData, isDirty, autoSave, autoSaveInterval, saveCard]);
};
