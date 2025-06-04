
import React from 'react';
import { EnhancedCardContainer } from './EnhancedCardContainer';
import { ViewerErrorBoundary } from './ViewerErrorBoundary';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface ViewerCardRendererProps {
  cardContainerRef: React.RefObject<HTMLDivElement>;
  card: CardData;
  isFlipped: boolean;
  isHovering: boolean;
  showEffects: boolean;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  rotation: { x: number; y: number };
  zoom: number;
  isDragging: boolean;
  frameStyles: React.CSSProperties;
  enhancedEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

export const ViewerCardRenderer: React.FC<ViewerCardRendererProps> = ({
  cardContainerRef,
  card,
  isFlipped,
  isHovering,
  showEffects,
  effectValues,
  mousePosition,
  rotation,
  zoom,
  isDragging,
  frameStyles,
  enhancedEffectStyles,
  SurfaceTexture,
  onMouseDown,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  onClick
}) => {
  return (
    <ViewerErrorBoundary>
      <div ref={cardContainerRef}>
        <EnhancedCardContainer
          card={card}
          isFlipped={isFlipped}
          isHovering={isHovering}
          showEffects={showEffects}
          effectValues={effectValues}
          mousePosition={mousePosition}
          rotation={rotation}
          zoom={zoom}
          isDragging={isDragging}
          frameStyles={frameStyles}
          enhancedEffectStyles={enhancedEffectStyles}
          SurfaceTexture={SurfaceTexture}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onClick={onClick}
        />
      </div>
    </ViewerErrorBoundary>
  );
};
