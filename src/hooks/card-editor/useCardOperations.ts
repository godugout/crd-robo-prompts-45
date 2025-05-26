
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase-client';
import { useCustomAuth } from '@/features/auth/hooks/useCustomAuth';
import type { CardData } from './types';

export const useCardOperations = (
  cardData: CardData,
  updateCardData: (data: Partial<CardData>) => void
) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { user } = useCustomAuth();

  const saveCard = async (): Promise<boolean> => {
    if (!user) {
      toast.error('Please sign in to save cards');
      return false;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('cards')
        .upsert({
          id: cardData.id,
          title: cardData.title,
          description: cardData.description,
          creator_id: user.id,
          design_metadata: cardData.design_metadata,
          image_url: cardData.image_url,
          thumbnail_url: cardData.thumbnail_url,
          rarity: cardData.rarity,
          tags: cardData.tags,
          is_public: cardData.is_public || false,
          template_id: cardData.template_id && cardData.template_id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i) ? cardData.template_id : null,
          creator_attribution: cardData.creator_attribution,
          publishing_options: cardData.publishing_options,
          verification_status: 'pending',
          print_metadata: cardData.print_metadata
        });

      if (error) {
        console.error('Error saving card:', error);
        toast.error('Failed to save card');
        return false;
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
    if (!user) {
      toast.error('Please sign in to publish cards');
      return false;
    }

    try {
      const { error } = await supabase
        .from('cards')
        .update({ is_public: true })
        .eq('id', cardData.id);

      if (error) {
        console.error('Error publishing card:', error);
        toast.error('Failed to publish card');
        return false;
      }
      
      updateCardData({ is_public: true });
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
