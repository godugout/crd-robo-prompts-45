
export interface Collection {
  id: string;
  title: string; // Changed from 'name' to 'title' to match database schema
  description?: string;
  cardCount: number;
  createdAt: Date;
}

export interface ExtractedCard {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  tags: string[];
  confidence: number;
  sourceImageName: string;
  imageUrl: string;
  imageBlob: Blob;
}

export interface CollectionSelectionPhaseProps {
  extractedCards: ExtractedCard[];
  onCollectionSelected: (collectionId: string) => void;
  onGoBack?: () => void;
}
