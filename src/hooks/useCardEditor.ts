
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase-client';
import { useTags } from '@/components/memory/hooks/useTags';

export type CardRarity = 'common' | 'uncommon' | 'rare' | 'legendary' | 'mythic';

export interface CardData {
  id?: string;
  title: string;
  description: string;
  type: string;
  series: string;
  category: string;
  rarity: CardRarity;
  tags: string[];
  image_url?: string;
  design_metadata: Record<string, any>;
  creator_id?: string;
  visibility: 'private' | 'public' | 'shared';
}

interface UseCardEditorOptions {
  initialData?: Partial<CardData>;
  autoSave?: boolean;
  autoSaveInterval?: number;
}

export const useCardEditor = (options: UseCardEditorOptions = {}) => {
  const {
    initialData = {},
    autoSave = true,
    autoSaveInterval = 10000, // 10 seconds
  } = options;

  const [cardData, setCardData] = useState<CardData>({
    title: initialData.title || '',
    description: initialData.description || '',
    type: initialData.type || 'Handcrafted',
    series: initialData.series || '80s VCR',
    category: initialData.category || 'Movies',
    rarity: initialData.rarity || 'common',
    tags: initialData.tags || [],
    image_url: initialData.image_url,
    design_metadata: initialData.design_metadata || {},
    visibility: initialData.visibility || 'private'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const { 
    tags, 
    addTag, 
    removeTag, 
    handleTagInput, 
    hasMaxTags 
  } = useTags(cardData.tags || [], {
    maxTags: 10,
    validateTag: (tag) => tag.length <= 20 && /^[A-Za-z0-9\s-]+$/.test(tag),
    onTagAdded: (tag) => updateCardField('tags', [...(cardData.tags || []), tag]),
    onTagRemoved: (tag) => updateCardField('tags', cardData.tags.filter(t => t !== tag))
  });

  useEffect(() => {
    // Set up auto-save
    if (!autoSave || !isDirty) return;
    
    const timer = setTimeout(() => {
      if (isDirty) {
        saveCard();
      }
    }, autoSaveInterval);
    
    return () => clearTimeout(timer);
  }, [cardData, isDirty, autoSave, autoSaveInterval]);

  // Update a field in the card data
  const updateCardField = <K extends keyof CardData>(
    field: K, 
    value: CardData[K]
  ) => {
    setCardData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
  };

  // Update design metadata
  const updateDesignMetadata = (key: string, value: any) => {
    setCardData(prev => ({
      ...prev,
      design_metadata: {
        ...prev.design_metadata,
        [key]: value
      }
    }));
    setIsDirty(true);
  };

  // Save the card to the database
  const saveCard = async (): Promise<boolean> => {
    setIsSaving(true);
    try {
      // If we have an ID, update the existing card
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
        // Check if user is logged in
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error('Please log in to save cards');
          return false;
        }

        // Create a new card
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
          setCardData(prev => ({
            ...prev,
            id: data.id
          }));
        }
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

  // Publish the card (make it public)
  const publishCard = async (): Promise<boolean> => {
    try {
      if (!cardData.id) {
        // Save the card first if it's new
        const saved = await saveCard();
        if (!saved) return false;
      }

      const { error } = await supabase
        .from('cards')
        .update({ is_public: true })
        .eq('id', cardData.id);
      
      if (error) throw error;
      
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
    isLoading,
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
