
import React from 'react';
import { FrameRenderer } from '@/components/editor/frames/FrameRenderer';
import { Badge } from '@/components/ui/badge';

interface GridCard {
  id: string;
  cardData: any;
  gridPosition: number;
  currentPhoto?: string;
}

interface GridCardProps {
  card: GridCard;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (newPosition: number) => void;
  position: number;
}

export const GridCard: React.FC<GridCardProps> = ({
  card,
  isSelected,
  onSelect,
  position
}) => {
  const rarityColors = {
    common: '#6b7280',
    uncommon: '#10b981',
    rare: '#3b82f6',
    epic: '#8b5cf6',
    legendary: '#f59e0b'
  };

  return (
    <div
      className={`
        relative w-full h-full cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'ring-4 ring-crd-green shadow-2xl scale-105 z-10' 
          : 'hover:shadow-xl hover:scale-102'
        }
      `}
      onClick={onSelect}
    >
      {/* Position Number */}
      <div className="absolute -top-2 -left-2 w-6 h-6 bg-[#2c2c54] border border-[#4a4a4a] rounded-full flex items-center justify-center text-white text-xs font-bold z-20">
        {position + 1}
      </div>

      {/* Selected Badge */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 z-20">
          <Badge className="bg-crd-green text-black font-bold">
            EDITING
          </Badge>
        </div>
      )}

      {/* Card Renderer */}
      <div className="w-full h-full rounded-lg overflow-hidden">
        <FrameRenderer
          frameId={card.cardData.template_id || 'classic-sports'}
          cardData={card.cardData}
          imageUrl={card.currentPhoto}
          width={240}
          height={320}
        />
      </div>

      {/* Card Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <div className="text-white text-sm font-semibold truncate">
          {card.cardData.title}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: rarityColors[card.cardData.rarity as keyof typeof rarityColors] }}
          />
          <span className="text-xs text-white/80 capitalize">
            {card.cardData.rarity}
          </span>
        </div>
      </div>
    </div>
  );
};
