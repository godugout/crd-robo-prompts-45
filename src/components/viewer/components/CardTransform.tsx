
import React from 'react';
import { cn } from '@/lib/utils';
import { CardFront } from './CardFront';
import { CardBack } from './CardBack';

interface CardTransformProps {
  card: any;
  isFlipped: boolean;
  isHovering: boolean;
  showEffects: boolean;
  effectIntensity: number[];
  mousePosition: { x: number; y: number };
  frameStyles: any;
  physicalEffectStyles: any;
  SurfaceTexture: React.ComponentType<any>;
  interactiveLighting: boolean;
  effectValues: Record<string, Record<string, number | boolean | string>>;
  currentIsFlipped: boolean;
  currentZoom: number;
  currentRotation: { x: number; y: number };
  currentPosition: { x: number; y: number };
}

export const CardTransform: React.FC<CardTransformProps> = ({
  card,
  isFlipped,
  isHovering,
  showEffects,
  effectIntensity,
  mousePosition,
  frameStyles,
  physicalEffectStyles,
  SurfaceTexture,
  interactiveLighting,
  effectValues,
  currentIsFlipped,
  currentZoom,
  currentRotation,
  currentPosition
}) => {
  return (
    <div
      className="relative w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
      style={{
        transform: `
          scale(${currentZoom})
          rotateX(${currentRotation.x}deg)
          rotateY(${currentRotation.y}deg)
          translate3d(${currentPosition.x}px, ${currentPosition.y}px, 0)
        `,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        minHeight: '400px'
      }}
    >
      {/* Card Content - Fixed dimensions */}
      <div
        className={cn(
          "relative w-80 h-[28rem] transition-transform duration-500",
          "shadow-2xl rounded-xl overflow-hidden",
          "bg-gradient-to-br from-blue-500 to-purple-600"
        )}
        style={{
          transformStyle: 'preserve-3d',
          transform: currentIsFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.6s ease-out'
        }}
      >
        {/* Card Front */}
        <CardFront 
          card={card}
          isFlipped={currentIsFlipped}
          isHovering={isHovering}
          showEffects={showEffects}
          effectIntensity={effectIntensity}
          mousePosition={mousePosition}
          frameStyles={frameStyles}
          physicalEffectStyles={physicalEffectStyles}
          SurfaceTexture={<SurfaceTexture 
            effectValues={effectValues}
            mousePosition={mousePosition}
            isHovering={isHovering}
            interactiveLighting={interactiveLighting}
          />}
          effectValues={effectValues}
          materialSettings={{}}
          interactiveLighting={interactiveLighting}
        />

        {/* Card Back */}
        <CardBack
          card={card}
          isFlipped={currentIsFlipped}
          isHovering={isHovering}
          showEffects={showEffects}
          effectIntensity={effectIntensity}
          mousePosition={mousePosition}
          physicalEffectStyles={physicalEffectStyles}
          SurfaceTexture={<SurfaceTexture 
            effectValues={effectValues}
            mousePosition={mousePosition}
            isHovering={isHovering}
            interactiveLighting={false}
          />}
        />
      </div>
    </div>
  );
};
