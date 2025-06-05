
import React, { useRef, useEffect, useState } from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { EnhancedCardContainer } from './EnhancedCardContainer';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

interface EnhancedCardCanvasProps {
  card: CardData;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
  rotation: { x: number; y: number };
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  overallBrightness: number;
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
  const { isMobile, isTablet } = useResponsiveLayout();

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

  // Responsive branding logo sizing
  const getBrandingLogoSize = () => {
    if (isMobile) return 'w-12 h-auto'; // 48px
    if (isTablet) return 'w-16 h-auto'; // 64px
    return 'w-20 h-auto'; // 80px for desktop
  };

  // Responsive card back logo sizing
  const getCardBackLogoSize = () => {
    if (isMobile) return 'w-32 h-auto'; // 128px
    if (isTablet) return 'w-48 h-auto'; // 192px
    return 'w-48 h-auto'; // 192px for desktop in canvas
  };

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
      {/* CRD Logo Branding - Upper Right with Responsive Sizing and New Logo */}
      <div className="absolute top-4 right-4 z-50">
        <img 
          src="/lovable-uploads/f8aeaf57-4a95-4ebe-8874-2df97ff6adf6.png"
          alt="CRD Logo" 
          className={`${getBrandingLogoSize()} opacity-60 hover:opacity-80 transition-all duration-200`}
          style={{
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
            imageRendering: '-webkit-optimize-contrast',
            objectFit: 'contain'
          }}
          onLoad={() => console.log('Canvas gradient CRD branding logo loaded successfully')}
          onError={() => console.log('Error loading Canvas gradient CRD branding logo')}
        />
      </div>

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

        {/* Card Back - Enhanced with Responsive Logo and New Gradient Logo */}
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
          
          {/* Centered CRD Logo with Responsive Sizing and New Gradient Logo */}
          <div className="relative h-full flex items-center justify-center z-30">
            <div className="flex items-center justify-center">
              <img 
                src="/lovable-uploads/f8aeaf57-4a95-4ebe-8874-2df97ff6adf6.png"
                alt="CRD Logo" 
                className={`${getCardBackLogoSize()} opacity-90 transition-all duration-300 ease-out`}
                style={{
                  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
                  imageRendering: '-webkit-optimize-contrast',
                  objectFit: 'contain'
                }}
                onLoad={() => console.log('Enhanced Canvas gradient CRD logo loaded successfully')}
                onError={() => console.log('Error loading Enhanced Canvas gradient CRD logo')}
              />
            </div>
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
