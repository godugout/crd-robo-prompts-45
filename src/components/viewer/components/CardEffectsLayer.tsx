
import React from 'react';
import type { MaterialSettings } from '../types';

interface CardEffectsLayerProps {
  showEffects: boolean;
  isHovering: boolean;
  effectIntensity: number[];
  mousePosition: { x: number; y: number };
  physicalEffectStyles: React.CSSProperties;
  materialSettings?: MaterialSettings;
}

export const CardEffectsLayer: React.FC<CardEffectsLayerProps> = ({
  showEffects,
  isHovering,
  effectIntensity,
  mousePosition,
  physicalEffectStyles,
  materialSettings
}) => {
  if (!showEffects) return null;
  
  const intensity = effectIntensity[0] / 100;
  
  // Material-aware reflection
  const getReflectionStrength = () => {
    if (!materialSettings) return intensity * 0.5;
    
    // Combine reflectivity with clearcoat for more pronounced effect
    const reflectionBase = materialSettings.reflectivity * 0.7;
    const clearcoatBoost = materialSettings.clearcoat * 0.3;
    return (reflectionBase + clearcoatBoost) * intensity;
  };
  
  // Material-aware texture
  const getTextureIntensity = () => {
    if (!materialSettings) return intensity * 0.1;
    
    // Rougher surfaces get more texture
    return materialSettings.roughness * intensity * 0.3;
  };
  
  const reflectionStrength = getReflectionStrength();
  const textureIntensity = getTextureIntensity();
  
  return (
    <>
      {/* Base holographic effect */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: `conic-gradient(
            from ${mousePosition.x * 180}deg at 50% 60%,
            rgba(240, 60, 80, ${intensity * 0.6}) 0deg,
            rgba(80, 60, 240, ${intensity * 0.4}) 120deg,
            rgba(60, 240, 180, ${intensity * 0.4}) 240deg,
            rgba(240, 60, 80, ${intensity * 0.6}) 360deg
          )`,
          opacity: showEffects ? 0.5 : 0,
          mixBlendMode: 'soft-light',
          ...physicalEffectStyles
        }}
      />

      {/* Interactive high-frequency reflective/foil pattern */}
      {isHovering && (
        <div
          className="absolute inset-0 z-20 overflow-hidden"
          style={{
            opacity: reflectionStrength,
            background: `
              radial-gradient(
                circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                rgba(255, 255, 255, 0.9) 0%,
                rgba(255, 255, 255, 0.7) 15%,
                rgba(160, 190, 255, 0.3) 30%,
                transparent 60%
              )
            `,
            mixBlendMode: 'screen',
          }}
        />
      )}

      {/* Surface texture */}
      <div
        className="absolute inset-0 z-15"
        style={{
          opacity: textureIntensity,
          backgroundImage: `
            repeating-linear-gradient(
              ${45 + mousePosition.x * 30}deg,
              transparent,
              rgba(255, 255, 255, 0.05) 1px,
              transparent 2px
            )
          `,
          backgroundSize: '4px 4px',
          mixBlendMode: 'overlay',
        }}
      />

      {/* Edge highlight for depth */}
      <div
        className="absolute inset-0 z-25 rounded-xl"
        style={{
          boxShadow: `
            inset 0 0 20px rgba(255, 255, 255, ${intensity * 0.2}),
            inset 0 0 8px rgba(255, 255, 255, ${intensity * 0.3})
          `,
          opacity: 0.7
        }}
      />
    </>
  );
};
