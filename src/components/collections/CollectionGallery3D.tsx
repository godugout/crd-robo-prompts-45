
import React from 'react';
import { Gallery3D } from '@/components/3d/gallery/Gallery3D';
import { useCollectionCards } from '@/hooks/collections/useCollectionQueries';
import { use3DQualitySettings } from '@/hooks/use3DQualitySettings';
import { Enhanced3DCardViewer } from '@/components/3d/enhanced/Enhanced3DCardViewer';
import type { Collection } from '@/types/collections';
import type { Card } from '@/types/cards';

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
  
  // Extract cards from collection cards and properly map to Card type
  const cards: Card[] = collectionCards?.map(cc => {
    const card = cc.card;
    return {
      id: card.id,
      title: card.title,
      description: card.description || '',
      image_url: card.image_url,
      thumbnail_url: card.thumbnail_url,
      rarity: card.rarity || 'common',
      tags: card.tags || [],
      creator_id: card.creator_id || '',
      created_at: card.created_at || new Date().toISOString(),
      updated_at: card.updated_at || new Date().toISOString(),
      collection_id: card.collection_id,
      team_id: card.team_id,
      user_id: card.user_id,
      price: card.price,
      edition_size: card.edition_size || 1,
      verification_status: card.verification_status,
      print_metadata: card.print_metadata || {},
      template_id: card.template_id,
      creator_attribution: card.creator_attribution || {},
      publishing_options: card.publishing_options || {},
      print_available: card.print_available,
      crd_catalog_inclusion: card.crd_catalog_inclusion,
      marketplace_listing: card.marketplace_listing,
      shop_id: card.shop_id,
      design_metadata: card.design_metadata || {},
      is_public: card.is_public
    };
  }).filter(Boolean) || [];
  
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
