
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useTags } from '@/components/memory/hooks/useTags';
import { useLocalAutoSave } from './card-editor/useLocalAutoSave';
import { useCardOperations } from './card-editor/useCardOperations';
import { localCardStorage } from '@/lib/localCardStorage';
import type { CardData, UseCardEditorOptions, CardRarity, CardVisibility, DesignTemplate, PublishingOptions, CreatorAttribution } from './card-editor/types';

export type { CardData, CardRarity, CardVisibility, DesignTemplate, PublishingOptions, CreatorAttribution } from './card-editor/types';

// UUID validation function
const isValidUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

// Clean template_id - if it's not a valid UUID, return null
const cleanTemplateId = (templateId: string | undefined): string | undefined => {
  if (!templateId) return undefined;
  if (templateId === 'default' || templateId === 'neon' || !isValidUUID(templateId)) {
    console.warn(`Invalid template_id detected: ${templateId}, setting to null`);
    return undefined;
  }
  return templateId;
};

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
      template_id: cleanTemplateId(initialData.template_id), // Clean template_id
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
          rarity: localCard.rarity as CardRarity,
          template_id: cleanTemplateId(localCard.template_id) // Clean template_id from local storage too
        };
      }
    }

    console.log('Initialized card data:', baseData);
    return baseData;
  });

  const [isDirty, setIsDirty] = useState(false);

  const updateCardData = (updates: Partial<CardData>) => {
    // Clean any template_id in updates
    if (updates.template_id !== undefined) {
      updates.template_id = cleanTemplateId(updates.template_id);
    }
    
    console.log('Updating card data:', updates);
    setCardData(prev => ({ ...prev, ...updates }));
    setIsDirty(true);
  };

  const updateCardField = <K extends keyof CardData>(
    field: K, 
    value: CardData[K]
  ) => {
    // Clean template_id if that's what's being updated
    let cleanValue = value;
    if (field === 'template_id' && typeof value === 'string') {
      cleanValue = cleanTemplateId(value) as CardData[K];
    }
    
    console.log(`Updating card field ${field}:`, { original: value, cleaned: cleanValue });
    setCardData(prev => ({
      ...prev,
      [field]: cleanValue
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
