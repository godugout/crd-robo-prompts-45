
import { useState } from 'react';
import { useTags } from '@/components/memory/hooks/useTags';
import { useAutoSave } from './card-editor/useAutoSave';
import { useCardOperations } from './card-editor/useCardOperations';
import type { CardData, UseCardEditorOptions } from './card-editor/types';

export type { CardData, CardRarity } from './card-editor/types';

export const useCardEditor = (options: UseCardEditorOptions = {}) => {
  const {
    initialData = {},
    autoSave = true,
    autoSaveInterval = 10000,
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
    visibility: initialData.visibility || 'private',
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

  const { saveCard, publishCard, isSaving, lastSaved } = useCardOperations(
    cardData,
    updateCardData
  );

  useAutoSave(cardData, isDirty, saveCard, autoSave, autoSaveInterval);

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
