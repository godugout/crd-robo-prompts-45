
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';
import { prepareCardDataForSave } from './cardDataPreparation';
import { validateCardData } from './validationUtils';
import type { CardData } from './types';

export const saveCardToDatabase = async (
  cardData: CardData,
  cardId: string,
  userId: string
): Promise<boolean> => {
  try {
    // Validate required fields
    if (!cardData.title?.trim()) {
      toast.error('Please enter a card title');
      return false;
    }

    // Comprehensive validation
    const validation = validateCardData({ ...cardData, id: cardId });
    if (!validation.isValid) {
      console.error('Card validation failed:', validation.errors);
      toast.error(`Validation failed: ${validation.errors.join(', ')}`);
      return false;
    }

    // Clean and prepare the card data for saving
    const cardToSave = prepareCardDataForSave(cardData, cardId, userId);

    console.log('Attempting to save card with validated data:', { 
      cardId: cardToSave.id, 
      userId: userId, 
      title: cardToSave.title,
      creator_id: cardToSave.creator_id
    });

    const { error } = await supabase
      .from('cards')
      .upsert(cardToSave, { onConflict: 'id' });

    if (error) {
      console.error('Database error saving card:', error);
      if (error.message.includes('row-level security policy')) {
        toast.error('Authentication required. Please sign in to save cards.');
      } else {
        toast.error(`Failed to save card: ${error.message}`);
      }
      return false;
    }
    
    toast.success('Card saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving card:', error);
    toast.error('Failed to save card');
    return false;
  }
};

export const publishCardToDatabase = async (cardId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('cards')
      .update({ is_public: true })
      .eq('id', cardId);

    if (error) {
      console.error('Error publishing card:', error);
      toast.error('Failed to publish card');
      return false;
    }
    
    toast.success('Card published successfully');
    return true;
  } catch (error) {
    console.error('Error publishing card:', error);
    toast.error('Failed to publish card');
    return false;
  }
};
