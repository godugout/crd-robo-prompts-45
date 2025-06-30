
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { CardRarity } from '@/types/card';

interface CardData {
  id?: string;
  title: string;
  description: string;
  image_url: string;
  thumbnail_url: string;
  rarity: CardRarity;
  template_id: string;
  tags: string[];
  is_public: boolean;
}

export const useSimpleCardEditor = () => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  
  const [cardData, setCardData] = useState<CardData>({
    title: '',
    description: '',
    image_url: '',
    thumbnail_url: '',
    rarity: 'common',
    template_id: '',
    tags: [],
    is_public: false,
  });

  const updateField = useCallback((field: keyof CardData, value: any) => {
    setCardData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const saveCard = useCallback(async (publishImmediately: boolean = false) => {
    if (!user) {
      toast.error('Please sign in to save cards');
      return false;
    }

    if (!cardData.title.trim()) {
      toast.error('Please enter a card title');
      return false;
    }

    setIsSaving(true);
    
    try {
      const { data, error } = await supabase
        .from('cards')
        .insert({
          title: cardData.title,
          description: cardData.description,
          image_url: cardData.image_url,
          thumbnail_url: cardData.thumbnail_url || cardData.image_url,
          rarity: cardData.rarity,
          template_id: cardData.template_id || null,
          tags: cardData.tags,
          is_public: publishImmediately || cardData.is_public,
          creator_id: user.id,
          edition_size: 1,
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving card:', error);
        toast.error('Failed to save card: ' + error.message);
        return false;
      }

      // Update local state with the returned card ID
      setCardData(prev => ({ ...prev, id: data.id }));
      
      toast.success(publishImmediately ? 'Card published successfully!' : 'Card saved successfully!');
      return true;
    } catch (error) {
      console.error('Unexpected error saving card:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [user, cardData]);

  const publishCard = useCallback(async () => {
    return await saveCard(true);
  }, [saveCard]);

  return {
    cardData,
    updateField,
    saveCard,
    publishCard,
    isSaving,
  };
};
