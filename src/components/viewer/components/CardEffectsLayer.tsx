
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
  if (avgIntensity < 2) return null;
  
  return (
    <div className="absolute inset-0 z-40 overflow-hidden pointer-events-none">
      {/* Base holographic effect layer */}
      <div 
        className="absolute inset-0"
        style={{
          opacity: avgIntensity / 100 * 0.5,
          background: `
            linear-gradient(
              ${45 + mousePosition.x * 30}deg,
              rgba(255, 255, 255, 0.05) 0%,
              rgba(255, 255, 255, ${0.05 + (mousePosition.y * 0.1)}) 50%,
              rgba(255, 255, 255, 0.05) 100%
            )
          `,
          mixBlendMode: 'overlay',
          transition: 'opacity 0.3s ease',
          ...physicalEffectStyles
        }}
      />
      
      {/* Dynamic highlight based on mouse movement and interactive lighting */}
      {interactiveLighting && isHovering && (
        <div 
          className="absolute inset-0" 
          style={{
            background: `
              radial-gradient(
                ellipse 200% 150% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                rgba(255, 255, 255, ${0.08 * (avgIntensity / 100)}) 0%,
                rgba(255, 255, 255, ${0.04 * (avgIntensity / 100)}) 40%,
                rgba(255, 255, 255, 0) 70%
              )
            `,
            opacity: avgIntensity / 100 * 0.8,
            mixBlendMode: 'screen',
            transition: 'opacity 0.2s ease'
          }}
        />
      )}

      {/* Enhanced effect-specific rendering based on effectValues */}
      {effectValues && Object.entries(effectValues).map(([effectId, params]) => {
        // Only render effects with intensity > 0
        const intensity = typeof params.intensity === 'number' ? params.intensity : 0;
        if (intensity <= 0) return null;

        const normalizedIntensity = intensity / 100;

        // Effect-specific rendering based on effect ID
        switch(effectId) {
          case 'holographic':
            return (
              <div 
                key={effectId}
                className="absolute inset-0"
                style={{
                  background: `
                    conic-gradient(
                      from ${mousePosition.x * 360}deg at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                      rgba(255,0,128,${normalizedIntensity * 0.15}) 0deg,
                      rgba(255,255,0,${normalizedIntensity * 0.12}) 60deg,
                      rgba(0,255,255,${normalizedIntensity * 0.15}) 120deg,
                      rgba(128,0,255,${normalizedIntensity * 0.12}) 180deg,
                      rgba(255,128,0,${normalizedIntensity * 0.15}) 240deg,
                      rgba(255,0,128,${normalizedIntensity * 0.15}) 360deg
                    )
                  `,
                  opacity: normalizedIntensity * 0.7,
                  mixBlendMode: 'screen',
                  transition: 'opacity 0.3s ease'
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
                    linear-gradient(
                      ${mousePosition.x * 180}deg,
                      rgba(255,255,255,${normalizedIntensity * 0.2}) 0%,
                      rgba(240,240,240,${normalizedIntensity * 0.15}) 30%,
                      rgba(210,210,210,${normalizedIntensity * 0.1}) 60%,
                      rgba(255,255,255,${normalizedIntensity * 0.05}) 100%
                    )
                  `,
                  opacity: normalizedIntensity * 0.6,
                  mixBlendMode: 'overlay',
                  transition: 'opacity 0.3s ease'
                }}
              />
            );
          case 'gold':
            return (
              <div 
                key={effectId}
                className="absolute inset-0"
                style={{
                  background: `
                    radial-gradient(
                      ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                      rgba(255,215,0,${normalizedIntensity * 0.25}) 0%,
                      rgba(255,223,0,${normalizedIntensity * 0.2}) 40%,
                      rgba(218,165,32,${normalizedIntensity * 0.1}) 80%,
                      transparent 100%
                    )
                  `,
                  opacity: normalizedIntensity * 0.8,
                  mixBlendMode: 'screen',
                  transition: 'opacity 0.3s ease'
                }}
              />
            );
          case 'crystal':
            return (
              <div 
                key={effectId}
                className="absolute inset-0"
                style={{
                  background: `
                    linear-gradient(
                      ${45 + mousePosition.y * 90}deg,
                      rgba(123,179,189,${normalizedIntensity * 0.2}) 0%,
                      rgba(144,202,249,${normalizedIntensity * 0.25}) 25%,
                      rgba(100,181,246,${normalizedIntensity * 0.2}) 50%,
                      rgba(66,165,245,${normalizedIntensity * 0.15}) 75%,
                      rgba(123,179,189,${normalizedIntensity * 0.1}) 100%
                    )
                  `,
                  opacity: normalizedIntensity * 0.7,
                  mixBlendMode: 'overlay',
                  transition: 'opacity 0.3s ease'
                }}
              />
            );
          case 'prizm':
            const prizmAngle = (mousePosition.x + mousePosition.y) * 180;
            return (
              <div 
                key={effectId}
                className="absolute inset-0"
                style={{
                  background: `
                    linear-gradient(
                      ${prizmAngle}deg,
                      rgba(123,31,162,${normalizedIntensity * 0.2}) 0%,
                      rgba(94,53,177,${normalizedIntensity * 0.25}) 20%,
                      rgba(57,73,171,${normalizedIntensity * 0.3}) 40%,
                      rgba(40,53,147,${normalizedIntensity * 0.25}) 60%,
                      rgba(26,35,126,${normalizedIntensity * 0.2}) 80%,
                      rgba(123,31,162,${normalizedIntensity * 0.15}) 100%
                    )
                  `,
                  opacity: normalizedIntensity * 0.6,
                  mixBlendMode: 'screen',
                  transition: 'opacity 0.3s ease'
                }}
              />
            );
          case 'vintage':
            return (
              <div 
                key={effectId}
                className="absolute inset-0"
                style={{
                  background: `
                    radial-gradient(
                      ellipse at center,
                      rgba(188,170,164,${normalizedIntensity * 0.15}) 0%,
                      rgba(161,136,127,${normalizedIntensity * 0.2}) 40%,
                      rgba(121,85,72,${normalizedIntensity * 0.25}) 70%,
                      rgba(93,64,55,${normalizedIntensity * 0.15}) 100%
                    )
                  `,
                  opacity: normalizedIntensity * 0.5,
                  mixBlendMode: 'overlay',
                  transition: 'opacity 0.3s ease'
                }}
              />
            );
          case 'ice':
          case 'interference':
            return (
              <div 
                key={effectId}
                className="absolute inset-0"
                style={{
                  background: `
                    radial-gradient(
                      circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                      rgba(66,165,245,${normalizedIntensity * 0.2}) 0%,
                      rgba(100,181,246,${normalizedIntensity * 0.15}) 30%,
                      rgba(144,202,249,${normalizedIntensity * 0.1}) 60%,
                      transparent 100%
                    )
                  `,
                  opacity: normalizedIntensity * 0.6,
                  mixBlendMode: 'screen',
                  transition: 'opacity 0.3s ease'
                }}
              />
            );
          case 'starlight':
          case 'foilspray':
            return (
              <div 
                key={effectId}
                className="absolute inset-0"
                style={{
                  background: `
                    conic-gradient(
                      from ${mousePosition.x * 360 + mousePosition.y * 180}deg at 50% 50%,
                      rgba(243,156,18,${normalizedIntensity * 0.2}) 0deg,
                      rgba(233,69,96,${normalizedIntensity * 0.15}) 72deg,
                      rgba(15,52,96,${normalizedIntensity * 0.1}) 144deg,
                      rgba(22,33,62,${normalizedIntensity * 0.15}) 216deg,
                      rgba(26,26,46,${normalizedIntensity * 0.1}) 288deg,
                      rgba(243,156,18,${normalizedIntensity * 0.2}) 360deg
                    )
                  `,
                  opacity: normalizedIntensity * 0.7,
                  mixBlendMode: 'screen',
                  transition: 'opacity 0.3s ease'
                }}
              />
            );
          default:
            return (
              <div 
                key={effectId}
                className="absolute inset-0"
                style={{
                  background: `
                    radial-gradient(
                      ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                      rgba(255,255,255,${normalizedIntensity * 0.1}) 0%,
                      rgba(255,255,255,${normalizedIntensity * 0.05}) 50%,
                      transparent 100%
                    )
                  `,
                  opacity: normalizedIntensity * 0.4,
                  mixBlendMode: 'overlay',
                  transition: 'opacity 0.3s ease'
                }}
              />
            );
        }
      })}

      {/* Final enhancement layer for overall cohesion */}
      {avgIntensity > 10 && (
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(
                ellipse 150% 120% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                rgba(255, 255, 255, 0.02) 0%,
                rgba(255, 255, 255, 0.01) 60%,
                transparent 100%
              )
            `,
            opacity: avgIntensity / 100 * 0.3,
            mixBlendMode: 'overlay',
            transition: 'opacity 0.3s ease'
          }}
        />
      )}
    </div>
  );
};
