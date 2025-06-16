
import React, { useCallback, useMemo } from 'react';
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

// Throttle function to limit position updates
const throttle = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;
  
  return (...args: any[]) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};

export const DraggableCardItem: React.FC<DraggableCardItemProps> = React.memo(({
  card,
  isSelected,
  onPositionChange,
  onSelect
}) => {
  // Throttled position update to reduce re-renders during drag
  const throttledPositionChange = useCallback(
    throttle((id: string, pos: { x: number; y: number }) => {
      onPositionChange(id, pos);
    }, 16), // ~60fps
    [onPositionChange]
  );

  // Memoize drag configuration
  const dragConfig = useMemo(() => ({
    from: [card.position.x, card.position.y] as [number, number],
    bounds: { left: -50, right: window.innerWidth - 250, top: -50, bottom: window.innerHeight - 370 },
    rubberband: true
  }), [card.position.x, card.position.y]);

  const bind = useDrag(
    ({ offset: [x, y], dragging, first, last }) => {
      // Only update position during drag, not on every movement
      if (dragging) {
        // Use throttled update for smooth performance
        throttledPositionChange(card.id, { x, y });
        
        // Select card on first drag if not already selected
        if (first && !isSelected) {
          onSelect(card.id);
        }
      }
      
      // Final position update when drag ends
      if (last) {
        onPositionChange(card.id, { x, y });
      }
    },
    dragConfig
  );

  // Memoize styles to prevent unnecessary recalculations
  const containerStyles = useMemo(() => ({
    left: card.position.x,
    top: card.position.y,
    transform: 'translate(-50%, -50%)',
    filter: isSelected ? 'brightness(1.2) saturate(1.1)' : 'brightness(1)',
    willChange: 'transform', // Optimize for animations
    touchAction: 'none' // Fix touch-action warning
  }), [card.position.x, card.position.y, isSelected]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSelected) {
      onSelect(card.id);
    }
  }, [isSelected, onSelect, card.id]);

  return (
    <div
      {...bind()}
      className={`absolute cursor-move transition-all duration-200 ${
        isSelected
          ? 'ring-4 ring-purple-400 shadow-2xl scale-110 z-20'
          : 'hover:shadow-2xl hover:scale-105 z-10'
      }`}
      style={containerStyles}
      onClick={handleClick}
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
});

DraggableCardItem.displayName = 'DraggableCardItem';
