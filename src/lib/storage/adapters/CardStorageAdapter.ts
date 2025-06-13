
import { localStorageManager } from '../LocalStorageManager';
import { LocalCard } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class CardStorageAdapter {
  private static instance: CardStorageAdapter;

  private constructor() {}

  public static getInstance(): CardStorageAdapter {
    if (!CardStorageAdapter.instance) {
      CardStorageAdapter.instance = new CardStorageAdapter();
    }
    return CardStorageAdapter.instance;
  }

  public saveCard(cardData: Partial<LocalCard>): string {
    const cardId = cardData.id || uuidv4();
    
    const card: LocalCard = {
      id: cardId,
      title: cardData.title || 'Untitled Card',
      description: cardData.description,
      image_url: cardData.image_url,
      thumbnail_url: cardData.thumbnail_url,
      design_metadata: cardData.design_metadata || {},
      rarity: cardData.rarity || 'common',
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
      lastModified: Date.now(),
      needsSync: true,
      isLocal: true
    };

    const key = `crd_card_${cardId}`;
    localStorageManager.setItem(key, card, 'cards', 'high');
    
    console.log('Card saved via unified storage:', cardId);
    return cardId;
  }

  public getCard(id: string): LocalCard | null {
    const key = `crd_card_${id}`;
    return localStorageManager.getItem<LocalCard>(key);
  }

  public getAllCards(): Record<string, LocalCard> {
    const cardItems = localStorageManager.getItemsByType('cards');
    const cards: Record<string, LocalCard> = {};
    
    cardItems.forEach(item => {
      const card = localStorageManager.getItem<LocalCard>(item.key);
      if (card) {
        cards[card.id] = card;
      }
    });
    
    return cards;
  }

  public getCardsNeedingSync(): LocalCard[] {
    const cards = this.getAllCards();
    return Object.values(cards).filter(card => card.needsSync);
  }

  public markAsSynced(id: string): void {
    const card = this.getCard(id);
    if (card) {
      card.needsSync = false;
      card.isLocal = false;
      const key = `crd_card_${id}`;
      localStorageManager.setItem(key, card, 'cards', 'high');
      console.log('Card marked as synced:', id);
    }
  }

  public deleteCard(id: string): void {
    const key = `crd_card_${id}`;
    localStorageManager.removeItem(key);
    console.log('Card deleted from unified storage:', id);
  }

  public isRecentlyModified(id: string, thresholdSeconds: number = 30): boolean {
    const card = this.getCard(id);
    if (!card) return false;
    
    const timeDiff = (Date.now() - card.lastModified) / 1000;
    return timeDiff < thresholdSeconds;
  }
}

export const cardStorageAdapter = CardStorageAdapter.getInstance();
