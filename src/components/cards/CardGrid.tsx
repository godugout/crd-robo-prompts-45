
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface CardData {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  thumbnail_url?: string;
  price?: string;
}

interface CardGridProps {
  cards: CardData[];
  loading: boolean;
  viewMode: 'grid' | 'masonry' | 'feed';
}

const UNSPLASH_IMAGES = [
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80', // Trading cards
  'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&q=80', // Gaming cards
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80', // Tech aesthetic
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80', // Code aesthetic
  'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&q=80', // Abstract digital
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', // Neon aesthetic
  'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&q=80', // Digital art
  'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&q=80', // Abstract colorful
];

const CardGridItem = ({ card, index }: { card: CardData; index: number }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  // Use consistent fallback image based on card ID to prevent flickering
  const fallbackImage = UNSPLASH_IMAGES[index % UNSPLASH_IMAGES.length];
  const displayImage = imageError || (!card.image_url && !card.thumbnail_url) 
    ? fallbackImage 
    : (card.thumbnail_url || card.image_url);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  return (
    <Card className="group bg-crd-dark border-crd-mediumGray hover:border-crd-blue transition-all duration-300 overflow-hidden">
      <div className="aspect-[3/4] relative overflow-hidden bg-crd-mediumGray">
        {imageLoading && (
          <Skeleton className="absolute inset-0 bg-crd-mediumGray" />
        )}
        <img
          src={displayImage}
          alt={card.title || 'Card'}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
            imageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          loading="lazy"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Badge variant="secondary" className="bg-crd-green/20 text-crd-green">
            {card.price ? `${card.price} ETH` : '1.5 ETH'}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-crd-white font-semibold mb-1 line-clamp-1">{card.title || 'Untitled Card'}</h3>
        <p className="text-crd-lightGray text-sm line-clamp-2">{card.description || 'Digital collectible card'}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-crd-lightGray">3 in stock</span>
          <span className="text-xs text-crd-orange">0.001 ETH bid</span>
        </div>
      </CardContent>
    </Card>
  );
};

const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <Skeleton className="aspect-[3/4] rounded-t-lg bg-crd-mediumGray" />
    <div className="bg-crd-dark p-4 rounded-b-lg space-y-2">
      <Skeleton className="h-4 bg-crd-mediumGray rounded" />
      <Skeleton className="h-3 bg-crd-mediumGray rounded w-2/3" />
      <div className="flex justify-between mt-3">
        <Skeleton className="h-3 bg-crd-mediumGray rounded w-16" />
        <Skeleton className="h-3 bg-crd-mediumGray rounded w-20" />
      </div>
    </div>
  </div>
);

export const CardGrid: React.FC<CardGridProps> = ({ cards, loading, viewMode }) => {
  if (loading) {
    return (
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
          : viewMode === 'masonry'
          ? 'columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6'
          : 'space-y-6'
      }>
        {Array(8).fill(0).map((_, i) => (
          <LoadingSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-crd-lightGray mb-4">No cards found</p>
      </div>
    );
  }

  return (
    <div className={
      viewMode === 'grid' 
        ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
        : viewMode === 'masonry'
        ? 'columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6'
        : 'space-y-6'
    }>
      {cards.map((card, index) => (
        <CardGridItem key={`card-${card.id}-${index}`} card={card} index={index} />
      ))}
    </div>
  );
};
