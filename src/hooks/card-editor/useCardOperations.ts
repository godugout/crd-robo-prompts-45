
import { useState } from 'react';
import { toast } from 'sonner';
import { useCustomAuth } from '@/features/auth/hooks/useCustomAuth';
import { v4 as uuidv4 } from 'uuid';
import { saveCardToDatabase, publishCardToDatabase } from './cardSaveService';
import type { CardData } from './types';

export const useCardOperations = (
  cardData: CardData,
  updateCardData: (data: Partial<CardData>) => void
) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { user } = useCustomAuth();

  const saveCard = async (): Promise<boolean> => {
    setIsSaving(true);
    try {
      // Check if user is authenticated first
      if (!user?.id) {
        console.error('User not authenticated');
        toast.error('Please sign in to save cards');
        return false;
      }

      // Ensure we have a card ID
      let cardId = cardData.id;
      if (!cardId) {
        cardId = uuidv4();
        updateCardData({ id: cardId });
      }

      const success = await saveCardToDatabase(cardData, cardId, user.id);
      
      if (success) {
        setLastSaved(new Date());
      }
      
      return success;
    } finally {
      setIsSaving(false);
    }
  };

  const publishCard = async (): Promise<boolean> => {
    if (!user) {
      toast.error('Please sign in to publish cards');
      return false;
    }

    if (!cardData.id) {
      toast.error('Please save the card first before publishing');
      return false;
    }

    const success = await publishCardToDatabase(cardData.id);
    
    if (success) {
      updateCardData({ is_public: true });
    }
    
    return success;
  };

  return {
    saveCard,
    publishCard,
    isSaving,
    lastSaved
  };
};
