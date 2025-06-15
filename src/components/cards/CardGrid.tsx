
import React from 'react';
import { UniversalCardGrid } from './UniversalCardGrid';
import { UniversalCardData } from './UniversalCardDisplay';
import { useNavigate } from 'react-router-dom';
import { setCardNavigationContext, createCardNavigationUrl } from '@/utils/cardNavigation';
import { toast } from 'sonner';

interface CardData {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  thumbnail_url?: string;
  price?: string;
  rarity?: string;
  creator_name?: string;
  creator_verified?: boolean;
  creator_id?: string;
  stock?: number;
  highest_bid?: number;
  edition_size?: number;
  tags?: string[];
}

interface CardGridProps {
  cards: CardData[];
  loading: boolean;
  viewMode?: 'grid' | 'masonry' | 'feed';
  navigationSource?: 'gallery' | 'profile' | 'search' | 'collection';
  navigationSourceId?: string;
}

// Convert old card format to universal format
const convertToUniversalCard = (card: CardData): UniversalCardData => ({
  id: card.id,
  title: card.title,
  description: card.description,
  image_url: card.image_url,
  thumbnail_url: card.thumbnail_url,
  rarity: (card.rarity as any) || 'common',
  price: card.price ? parseFloat(card.price) : undefined,
  creator_name: card.creator_name,
  creator_verified: card.creator_verified,
  creator_id: card.creator_id,
  stock: card.stock,
  highest_bid: card.highest_bid,
  edition_size: card.edition_size,
  tags: card.tags
});

export const CardGrid: React.FC<CardGridProps> = ({ 
  cards, 
  loading, 
  viewMode = 'grid',
  navigationSource = 'gallery',
  navigationSourceId
}) => {
  const navigate = useNavigate();

  const handleView = (card: UniversalCardData) => {
    // Set navigation context when viewing cards
    const navigationData = {
      cards: cards.map(c => ({ id: c.id, title: c.title })),
      source: navigationSource,
      sourceId: navigationSourceId
    };
    
    setCardNavigationContext(navigationData);
    const navigationUrl = createCardNavigationUrl(card.id, navigationData);
    navigate(navigationUrl);
  };

  const handleEdit = (card: UniversalCardData) => {
    navigate(`/cards/create?template=${card.id}`);
    toast.success(`Opening "${card.title}" for editing`);
  };

  const universalCards = cards.map(convertToUniversalCard);

  return (
    <UniversalCardGrid
      cards={universalCards}
      loading={loading}
      defaultMode={viewMode === 'feed' ? 'row' : 'grid'}
      onView={handleView}
      onEdit={handleEdit}
    />
  );
};
