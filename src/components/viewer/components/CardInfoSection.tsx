
import React from 'react';
import { Heart, Bookmark, Share2, Download, User, Calendar, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CardInfoSectionProps {
  card: any;
  cardDetails?: {
    id: string;
    title: string;
    description?: string;
    rarity: string;
    creator_name?: string;
    creator_verified?: boolean;
    price?: string;
    created_at: string;
    tags?: string[];
    view_count?: number;
    like_count?: number;
  };
  onLike?: () => void;
  onBookmark?: () => void;
  onShare?: () => void;
  onDownload?: () => void;
}

export const CardInfoSection: React.FC<CardInfoSectionProps> = ({
  card,
  cardDetails,
  onLike,
  onBookmark,
  onShare,
  onDownload
}) => {
  return (
    <div className="p-4 space-y-4">
      {/* Card Title and Basic Info */}
      <div>
        <h2 className="text-white text-lg font-semibold mb-1">
          {cardDetails?.title || card?.title || 'Untitled Card'}
        </h2>
        {cardDetails?.description && (
          <p className="text-gray-400 text-sm">{cardDetails.description}</p>
        )}
      </div>

      {/* Creator Info */}
      {cardDetails?.creator_name && (
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300 text-sm">
            {cardDetails.creator_name}
            {cardDetails.creator_verified && (
              <span className="text-crd-green ml-1">✓</span>
            )}
          </span>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center space-x-4 text-sm text-gray-400">
        {cardDetails?.view_count && (
          <div className="flex items-center space-x-1">
            <Eye className="w-3 h-3" />
            <span>{cardDetails.view_count}</span>
          </div>
        )}
        {cardDetails?.like_count && (
          <div className="flex items-center space-x-1">
            <Heart className="w-3 h-3" />
            <span>{cardDetails.like_count}</span>
          </div>
        )}
        {cardDetails?.created_at && (
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(cardDetails.created_at).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-4 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onLike}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <Heart className="w-3 h-3" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onBookmark}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <Bookmark className="w-3 h-3" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onShare}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <Share2 className="w-3 h-3" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onDownload}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <Download className="w-3 h-3" />
        </Button>
      </div>

      {/* Tags */}
      {cardDetails?.tags && cardDetails.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {cardDetails.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
