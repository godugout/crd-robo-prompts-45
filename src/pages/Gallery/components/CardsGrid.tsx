
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface CardItem {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  rarity?: string;
}

interface CardsGridProps {
  cards: CardItem[];
  loading: boolean;
  onCardClick: (card: CardItem) => void;
}

export const CardsGrid: React.FC<CardsGridProps> = ({
  cards,
  loading,
  onCardClick
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array(4).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <p className="text-[#777E90] col-span-4 text-center py-8">No featured cards found</p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {cards.slice(0, 8).map((card) => (
        <Card 
          key={card.id} 
          className="bg-[#23262F] border-[#353945] overflow-hidden cursor-pointer hover:border-[#3772FF] transition-colors group"
          onClick={() => onCardClick(card)}
        >
          <div 
            className="h-48 bg-cover bg-center group-hover:scale-105 transition-transform"
            style={{ 
              backgroundImage: card.image_url 
                ? `url(${card.image_url})` 
                : 'url(https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&q=80)'
            }}
          ></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-[#FCFCFD] text-lg group-hover:text-[#3772FF] transition-colors">{card.title}</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-[#777E90] text-sm line-clamp-2">{card.description}</p>
            {card.rarity && (
              <div className="mt-2">
                <span className="inline-block bg-[#3772FF] text-white text-xs px-2 py-1 rounded">
                  {card.rarity}
                </span>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full border-[#353945] text-white hover:bg-[#3772FF] hover:border-[#3772FF] transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onCardClick(card);
              }}
            >
              View in 3D
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
