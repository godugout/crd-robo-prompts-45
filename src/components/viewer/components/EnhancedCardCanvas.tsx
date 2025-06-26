
import React, { useRef, useEffect, useState } from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import type { EffectValues } from '../types';
import { getEnvironmentSceneConfig } from '../types';
import { EnhancedCardContainer } from './EnhancedCardContainer';
import { EffectProvider } from '../contexts/EffectContext';

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
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);

  // Get scene configuration using helper function
  const sceneConfig = getEnvironmentSceneConfig(selectedScene);

  console.log('EnhancedCardCanvas rendering, isFlipped:', isFlipped);

  // Preload background image with better error handling
  useEffect(() => {
    if (sceneConfig.backgroundImage) {
      setBackgroundLoaded(false);
      const img = new Image();
      img.onload = () => {
        console.log('Background image loaded successfully:', sceneConfig.backgroundImage);
        setBackgroundLoaded(true);
      };
      img.onerror = () => {
        console.log('Background image failed to load, falling back to gradient:', sceneConfig.backgroundImage);
        setBackgroundLoaded(false);
      };
      img.src = sceneConfig.backgroundImage;
    }
  }, [sceneConfig.backgroundImage]);

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

  // Enhanced effect styles with brightness
  const enhancedEffectStyles: React.CSSProperties = {
    filter: `brightness(${overallBrightness / 100}) contrast(1.1)`
  };

  // Simple surface texture component
  const SurfaceTextureComponent = React.memo(() => (
    <div 
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}
    />
  ));

  // Calculate effect intensity for context
  const effectIntensity = Object.values(effectValues).map(effect => 
    typeof effect.intensity === 'number' ? effect.intensity : 0
  );

  return (
    <EffectProvider 
      initialEffects={effectValues}
      initialValues={{
        effectValues,
        mousePosition,
        isHovering,
        showEffects: true,
        materialSettings,
        interactiveLighting,
        effectIntensity
      }}
    >
      <div
        ref={canvasRef}
        className="relative flex items-center justify-center overflow-hidden"
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
        {/* High-Resolution Background */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: backgroundLoaded && sceneConfig.backgroundImage 
              ? `url(${sceneConfig.backgroundImage})` 
              : `linear-gradient(135deg, ${sceneConfig.gradient.replace('from-', '').replace('-900', '').replace('-700', '').replace('-800', '')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            filter: `brightness(${overallBrightness / 100}) contrast(1.05) saturate(1.1)`,
            transition: 'all 0.3s ease',
            transform: 'scale(1.05)' // Slight scale to ensure full coverage
          }}
        />

        {/* Enhanced overlay for better card contrast */}
        <div 
          className="absolute inset-0 z-10"
          style={{
            background: `
              radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.3) 80%),
              linear-gradient(45deg, rgba(0,0,0,0.1) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)
            `,
            pointerEvents: 'none'
          }}
        />

        {/* CRD Logo Branding - Upper Right */}
        <div className="absolute top-4 right-4 z-50">
          <img 
            src="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png" 
            alt="CRD Logo" 
            className="w-16 h-auto opacity-60 hover:opacity-80 transition-opacity duration-200"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
            }}
            onLoad={() => console.log('Canvas CRD branding logo loaded successfully')}
            onError={() => console.log('Error loading Canvas CRD branding logo')}
          />
        </div>

        {/* 3D Card Container */}
        <div
          className="relative cursor-pointer transition-transform duration-700 preserve-3d z-20"
          style={{
            width: '300px',
            height: '420px',
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) ${isFlipped ? 'rotateY(180deg)' : ''}`,
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Card Content Placeholder */}
          <div
            className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl backface-hidden bg-white"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)'
            }}
          >
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{card.title}</h3>
                <p className="text-gray-600">Enhanced 3D Card</p>
              </div>
            </div>
          </div>

          {/* Card Back */}
          <div
            className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl backface-hidden"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            {/* Environment-aware background */}
            <div 
              className="absolute inset-0"
              style={{
                background: backgroundLoaded && sceneConfig.backgroundImage 
                  ? `
                    linear-gradient(135deg, rgba(26,26,26,0.8) 0%, rgba(45,45,45,0.6) 50%, rgba(26,26,26,0.8) 100%),
                    url(${sceneConfig.backgroundImage})
                  `
                  : `
                    linear-gradient(135deg, rgba(26,26,26,0.9) 0%, rgba(45,45,45,0.8) 50%, rgba(26,26,26,0.9) 100%)
                  `,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#0a0a0a'
              }}
            />
            
            {/* Centered CRD Logo */}
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

            {/* Interactive lighting effects for consistency */}
            <div className="absolute inset-0 pointer-events-none z-40">
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
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/60 text-sm z-30">
          Click to flip card
        </div>
      </div>
    </EffectProvider>
  );
};
