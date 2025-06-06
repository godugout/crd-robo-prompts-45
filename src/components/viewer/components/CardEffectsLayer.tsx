
import React from 'react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface CardEffectsLayerProps {
  showEffects: boolean;
  isHovering: boolean;
  effectIntensity: number[];
  mousePosition: { x: number; y: number };
  physicalEffectStyles: React.CSSProperties;
  effectValues?: EffectValues;
  materialSettings?: any;
  interactiveLighting?: boolean;
}

export const CardEffectsLayer: React.FC<CardEffectsLayerProps> = ({
  showEffects,
  isHovering,
  effectIntensity,
  mousePosition,
  physicalEffectStyles,
  effectValues,
  materialSettings,
  interactiveLighting = false
}) => {
  if (!showEffects) return null;

  // Calculate the average effect intensity for dynamic opacity
  const avgIntensity = effectIntensity.length ? 
    effectIntensity.reduce((sum, val) => sum + val, 0) / effectIntensity.length : 0;
  
  // Only render if there are active effects
  if (avgIntensity < 5) return null;
  
  return (
    <div className="absolute inset-0 z-30 overflow-hidden">
      {/* Holographic effect layer */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-transparent to-white/20"
        style={{
          opacity: avgIntensity / 100 * 0.7,
          background: `
            linear-gradient(
              ${45 + mousePosition.x * 30}deg,
              rgba(255, 255, 255, 0.1) 0%,
              rgba(255, 255, 255, ${0.1 + (mousePosition.y * 0.15)}) 50%,
              rgba(255, 255, 255, 0.1) 100%
            )
          `,
          mixBlendMode: 'overlay',
          ...physicalEffectStyles
        }}
      />
      
      {/* Dynamic highlight based on mouse movement */}
      {interactiveLighting && isHovering && (
        <div 
          className="absolute inset-0" 
          style={{
            background: `
              radial-gradient(
                circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                rgba(255, 255, 255, ${0.15 * (avgIntensity / 100)}) 0%,
                rgba(255, 255, 255, 0) 60%
              )
            `,
            opacity: avgIntensity / 100 * 0.8,
            mixBlendMode: 'screen'
          }}
        />
      )}
    </div>
  );
};
