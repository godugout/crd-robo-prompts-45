
import React from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface CrystalEffectProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const CrystalEffect: React.FC<CrystalEffectProps> = ({
  effectValues,
  mousePosition
}) => {
  // Helper function to safely get effect parameter values
  const getEffectParam = (effectId: string, paramId: string, defaultValue: any = 0) => {
    return effectValues?.[effectId]?.[paramId] ?? defaultValue;
  };

  const crystalIntensity = getEffectParam('crystal', 'intensity', 0);
  const facets = getEffectParam('crystal', 'facets', 6);
  const dispersion = getEffectParam('crystal', 'dispersion', 40);
  const clarity = getEffectParam('crystal', 'clarity', 60);
  const sparkle = getEffectParam('crystal', 'sparkle', true);

  if (crystalIntensity <= 0) return null;

  // Calculate rotation based on mouse position and facets
  const mouseRotation = (mousePosition.x + mousePosition.y) * 180;
  const facetRotation = 360 / Math.max(facets, 3);
  
  // Base opacity from intensity and clarity
  const baseOpacity = (crystalIntensity / 100) * (clarity / 100);
  const strongOpacity = Math.min(baseOpacity * 1.5, 1);

  return (
    <>
      {/* Main Radial Burst Pattern */}
      <div
        className="absolute inset-0 z-15"
        style={{
          background: `conic-gradient(
            from ${mouseRotation}deg at 50% 50%,
            rgba(255, 255, 255, ${strongOpacity * 0.8}) 0deg,
            rgba(200, 220, 255, ${baseOpacity * 0.6}) ${facetRotation * 0.5}deg,
            rgba(255, 255, 255, ${strongOpacity * 0.9}) ${facetRotation}deg,
            rgba(180, 200, 255, ${baseOpacity * 0.4}) ${facetRotation * 1.5}deg,
            rgba(255, 255, 255, ${strongOpacity * 0.8}) ${facetRotation * 2}deg,
            rgba(200, 220, 255, ${baseOpacity * 0.6}) ${facetRotation * 2.5}deg,
            rgba(255, 255, 255, ${strongOpacity * 0.9}) ${facetRotation * 3}deg,
            rgba(180, 200, 255, ${baseOpacity * 0.4}) ${facetRotation * 3.5}deg,
            rgba(255, 255, 255, ${strongOpacity * 0.8}) 360deg
          )`,
          mixBlendMode: 'overlay',
          mask: `radial-gradient(circle at 50% 50%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 60%, rgba(255,255,255,0) 100%)`,
          WebkitMask: `radial-gradient(circle at 50% 50%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 60%, rgba(255,255,255,0) 100%)`
        }}
      />

      {/* Secondary Burst Layer */}
      <div
        className="absolute inset-0 z-16"
        style={{
          background: `conic-gradient(
            from ${mouseRotation + 30}deg at 50% 50%,
            transparent 0deg,
            rgba(255, 255, 255, ${baseOpacity * 0.3}) ${facetRotation * 0.25}deg,
            transparent ${facetRotation * 0.5}deg,
            rgba(220, 240, 255, ${baseOpacity * 0.4}) ${facetRotation * 0.75}deg,
            transparent ${facetRotation}deg,
            rgba(255, 255, 255, ${baseOpacity * 0.3}) ${facetRotation * 1.25}deg,
            transparent ${facetRotation * 1.5}deg,
            rgba(220, 240, 255, ${baseOpacity * 0.4}) ${facetRotation * 1.75}deg,
            transparent ${facetRotation * 2}deg
          )`,
          mixBlendMode: 'screen'
        }}
      />

      {/* Metallic Base Layer */}
      <div
        className="absolute inset-0 z-14"
        style={{
          background: `radial-gradient(
            circle at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%,
            rgba(240, 245, 255, ${baseOpacity * 0.4}) 0%,
            rgba(200, 215, 240, ${baseOpacity * 0.3}) 30%,
            rgba(180, 190, 220, ${baseOpacity * 0.2}) 60%,
            transparent 80%
          )`,
          mixBlendMode: 'multiply'
        }}
      />

      {/* Light Dispersion Rays (only if dispersion > 0) */}
      {dispersion > 0 && (
        <div
          className="absolute inset-0 z-17"
          style={{
            background: `linear-gradient(
              ${mouseRotation}deg,
              transparent 0%,
              rgba(255, 100, 150, ${baseOpacity * (dispersion / 100) * 0.15}) 20%,
              transparent 25%,
              rgba(100, 255, 150, ${baseOpacity * (dispersion / 100) * 0.15}) 45%,
              transparent 50%,
              rgba(100, 150, 255, ${baseOpacity * (dispersion / 100) * 0.15}) 70%,
              transparent 75%,
              rgba(255, 255, 100, ${baseOpacity * (dispersion / 100) * 0.15}) 95%,
              transparent 100%
            )`,
            mixBlendMode: 'color-dodge'
          }}
        />
      )}

      {/* Central Brilliant Point */}
      <div
        className="absolute z-18"
        style={{
          left: '50%',
          top: '50%',
          width: `${8 + (crystalIntensity * 0.2)}px`,
          height: `${8 + (crystalIntensity * 0.2)}px`,
          background: `radial-gradient(circle, rgba(255, 255, 255, ${strongOpacity}) 0%, transparent 70%)`,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          boxShadow: `0 0 ${10 + (crystalIntensity * 0.3)}px rgba(255, 255, 255, ${baseOpacity * 0.8})`
        }}
      />

      {/* Faceted Sparkle Points */}
      {sparkle && Array.from({ length: Math.min(facets, 12) }, (_, i) => {
        const angle = (360 / facets) * i;
        const radius = 0.25 + (i % 2) * 0.15;
        const x = 50 + Math.cos((angle * Math.PI) / 180) * radius * 100;
        const y = 50 + Math.sin((angle * Math.PI) / 180) * radius * 100;
        
        return (
          <div
            key={i}
            className="absolute z-19"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: '3px',
              height: '3px',
              background: `rgba(255, 255, 255, ${baseOpacity * 0.9})`,
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: `0 0 ${4 + (crystalIntensity * 0.1)}px rgba(255, 255, 255, ${baseOpacity * 0.6})`,
              animation: `crystal-sparkle-${i} ${2 + (i * 0.3)}s ease-in-out infinite`
            }}
          />
        );
      })}

      {/* Dynamic CSS Animations */}
      <style>
        {Array.from({ length: Math.min(facets, 12) }, (_, i) => `
          @keyframes crystal-sparkle-${i} {
            0%, 100% { 
              opacity: ${baseOpacity * 0.4}; 
              transform: translate(-50%, -50%) scale(0.8); 
            }
            50% { 
              opacity: ${baseOpacity}; 
              transform: translate(-50%, -50%) scale(1.2); 
            }
          }
        `).join('\n')}
      </style>
    </>
  );
};
