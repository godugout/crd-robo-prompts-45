
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Bookmark, Share2, Download, Eye, Clock, Tag, User, Shield } from 'lucide-react';
import type { CardData } from '@/types/card';

interface DetailsTabContentProps {
  card: CardData;
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

export const DetailsTabContent: React.FC<DetailsTabContentProps> = ({
  card,
  cardDetails,
  onLike,
  onBookmark,
  onShare,
  onDownload
}) => {
  return (
    <div className="p-4 space-y-6 text-white">
      {/* Card Title and Creator */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold">{cardDetails?.title || card.title}</h2>
        {cardDetails?.creator_name && (
          <div className="flex items-center gap-2 text-sm text-white/70">
            <User className="w-4 h-4" />
            <span>by {cardDetails.creator_name}</span>
            {cardDetails.creator_verified && (
              <Shield className="w-4 h-4 text-blue-400" />
            )}
          </div>
        )}
      </div>

      {/* Description */}
      {cardDetails?.description && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-white/80">Description</h3>
          <p className="text-sm text-white/70 leading-relaxed">
            {cardDetails.description}
          </p>
        </div>
      )}

      {/* Card Stats */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-white/80">Stats</h3>
        <div className="grid grid-cols-2 gap-3">
          {cardDetails?.view_count !== undefined && (
            <div className="flex items-center gap-2 text-sm">
              <Eye className="w-4 h-4 text-white/50" />
              <span className="text-white/70">{cardDetails.view_count.toLocaleString()} views</span>
            </div>
          )}
          {cardDetails?.like_count !== undefined && (
            <div className="flex items-center gap-2 text-sm">
              <Heart className="w-4 h-4 text-white/50" />
              <span className="text-white/70">{cardDetails.like_count.toLocaleString()} likes</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Properties */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-white/80">Properties</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70">Rarity</span>
            <span className="capitalize text-white font-medium">{cardDetails?.rarity || card.rarity}</span>
          </div>
          {cardDetails?.created_at && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">Created</span>
              <span className="text-white/70">{new Date(cardDetails.created_at).toLocaleDateString()}</span>
            </div>
          )}
          {cardDetails?.price && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">Price</span>
              <span className="text-crd-green font-medium">{cardDetails.price}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      {cardDetails?.tags && cardDetails.tags.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-white/80">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {cardDetails.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-white/10 rounded-md text-xs text-white/70 flex items-center gap-1"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 pt-4 border-t border-white/10">
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={onLike}
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Heart className="w-4 h-4 mr-2" />
            Like
          </Button>
          <Button
            onClick={onBookmark}
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Bookmark className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={onShare}
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button
            onClick={onDownload}
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};
