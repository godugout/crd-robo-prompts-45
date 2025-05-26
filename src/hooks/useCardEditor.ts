
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type CardVisibility = 'private' | 'public' | 'shared';

export interface CreatorAttribution {
  creator_name?: string;
  creator_id?: string;
  collaboration_type?: 'solo' | 'collaboration' | 'commission';
  additional_credits?: Array<{
    name: string;
    role: string;
  }>;
}

export interface PublishingOptions {
  marketplace_listing: boolean;
  crd_catalog_inclusion: boolean;
  print_available: boolean;
  pricing?: {
    base_price?: number;
    print_price?: number;
    currency: string;
  };
  distribution?: {
    limited_edition: boolean;
    edition_size?: number;
  };
}

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

export interface CardData {
  id?: string;
  title: string;
  description?: string;
  type?: string;
  series?: string;
  category?: string;
  rarity: CardRarity;
  tags: string[];
  image_url?: string;
  thumbnail_url?: string;
  design_metadata: Record<string, any>;
  visibility: CardVisibility;
  is_public?: boolean;
  shop_id?: string;
  template_id?: string;
  collection_id?: string;
  team_id?: string;
  creator_attribution: CreatorAttribution;
  publishing_options: PublishingOptions;
  verification_status?: 'pending' | 'verified' | 'rejected';
  print_metadata?: Record<string, any>;
  creator_id?: string;
}

export interface UseCardEditorOptions {
  initialData?: Partial<CardData>;
  autoSave?: boolean;
  autoSaveInterval?: number;
}

export const useCardEditor = (options: UseCardEditorOptions = {}) => {
  const { user } = useAuth();
  const { initialData = {}, autoSave = false, autoSaveInterval = 30000 } = options;
  
  const [cardData, setCardData] = useState<CardData>({
    id: initialData.id || uuidv4(),
    title: initialData.title || '',
    description: initialData.description || '',
    type: initialData.type || '',
    series: initialData.series || '',
    category: initialData.category || '',
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
    creator_id: user?.id
  });

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (user?.id && !cardData.creator_id) {
      setCardData(prev => ({ ...prev, creator_id: user.id }));
    }
  }, [user?.id, cardData.creator_id]);

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
      // Convert to database format with proper JSON fields
      const cardToSave = {
        id: cardData.id,
        title: cardData.title.trim(),
        description: cardData.description,
        type: cardData.type,
        series: cardData.series,
        category: cardData.category,
        rarity: cardData.rarity,
        tags: cardData.tags,
        image_url: cardData.image_url,
        thumbnail_url: cardData.thumbnail_url,
        design_metadata: cardData.design_metadata as any,
        visibility: cardData.visibility,
        is_public: cardData.visibility === 'public',
        shop_id: cardData.shop_id,
        template_id: cardData.template_id,
        collection_id: cardData.collection_id,
        team_id: cardData.team_id,
        creator_attribution: cardData.creator_attribution as any,
        publishing_options: cardData.publishing_options as any,
        verification_status: cardData.verification_status,
        print_metadata: cardData.print_metadata as any,
        creator_id: user.id
      };

      const { error } = await supabase
        .from('cards')
        .upsert(cardToSave, { onConflict: 'id' });

      if (error) {
        console.error('Error saving card:', error);
        toast.error('Failed to save card');
        return false;
      }

      setLastSaved(new Date());
      setIsDirty(false);
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
    const saved = await saveCard();
    if (!saved) return false;

    try {
      const { error } = await supabase
        .from('cards')
        .update({ is_public: true, visibility: 'public' })
        .eq('id', cardData.id);

      if (error) {
        toast.error('Failed to publish card');
        return false;
      }

      updateCardField('is_public', true);
      updateCardField('visibility', 'public');
      toast.success('Card published successfully');
      return true;
    } catch (error) {
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
