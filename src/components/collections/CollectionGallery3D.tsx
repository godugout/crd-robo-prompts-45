
import React from 'react';
import { Gallery3D } from '@/components/3d/gallery/Gallery3D';
import { useCollectionCards } from '@/hooks/collections/useCollectionQueries';
import { use3DQualitySettings } from '@/hooks/use3DQualitySettings';
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
    // Handle both direct card objects and collection_card objects with nested card
    const cardData = (cc as any).card || cc;
    
    return {
      id: cardData.id || '',
      title: cardData.title || 'Untitled Card',
      description: cardData.description || '',
      image_url: cardData.image_url,
      thumbnail_url: cardData.thumbnail_url,
      rarity: (cardData.rarity as any) || 'common',
      tags: cardData.tags || [],
      creator_id: cardData.creator_id || '',
      creator_name: cardData.creator_name || 'Unknown Creator',
      created_at: cardData.created_at || new Date().toISOString(),
      updated_at: cardData.updated_at || new Date().toISOString(),
      collection_id: cardData.collection_id,
      team_id: cardData.team_id,
      user_id: cardData.user_id,
      price: cardData.price,
      edition_size: cardData.edition_size || 1,
      verification_status: cardData.verification_status,
      print_metadata: cardData.print_metadata || {},
      template_id: cardData.template_id,
      creator_attribution: cardData.creator_attribution || {
        creator_name: cardData.creator_name || 'Unknown Creator'
      },
      publishing_options: cardData.publishing_options || {
        marketplace_listing: cardData.marketplace_listing || false,
        crd_catalog_inclusion: cardData.crd_catalog_inclusion !== false,
        print_available: cardData.print_available || false
      },
      print_available: cardData.print_available,
      crd_catalog_inclusion: cardData.crd_catalog_inclusion,
      marketplace_listing: cardData.marketplace_listing,
      shop_id: cardData.shop_id,
      design_metadata: cardData.design_metadata || {},
      is_public: cardData.is_public,
      visibility: cardData.visibility || (cardData.is_public ? 'public' : 'private')
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
