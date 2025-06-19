
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
  created_at?: string;
  updated_at?: string;
  sync_status?: 'pending' | 'synced' | 'failed';
}

export interface LocalCard extends SavedCard {
  is_public?: boolean;
  description?: string;
  thumbnail_url?: string;
  verification_status?: string;
  print_metadata?: any;
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
      const cardWithTimestamp = {
        ...card,
        updated_at: new Date().toISOString(),
        sync_status: 'pending' as const
      };
      localStorageManager.setItem(key, cardWithTimestamp, 'cards', 'high');
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

  public deleteCard(id: string): void {
    this.removeCard(id);
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

  public getCardsNeedingSync(): SavedCard[] {
    return this.getAllCards().filter(card => 
      card.sync_status === 'pending' || card.sync_status === 'failed'
    );
  }

  public markAsSynced(cardId: string): void {
    try {
      const card = this.getCard(cardId);
      if (card) {
        const updatedCard = {
          ...card,
          sync_status: 'synced' as const,
          updated_at: new Date().toISOString()
        };
        this.saveCard(updatedCard);
        console.log('✅ Card marked as synced:', cardId);
      }
    } catch (error) {
      console.error('❌ Failed to mark card as synced:', error);
    }
  }

  public isRecentlyModified(cardId: string, thresholdMinutes: number = 30): boolean {
    try {
      const card = this.getCard(cardId);
      if (!card || !card.updated_at) return false;
      
      const updatedAt = new Date(card.updated_at);
      const threshold = new Date(Date.now() - thresholdMinutes * 60 * 1000);
      
      return updatedAt > threshold;
    } catch (error) {
      console.error('❌ Failed to check if card is recently modified:', error);
      return false;
    }
  }
}

export const cardStorageAdapter = CardStorageAdapter.getInstance();
