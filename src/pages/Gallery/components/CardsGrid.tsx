
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
    
    navigate(`/cards/enhanced?template=${card.id}`);
    toast.success(`Opening "${card.title}" for editing`);
  };

  const universalCards = cards.map(convertToUniversalCard);

  return (
    <div className="space-y-6">
      <UniversalCardGrid
        cards={universalCards}
        loading={loading}
        title=""
        subtitle=""
        onView={handleView}
        onEdit={handleEdit}
        className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      />
      
      {!loading && universalCards.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-crd-darkGray rounded-xl mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-crd-lightGray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-crd-white mb-2">No Cards Found</h3>
          <p className="text-crd-lightGray">Discover amazing cards from our community</p>
        </div>
      )}
    </div>
  );
};
