
import React, { useState, useRef, useCallback, useMemo } from 'react';
import { useDrag } from '@use-gesture/react';
import { FrameRenderer } from '@/components/editor/frames/FrameRenderer';
import { FloatingToolbar } from './FloatingToolbar';
import type { CardData } from '@/hooks/useCardEditor';

interface DraggableCardProps {
  cardData: CardData;
  currentPhoto?: string;
  position: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
  onSelect: () => void;
  selected: boolean;
  onToolAction: (action: string) => void;
}

// Optimized throttle with RAF for smooth animations
const throttleWithRAF = (func: Function) => {
  let ticking = false;
  
  return (...args: any[]) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        func(...args);
        ticking = false;
      });
      ticking = true;
    }
  };
};

export const DraggableCard: React.FC<DraggableCardProps> = React.memo(({
  cardData,
  currentPhoto,
  position,
  onPositionChange,
  onSelect,
  selected,
  onToolAction
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });

  // Throttled position change for smooth dragging
  const throttledPositionChange = useCallback(
    throttleWithRAF(onPositionChange),
    [onPositionChange]
  );

  // Memoize drag configuration
  const dragConfig = useMemo(() => ({
    from: [position.x, position.y] as [number, number],
    bounds: { left: 0, right: window.innerWidth - 300, top: 0, bottom: window.innerHeight - 420 },
    rubberband: true
  }), [position.x, position.y]);

  const bind = useDrag(
    ({ offset: [x, y], dragging, first, last }) => {
      if (dragging) {
        // Use throttled update during drag for performance
        throttledPositionChange({ x, y });
        
        if (first && !selected) {
          onSelect();
        }
      }
      
      // Final accurate position when drag ends
      if (last) {
        onPositionChange({ x, y });
      }
    },
    dragConfig
  );

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selected) {
      onSelect();
    }
    
    // Update toolbar position
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      setToolbarPosition({
        x: rect.left + rect.width / 2,
        y: rect.top
      });
      setShowToolbar(true);
    }
  }, [selected, onSelect]);

  const handleToolAction = useCallback((action: string) => {
    onToolAction(action);
    setShowToolbar(false);
  }, [onToolAction]);

  // Memoize styles for performance
  const containerStyles = useMemo(() => ({
    left: position.x,
    top: position.y,
    transform: 'translate(-50%, -50%)',
    willChange: 'transform',
    touchAction: 'none'
  }), [position.x, position.y]);

  return (
    <>
      <div
        ref={cardRef}
        {...bind()}
        className={`absolute cursor-move transition-all duration-200 ${
          selected ? 'ring-2 ring-crd-green shadow-2xl' : 'hover:shadow-xl'
        }`}
        style={containerStyles}
        onClick={handleCardClick}
      >
        <FrameRenderer
          frameId={cardData.template_id || 'classic-sports'}
          title={cardData.title || 'Untitled Card'}
          cardData={cardData}
          imageUrl={currentPhoto}
          width={300}
          height={420}
        />
      </div>

      <FloatingToolbar
        position={toolbarPosition}
        type="card"
        onAction={handleToolAction}
        visible={showToolbar && selected}
      />
    </>
  );
});

DraggableCard.displayName = 'DraggableCard';
