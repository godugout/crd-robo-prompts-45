
import React from 'react';
import { useDrag } from '@use-gesture/react';
import { EnhancedCardRenderer } from './EnhancedCardRenderer';

interface EffectsType {
  holographic_intensity?: number;
  glow_effect?: number;
  border_thickness?: number;
  shadow_depth?: number;
  background_gradient?: string;
  background_texture?: string;
}
interface CardDataType {
  title: string;
  rarity: string;
  tags?: string[];
  description?: string;
  image_url?: string;
  template_id?: string;
  design_metadata?: any;
  visibility?: string;
  creator_attribution?: any;
  publishing_options?: any;
  edition_size?: number;
}
export interface CardElementType {
  id: string;
  cardData: CardDataType;
  position: { x: number; y: number };
  currentPhoto?: string;
  effects?: EffectsType;
}
interface DraggableCardItemProps {
  card: CardElementType;
  isSelected: boolean;
  onPositionChange: (id: string, pos: { x: number; y: number }) => void;
  onSelect: (id: string) => void;
}
export const DraggableCardItem: React.FC<DraggableCardItemProps> = ({
  card,
  isSelected,
  onPositionChange,
  onSelect
}) => {
  const bind = useDrag(
    ({ offset: [x, y], dragging }) => {
      onPositionChange(card.id, { x, y });
      if (dragging && !isSelected) onSelect(card.id);
    },
    { from: [card.position.x, card.position.y] }
  );
  return (
    <div
      {...bind()}
      className={`absolute cursor-move transition-all duration-500 ${isSelected
        ? 'ring-4 ring-purple-400 shadow-2xl scale-110 z-20'
        : 'hover:shadow-2xl hover:scale-105 z-10'
      }`}
      style={{
        left: card.position.x,
        top: card.position.y,
        transform: 'translate(-50%, -50%)',
        filter: isSelected ? 'brightness(1.2) saturate(1.1)' : 'brightness(1)'
      }}
      onClick={e => { e.stopPropagation(); onSelect(card.id); }}
    >
      <EnhancedCardRenderer
        cardData={card.cardData}
        currentPhoto={card.currentPhoto}
        width={300}
        height={420}
        effects={card.effects}
      />
    </div>
  );
};
