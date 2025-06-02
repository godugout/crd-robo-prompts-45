
import type { CardData, CardRarity } from '@/hooks/useCardEditor';

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
      design_metadata: card.design_metadata || {},
      visibility: 'public',
      creator_attribution: {
        creator_name: '',
        creator_id: card.creator_id
      },
      publishing_options: {
        marketplace_listing: false,
        crd_catalog_inclusion: true,
        print_available: false,
        pricing: {
          currency: 'USD'
        }
      }
    }));
  };

  return { convertCardsToCardData };
};
