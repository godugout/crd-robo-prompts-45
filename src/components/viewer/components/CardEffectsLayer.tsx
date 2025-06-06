
import React from 'react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface CardEffectsLayerProps {
  showEffects: boolean;
  isHovering: boolean;
  effectIntensity: number[];
  mousePosition: { x: number; y: number };
  physicalEffectStyles: React.CSSProperties;
  effectValues?: EffectValues | Record<string, Record<string, number | boolean | string>>;
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
    <div className="absolute inset-0 z-40 overflow-hidden">
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

      {/* Apply effect-specific styling based on effectValues */}
      {effectValues && Object.entries(effectValues).map(([effectId, params]) => {
        // Only render effects with intensity > 0
        const intensity = typeof params.intensity === 'number' ? params.intensity : 0;
        if (intensity <= 0) return null;

        // Effect-specific rendering based on effect ID
        switch(effectId) {
          case 'holographic':
            return (
              <div 
                key={effectId}
                className="absolute inset-0"
                style={{
                  background: `
                    linear-gradient(
                      ${mousePosition.x * 360}deg,
                      rgba(255,0,128,${intensity * 0.003}) 0%,
                      rgba(255,255,0,${intensity * 0.003}) 25%,
                      rgba(0,255,255,${intensity * 0.003}) 50%,
                      rgba(128,0,255,${intensity * 0.003}) 75%,
                      rgba(255,0,128,${intensity * 0.003}) 100%
                    )
                  `,
                  opacity: intensity / 100 * 0.8,
                  mixBlendMode: 'screen'
                }}
              />
            );
          case 'chrome':
            return (
              <div 
                key={effectId}
                className="absolute inset-0"
                style={{
                  background: `
                    radial-gradient(
                      ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                      rgba(255,255,255,${intensity * 0.006}) 0%,
                      rgba(240,240,240,${intensity * 0.004}) 30%,
                      rgba(210,210,210,${intensity * 0.002}) 60%,
                      rgba(192,192,192,0) 100%
                    )
                  `,
                  opacity: intensity / 100 * 0.8,
                  mixBlendMode: 'screen'
                }}
              />
            );
          // Add cases for other effects as needed
          default:
            return null;
        }
      })}
    </div>
  );
};
