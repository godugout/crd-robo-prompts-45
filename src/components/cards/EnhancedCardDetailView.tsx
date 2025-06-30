import React, { useState } from 'react';
import { convertToViewerCardData } from '@/components/viewer/types';
import type { CardData as HookCardData } from '@/hooks/useCardData';
import { CardDetailHeader } from './components/CardDetailHeader';
import { CardDetailMainContent } from './components/CardDetailMainContent';
import { CardDetailSidebar } from './components/CardDetailSidebar';
import { CardDetailActions } from './components/CardDetailActions';

interface EnhancedCardDetailViewProps {
  card: HookCardData;
  onOpenViewer: () => void;
  onShare: () => void;
  onDownload: () => void;
  onGoBack: () => void;
}

export const EnhancedCardDetailView: React.FC<EnhancedCardDetailViewProps> = ({
  card,
  onOpenViewer,
  onShare,
  onDownload,
  onGoBack
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50) + 10);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  // Convert CardData to viewer format - Fix TypeScript errors here
  const universalCard = {
    id: card.id || '',
    title: card.title,
    description: card.description,
    image_url: card.image_url,
    thumbnail_url: card.thumbnail_url,
    rarity: card.rarity,
    price: typeof card.price === 'number' ? card.price : (typeof card.price === 'string' ? parseFloat(card.price) || 0 : 0),
    creator_name: card.creator_name,
    creator_verified: card.creator_verified || false,
    stock: 3,
    tags: card.tags || []
  };

  // Create complete viewer card with all required properties
  const viewerCard = {
    id: universalCard.id,
    title: universalCard.title,
    description: universalCard.description,
    image_url: universalCard.image_url,
    rarity: universalCard.rarity as any,
    tags: universalCard.tags,
    visibility: 'public' as any,
    is_public: true,
    template_id: undefined,
    collection_id: undefined,
    team_id: undefined,
    creator_attribution: {
      creator_name: universalCard.creator_name,
      creator_id: card.creator_id
    },
    publishing_options: {
      marketplace_listing: false,
      crd_catalog_inclusion: true,
      print_available: false,
      pricing: { currency: 'USD' },
      distribution: { limited_edition: false }
    },
    design_metadata: {}
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-crd-darker to-crd-darkest relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-crd-blue/5 to-transparent rounded-full animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-crd-green/5 to-transparent rounded-full animate-pulse delay-1000"></div>
      </div>

      {/* Header Navigation */}
      <CardDetailHeader onGoBack={onGoBack} />

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <CardDetailMainContent
            cardTitle={card.title}
            cardId={card.id || ''}
            viewerCard={viewerCard}
            onOpenViewer={onOpenViewer}
          />

          {/* Action Buttons - Mobile Only */}
          <div className="lg:hidden">
            <CardDetailActions
              isLiked={isLiked}
              isBookmarked={isBookmarked}
              onLike={handleLike}
              onBookmark={handleBookmark}
              onShare={onShare}
              onDownload={onDownload}
              isMobile={true}
            />
          </div>

          {/* Right Sidebar */}
          <CardDetailSidebar
            card={card}
            likeCount={likeCount}
            isLiked={isLiked}
            isBookmarked={isBookmarked}
            onLike={handleLike}
            onBookmark={handleBookmark}
            onShare={onShare}
            onDownload={onDownload}
            onOpenViewer={onOpenViewer}
          />
        </div>
      </div>
    </div>
  );
};
