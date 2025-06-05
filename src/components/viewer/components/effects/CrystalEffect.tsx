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

  console.log('💎 Crystal Effect Rendering:', {
    crystalIntensity,
    facets,
    dispersion,
    clarity,
    sparkle
  });

  // More subtle opacity calculations
  const baseOpacity = (crystalIntensity / 100) * 0.12; // Further reduced
  const gentleOpacity = baseOpacity * 0.7;
  const subtleOpacity = baseOpacity * 0.4;

  // Organic movement based on mouse position
  const mouseInfluence = {
    x: (mousePosition.x - 0.5) * 25,
    y: (mousePosition.y - 0.5) * 25
  };

  return (
    <>
      {/* Very subtle crystal base layer */}
      <div
        className="absolute inset-0 z-14"
        style={{
          background: `radial-gradient(
            ellipse at ${50 + mouseInfluence.x}% ${50 + mouseInfluence.y}%,
            rgba(255, 255, 255, ${gentleOpacity * 0.8}) 0%,
            rgba(240, 248, 255, ${subtleOpacity * 0.6}) 25%,
            rgba(230, 240, 250, ${subtleOpacity * 0.3}) 50%,
            transparent 75%
          )`,
          mixBlendMode: 'soft-light'
        }}
      />

      {/* Gentle prismatic dispersion */}
      {dispersion > 0 && (
        <div
          className="absolute inset-0 z-15"
          style={{
            background: `radial-gradient(
              circle at ${50 + mousePosition.x * 15}% ${50 + mousePosition.y * 15}%,
              rgba(255, 200, 220, ${baseOpacity * (dispersion / 100) * 0.3}) 0%,
              rgba(200, 255, 230, ${baseOpacity * (dispersion / 100) * 0.25}) 30%,
              rgba(200, 230, 255, ${baseOpacity * (dispersion / 100) * 0.25}) 60%,
              transparent 85%
            )`,
            mixBlendMode: 'overlay'
          }}
        />
      )}

      {/* Subtle light refraction pattern */}
      <div
        className="absolute inset-0 z-16"
        style={{
          background: `linear-gradient(
            ${mousePosition.x * 180 + 45}deg,
            transparent 0%,
            rgba(255, 255, 255, ${gentleOpacity * 0.6}) 20%,
            transparent 25%,
            rgba(230, 245, 255, ${subtleOpacity * 0.8}) 45%,
            transparent 50%,
            rgba(245, 255, 230, ${subtleOpacity * 0.8}) 70%,
            transparent 75%,
            rgba(255, 245, 230, ${gentleOpacity * 0.4}) 95%,
            transparent 100%
          )`,
          mixBlendMode: 'normal',
          opacity: clarity / 100
        }}
      />

      {/* Very subtle sparkle points */}
      {sparkle && Array.from({ length: Math.min(Math.max(facets, 3), 6) }, (_, i) => {
        const angle = (360 / Math.max(facets, 3)) * i + mousePosition.x * 40;
        const radius = 0.12 + (i % 3) * 0.08;
        const x = 50 + Math.cos((angle * Math.PI) / 180) * radius * 100;
        const y = 50 + Math.sin((angle * Math.PI) / 180) * radius * 100;
        
        return (
          <div
            key={i}
            className="absolute z-19"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${3 + (crystalIntensity * 0.04)}px`,
              height: `${3 + (crystalIntensity * 0.04)}px`,
              background: `radial-gradient(circle, rgba(255, 255, 255, ${gentleOpacity * 1.5}) 0%, rgba(240, 250, 255, ${subtleOpacity * 1.2}) 40%, transparent 70%)`,
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              filter: `blur(${0.3 + (i * 0.15)}px)`,
              animation: `crystal-glow-${i} ${2.5 + (i * 0.3)}s ease-in-out infinite alternate`
            }}
          />
        );
      })}

      {/* CSS Animations with reduced intensity */}
      <style>
        {Array.from({ length: Math.min(Math.max(facets, 3), 6) }, (_, i) => `
          @keyframes crystal-glow-${i} {
            0% { 
              opacity: ${gentleOpacity * 0.4}; 
              transform: translate(-50%, -50%) scale(0.9); 
            }
            100% { 
              opacity: ${gentleOpacity * 1.2}; 
              transform: translate(-50%, -50%) scale(1.05); 
            }
          }
        `).join('\n')}
      </style>
    </>
  );
};
