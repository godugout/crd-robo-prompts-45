
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';
import { useCustomAuth } from '@/features/auth/hooks/useCustomAuth';
import type { CardData, CardRarity } from '@/types/card';

export const useSimpleCardEditor = () => {
  const { user } = useCustomAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const [cardData, setCardData] = useState<CardData>({
    id: uuidv4(),
    title: '',
    description: '',
    rarity: 'common' as CardRarity,
    tags: [],
    design_metadata: {},
    visibility: 'private',
    creator_attribution: { collaboration_type: 'solo' },
    publishing_options: {
      marketplace_listing: false,
      crd_catalog_inclusion: true,
      print_available: false,
      pricing: { currency: 'USD' },
      distribution: { limited_edition: false }
    }
  });

  const updateField = <K extends keyof CardData>(field: K, value: CardData[K]) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const saveCard = async (): Promise<boolean> => {
    if (!user?.id) {
      toast.error('Please sign in to save cards');
      return false;
    }

    if (!cardData.title.trim()) {
      toast.error('Please enter a card title');
      return false;
    }

    setIsSaving(true);
    try {
      // Prepare data for database - only include fields that exist in the schema
      const dbCard = {
        id: cardData.id,
        title: cardData.title.trim(),
        description: cardData.description?.trim() || null,
        creator_id: user.id,
        rarity: cardData.rarity,
        tags: cardData.tags,
        image_url: cardData.image_url || null,
        thumbnail_url: cardData.thumbnail_url || null,
        design_metadata: cardData.design_metadata,
        is_public: cardData.visibility === 'public',
        template_id: cardData.template_id || null,
        collection_id: cardData.collection_id || null,
        team_id: cardData.team_id || null,
        creator_attribution: cardData.creator_attribution,
        publishing_options: cardData.publishing_options,
        verification_status: 'pending' as const,
        print_metadata: cardData.print_metadata || {},
        price: cardData.price || null,
        edition_size: cardData.edition_size || 1,
        marketplace_listing: cardData.publishing_options.marketplace_listing,
        crd_catalog_inclusion: cardData.publishing_options.crd_catalog_inclusion,
        print_available: cardData.publishing_options.print_available
      };

      const { error } = await supabase
        .from('cards')
        .upsert(dbCard, { onConflict: 'id' });

      if (error) {
        console.error('Save error:', error);
        toast.error(`Failed to save: ${error.message}`);
        return false;
      }

      setLastSaved(new Date());
      toast.success('Card saved successfully!');
      return true;
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save card');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const publishCard = async (): Promise<boolean> => {
    // First save the card
    const saved = await saveCard();
    if (!saved) return false;

    try {
      const { error } = await supabase
        .from('cards')
        .update({ is_public: true })
        .eq('id', cardData.id);

      if (error) {
        toast.error('Failed to publish card');
        return false;
      }

      updateField('visibility', 'public');
      updateField('is_public', true);
      toast.success('Card published successfully!');
      return true;
    } catch (error) {
      toast.error('Failed to publish card');
      return false;
    }
  };

  return {
    cardData,
    updateField,
    saveCard,
    publishCard,
    isSaving,
    lastSaved
  };
};
