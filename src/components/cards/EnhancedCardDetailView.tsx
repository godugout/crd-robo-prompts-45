
import React, { useState } from 'react';
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
            card={card}
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
