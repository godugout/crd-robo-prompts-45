
import React, { useState } from 'react';
import { Card } from '@/types/cards';
import { RarityBadge } from './RarityBadge';
import { CardStats } from './CardStats';
import { Button } from '@/components/ui/button';
import { Heart, Eye, Share2, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RARITY_COLORS, CARD_TYPE_LABELS } from '@/types/cards';

interface CardDisplayProps {
  card: Card;
  variant?: 'grid' | 'list' | 'featured';
  showStats?: boolean;
  onView?: (card: Card) => void;
  onFavorite?: (card: Card) => void;
  onShare?: (card: Card) => void;
  className?: string;
}

export const CardDisplay: React.FC<CardDisplayProps> = ({
  card,
  variant = 'grid',
  showStats = true,
  onView,
  onFavorite,
  onShare,
  className
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  const rarityColors = RARITY_COLORS[card.rarity];

  const handleImageLoad = () => setImageLoading(false);
  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  if (variant === 'list') {
    return (
      <div className={cn(
        'bg-crd-dark border border-crd-mediumGray rounded-lg p-4 hover:border-crd-green/50 transition-all duration-200',
        className
      )}>
        <div className="flex items-center gap-4">
          {/* Image */}
          <div className="relative w-16 h-20 flex-shrink-0">
            {!imageError ? (
              <img
                src={card.image_url || '/placeholder-card.png'}
                alt={card.name}
                className="w-full h-full object-cover rounded border border-crd-mediumGray"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full bg-crd-mediumGray rounded flex items-center justify-center">
                <span className="text-xs text-crd-lightGray">No Image</span>
              </div>
            )}
            {imageLoading && (
              <div className="absolute inset-0 bg-crd-mediumGray animate-pulse rounded" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-bold text-white truncate">{card.name}</h3>
                <p className="text-sm text-crd-lightGray">
                  {CARD_TYPE_LABELS[card.card_type]}
                </p>
              </div>
              <RarityBadge rarity={card.rarity} size="sm" />
            </div>
            
            {card.description && (
              <p className="text-sm text-crd-lightGray line-clamp-1 mb-2">
                {card.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <CardStats card={card} variant="compact" />
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-crd-green">
                  ${card.current_market_value.toFixed(2)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView?.(card)}
                  className="text-crd-lightGray hover:text-white"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'group relative bg-crd-dark border rounded-xl overflow-hidden transition-all duration-300 hover:scale-105',
      `border-${rarityColors.border.split('-')[1]}-500/30`,
      'hover:border-crd-green/50 hover:shadow-lg hover:shadow-crd-green/20',
      variant === 'featured' && 'lg:col-span-2',
      className
    )}>
      {/* Image Container */}
      <div className={cn(
        'relative aspect-[2/3] overflow-hidden',
        variant === 'featured' && 'aspect-[16/9]'
      )}>
        {!imageError ? (
          <img
            src={card.image_url || '/placeholder-card.png'}
            alt={card.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-crd-mediumGray to-crd-darkest flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-crd-mediumGray rounded-full flex items-center justify-center mx-auto mb-2">
                <Eye className="w-8 h-8 text-crd-lightGray" />
              </div>
              <span className="text-sm text-crd-lightGray">{card.name}</span>
            </div>
          </div>
        )}

        {imageLoading && (
          <div className="absolute inset-0 bg-crd-mediumGray animate-pulse" />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Top badges */}
        <div className="absolute top-3 left-3">
          <RarityBadge rarity={card.rarity} animated />
        </div>

        {card.is_featured && (
          <div className="absolute top-3 right-3">
            <div className="bg-crd-green text-black px-2 py-1 rounded-full text-xs font-bold">
              Featured
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onFavorite?.(card)}
            className="bg-black/50 hover:bg-black/70 border-0"
          >
            <Heart className={cn(
              'w-4 h-4',
              card.is_favorited ? 'fill-red-500 text-red-500' : 'text-white'
            )} />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onShare?.(card)}
            className="bg-black/50 hover:bg-black/70 border-0"
          >
            <Share2 className="w-4 h-4 text-white" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-bold text-white mb-1 line-clamp-1">
            {card.name}
          </h3>
          <p className="text-sm text-crd-lightGray">
            {CARD_TYPE_LABELS[card.card_type]}
          </p>
        </div>

        {card.description && (
          <p className="text-sm text-crd-lightGray line-clamp-2 mb-3">
            {card.description}
          </p>
        )}

        {showStats && <CardStats card={card} variant="compact" className="mb-3" />}

        <div className="flex items-center justify-between">
          <div className="text-left">
            <div className="text-lg font-bold text-crd-green">
              ${card.current_market_value.toFixed(2)}
            </div>
            {card.creator_name && (
              <div className="text-xs text-crd-lightGray">
                by {card.creator_name}
              </div>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView?.(card)}
            className="border-crd-green text-crd-green hover:bg-crd-green hover:text-black"
          >
            View Card
          </Button>
        </div>
      </div>
    </div>
  );
};
