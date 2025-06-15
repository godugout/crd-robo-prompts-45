
import React, { useState, useRef } from 'react';
import { useDrag } from '@use-gesture/react';
import { StudioCardRenderer } from '../renderer/StudioCardRenderer';
import { FloatingToolbar } from './FloatingToolbar';
import type { CardData } from '@/hooks/useCardEditor';
import type { StudioState } from '@/hooks/useStudioState';

interface DraggableCardProps {
  cardData: CardData;
  currentPhoto?: string;
  studioState: StudioState;
  template: any;
  position: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
  onSelect: () => void;
  selected: boolean;
  onToolAction: (action: string) => void;
}

export const DraggableCard: React.FC<DraggableCardProps> = ({
  cardData,
  currentPhoto,
  studioState,
  template,
  position,
  onPositionChange,
  onSelect,
  selected,
  onToolAction
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });

  const bind = useDrag(
    ({ offset: [x, y], dragging }) => {
      onPositionChange({ x, y });
      if (dragging && !selected) {
        onSelect();
      }
    },
    { from: [position.x, position.y] }
  );

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
    
    // Update toolbar position
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      setToolbarPosition({
        x: rect.left + rect.width / 2,
        y: rect.top
      });
      setShowToolbar(true);
    }
  };

  const handleToolAction = (action: string) => {
    onToolAction(action);
    setShowToolbar(false);
  };

  return (
    <>
      <div
        ref={cardRef}
        {...bind()}
        className={`absolute cursor-move transition-all duration-200 ${
          selected ? 'ring-2 ring-crd-green shadow-2xl' : 'hover:shadow-xl'
        }`}
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)'
        }}
        onClick={handleCardClick}
      >
        <StudioCardRenderer
          template={template}
          cardData={cardData}
          currentPhoto={currentPhoto}
          studioState={studioState}
          dimensions={{ width: 300, height: 420 }}
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
};
