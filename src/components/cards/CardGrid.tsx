
import React from 'react';
import { UniversalCardGrid } from './UniversalCardGrid';
import { UniversalCardData } from './UniversalCardDisplay';
import { useNavigate } from 'react-router-dom';
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
  viewMode = 'grid' 
}) => {
  const navigate = useNavigate();

  const handleView = (card: UniversalCardData) => {
    // Navigate to card detail page which will show the immersive viewer
    navigate(`/card/${card.id}`);
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
