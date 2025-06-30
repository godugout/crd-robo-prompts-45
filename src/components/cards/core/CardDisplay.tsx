
import React from 'react';
import { Card } from '@/types/cards';
import { RarityBadge } from './RarityBadge';
import { CardStats } from './CardStats';
import { Button } from '@/components/ui/button';
import { Heart, Share2, Eye } from 'lucide-react';

interface CardDisplayProps {
  card: Card;
  variant?: 'grid' | 'list';
  onView?: (card: Card) => void;
  onFavorite?: (card: Card) => void;
  onShare?: (card: Card) => void;
  className?: string;
}

export const CardDisplay: React.FC<CardDisplayProps> = ({
  card,
  variant = 'grid',
  onView,
  onFavorite,
  onShare,
  className = ''
}) => {
  if (variant === 'list') {
    return (
      <div className={`bg-crd-dark border border-crd-mediumGray rounded-lg p-4 hover:border-crd-green/50 transition-colors ${className}`}>
        <div className="flex gap-4">
          <div className="w-20 h-28 bg-crd-mediumGray rounded-lg flex-shrink-0">
            {card.image_url ? (
              <img 
                src={card.image_url} 
                alt={card.title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-crd-lightGray">
                No Image
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-bold text-white">{card.title}</h3>
              <RarityBadge rarity={card.rarity} size="sm" />
            </div>
            
            {card.description && (
              <p className="text-crd-lightGray text-sm mb-3 line-clamp-2">
                {card.description}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <CardStats card={card} variant="compact" />
              
              <div className="flex gap-2">
                {onFavorite && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFavorite(card)}
                    className="text-crd-lightGray hover:text-red-400"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                )}
                {onShare && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onShare(card)}
                    className="text-crd-lightGray hover:text-crd-blue"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                )}
                {onView && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(card)}
                    className="text-crd-lightGray hover:text-crd-green"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-crd-dark border border-crd-mediumGray rounded-lg overflow-hidden hover:border-crd-green/50 transition-all duration-200 group ${className}`}>
      {/* Card Image */}
      <div className="aspect-[3/4] bg-crd-mediumGray relative">
        {card.image_url ? (
          <img 
            src={card.image_url} 
            alt={card.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-crd-lightGray">
            No Image
          </div>
        )}
        
        {/* Rarity Badge Overlay */}
        <div className="absolute top-2 right-2">
          <RarityBadge rarity={card.rarity} size="sm" />
        </div>
        
        {/* Action Buttons Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
          {onView && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onView(card)}
              className="bg-crd-green text-black hover:bg-crd-green/80"
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
          )}
        </div>
      </div>
      
      {/* Card Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
          {card.title}
        </h3>
        
        {card.creator_name && (
          <p className="text-sm text-crd-lightGray mb-2">
            by {card.creator_name}
          </p>
        )}
        
        {card.description && (
          <p className="text-sm text-crd-lightGray mb-3 line-clamp-2">
            {card.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <CardStats card={card} variant="compact" />
          
          <div className="flex gap-1">
            {onFavorite && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFavorite(card)}
                className="text-crd-lightGray hover:text-red-400 p-1"
              >
                <Heart className="w-4 h-4" />
              </Button>
            )}
            {onShare && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onShare(card)}
                className="text-crd-lightGray hover:text-crd-blue p-1"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
