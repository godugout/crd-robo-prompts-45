
import React, { useRef, useEffect, useState } from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { EnhancedCardContainer } from './EnhancedCardContainer';

interface EnhancedCardCanvasProps {
  card: CardData;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
  rotation: { x: number; y: number };
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  overallBrightness: number;
  interactiveLighting: boolean;
  materialSettings: MaterialSettings;
  onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  width?: number;
  height?: number;
}

export const EnhancedCardCanvas: React.FC<EnhancedCardCanvasProps> = ({
  card,
  effectValues,
  mousePosition,
  isHovering,
  rotation,
  selectedScene,
  selectedLighting,
  overallBrightness,
  interactiveLighting,
  materialSettings,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  width = 400,
  height = 560
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  console.log('EnhancedCardCanvas rendering, isFlipped:', isFlipped);

  // Handle card flip on click
  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
    console.log('Card flipped to:', !isFlipped);
  };

  // Mock frame styles for the container
  const frameStyles: React.CSSProperties = {
    background: `linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)`,
    border: '1px solid rgba(255,255,255,0.1)'
  };

  // Mock enhanced effect styles
  const enhancedEffectStyles: React.CSSProperties = {
    filter: `brightness(${overallBrightness / 100}) contrast(1.1)`
  };

  // Simple surface texture component
  const SurfaceTexture = (
    <div 
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}
    />
  );

  return (
    <div
      ref={canvasRef}
      className="relative flex items-center justify-center"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        perspective: '1000px'
      }}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleCardClick}
    >
      {/* 3D Card Container */}
      <div
        className="relative cursor-pointer transition-transform duration-700 preserve-3d"
        style={{
          width: '300px',
          height: '420px',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) ${isFlipped ? 'rotateY(180deg)' : ''}`,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Card Front */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)'
          }}
        >
          <EnhancedCardContainer
            card={card}
            isFlipped={false}
            isHovering={isHovering}
            showEffects={true}
            effectValues={effectValues}
            mousePosition={mousePosition}
            rotation={rotation}
            zoom={1}
            isDragging={isDragging}
            frameStyles={frameStyles}
            enhancedEffectStyles={enhancedEffectStyles}
            SurfaceTexture={SurfaceTexture}
            interactiveLighting={interactiveLighting}
            onMouseDown={() => setIsDragging(true)}
            onMouseMove={onMouseMove}
            onMouseEnter={onMouseEnter}
            onMouseLeave={() => {
              setIsDragging(false);
              onMouseLeave();
            }}
            onClick={handleCardClick}
          />
        </div>

        {/* Card Back - NEW DESIGN */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {/* Dark Pattern Background Base */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)
              `,
              backgroundColor: '#0a0a0a'
            }}
          />
          
          {/* Centered CRD Logo Only */}
          <div className="relative h-full flex items-center justify-center z-30">
            <div className="flex items-center justify-center">
              <img 
                src="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png" 
                alt="CRD Logo" 
                className="w-48 h-auto opacity-90"
                style={{
                  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
                }}
                onLoad={() => console.log('Enhanced Canvas CRD logo loaded successfully')}
                onError={() => console.log('Error loading Enhanced Canvas CRD logo')}
              />
            </div>
          </div>

          {/* Apply same effects as front for consistency */}
          <div className="absolute inset-0 pointer-events-none z-40">
            {/* Lighting effects overlay */}
            {interactiveLighting && isHovering && (
              <div
                className="absolute inset-0"
                style={{
                  background: `
                    radial-gradient(
                      ellipse 180% 140% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                      rgba(255, 255, 255, 0.02) 0%,
                      rgba(255, 255, 255, 0.01) 50%,
                      transparent 85%
                    )
                  `,
                  mixBlendMode: 'overlay',
                  transition: 'opacity 0.2s ease'
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Click instruction */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/60 text-sm">
        Click to flip card
      </div>
    </div>
  );
};
