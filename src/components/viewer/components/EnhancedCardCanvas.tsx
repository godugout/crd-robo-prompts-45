
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
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
  width: number;
  height: number;
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
  width,
  height
}) => {
  // Calculate frame styles based on scene and lighting
  const frameStyles: React.CSSProperties = {
    background: selectedScene.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    filter: `brightness(${overallBrightness}%)`,
    boxShadow: selectedLighting.shadowIntensity ? 
      `0 ${selectedLighting.shadowIntensity * 20}px ${selectedLighting.shadowIntensity * 40}px rgba(0,0,0,${selectedLighting.shadowIntensity * 0.3})` : 
      '0 20px 40px rgba(0,0,0,0.3)'
  };

  // Calculate enhanced effect styles based on lighting
  const enhancedEffectStyles: React.CSSProperties = {
    background: selectedLighting.gradient || 'transparent',
    mixBlendMode: selectedLighting.blendMode || 'overlay',
    opacity: selectedLighting.intensity || 0.5
  };

  // Create surface texture based on material settings
  const SurfaceTexture = (
    <div 
      className="absolute inset-0"
      style={{
        background: `
          repeating-linear-gradient(
            45deg,
            transparent,
            rgba(255, 255, 255, ${materialSettings.roughness * 0.05}) 1px,
            transparent 2px
          )
        `,
        opacity: materialSettings.roughness * 0.3
      }}
    />
  );

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: selectedScene.background || 'radial-gradient(circle, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)'
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
        isDragging={false}
        frameStyles={frameStyles}
        enhancedEffectStyles={enhancedEffectStyles}
        SurfaceTexture={SurfaceTexture}
        onMouseDown={() => {}}
        onMouseMove={onMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={() => {}}
        materialSettings={materialSettings}
        interactiveLighting={interactiveLighting}
      />
    </div>
  );
};
