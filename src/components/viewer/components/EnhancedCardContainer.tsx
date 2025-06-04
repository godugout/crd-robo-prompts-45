
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import { CardFront } from './CardFront';
import { CardBack } from './CardBack';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

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
  onClick
}) => {
  console.log('EnhancedCardContainer render:', {
    cardTitle: card?.title,
    isFlipped,
    rotation,
    zoom,
    hasFrameStyles: !!frameStyles,
    hasEffectStyles: !!enhancedEffectStyles
  });

  // Safety check for card data
  if (!card) {
    console.error('EnhancedCardContainer: No card data');
    return (
      <div className="relative z-20 w-[400px] h-[560px] bg-gray-800 rounded-xl flex items-center justify-center">
        <span className="text-white">No card data</span>
      </div>
    );
  }

  // Safe fallback styles
  const safeFrameStyles = frameStyles || {};
  const safeEffectStyles = enhancedEffectStyles || {};

  return (
    <div 
      className={`relative z-20 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        transform: `scale(${zoom || 1})`,
        transition: isDragging ? 'none' : 'transform 0.3s ease',
        filter: 'brightness(1.2) contrast(1.1)'
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Enhanced 3D Card */}
      <div
        className="relative"
        style={{
          width: '400px',
          height: '560px',
          transform: `perspective(1000px) rotateX(${rotation?.x || 0}deg) rotateY(${rotation?.y || 0}deg)`,
          transformStyle: 'preserve-3d',
          transition: isDragging ? 'none' : 'transform 0.1s ease',
          filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.8))'
        }}
        onClick={onClick}
      >
        {/* Card Front */}
        <CardFront
          card={card}
          isFlipped={isFlipped}
          isHovering={isHovering}
          showEffects={showEffects}
          effectIntensity={[50]} // Simplified intensity
          mousePosition={mousePosition}
          frameStyles={safeFrameStyles}
          physicalEffectStyles={safeEffectStyles}
          SurfaceTexture={SurfaceTexture}
        />

        {/* Card Back */}
        <CardBack
          card={card}
          isFlipped={isFlipped}
          isHovering={isHovering}
          showEffects={showEffects}
          effectIntensity={[50]} // Simplified intensity
          mousePosition={mousePosition}
          physicalEffectStyles={safeEffectStyles}
          SurfaceTexture={SurfaceTexture}
        />
      </div>
    </div>
  );
};
