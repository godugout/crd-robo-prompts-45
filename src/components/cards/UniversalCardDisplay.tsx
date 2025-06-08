
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Eye, 
  Edit, 
  Zap, 
  Heart, 
  Share,
  MoreHorizontal,
  User,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
  stock?: number;
  highest_bid?: number;
  edition_size?: number;
  tags?: string[];
}

interface UniversalCardDisplayProps {
  card: UniversalCardData;
  mode: CardDisplayMode;
  onView?: (card: UniversalCardData) => void;
  onRemix?: (card: UniversalCardData) => void;
  onStage?: (card: UniversalCardData) => void;
  onFavorite?: (card: UniversalCardData) => void;
  onShare?: (card: UniversalCardData) => void;
  showActions?: boolean;
  loading?: boolean;
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
  mode,
  onView,
  onRemix,
  onStage,
  onFavorite,
  onShare,
  showActions = true,
  loading = false
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const displayImage = imageError || (!card.image_url && !card.thumbnail_url)
    ? FALLBACK_IMAGES[parseInt(card.id.slice(-1), 16) % FALLBACK_IMAGES.length]
    : (card.thumbnail_url || card.image_url);

  const handleImageLoad = () => setImageLoading(false);
  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  if (loading) {
    return <CardSkeleton mode={mode} />;
  }

  if (mode === 'table') {
    return (
      <div className="flex items-center p-4 bg-crd-dark border-b border-crd-mediumGray hover:bg-crd-mediumGray/10 transition-colors">
        <div className="w-16 h-20 rounded overflow-hidden bg-crd-mediumGray flex-shrink-0">
          <img
            src={displayImage}
            alt={card.title}
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>
        
        <div className="flex-1 ml-4">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-medium">{card.title}</h3>
            <Badge className={cn('text-xs', RARITY_COLORS[card.rarity])}>
              {card.rarity}
            </Badge>
          </div>
          <p className="text-crd-lightGray text-sm line-clamp-1">{card.description}</p>
        </div>

        <div className="flex items-center gap-4 text-sm text-crd-lightGray">
          <span>{card.price ? `${card.price} ETH` : '1.5 ETH'}</span>
          <span>{card.stock || 3} in stock</span>
        </div>

        {showActions && (
          <div className="flex items-center gap-1 ml-4">
            <Button size="sm" variant="ghost" onClick={() => onView?.(card)}>
              <Eye className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onRemix?.(card)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onStage?.(card)}>
              <Zap className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (mode === 'row') {
    return (
      <Card 
        className="bg-crd-dark border-crd-mediumGray hover:border-crd-blue/50 transition-all cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onView?.(card)}
      >
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="w-24 h-32 rounded overflow-hidden bg-crd-mediumGray flex-shrink-0">
              <img
                src={displayImage}
                alt={card.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-white font-semibold">{card.title}</h3>
                <Badge className={cn('text-xs', RARITY_COLORS[card.rarity])}>
                  {card.rarity}
                </Badge>
              </div>
              
              <p className="text-crd-lightGray text-sm mb-3 line-clamp-2">{card.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-crd-lightGray mb-3">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {card.creator_name || 'Anonymous'}
                  {card.creator_verified && <Star className="w-3 h-3 text-yellow-400" />}
                </span>
                <span>{card.stock || 3} in stock</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-crd-green font-medium">
                  {card.price ? `${card.price} ETH` : '1.5 ETH'}
                </span>
                
                {showActions && isHovered && (
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onView?.(card); }}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onRemix?.(card); }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onStage?.(card); }}>
                      <Zap className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid mode (default)
  return (
    <Card 
      className="group bg-crd-dark border-crd-mediumGray hover:border-crd-blue/50 transition-all duration-300 overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onView?.(card)}
    >
      <div className="aspect-[3/4] relative overflow-hidden bg-crd-mediumGray">
        {imageLoading && (
          <Skeleton className="absolute inset-0 bg-crd-mediumGray" />
        )}
        <img
          src={displayImage}
          alt={card.title}
          className={cn(
            "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300",
            imageLoading ? 'opacity-0' : 'opacity-100'
          )}
          loading="lazy"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        
        {/* Rarity Badge */}
        <div className="absolute top-2 left-2">
          <Badge className={cn('text-xs', RARITY_COLORS[card.rarity])}>
            {card.rarity}
          </Badge>
        </div>

        {/* Quick Actions */}
        {showActions && isHovered && (
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="w-8 h-8 p-0 bg-black/70 hover:bg-black/90"
              onClick={(e) => { e.stopPropagation(); onFavorite?.(card); }}
            >
              <Heart className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="w-8 h-8 p-0 bg-black/70 hover:bg-black/90"
              onClick={(e) => { e.stopPropagation(); onShare?.(card); }}
            >
              <Share className="w-3 h-3" />
            </Button>
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute bottom-2 left-2">
          <Badge variant="secondary" className="bg-black/70 text-crd-green">
            {card.price ? `${card.price} ETH` : '1.5 ETH'}
          </Badge>
        </div>

        {/* Main Actions */}
        {showActions && isHovered && (
          <div className="absolute bottom-2 right-2 flex gap-1">
            <Button
              size="sm"
              className="w-8 h-8 p-0 bg-crd-blue hover:bg-crd-blue/90"
              onClick={(e) => { e.stopPropagation(); onView?.(card); }}
            >
              <Eye className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              className="w-8 h-8 p-0 bg-crd-purple hover:bg-crd-purple/90"
              onClick={(e) => { e.stopPropagation(); onRemix?.(card); }}
            >
              <Edit className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              className="w-8 h-8 p-0 bg-crd-green hover:bg-crd-green/90 text-black"
              onClick={(e) => { e.stopPropagation(); onStage?.(card); }}
            >
              <Zap className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-crd-white font-semibold mb-1 line-clamp-1 flex-1">{card.title}</h3>
          <Button
            size="sm"
            variant="ghost"
            className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => { e.stopPropagation(); }}
          >
            <MoreHorizontal className="w-3 h-3" />
          </Button>
        </div>
        
        <p className="text-crd-lightGray text-sm line-clamp-2 mb-3">{card.description || 'Digital collectible card'}</p>
        
        <div className="flex items-center justify-between text-xs text-crd-lightGray">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {card.creator_name || 'Anonymous'}
            {card.creator_verified && <Star className="w-3 h-3 text-yellow-400" />}
          </span>
          <span>{card.stock || 3} in stock</span>
        </div>
      </CardContent>
    </Card>
  );
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
