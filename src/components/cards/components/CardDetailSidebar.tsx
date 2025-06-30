
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Bookmark, Share2, Download, Play } from 'lucide-react';
import type { CardData as HookCardData } from '@/hooks/useCardData';

interface CardDetailSidebarProps {
  card: HookCardData;
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
    <div className="space-y-6">
      {/* Action Buttons */}
      <Card className="p-4 bg-crd-darker border-crd-mediumGray/20">
        <div className="space-y-3">
          <Button
            onClick={onOpenViewer}
            className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-medium flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            View in 3D
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={onLike}
              className={`border-crd-mediumGray/40 flex items-center gap-2 ${
                isLiked ? 'text-red-400 border-red-400/40' : 'text-crd-lightGray hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              {likeCount}
            </Button>
            
            <Button
              variant="outline"
              onClick={onBookmark}
              className={`border-crd-mediumGray/40 flex items-center gap-2 ${
                isBookmarked ? 'text-crd-green border-crd-green/40' : 'text-crd-lightGray hover:text-white'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={onShare}
              className="border-crd-mediumGray/40 text-crd-lightGray hover:text-white flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            
            <Button
              variant="outline"
              onClick={onDownload}
              className="border-crd-mediumGray/40 text-crd-lightGray hover:text-white flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Save
            </Button>
          </div>
        </div>
      </Card>

      {/* Card Stats */}
      <Card className="p-4 bg-crd-darker border-crd-mediumGray/20">
        <h3 className="font-semibold text-white mb-3">Card Stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-crd-lightGray">Views</span>
            <span className="text-white font-medium">1,234</span>
          </div>
          <div className="flex justify-between">
            <span className="text-crd-lightGray">Likes</span>
            <span className="text-white font-medium">{likeCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-crd-lightGray">Shares</span>
            <span className="text-white font-medium">42</span>
          </div>
          <div className="flex justify-between">
            <span className="text-crd-lightGray">Created</span>
            <span className="text-white font-medium">
              {card.created_at ? new Date(card.created_at).toLocaleDateString() : 'Unknown'}
            </span>
          </div>
        </div>
      </Card>

      {/* Creator Info */}
      <Card className="p-4 bg-crd-darker border-crd-mediumGray/20">
        <h3 className="font-semibold text-white mb-3">Creator</h3>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-crd-green to-crd-blue rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {card.creator_name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-white">{card.creator_name || 'Unknown Creator'}</p>
            <p className="text-sm text-crd-lightGray">Digital Artist</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full mt-3 border-crd-mediumGray/40 text-crd-lightGray hover:text-white"
        >
          View Profile
        </Button>
      </Card>
    </div>
  );
};
