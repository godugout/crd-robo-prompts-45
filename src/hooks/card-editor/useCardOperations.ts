
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase-client';
import type { CardData } from './types';

export const useCardOperations = (cardData: CardData, updateCardData: (data: Partial<CardData>) => void) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const saveCard = async (): Promise<boolean> => {
    setIsSaving(true);
    try {
      if (cardData.id) {
        const { error } = await supabase
          .from('cards')
          .update({
            title: cardData.title,
            description: cardData.description,
            design_metadata: cardData.design_metadata,
            image_url: cardData.image_url,
            rarity: cardData.rarity,
            tags: cardData.tags,
          })
          .eq('id', cardData.id);
        
        if (error) throw error;
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error('Please log in to save cards');
          return false;
        }

        const { data, error } = await supabase
          .from('cards')
          .insert({
            title: cardData.title,
            description: cardData.description,
            creator_id: user.id,
            design_metadata: cardData.design_metadata,
            image_url: cardData.image_url,
            rarity: cardData.rarity,
            tags: cardData.tags,
            is_public: cardData.visibility === 'public',
          })
          .select()
          .single();
        
        if (error) throw error;
        if (data) {
          updateCardData({ id: data.id });
        }
      }

      setLastSaved(new Date());
      toast.success('Card saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving card:', error);
      toast.error('Failed to save card');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const publishCard = async (): Promise<boolean> => {
    try {
      if (!cardData.id) {
        const saved = await saveCard();
        if (!saved) return false;
      }

      const { error } = await supabase
        .from('cards')
        .update({ is_public: true })
        .eq('id', cardData.id);
      
      if (error) throw error;
      
      updateCardData({ visibility: 'public' });
      toast.success('Card published successfully');
      return true;
    } catch (error) {
      console.error('Error publishing card:', error);
      toast.error('Failed to publish card');
      return false;
    }
  };

  return {
    saveCard,
    publishCard,
    isSaving,
    lastSaved
  };
};
