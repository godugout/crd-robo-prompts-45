
import React from 'react';
import { UniversalCardGrid } from '@/components/cards/UniversalCardGrid';
import { UniversalCardData } from '@/components/cards/UniversalCardDisplay';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface CardItem {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  rarity?: string;
}

interface CardsGridProps {
  cards: CardItem[];
  loading: boolean;
  onCardClick: (card: CardItem) => void;
}

const convertToUniversalCard = (card: CardItem): UniversalCardData => ({
  id: card.id,
  title: card.title,
  description: card.description,
  image_url: card.image_url,
  rarity: (card.rarity as any) || 'common',
  price: 1.5 + Math.random() * 3, // Sample pricing
  creator_name: 'Creator',
  stock: Math.floor(Math.random() * 10) + 1
});

export const CardsGrid: React.FC<CardsGridProps> = ({
  cards,
  loading,
  onCardClick
}) => {
  const navigate = useNavigate();

  const handleView = (card: UniversalCardData) => {
    // Find original card for callback
    const originalCard = cards.find(c => c.id === card.id);
    if (originalCard) {
      onCardClick(originalCard);
    }
  };

  const handleRemix = (card: UniversalCardData) => {
    navigate(`/cards/create?template=${card.id}`);
    toast.success(`Starting remix of "${card.title}"`);
  };

  const handleStage = (card: UniversalCardData) => {
    navigate(`/studio?card=${card.id}`);
    toast.success(`Opening "${card.title}" in Studio`);
  };

  const handleFavorite = (card: UniversalCardData) => {
    toast.success(`Added "${card.title}" to favorites`);
  };

  const handleShare = (card: UniversalCardData) => {
    navigator.clipboard.writeText(`${window.location.origin}/card/${card.id}`);
    toast.success('Card link copied to clipboard');
  };

  const universalCards = cards.map(convertToUniversalCard);

  return (
    <UniversalCardGrid
      cards={universalCards}
      loading={loading}
      title="Featured Cards"
      subtitle="Discover amazing cards from our community"
      onView={handleView}
      onRemix={handleRemix}
      onStage={handleStage}
      onFavorite={handleFavorite}
      onShare={handleShare}
    />
  );
};
