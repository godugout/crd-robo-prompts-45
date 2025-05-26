
import { isValidUUID } from './validationUtils';
import type { CardData } from './types';

export const prepareCardDataForSave = (cardData: CardData, cardId: string, userId: string) => {
  return {
    id: cardId,
    title: cardData.title.trim(),
    description: cardData.description?.trim() || '',
    creator_id: userId,
    design_metadata: cardData.design_metadata || {},
    image_url: cardData.image_url || null,
    thumbnail_url: cardData.thumbnail_url || null,
    rarity: cardData.rarity || 'common',
    tags: cardData.tags || [],
    is_public: cardData.is_public || false,
    // Only include template_id if it's a valid UUID, otherwise set to null
    template_id: (cardData.template_id && isValidUUID(cardData.template_id)) ? cardData.template_id : null,
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
};
