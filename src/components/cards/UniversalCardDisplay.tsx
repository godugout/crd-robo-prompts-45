import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Eye, 
  Edit2,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CachedImage } from '@/components/common/CachedImage';
import { useCardOwnership } from '@/hooks/useCardOwnership';
import { useNavigate } from 'react-router-dom';

export type CardDisplayMode = 'grid' | 'row' | 'table';
export type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface UniversalCardData {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  thumbnail_url?: string;
  rarity: CardRarity;
  price?: number;
  creator_name?: string;
  creator_verified?: boolean;
  creator_id?: string;
  stock?: number;
  highest_bid?: number;
  edition_size?: number;
  tags?: string[];
}

interface UniversalCardDisplayProps {
  card: UniversalCardData;
  mode: CardDisplayMode;
  onView?: (card: UniversalCardData) => void;
  onEdit?: (card: UniversalCardData) => void;
  onCardClick?: (card: UniversalCardData) => void;
  showActions?: boolean;
  loading?: boolean;
  className?: string;
}

const RARITY_COLORS = {
  common: 'border-blue-500 bg-blue-500/10 text-blue-400',
  uncommon: 'border-green-500 bg-green-500/10 text-green-400',
  rare: 'border-purple-500 bg-purple-500/10 text-purple-400',
  epic: 'border-orange-500 bg-orange-500/10 text-orange-400',
  legendary: 'border-yellow-500 bg-yellow-500/10 text-yellow-400'
};

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80',
  'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80',
];

export const UniversalCardDisplay: React.FC<UniversalCardDisplayProps> = ({
  card,
  mode = 'grid',
  onView,
  onEdit,
  onCardClick,
  showActions = true,
  loading = false,
  className
}) => {
  const [imageError, setImageError] = useState(false);
  const { isOwner } = useCardOwnership(card.creator_id);
  const navigate = useNavigate();

  // Add safety checks for card and card.id
  if (!card || !card.id) {
    console.warn('UniversalCardDisplay received invalid card data:', card);
    return <CardSkeleton mode={mode} />;
  }

  const displayImage = imageError || (!card.image_url && !card.thumbnail_url)
    ? FALLBACK_IMAGES[parseInt(card.id.slice(-1), 16) % FALLBACK_IMAGES.length]
    : (card.thumbnail_url || card.image_url);

  const handleImageError = () => {
    setImageError(true);
  };

  // Fix: Ensure card click always triggers onView and prevent button event bubbling
  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(card);
    } else {
      // Navigate to card detail page
      navigate(`/card/${card.id}`);
    }
  };

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('View button clicked:', card.id);
    onView?.(card);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('Edit button clicked:', card.id);
    onEdit?.(card);
  };

  if (loading) {
    return (
      <div className={cn(
        'animate-pulse bg-crd-mediumGray/20 rounded-lg',
        mode === 'grid' ? 'aspect-[3/4]' : 'h-24',
        className
      )}>
        <div className="w-full h-full bg-gradient-to-br from-crd-mediumGray/10 to-crd-mediumGray/30 rounded-lg" />
      </div>
    );
  }

  const imageUrl = card.thumbnail_url || card.image_url || displayImage;

  if (mode === 'grid') {
    return (
      <Card 
        className={cn(
          "bg-crd-dark border-crd-mediumGray hover:border-crd-blue/50 transition-all duration-200 group overflow-hidden cursor-pointer",
          "hover:scale-[1.02] hover:shadow-lg hover:shadow-crd-blue/10",
          className
        )}
        onClick={handleCardClick}
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          {/* Make entire image area clickable */}
          <div 
            className="absolute inset-0 z-0 cursor-pointer"
            onClick={handleCardClick}
          />
          
          <CachedImage
            src={imageUrl}
            alt={card.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
            onError={handleImageError}
          />
          
          {/* Rarity Badge */}
          <div className="absolute top-2 left-2 z-10">
            <Badge className={cn('text-xs', RARITY_COLORS[card.rarity || 'common'])}>
              {card.rarity || 'common'}
            </Badge>
          </div>

          {/* Action Buttons with proper z-index and data attributes */}
          {showActions && (
            <div className="absolute top-2 right-2 flex gap-1 z-20">
              <Button
                size="sm"
                variant="ghost"
                className="w-8 h-8 p-0 bg-black/70 hover:bg-black/90 text-white/90 hover:text-white backdrop-blur-sm border border-white/10"
                onClick={handleViewClick}
                title="View in 3D"
                data-action-button="true"
              >
                <Eye className="w-3 h-3" />
              </Button>
              
              {isOwner && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-8 h-8 p-0 bg-black/70 hover:bg-black/90 text-white/90 hover:text-white backdrop-blur-sm border border-white/10"
                  onClick={handleEditClick}
                  title="Edit Card"
                  data-action-button="true"
                >
                  <Edit2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          )}

          {/* Price Badge */}
          <div className="absolute bottom-2 left-2 z-10">
            <Badge variant="secondary" className="bg-black/70 text-crd-green">
              {card.price ? `${card.price} ETH` : '1.5 ETH'}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-crd-white font-semibold mb-1 line-clamp-1 flex-1">{card.title || 'Untitled Card'}</h3>
          </div>
          
          <p className="text-crd-lightGray text-sm line-clamp-2 mb-3">{card.description || 'Digital collectible card'}</p>
          
          <div className="flex items-center justify-between text-xs text-crd-lightGray">
            <span className="flex items-center gap-1">
              {card.creator_name || 'Anonymous'}
              {card.creator_verified && <Star className="w-3 h-3 text-yellow-400" />}
            </span>
            <span>{card.stock || 3} in stock</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (mode === 'row') {
    return (
      <Card 
        className={cn(
          "bg-crd-dark border-crd-mediumGray hover:border-crd-blue/50 transition-all duration-200 cursor-pointer",
          "hover:bg-crd-mediumGray/5",
          className
        )}
        onClick={handleCardClick}
      >
        <div className="flex items-center p-4 gap-4">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer">
            <CachedImage
              src={imageUrl}
              alt={card.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={handleImageError}
            />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-white font-semibold">{card.title || 'Untitled Card'}</h3>
              <Badge className={cn('text-xs', RARITY_COLORS[card.rarity || 'common'])}>
                {card.rarity || 'common'}
              </Badge>
            </div>
            
            <p className="text-crd-lightGray text-sm mb-3 line-clamp-2">{card.description || 'No description available'}</p>
            
            <div className="flex items-center gap-4 text-sm text-crd-lightGray mb-3">
              <span className="flex items-center gap-1">
                {card.creator_name || 'Anonymous'}
                {card.creator_verified && <Star className="w-3 h-3 text-yellow-400" />}
              </span>
              <span>{card.stock || 3} in stock</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-crd-green font-medium">
                {card.price ? `${card.price} ETH` : '1.5 ETH'}
              </span>
              
              {showActions && (
                <div className="flex items-center gap-1">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={handleViewClick}
                    className="hover:bg-crd-blue/20"
                    data-action-button="true"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  {isOwner && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={handleEditClick}
                      className="hover:bg-crd-purple/20"
                      data-action-button="true"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (mode === 'table') {
    return (
      <div 
        className={cn(
          "flex items-center p-4 border-b border-crd-mediumGray hover:bg-crd-mediumGray/10 transition-colors cursor-pointer",
          className
        )}
        onClick={handleCardClick}
      >
        <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 cursor-pointer">
          <CachedImage
            src={imageUrl}
            alt={card.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={handleImageError}
          />
        </div>
        
        <div className="flex-1 ml-4">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-medium">{card.title || 'Untitled Card'}</h3>
            <Badge className={cn('text-xs', RARITY_COLORS[card.rarity || 'common'])}>
              {card.rarity || 'common'}
            </Badge>
          </div>
          <p className="text-crd-lightGray text-sm line-clamp-1">{card.description || 'No description available'}</p>
        </div>

        <div className="flex items-center gap-4 text-sm text-crd-lightGray">
          <span>{card.price ? `${card.price} ETH` : '1.5 ETH'}</span>
          <span>{card.stock || 3} in stock</span>
        </div>

        {showActions && (
          <div className="flex items-center gap-1 ml-4">
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={handleViewClick}
              data-action-button="true"
            >
              <Eye className="w-4 h-4" />
            </Button>
            {isOwner && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={handleEditClick}
                data-action-button="true"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }

  return null;
};

const CardSkeleton: React.FC<{ mode: CardDisplayMode }> = ({ mode }) => {
  if (mode === 'table') {
    return (
      <div className="flex items-center p-4 border-b border-crd-mediumGray">
        <Skeleton className="w-16 h-20 rounded bg-crd-mediumGray" />
        <div className="flex-1 ml-4 space-y-2">
          <Skeleton className="h-4 bg-crd-mediumGray rounded w-1/3" />
          <Skeleton className="h-3 bg-crd-mediumGray rounded w-1/2" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-3 bg-crd-mediumGray rounded w-16" />
          <Skeleton className="h-3 bg-crd-mediumGray rounded w-20" />
        </div>
      </div>
    );
  }

  if (mode === 'row') {
    return (
      <Card className="bg-crd-dark border-crd-mediumGray">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Skeleton className="w-24 h-32 rounded bg-crd-mediumGray" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 bg-crd-mediumGray rounded" />
              <Skeleton className="h-3 bg-crd-mediumGray rounded w-2/3" />
              <Skeleton className="h-3 bg-crd-mediumGray rounded w-1/2" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-crd-dark border-crd-mediumGray overflow-hidden">
      <Skeleton className="aspect-[3/4] bg-crd-mediumGray" />
      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-4 bg-crd-mediumGray rounded" />
        <Skeleton className="h-3 bg-crd-mediumGray rounded w-2/3" />
        <div className="flex justify-between mt-3">
          <Skeleton className="h-3 bg-crd-mediumGray rounded w-16" />
          <Skeleton className="h-3 bg-crd-mediumGray rounded w-20" />
        </div>
      </CardContent>
    </Card>
  );
};

export default UniversalCardDisplay;
