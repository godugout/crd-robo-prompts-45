
export interface ExtractedCard {
  id: string;
  imageBlob: Blob;
  imageUrl: string;
  confidence: number;
  sourceImageName: string;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  tags: string[];
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  createdAt: Date | string;
}

export interface CollectionSelectionPhaseProps {
  extractedCards: ExtractedCard[];
  onCollectionSelected: (collectionId: string) => void;
  onGoBack: () => void;
}
