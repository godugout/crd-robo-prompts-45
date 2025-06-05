
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

  // Base opacity - much more subtle
  const baseOpacity = (crystalIntensity / 100) * 0.15; // Reduced from previous high values
  const gentleOpacity = baseOpacity * 0.6;
  const subtleOpacity = baseOpacity * 0.3;

  // Organic movement based on mouse position
  const mouseInfluence = {
    x: (mousePosition.x - 0.5) * 30,
    y: (mousePosition.y - 0.5) * 30
  };

  return (
    <>
      {/* Translucent Crystal Base Layer */}
      <div
        className="absolute inset-0 z-14"
        style={{
          background: `radial-gradient(
            ellipse at ${50 + mouseInfluence.x}% ${50 + mouseInfluence.y}%,
            rgba(255, 255, 255, ${gentleOpacity}) 0%,
            rgba(240, 248, 255, ${subtleOpacity}) 25%,
            rgba(230, 240, 250, ${subtleOpacity * 0.5}) 50%,
            transparent 75%
          )`,
          mixBlendMode: 'soft-light'
        }}
      />

      {/* Soft Prismatic Dispersion */}
      {dispersion > 0 && (
        <div
          className="absolute inset-0 z-15"
          style={{
            background: `radial-gradient(
              circle at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%,
              rgba(255, 200, 220, ${baseOpacity * (dispersion / 100) * 0.4}) 0%,
              rgba(200, 255, 230, ${baseOpacity * (dispersion / 100) * 0.3}) 30%,
              rgba(200, 230, 255, ${baseOpacity * (dispersion / 100) * 0.3}) 60%,
              transparent 85%
            )`,
            mixBlendMode: 'overlay'
          }}
        />
      )}

      {/* Natural Light Refraction */}
      <div
        className="absolute inset-0 z-16"
        style={{
          background: `linear-gradient(
            ${mousePosition.x * 180 + 45}deg,
            transparent 0%,
            rgba(255, 255, 255, ${gentleOpacity * 0.8}) 20%,
            transparent 25%,
            rgba(230, 245, 255, ${subtleOpacity}) 45%,
            transparent 50%,
            rgba(245, 255, 230, ${subtleOpacity}) 70%,
            transparent 75%,
            rgba(255, 245, 230, ${gentleOpacity * 0.6}) 95%,
            transparent 100%
          )`,
          mixBlendMode: 'normal',
          opacity: clarity / 100
        }}
      />

      {/* Organic Crystal Facets */}
      <div
        className="absolute inset-0 z-17"
        style={{
          background: `conic-gradient(
            from ${mousePosition.x * 120}deg at ${50 + mouseInfluence.x * 0.3}% ${50 + mouseInfluence.y * 0.3}%,
            transparent 0deg,
            rgba(255, 255, 255, ${subtleOpacity * 0.8}) ${360 / Math.max(facets, 3) * 0.3}deg,
            transparent ${360 / Math.max(facets, 3) * 0.7}deg,
            rgba(240, 250, 255, ${subtleOpacity * 0.6}) ${360 / Math.max(facets, 3) * 1.2}deg,
            transparent ${360 / Math.max(facets, 3) * 1.8}deg,
            rgba(250, 255, 240, ${subtleOpacity * 0.5}) ${360 / Math.max(facets, 3) * 2.3}deg,
            transparent ${360 / Math.max(facets, 3) * 2.7}deg
          )`,
          mixBlendMode: 'soft-light',
          mask: `radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 60%, transparent 85%)`,
          WebkitMask: `radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 60%, transparent 85%)`
        }}
      />

      {/* Gentle Internal Reflections */}
      <div
        className="absolute inset-0 z-18"
        style={{
          background: `radial-gradient(
            circle at ${30 + mousePosition.x * 40}% ${30 + mousePosition.y * 40}%,
            rgba(255, 255, 255, ${gentleOpacity * 1.2}) 0%,
            transparent 15%
          ), radial-gradient(
            circle at ${70 - mousePosition.x * 40}% ${70 - mousePosition.y * 40}%,
            rgba(245, 250, 255, ${subtleOpacity * 1.5}) 0%,
            transparent 20%
          )`,
          mixBlendMode: 'overlay'
        }}
      />

      {/* Soft Sparkle Points */}
      {sparkle && Array.from({ length: Math.min(Math.max(facets, 3), 8) }, (_, i) => {
        const angle = (360 / Math.max(facets, 3)) * i + mousePosition.x * 60;
        const radius = 0.15 + (i % 3) * 0.1;
        const x = 50 + Math.cos((angle * Math.PI) / 180) * radius * 100;
        const y = 50 + Math.sin((angle * Math.PI) / 180) * radius * 100;
        
        return (
          <div
            key={i}
            className="absolute z-19"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${4 + (crystalIntensity * 0.08)}px`,
              height: `${4 + (crystalIntensity * 0.08)}px`,
              background: `radial-gradient(circle, rgba(255, 255, 255, ${gentleOpacity * 2}) 0%, rgba(240, 250, 255, ${subtleOpacity}) 40%, transparent 70%)`,
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              filter: `blur(${0.5 + (i * 0.2)}px)`,
              animation: `crystal-glow-${i} ${3 + (i * 0.4)}s ease-in-out infinite alternate`
            }}
          />
        );
      })}

      {/* Subtle Edge Enhancement */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `linear-gradient(
            to right,
            rgba(255, 255, 255, ${subtleOpacity * 0.5}) 0%,
            transparent 8%,
            transparent 92%,
            rgba(255, 255, 255, ${subtleOpacity * 0.5}) 100%
          ), linear-gradient(
            to bottom,
            rgba(255, 255, 255, ${subtleOpacity * 0.3}) 0%,
            transparent 8%,
            transparent 92%,
            rgba(255, 255, 255, ${subtleOpacity * 0.3}) 100%
          )`,
          mixBlendMode: 'soft-light',
          borderRadius: 'inherit'
        }}
      />

      {/* Gentle CSS Animations */}
      <style>
        {Array.from({ length: Math.min(Math.max(facets, 3), 8) }, (_, i) => `
          @keyframes crystal-glow-${i} {
            0% { 
              opacity: ${gentleOpacity * 0.6}; 
              transform: translate(-50%, -50%) scale(0.8); 
            }
            100% { 
              opacity: ${gentleOpacity * 1.4}; 
              transform: translate(-50%, -50%) scale(1.1); 
            }
          }
        `).join('\n')}
      </style>
    </>
  );
};
