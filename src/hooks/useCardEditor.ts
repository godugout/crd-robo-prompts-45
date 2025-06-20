
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { CardData, CardRarity, CardVisibility, CreatorAttribution, PublishingOptions } from '@/types/card';

// Re-export types for backwards compatibility
export type { CardData, CardRarity, CardVisibility, CreatorAttribution, PublishingOptions } from '@/types/card';

export interface DesignTemplate {
  id: string;
  name: string;
  category: string;
  description?: string;
  preview_url?: string;
  template_data: Record<string, any>;
  is_premium: boolean;
  usage_count: number;
  tags: string[];
}

export interface UseCardEditorOptions {
  initialData?: Partial<CardData>;
  autoSave?: boolean;
  autoSaveInterval?: number;
}

// Helper function to check if a string is a valid UUID
const isValidUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

export const useCardEditor = (options: UseCardEditorOptions = {}) => {
  const { user } = useAuth();
  const { initialData = {}, autoSave = false, autoSaveInterval = 30000 } = options;
  
  const [cardData, setCardData] = useState<CardData>({
    id: initialData.id || uuidv4(),
    title: initialData.title || 'My New Card',
    description: initialData.description || '',
    image_url: initialData.image_url,
    thumbnail_url: initialData.thumbnail_url,
    rarity: initialData.rarity || 'common',
    tags: initialData.tags || [],
    design_metadata: initialData.design_metadata || {},
    visibility: initialData.visibility || 'private',
    is_public: initialData.is_public || false,
    template_id: initialData.template_id,
    creator_attribution: initialData.creator_attribution || {
      collaboration_type: 'solo'
    },
    publishing_options: initialData.publishing_options || {
      marketplace_listing: false,
      crd_catalog_inclusion: true,
      print_available: false,
      pricing: {
        currency: 'USD'
      },
      distribution: {
        limited_edition: false
      }
    },
    user_id: user?.id,
    creator_id: initialData.creator_id || user?.id,
    price: initialData.price,
    created_at: initialData.created_at,
    updated_at: initialData.updated_at,
    shop_id: initialData.shop_id,
    collection_id: initialData.collection_id,
    team_id: initialData.team_id,
    print_metadata: initialData.print_metadata || {}
  });

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (user?.id && !cardData.user_id) {
      setCardData(prev => ({ ...prev, user_id: user.id, creator_id: user.id }));
    }
  }, [user?.id, cardData.user_id]);

  const updateCardField = <K extends keyof CardData>(field: K, value: CardData[K]) => {
    setCardData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const updateDesignMetadata = (key: string, value: any) => {
    setCardData(prev => ({
      ...prev,
      design_metadata: { ...prev.design_metadata, [key]: value }
    }));
    setIsDirty(true);
  };

  // Tag management
  const tags = cardData.tags;
  const hasMaxTags = tags.length >= 10;

  const addTag = (tag: string) => {
    if (!hasMaxTags && !tags.includes(tag)) {
      updateCardField('tags', [...tags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateCardField('tags', tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInput = (input: string) => {
    const newTags = input.split(',').map(tag => tag.trim()).filter(Boolean);
    const uniqueTags = [...new Set([...tags, ...newTags])].slice(0, 10);
    updateCardField('tags', uniqueTags);
  };

  const saveCard = async (): Promise<boolean> => {
    console.log('Starting card save...', { cardData, user });
    
    if (!user) {
      toast.error('Please sign in to save cards');
      return false;
    }

    // Ensure minimum required data
    const finalCardData = {
      ...cardData,
      title: cardData.title?.trim() || 'My New Card',
      user_id: user.id,
      creator_id: user.id // Ensure creator_id is set
    };

    setIsSaving(true);
    try {
      // Convert to database format with proper JSON fields
      const cardToSave = {
        id: finalCardData.id,
        title: finalCardData.title,
        description: finalCardData.description || null,
        rarity: finalCardData.rarity,
        tags: finalCardData.tags,
        image_url: finalCardData.image_url || null,
        thumbnail_url: finalCardData.thumbnail_url || null,
        design_metadata: finalCardData.design_metadata as any,
        is_public: finalCardData.visibility === 'public',
        // Only set template_id if it's a valid UUID, otherwise store in design_metadata
        template_id: (finalCardData.template_id && isValidUUID(finalCardData.template_id)) ? finalCardData.template_id : null,
        creator_attribution: finalCardData.creator_attribution as any,
        publishing_options: finalCardData.publishing_options as any,
        user_id: user.id,
        creator_id: user.id, // Add creator_id for database
        price: finalCardData.price || null,
        created_at: finalCardData.created_at,
        updated_at: finalCardData.updated_at,
        // Only include optional fields if they have valid values
        shop_id: (finalCardData.shop_id && isValidUUID(finalCardData.shop_id)) ? finalCardData.shop_id : null,
        collection_id: (finalCardData.collection_id && isValidUUID(finalCardData.collection_id)) ? finalCardData.collection_id : null,
        team_id: (finalCardData.team_id && isValidUUID(finalCardData.team_id)) ? finalCardData.team_id : null,
        print_metadata: finalCardData.print_metadata || {},
        edition_size: 1,
        marketplace_listing: false,
        print_available: false,
        crd_catalog_inclusion: true,
        verification_status: 'pending'
      };

      // If template_id is not a valid UUID, store it in design_metadata instead
      if (finalCardData.template_id && !isValidUUID(finalCardData.template_id)) {
        cardToSave.design_metadata = {
          ...cardToSave.design_metadata,
          template_reference: finalCardData.template_id
        };
      }

      console.log('Attempting to save card:', cardToSave);

      const { data, error } = await supabase
        .from('cards')
        .upsert(cardToSave, { onConflict: 'id' })
        .select()
        .single();

      if (error) {
        console.error('Supabase error saving card:', error);
        toast.error(`Failed to save card: ${error.message}`);
        return false;
      }

      console.log('Card saved successfully:', data);
      setLastSaved(new Date());
      setIsDirty(false);
      toast.success('Card saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving card:', error);
      toast.error('Failed to save card. Please try again.');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const publishCard = async (): Promise<boolean> => {
    const saved = await saveCard();
    if (!saved) return false;

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

      updateCardField('is_public', true);
      updateCardField('visibility', 'public');
      toast.success('Card published successfully');
      return true;
    } catch (error) {
      console.error('Error publishing card:', error);
      toast.error('Failed to publish card');
      return false;
    }
  };

  return {
    cardData,
    updateCardField,
    updateDesignMetadata,
    saveCard,
    publishCard,
    isSaving,
    lastSaved,
    isDirty,
    tags,
    addTag,
    removeTag,
    handleTagInput,
    hasMaxTags
  };
};
