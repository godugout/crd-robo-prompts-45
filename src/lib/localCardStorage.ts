
import { v4 as uuidv4 } from 'uuid';
import type { CardRarity, CardVisibility } from '@/hooks/useCardEditor';

export interface LocalCard {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  thumbnail_url?: string;
  design_metadata: Record<string, any>;
  rarity: CardRarity;
  tags: string[];
  template_id?: string;
  creator_attribution: any;
  publishing_options: any;
  print_metadata: Record<string, any>;
  is_public?: boolean;
  visibility?: CardVisibility;
  lastModified: number;
  needsSync: boolean;
  isLocal: boolean;
}

const LOCAL_CARDS_KEY = 'crd_local_cards';

export const localCardStorage = {
  saveCard: (cardData: Partial<LocalCard>): string => {
    const cards = localCardStorage.getAllCards();
    const cardId = cardData.id || uuidv4();
    
    const card: LocalCard = {
      id: cardId,
      title: cardData.title || 'Untitled Card',
      description: cardData.description,
      image_url: cardData.image_url,
      thumbnail_url: cardData.thumbnail_url,
      design_metadata: cardData.design_metadata || {},
      rarity: (cardData.rarity as CardRarity) || 'common',
      tags: cardData.tags || [],
      template_id: cardData.template_id,
      creator_attribution: cardData.creator_attribution || { collaboration_type: 'solo' },
      publishing_options: cardData.publishing_options || {
        marketplace_listing: false,
        crd_catalog_inclusion: true,
        print_available: false,
        pricing: { currency: 'USD' },
        distribution: { limited_edition: false }
      },
      print_metadata: cardData.print_metadata || {},
      is_public: cardData.is_public || false,
      visibility: cardData.visibility || 'private',
      lastModified: Date.now(),
      needsSync: true,
      isLocal: true
    };

    cards[cardId] = card;
    
    try {
      localStorage.setItem(LOCAL_CARDS_KEY, JSON.stringify(cards));
      console.log('Card saved to local storage:', cardId);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
    
    return cardId;
  },

  getCard: (id: string): LocalCard | null => {
    const cards = localCardStorage.getAllCards();
    return cards[id] || null;
  },

  getAllCards: (): Record<string, LocalCard> => {
    try {
      const stored = localStorage.getItem(LOCAL_CARDS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error reading local cards:', error);
      return {};
    }
  },

  getCardsNeedingSync: (): LocalCard[] => {
    const cards = localCardStorage.getAllCards();
    return Object.values(cards).filter(card => card.needsSync);
  },

  markAsSynced: (id: string): void => {
    const cards = localCardStorage.getAllCards();
    if (cards[id]) {
      cards[id].needsSync = false;
      cards[id].isLocal = false;
      try {
        localStorage.setItem(LOCAL_CARDS_KEY, JSON.stringify(cards));
        console.log('Card marked as synced:', id);
      } catch (error) {
        console.error('Failed to update sync status:', error);
      }
    }
  },

  deleteCard: (id: string): void => {
    const cards = localCardStorage.getAllCards();
    delete cards[id];
    try {
      localStorage.setItem(LOCAL_CARDS_KEY, JSON.stringify(cards));
      console.log('Card deleted from local storage:', id);
    } catch (error) {
      console.error('Failed to delete card:', error);
    }
  },

  isRecentlyModified: (id: string, thresholdSeconds: number = 30): boolean => {
    const card = localCardStorage.getCard(id);
    if (!card) return false;
    
    const timeDiff = (Date.now() - card.lastModified) / 1000;
    return timeDiff < thresholdSeconds;
  }
};
