
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
      // Get the current authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast.error('You must be logged in to save cards');
        return false;
      }

      if (cardData.id) {
        const { error } = await supabase
          .from('cards')
          .update({
            title: cardData.title,
            description: cardData.description,
            design_metadata: cardData.design_metadata,
            image_url: cardData.image_url,
            thumbnail_url: cardData.thumbnail_url,
            rarity: cardData.rarity,
            tags: cardData.tags,
            shop_id: cardData.shop_id,
            // Only include template_id if it's a valid UUID format
            template_id: cardData.template_id && cardData.template_id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i) ? cardData.template_id : null,
            marketplace_listing: cardData.publishing_options.marketplace_listing,
            crd_catalog_inclusion: cardData.publishing_options.crd_catalog_inclusion,
            print_available: cardData.publishing_options.print_available,
            publishing_options: cardData.publishing_options,
            creator_attribution: cardData.creator_attribution,
            print_metadata: cardData.print_metadata,
            updated_at: new Date().toISOString(),
          })
          .eq('id', cardData.id);
        
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('cards')
          .insert({
            title: cardData.title || 'Untitled Card',
            description: cardData.description,
            creator_id: user.id, // Use the authenticated user's ID
            design_metadata: cardData.design_metadata || {},
            image_url: cardData.image_url,
            thumbnail_url: cardData.thumbnail_url,
            rarity: cardData.rarity || 'common',
            tags: cardData.tags || [],
            is_public: cardData.visibility === 'public',
            shop_id: cardData.shop_id,
            // Only include template_id if it's a valid UUID format
            template_id: cardData.template_id && cardData.template_id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i) ? cardData.template_id : null,
            marketplace_listing: cardData.publishing_options.marketplace_listing || false,
            crd_catalog_inclusion: cardData.publishing_options.crd_catalog_inclusion !== false,
            print_available: cardData.publishing_options.print_available || false,
            publishing_options: cardData.publishing_options,
            creator_attribution: cardData.creator_attribution,
            verification_status: 'pending',
            print_metadata: cardData.print_metadata || {}
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
      // Get the current authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast.error('You must be logged in to publish cards');
        return false;
      }

      if (!cardData.id) {
        const saved = await saveCard();
        if (!saved) return false;
      }

      const { error } = await supabase
        .from('cards')
        .update({ 
          is_public: true,
          marketplace_listing: cardData.publishing_options.marketplace_listing,
          updated_at: new Date().toISOString()
        })
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
