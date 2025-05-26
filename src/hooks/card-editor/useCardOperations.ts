
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase-client';
import { useCustomAuth } from '@/features/auth/hooks/useCustomAuth';
import { v4 as uuidv4 } from 'uuid';
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
      // Ensure we have a card ID
      let cardId = cardData.id;
      if (!cardId) {
        cardId = uuidv4();
        updateCardData({ id: cardId });
      }

      // Validate required fields
      if (!cardData.title?.trim()) {
        toast.error('Please enter a card title');
        return false;
      }

      // Prepare the card data for saving with all required fields
      const cardToSave = {
        id: cardId,
        title: cardData.title.trim(),
        description: cardData.description?.trim() || '',
        creator_id: user?.id || null,
        design_metadata: cardData.design_metadata || {},
        image_url: cardData.image_url || null,
        thumbnail_url: cardData.thumbnail_url || null,
        rarity: cardData.rarity || 'common',
        tags: cardData.tags || [],
        is_public: cardData.is_public || false,
        template_id: cardData.template_id || null,
        creator_attribution: cardData.creator_attribution || { collaboration_type: 'solo' },
        publishing_options: cardData.publishing_options || {
          marketplace_listing: false,
          crd_catalog_inclusion: true,
          print_available: false,
          pricing: { currency: 'USD' },
          distribution: { limited_edition: false }
        },
        verification_status: 'pending' as const,
        print_metadata: cardData.print_metadata || {},
        edition_size: 1,
        marketplace_listing: false,
        print_available: false,
        crd_catalog_inclusion: true
      };

      console.log('Attempting to save card:', { 
        cardId: cardToSave.id, 
        userId: user?.id, 
        isAuthenticated: !!user,
        title: cardToSave.title
      });

      const { error } = await supabase
        .from('cards')
        .upsert(cardToSave, { onConflict: 'id' });

      if (error) {
        console.error('Database error saving card:', error);
        toast.error(`Failed to save card: ${error.message}`);
        return false;
      }
      
      setLastSaved(new Date());
      if (user) {
        toast.success('Card saved to cloud successfully');
      } else {
        toast.success('Card saved locally (sign in to sync to cloud)');
      }
      return true;
    } catch (error) {
      console.error('Error saving card:', error);
      toast.error('Failed to save card to cloud');
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

    if (!cardData.id) {
      toast.error('Please save the card first before publishing');
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
