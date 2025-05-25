
import React from 'react';
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

const CardGridItem = ({ card, index }: { card: CardData; index: number }) => (
  <Card className="group bg-crd-dark border-crd-mediumGray hover:border-crd-blue transition-all duration-300 overflow-hidden">
    <div className="aspect-[3/4] relative overflow-hidden">
      <img
        src={card.image_url || card.thumbnail_url || `https://images.unsplash.com/photo-${1580000000000 + index}?w=300&q=80`}
        alt={card.title || 'Card'}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = `https://images.unsplash.com/photo-${1580000000000 + index}?w=300&q=80`;
        }}
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
          <LoadingSkeleton key={i} />
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
        <CardGridItem key={card.id || `card-${index}`} card={card} index={index} />
      ))}
    </div>
  );
};
