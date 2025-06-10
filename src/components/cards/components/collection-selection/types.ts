
export interface Collection {
  id: string;
  name: string;
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
