
import React from 'react';
import type { CardData } from '@/types/card';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { CardBackContainer } from './CardBackContainer';

export interface EnhancedCardContainerProps {
  card: CardData;
  effectValues: EffectValues;
  showEffects: boolean;
  interactiveLighting?: boolean;
  isFlipped?: boolean;
  isHovering?: boolean;
  mousePosition?: { x: number; y: number };
  rotation?: { x: number; y: number };
  zoom?: number;
  isDragging?: boolean;
  frameStyles?: React.CSSProperties;
  enhancedEffectStyles?: React.CSSProperties;
  SurfaceTexture?: React.ReactNode;
  onMouseDown?: () => void;
  onMouseMove?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
  className?: string;
}

export const EnhancedCardContainer: React.FC<EnhancedCardContainerProps> = ({
  card,
  effectValues,
  showEffects,
  interactiveLighting = false,
  isFlipped = false,
  isHovering = false,
  mousePosition = { x: 0.5, y: 0.5 },
  rotation = { x: 0, y: 0 },
  zoom = 1,
  isDragging = false,
  frameStyles = {},
  enhancedEffectStyles = {},
  SurfaceTexture = <div />,
  onMouseDown,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  onClick,
  className = ""
}) => {
  const [internalIsFlipped, setInternalIsFlipped] = React.useState(isFlipped);
  const [internalIsHovering, setInternalIsHovering] = React.useState(isHovering);
  const [internalMousePosition, setInternalMousePosition] = React.useState(mousePosition);

  // Use internal state if external handlers aren't provided
  const handleMouseEnter = onMouseEnter || (() => setInternalIsHovering(true));
  const handleMouseLeave = onMouseLeave || (() => setInternalIsHovering(false));
  const handleClick = onClick || (() => setInternalIsFlipped(!internalIsFlipped));
  const handleMouseMove = onMouseMove || ((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setInternalMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  });

  const currentIsFlipped = onMouseMove ? isFlipped : internalIsFlipped;
  const currentIsHovering = onMouseEnter ? isHovering : internalIsHovering;
  const currentMousePosition = onMouseMove ? mousePosition : internalMousePosition;

  return (
    <div 
      className={`relative w-full aspect-[2.5/3.5] rounded-xl overflow-hidden perspective-1000 ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onMouseDown={onMouseDown}
      onClick={handleClick}
      style={{
        transform: `scale(${zoom}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        ...enhancedEffectStyles
      }}
    >
      {/* Card Front */}
      <div 
        className={`absolute inset-0 rounded-xl overflow-hidden transition-transform duration-600 ${
          currentIsFlipped ? 'transform rotate-y-180' : ''
        }`}
        style={{ 
          backfaceVisibility: 'hidden',
          ...frameStyles
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 rounded-xl flex flex-col p-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">{card.title}</h3>
            <p className="text-sm text-gray-600">{card.description}</p>
          </div>
          {card.image_url && (
            <div className="flex-1 flex items-center justify-center">
              <img src={card.image_url} alt={card.title} className="max-w-full max-h-full object-contain rounded" />
            </div>
          )}
        </div>
      </div>

      {/* Card Back */}
      <CardBackContainer
        isFlipped={currentIsFlipped}
        isHovering={currentIsHovering}
        showEffects={showEffects}
        effectValues={effectValues}
        mousePosition={currentMousePosition}
        frameStyles={frameStyles}
        enhancedEffectStyles={enhancedEffectStyles}
        SurfaceTexture={SurfaceTexture}
        interactiveLighting={interactiveLighting}
      />
    </div>
  );
};
