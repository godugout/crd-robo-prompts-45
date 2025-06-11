
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnhancedCardViewer } from '@/components/viewer/EnhancedCardViewer';
import { useCardData } from '@/hooks/useCardData';
import { convertToViewerCardData } from '@/components/viewer/types';

const CardDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: cards, isLoading } = useCardData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
        <div className="text-white">Loading card...</div>
      </div>
    );
  }

  const card = cards?.find(c => c.id === id);
  
  if (!card) {
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Card Not Found</h1>
          <Button onClick={() => navigate('/cards')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cards
          </Button>
        </div>
      </div>
    );
  }

  // Convert to viewer format
  const viewerCard = convertToViewerCardData(card);

  // Mock card details for enhanced features
  const cardDetails = {
    id: card.id,
    title: card.title,
    description: card.description,
    rarity: card.rarity,
    creator_name: card.creator_name,
    creator_verified: card.creator_verified,
    price: card.price,
    created_at: card.created_at || new Date().toISOString(),
    tags: card.tags,
    view_count: Math.floor(Math.random() * 1000) + 100,
    like_count: Math.floor(Math.random() * 50) + 10,
  };

  return (
    <div className="min-h-screen bg-crd-darkest relative">
      {/* Simple Header */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4">
        <Button
          onClick={() => navigate('/cards')}
          variant="ghost"
          className="bg-black/20 backdrop-blur-sm hover:bg-black/30 text-white border border-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cards
        </Button>
      </div>

      {/* Enhanced Card Viewer with Flexible Panel */}
      <div className="h-screen pt-16">
        <EnhancedCardViewer
          card={viewerCard}
          cardDetails={cardDetails}
          onDownload={() => console.log('Download card')}
          onShare={() => console.log('Share card')}
          onLike={() => console.log('Like card')}
          onBookmark={() => console.log('Bookmark card')}
        />
      </div>
    </div>
  );
};

export default CardDetail;
