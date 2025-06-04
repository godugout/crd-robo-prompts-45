
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { CardFront } from './CardFront';
import { CardBack } from './CardBack';

interface EnhancedCardContainerProps {
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
  materialSettings?: any;
  interactiveLighting?: boolean;
}

export const EnhancedCardContainer: React.FC<EnhancedCardContainerProps> = ({
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
  onClick,
  materialSettings,
  interactiveLighting = true
}) => {
  // Convert effect values to intensity array for compatibility
  const effectIntensity = [50]; // Default intensity
  
  return (
    <div
      className="relative cursor-grab active:cursor-grabbing select-none"
      style={{
        width: '350px',
        height: '490px',
        transform: `scale(${zoom})`,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out'
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {/* 3D Card Container */}
      <div
        style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transform: `
            perspective(2000px) 
            rotateX(${rotation.x}deg) 
            rotateY(${rotation.y + (isFlipped ? 180 : 0)}deg)
          `,
          transition: isDragging ? 'none' : 'transform 0.6s ease-out'
        }}
      >
        {/* Card Front */}
        <CardFront
          card={card}
          isFlipped={false} // Always pass false since we handle flip at container level
          isHovering={isHovering}
          showEffects={showEffects}
          effectIntensity={effectIntensity}
          mousePosition={mousePosition}
          physicalEffectStyles={enhancedEffectStyles}
          SurfaceTexture={SurfaceTexture}
          frameStyles={{}}
          effectValues={effectValues}
          materialSettings={materialSettings}
          interactiveLighting={interactiveLighting}
        />

        {/* Card Back */}
        <CardBack
          card={card}
          isFlipped={false} // Always pass false since we handle flip at container level
          isHovering={isHovering}
          showEffects={showEffects}
          effectIntensity={effectIntensity}
          mousePosition={mousePosition}
          physicalEffectStyles={enhancedEffectStyles}
          SurfaceTexture={SurfaceTexture}
          frameStyles={{}}
          effectValues={effectValues}
          materialSettings={materialSettings}
          interactiveLighting={interactiveLighting}
        />
      </div>
    </div>
  );
};
