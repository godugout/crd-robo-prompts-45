
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Bookmark, 
  Share2, 
  Download, 
  MessageCircle, 
  User, 
  Calendar,
  Eye,
  Star,
  Tag
} from 'lucide-react';

interface CardDetailsProps {
  card: {
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
  onShare?: () => void;
  onDownload?: () => void;
  onLike?: () => void;
  onBookmark?: () => void;
}

export const CardDetailsSection: React.FC<CardDetailsProps> = ({
  card,
  onShare,
  onDownload,
  onLike,
  onBookmark
}) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary': return 'text-orange-400 bg-orange-400/20';
      case 'epic': return 'text-purple-400 bg-purple-400/20';
      case 'rare': return 'text-blue-400 bg-blue-400/20';
      case 'uncommon': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="space-y-4">
      {/* Card Info Section */}
      <div>
        <h4 className="text-sm font-medium text-white mb-3 flex items-center">
          <Tag className="w-4 h-4 mr-2 text-crd-lightGray" />
          Card Information
        </h4>
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-bold text-white mb-2">{card.title}</h2>
            {card.description && (
              <p className="text-crd-lightGray text-sm">{card.description}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Badge className={getRarityColor(card.rarity)}>
              {card.rarity}
            </Badge>
            {card.price && (
              <Badge variant="outline" className="border-crd-green text-crd-green">
                {card.price} CC
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-crd-lightGray" />
              <span className="text-crd-lightGray">Creator:</span>
              <span className="text-white">{card.creator_name || 'Unknown'}</span>
              {card.creator_verified && (
                <Star className="w-3 h-3 text-crd-green fill-current" />
              )}
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-crd-lightGray" />
              <span className="text-crd-lightGray">Created:</span>
              <span className="text-white">{new Date(card.created_at).toLocaleDateString()}</span>
            </div>

            {card.view_count && (
              <div className="flex items-center gap-2 text-sm">
                <Eye className="w-4 h-4 text-crd-lightGray" />
                <span className="text-crd-lightGray">Views:</span>
                <span className="text-white">{card.view_count.toLocaleString()}</span>
              </div>
            )}
          </div>

          {card.tags && card.tags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-crd-lightGray" />
                <span className="text-sm text-crd-lightGray">Tags</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {card.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Separator className="bg-crd-mediumGray/20" />

      {/* Actions Section */}
      <div>
        <h4 className="text-sm font-medium text-white mb-3">Actions</h4>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onLike}
              className="border-crd-mediumGray text-crd-lightGray hover:text-white hover:border-red-500 hover:text-red-400"
            >
              <Heart className="w-4 h-4 mr-2" />
              Like
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onBookmark}
              className="border-crd-mediumGray text-crd-lightGray hover:text-white hover:border-crd-green hover:text-crd-green"
            >
              <Bookmark className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onShare}
            className="w-full border-crd-mediumGray text-crd-lightGray hover:text-white"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Card
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onDownload}
            className="w-full border-crd-mediumGray text-crd-lightGray hover:text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>

          <div className="text-xs text-crd-lightGray space-y-1 pt-2">
            <div className="flex justify-between">
              <span>Likes:</span>
              <span>{card.like_count || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Views:</span>
              <span>{card.view_count || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-crd-mediumGray/20" />

      {/* Comments Section */}
      <div>
        <h4 className="text-sm font-medium text-white mb-3 flex items-center">
          <MessageCircle className="w-4 h-4 mr-2 text-crd-lightGray" />
          Comments
        </h4>
        <div className="text-center py-4">
          <MessageCircle className="w-8 h-8 text-crd-mediumGray mx-auto mb-2" />
          <p className="text-crd-lightGray text-xs">Comments coming soon!</p>
          <p className="text-crd-lightGray text-xs mt-1">
            Connect with other collectors and share your thoughts.
          </p>
        </div>
      </div>

      <Separator className="bg-crd-mediumGray/20" />

      {/* Technical Details Section */}
      <div>
        <h4 className="text-sm font-medium text-white mb-3">Technical Details</h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-crd-lightGray">Card ID:</span>
            <span className="text-white font-mono">{card.id.slice(-8)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-crd-lightGray">Format:</span>
            <span className="text-white">CRD Digital Card</span>
          </div>
          <div className="flex justify-between">
            <span className="text-crd-lightGray">Version:</span>
            <span className="text-white">1.0</span>
          </div>
        </div>

        <div className="mt-4">
          <h5 className="text-xs font-medium text-white mb-2">Blockchain Info</h5>
          <div className="text-center py-2">
            <p className="text-crd-lightGray text-xs">
              Blockchain features coming soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
