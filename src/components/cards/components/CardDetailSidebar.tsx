
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MoreHorizontal,
  Maximize2
} from 'lucide-react';
import { CardQuickFactsPanel } from './CardQuickFactsPanel';
import { CardMetadataPanel } from './CardMetadataPanel';
import { CardDetailActions } from './CardDetailActions';
import type { CardData } from '@/hooks/useCardData';

interface CardDetailSidebarProps {
  card: CardData;
  likeCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  onLike: () => void;
  onBookmark: () => void;
  onShare: () => void;
  onDownload: () => void;
  onOpenViewer: () => void;
}

export const CardDetailSidebar: React.FC<CardDetailSidebarProps> = ({
  card,
  likeCount,
  isLiked,
  isBookmarked,
  onLike,
  onBookmark,
  onShare,
  onDownload,
  onOpenViewer
}) => {
  return (
    <div className="space-y-5">
      {/* Card Title & Creator - Desktop Only */}
      <div className="hidden lg:block">
        <h1 className="text-4xl font-bold text-white mb-4 leading-tight">{card.title}</h1>
      </div>
      
      {/* Quick Facts Panel */}
      <CardQuickFactsPanel
        card={card}
        likeCount={likeCount}
        isLiked={isLiked}
        isBookmarked={isBookmarked}
      />

      {/* Actions - Desktop Only */}
      <Card className="bg-editor-dark/50 backdrop-blur-sm border-white/10 hidden lg:block">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
          <CardDetailActions
            isLiked={isLiked}
            isBookmarked={isBookmarked}
            onLike={onLike}
            onBookmark={onBookmark}
            onShare={onShare}
            onDownload={onDownload}
          />
        </CardContent>
      </Card>
      
      {/* Enhanced Metadata */}
      <CardMetadataPanel card={card} />

      {/* More Actions */}
      <Card className="bg-editor-dark/50 backdrop-blur-sm border-white/10">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-white mb-3">More Actions</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start border-white/20 text-crd-lightGray hover:bg-white/10 hover:text-white"
            >
              <MoreHorizontal className="w-4 h-4 mr-2" />
              Add to Collection
            </Button>
            <Button
              variant="outline"
              onClick={onOpenViewer}
              className="w-full justify-start border-white/20 text-crd-lightGray hover:bg-white/10 hover:text-white"
            >
              <Maximize2 className="w-4 h-4 mr-2" />
              View in 3D
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
