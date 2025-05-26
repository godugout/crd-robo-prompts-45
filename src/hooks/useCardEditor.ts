
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useTags } from '@/components/memory/hooks/useTags';
import { useLocalAutoSave } from './card-editor/useLocalAutoSave';
import { useCardOperations } from './card-editor/useCardOperations';
import { localCardStorage } from '@/lib/localCardStorage';
import type { CardData, UseCardEditorOptions, CardRarity, CardVisibility, DesignTemplate, PublishingOptions, CreatorAttribution } from './card-editor/types';

export type { CardData, CardRarity, CardVisibility, DesignTemplate, PublishingOptions, CreatorAttribution } from './card-editor/types';

export const useCardEditor = (options: UseCardEditorOptions = {}) => {
  const {
    initialData = {},
    autoSave = true,
    autoSaveInterval = 5000,
  } = options;

  // Initialize card data with proper defaults and unique ID
  const [cardData, setCardData] = useState<CardData>(() => {
    const baseData: CardData = {
      id: initialData.id || uuidv4(),
      title: initialData.title || '',
      description: initialData.description || '',
      type: initialData.type || 'Handcrafted',
      series: initialData.series || '80s VCR',
      category: initialData.category || 'Movies',
      rarity: (initialData.rarity as CardRarity) || 'common',
      tags: initialData.tags || [],
      image_url: initialData.image_url,
      design_metadata: initialData.design_metadata || {},
      visibility: initialData.visibility || 'private',
      is_public: initialData.is_public || false,
      shop_id: initialData.shop_id,
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
      verification_status: initialData.verification_status || 'pending',
      print_metadata: initialData.print_metadata || {}
    };

    // Load from local storage if available
    if (initialData.id) {
      const localCard = localCardStorage.getCard(initialData.id);
      if (localCard) {
        return {
          ...baseData,
          ...localCard,
          id: localCard.id,
          rarity: localCard.rarity as CardRarity
        };
      }
    }

    return baseData;
  });

  const [isDirty, setIsDirty] = useState(false);

  const updateCardData = (updates: Partial<CardData>) => {
    setCardData(prev => ({ ...prev, ...updates }));
    setIsDirty(true);
  };

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

  const { saveCard: saveCardToServer, publishCard, isSaving, lastSaved } = useCardOperations(
    cardData,
    updateCardData
  );

  const { lastSaveTime, forceSyncToServer } = useLocalAutoSave(
    cardData,
    isDirty,
    updateCardData,
    autoSave ? autoSaveInterval : 0
  );

  // Reset dirty state after local save
  useEffect(() => {
    if (lastSaveTime > 0) {
      setIsDirty(false);
    }
  }, [lastSaveTime]);

  const saveCard = async (): Promise<boolean> => {
    try {
      // Ensure we have a title before saving
      if (!cardData.title?.trim()) {
        updateCardData({ title: 'Untitled Card' });
      }
      
      const success = await saveCardToServer();
      if (success) {
        setIsDirty(false);
      }
      return success;
    } catch (error) {
      console.error('Error saving card:', error);
      return false;
    }
  };

  return {
    cardData,
    updateCardData,
    updateCardField,
    updateDesignMetadata,
    saveCard,
    publishCard,
    isLoading: false,
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
