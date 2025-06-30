
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Bookmark, Share2, Download } from 'lucide-react';

interface CardDetailActionsProps {
  isLiked: boolean;
  isBookmarked: boolean;
  onLike: () => void;
  onBookmark: () => void;
  onShare: () => void;
  onDownload: () => void;
  isMobile?: boolean;
}

export const CardDetailActions: React.FC<CardDetailActionsProps> = ({
  isLiked,
  isBookmarked,
  onLike,
  onBookmark,
  onShare,
  onDownload,
  isMobile = false
}) => {
  return (
    <div className={`flex gap-3 ${isMobile ? 'justify-center' : ''}`}>
      <Button
        variant="outline"
        onClick={onLike}
        className={`border-crd-mediumGray/40 flex items-center gap-2 ${
          isLiked ? 'text-red-400 border-red-400/40' : 'text-crd-lightGray hover:text-white'
        }`}
      >
        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        {!isMobile && 'Like'}
      </Button>
      
      <Button
        variant="outline"
        onClick={onBookmark}
        className={`border-crd-mediumGray/40 flex items-center gap-2 ${
          isBookmarked ? 'text-crd-green border-crd-green/40' : 'text-crd-lightGray hover:text-white'
        }`}
      >
        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        {!isMobile && 'Save'}
      </Button>
      
      <Button
        variant="outline"
        onClick={onShare}
        className="border-crd-mediumGray/40 text-crd-lightGray hover:text-white flex items-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        {!isMobile && 'Share'}
      </Button>
      
      <Button
        variant="outline"
        onClick={onDownload}
        className="border-crd-mediumGray/40 text-crd-lightGray hover:text-white flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        {!isMobile && 'Download'}
      </Button>
    </div>
  );
};
