
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CardData {
  title: string;
  description: string;
  imageUrl: string;
  frameId: string;
  rarity: string;
}

export const useCardSaver = () => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const saveCard = async (cardData: CardData): Promise<string | null> => {
    if (!user) {
      toast.error('Please sign in to save cards');
      return null;
    }

    if (!cardData.title.trim()) {
      toast.error('Please enter a card title');
      return null;
    }

    setIsSaving(true);
    
    try {
      const { data, error } = await supabase
        .from('cards')
        .insert({
          title: cardData.title,
          description: cardData.description,
          image_url: cardData.imageUrl,
          thumbnail_url: cardData.imageUrl,
          rarity: cardData.rarity || 'common',
          template_id: null, // Set to null since frameId is not a UUID
          tags: ['custom', 'created'],
          is_public: true,
          creator_id: user.id,
          edition_size: 1,
          design_metadata: {
            frameId: cardData.frameId, // Store frame ID here instead
            version: '1.0'
          }
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving card:', error);
        toast.error('Failed to save card: ' + error.message);
        return null;
      }

      toast.success('Card saved successfully!');
      return data.id;
    } catch (error) {
      console.error('Unexpected error saving card:', error);
      toast.error('An unexpected error occurred');
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveCard,
    isSaving
  };
};
