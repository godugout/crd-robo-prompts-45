
import { cardStorageAdapter } from './storage/adapters/CardStorageAdapter';

// Re-export the types from the central types file
export type { LocalCard } from './storage/types';

// Legacy interface for backwards compatibility
export const localCardStorage = {
  saveCard: cardStorageAdapter.saveCard.bind(cardStorageAdapter),
  getCard: cardStorageAdapter.getCard.bind(cardStorageAdapter),
  getAllCards: cardStorageAdapter.getAllCards.bind(cardStorageAdapter),
  getCardsNeedingSync: cardStorageAdapter.getCardsNeedingSync.bind(cardStorageAdapter),
  markAsSynced: cardStorageAdapter.markAsSynced.bind(cardStorageAdapter),
  deleteCard: cardStorageAdapter.deleteCard.bind(cardStorageAdapter),
  isRecentlyModified: cardStorageAdapter.isRecentlyModified.bind(cardStorageAdapter)
};
