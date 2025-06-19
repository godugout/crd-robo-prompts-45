
import { localStorageManager } from '../LocalStorageManager';

export interface SavedCard {
  id: string;
  title: string;
  image_url?: string;
  template_id?: string;
  design_metadata?: {
    effects?: Record<string, any>;
    crop?: any;
    processing?: any;
  };
  rarity: string;
  tags: string[];
  creator_attribution: {
    collaboration_type: string;
  };
  publishing_options: {
    marketplace_listing: boolean;
    crd_catalog_inclusion: boolean;
    print_available: boolean;
    pricing: {
      currency: string;
    };
    distribution: {
      limited_edition: boolean;
    };
  };
}

export class CardStorageAdapter {
  private static instance: CardStorageAdapter;
  private keyPrefix = 'card-';

  private constructor() {}

  public static getInstance(): CardStorageAdapter {
    if (!CardStorageAdapter.instance) {
      CardStorageAdapter.instance = new CardStorageAdapter();
    }
    return CardStorageAdapter.instance;
  }

  public saveCard(card: SavedCard): void {
    try {
      const key = `${this.keyPrefix}${card.id}`;
      localStorageManager.setItem(key, card, 'cards', 'high');
      console.log('💾 Card saved:', card.id);
    } catch (error) {
      console.error('❌ Failed to save card:', error);
    }
  }

  public getCard(id: string): SavedCard | null {
    try {
      const key = `${this.keyPrefix}${id}`;
      return localStorageManager.getItem<SavedCard>(key);
    } catch (error) {
      console.error('❌ Failed to retrieve card:', error);
      return null;
    }
  }

  public removeCard(id: string): void {
    try {
      const key = `${this.keyPrefix}${id}`;
      localStorageManager.removeItem(key);
      console.log('🗑️ Card removed:', id);
    } catch (error) {
      console.error('❌ Failed to remove card:', error);
    }
  }

  public getAllCards(): SavedCard[] {
    const cards: SavedCard[] = [];
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.keyPrefix)) {
          const card = localStorageManager.getItem<SavedCard>(key);
          if (card) {
            cards.push(card);
          }
        }
      }
    } catch (error) {
      console.error('❌ Failed to retrieve all cards:', error);
    }
    
    return cards;
  }
}

export const cardStorageAdapter = CardStorageAdapter.getInstance();
