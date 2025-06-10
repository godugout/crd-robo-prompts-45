
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Share, 
  Download, 
  Heart,
  Bookmark
} from 'lucide-react';

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
  if (isMobile) {
    return (
      <div className="grid grid-cols-3 gap-3 lg:hidden">
        <Button 
          variant="outline" 
          className={`border-white/20 backdrop-blur-sm ${isLiked ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'text-white hover:bg-white/10'}`}
          onClick={onLike}
        >
          <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
          {isLiked ? 'Liked' : 'Like'}
        </Button>
        
        <Button 
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
          onClick={onShare}
        >
          <Share className="w-4 h-4 mr-2" />
          Share
        </Button>
        
        <Button 
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
          onClick={onDownload}
        >
          <Download className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          onClick={onLike}
          className={`border-white/20 backdrop-blur-sm ${
            isLiked ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'text-white hover:bg-white/10'
          }`}
        >
          <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
          {isLiked ? 'Liked' : 'Like'}
        </Button>
        
        <Button
          variant="outline"
          onClick={onBookmark}
          className={`border-white/20 backdrop-blur-sm ${
            isBookmarked ? 'bg-crd-green/20 text-crd-green border-crd-green/30' : 'text-white hover:bg-white/10'
          }`}
        >
          <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
          Save
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          onClick={onShare}
          className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
        >
          <Share className="w-4 h-4 mr-2" />
          Share
        </Button>
        
        <Button
          variant="outline"
          onClick={onDownload}
          className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
};
