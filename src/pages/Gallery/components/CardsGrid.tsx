
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
  creator_id?: string;
  creator_name?: string;
  creator_verified?: boolean;
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
  creator_name: card.creator_name || 'Creator',
  creator_verified: card.creator_verified,
  creator_id: card.creator_id,
  stock: Math.floor(Math.random() * 10) + 1
});

export const CardsGrid: React.FC<CardsGridProps> = ({
  cards,
  loading,
  onCardClick
}) => {
  const navigate = useNavigate();

  const handleView = (card: UniversalCardData) => {
    console.log('Navigating to card detail:', card.id);
    
    // Ensure we have a valid card ID before navigating
    if (!card.id) {
      console.error('Card ID is missing:', card);
      toast.error('Card ID is missing - cannot navigate');
      return;
    }
    
    // Navigate to card detail page which will show the immersive viewer
    navigate(`/card/${card.id}`);
    
    // Also call the original callback for any additional logic
    const originalCard = cards.find(c => c.id === card.id);
    if (originalCard) {
      onCardClick(originalCard);
    }
  };

  const handleEdit = (card: UniversalCardData) => {
    if (!card.id) {
      console.error('Card ID is missing for edit:', card);
      toast.error('Card ID is missing - cannot edit');
      return;
    }
    
    navigate(`/cards/create?template=${card.id}`);
    toast.success(`Opening "${card.title}" for editing`);
  };

  const universalCards = cards.map(convertToUniversalCard);

  return (
    <UniversalCardGrid
      cards={universalCards}
      loading={loading}
      title="Featured Cards"
      subtitle="Discover amazing cards from our community"
      onView={handleView}
      onEdit={handleEdit}
    />
  );
};
