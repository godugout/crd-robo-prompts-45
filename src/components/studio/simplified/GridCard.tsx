
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

const rarityColors = {
  common: '#6b7280',
  uncommon: '#10b981',
  rare: '#3b82f6',
  epic: '#8b5cf6',
  legendary: '#f59e0b'
};

export const GridCard: React.FC<GridCardProps> = ({
  card,
  isSelected,
  onSelect,
  position
}) => {
  return (
    <div
      className={`
        relative w-full h-full cursor-pointer group transition-all duration-300 ease-out
        ${isSelected 
          ? 'scale-105 z-20' 
          : 'hover:scale-102 z-0'
        }
      `}
      onClick={onSelect}
    >
      {/* Selection Ring & Glow Effect */}
      <div className={`
        absolute inset-0 rounded-xl transition-all duration-300
        ${isSelected 
          ? 'ring-4 ring-crd-green shadow-2xl shadow-crd-green/30 bg-gradient-to-t from-crd-green/5 to-transparent' 
          : 'ring-2 ring-transparent group-hover:ring-[#3772FF]/50 group-hover:shadow-xl'
        }
      `} />

      {/* Grid Position Number */}
      <div className={`
        absolute -top-3 -left-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold z-30 transition-all duration-200
        ${isSelected 
          ? 'bg-crd-green text-black shadow-lg' 
          : 'bg-[#2c2c54] border-2 border-[#4a4a4a] text-[#a1a1aa] group-hover:border-[#3772FF] group-hover:text-white'
        }
      `}>
        {position + 1}
      </div>

      {/* Active Editing Badge */}
      {isSelected && (
        <div className="absolute -top-3 -right-3 z-30">
          <Badge className="bg-crd-green text-black font-bold text-xs px-2 py-1 shadow-lg animate-pulse">
            EDITING
          </Badge>
        </div>
      )}

      {/* Card Content */}
      <div className="w-full h-full rounded-xl overflow-hidden bg-[#1a1a1d] border border-[#27272a] transition-all duration-300 group-hover:border-[#3f3f46]">
        <FrameRenderer
          frameId={card.cardData.template_id || 'classic-sports'}
          title={card.cardData.title || 'Untitled Card'}
          cardData={card.cardData}
          imageUrl={card.currentPhoto}
          width={280}
          height={373}
        />
      </div>

      {/* Card Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 rounded-b-xl">
        <div className="space-y-2">
          <h3 className="text-white font-semibold text-sm truncate">
            {card.cardData.title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full border border-white/20"
                style={{ backgroundColor: rarityColors[card.cardData.rarity as keyof typeof rarityColors] }}
              />
              <span className="text-xs text-white/80 capitalize font-medium">
                {card.cardData.rarity}
              </span>
            </div>
            {isSelected && (
              <div className="w-2 h-2 bg-crd-green rounded-full animate-pulse" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
