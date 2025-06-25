
import type { CardData, CardRarity, PublishingOptions, CreatorAttribution } from '@/types/card';

interface Card {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  thumbnail_url?: string;
  creator_id: string;
  rarity: string;
  tags: string[];
  design_metadata: Record<string, any>;
  is_public?: boolean;
  creator_attribution?: Record<string, any>;
  publishing_options?: Record<string, any>;
  created_at?: string;
}

export const useCardConversion = () => {
  const convertCardsToCardData = (cards: Card[]): CardData[] => {
    return cards.map(card => ({
      id: card.id,
      title: card.title,
      description: card.description || '',
      image_url: card.image_url,
      thumbnail_url: card.thumbnail_url,
      rarity: (card.rarity as CardRarity) || 'common',
      tags: card.tags || [],
      creator_id: card.creator_id,
      created_at: card.created_at || new Date().toISOString(),
      design_metadata: card.design_metadata || {},
      visibility: card.is_public ? 'public' : 'private',
      is_public: card.is_public || false,
      creator_attribution: (card.creator_attribution || {
        creator_name: '',
        creator_id: card.creator_id,
        collaboration_type: 'solo'
      }) as CreatorAttribution,
      publishing_options: (card.publishing_options || {
        marketplace_listing: false,
        crd_catalog_inclusion: true,
        print_available: false,
        pricing: { currency: 'USD' },
        distribution: { limited_edition: false }
      }) as PublishingOptions
    }));
  };

  return { convertCardsToCardData };
};
