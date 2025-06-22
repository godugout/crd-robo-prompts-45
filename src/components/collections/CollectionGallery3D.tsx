
import React from 'react';
import { Gallery3D } from '@/components/3d/gallery/Gallery3D';
import { useCollectionCards } from '@/hooks/collections/useCollectionQueries';
import { use3DQualitySettings } from '@/hooks/use3DQualitySettings';
import { Enhanced3DCardViewer } from '@/components/3d/enhanced/Enhanced3DCardViewer';
import type { Collection } from '@/types/collections';

interface CollectionGallery3DProps {
  collection: Collection;
  onCardSelect?: (card: any) => void;
  className?: string;
}

export const CollectionGallery3D: React.FC<CollectionGallery3DProps> = ({
  collection,
  onCardSelect,
  className = ''
}) => {
  const { data: collectionCards, isLoading } = useCollectionCards(collection.id);
  const { settings: qualitySettings } = use3DQualitySettings();
  
  // Extract cards from collection cards
  const cards = collectionCards?.map(cc => cc.card).filter(Boolean) || [];
  
  const handleCardInteraction = (type: string, card: any, data?: any) => {
    console.log('Card interaction:', type, card.title, data);
    
    // Track analytics for card interactions
    if (type === 'select') {
      onCardSelect?.(card);
    }
  };
  
  if (isLoading) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gray-900 ${className}`}>
        <div className="text-white text-lg">Loading collection...</div>
      </div>
    );
  }
  
  if (!cards.length) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gray-900 ${className}`}>
        <div className="text-white text-lg">No cards in this collection</div>
      </div>
    );
  }
  
  return (
    <div className={`w-full h-full ${className}`}>
      <Gallery3D
        collection={collection}
        cards={cards}
        onCardSelect={onCardSelect}
        onCardInteraction={handleCardInteraction}
        quality={qualitySettings.renderQuality}
        enableVR={false}
        enableMultiUser={false}
      />
    </div>
  );
};
