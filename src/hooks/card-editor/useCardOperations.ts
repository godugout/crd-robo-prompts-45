
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase-client';
import { useCustomAuth } from '@/features/auth/hooks/useCustomAuth';
import { v4 as uuidv4 } from 'uuid';
import type { CardData } from './types';

// UUID validation function
const isValidUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

// Validation function for card data
const validateCardData = (cardData: CardData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate required fields
  if (!cardData.title?.trim()) {
    errors.push('Title is required');
  }

  // Validate UUID fields
  if (cardData.id && !isValidUUID(cardData.id)) {
    errors.push(`Invalid card ID format: ${cardData.id}`);
  }

  if (cardData.template_id && !isValidUUID(cardData.template_id)) {
    errors.push(`Invalid template_id format: ${cardData.template_id}`);
  }

  if (cardData.shop_id && !isValidUUID(cardData.shop_id)) {
    errors.push(`Invalid shop_id format: ${cardData.shop_id}`);
  }

  if (cardData.collection_id && !isValidUUID(cardData.collection_id)) {
    errors.push(`Invalid collection_id format: ${cardData.collection_id}`);
  }

  if (cardData.team_id && !isValidUUID(cardData.team_id)) {
    errors.push(`Invalid team_id format: ${cardData.team_id}`);
  }

  // Validate rarity enum
  const validRarities = ['common', 'rare', 'legendary'];
  if (cardData.rarity && !validRarities.includes(cardData.rarity)) {
    errors.push(`Invalid rarity: ${cardData.rarity}. Must be one of: ${validRarities.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

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

      // Validate required fields
      if (!cardData.title?.trim()) {
        toast.error('Please enter a card title');
        return false;
      }

      // Clean and prepare the card data for saving
      const cardToSave = {
        id: cardId,
        title: cardData.title.trim(),
        description: cardData.description?.trim() || '',
        creator_id: user.id, // Ensure this is set to the authenticated user's ID
        design_metadata: {
          ...(cardData.design_metadata || {}),
          // Store frame ID as string in design_metadata instead of template_id
          frameId: cardData.template_id || null
        },
        image_url: cardData.image_url || null,
        thumbnail_url: cardData.thumbnail_url || null,
        rarity: cardData.rarity || 'common',
        tags: cardData.tags || [],
        is_public: cardData.is_public || false,
        // Set template_id to null since we're storing frame info in design_metadata
        template_id: null,
        // Only include shop_id if it's a valid UUID, otherwise set to null
        shop_id: (cardData.shop_id && isValidUUID(cardData.shop_id)) ? cardData.shop_id : null,
        // Only include collection_id if it's a valid UUID, otherwise set to null
        collection_id: (cardData.collection_id && isValidUUID(cardData.collection_id)) ? cardData.collection_id : null,
        // Only include team_id if it's a valid UUID, otherwise set to null
        team_id: (cardData.team_id && isValidUUID(cardData.team_id)) ? cardData.team_id : null,
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

      console.log('Attempting to save card with validated data:', { 
        cardId: cardToSave.id, 
        userId: user.id, 
        isAuthenticated: !!user,
        title: cardToSave.title,
        creator_id: cardToSave.creator_id,
        frameId: cardToSave.design_metadata.frameId
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
      
      setLastSaved(new Date());
      toast.success('Card saved successfully!');
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
