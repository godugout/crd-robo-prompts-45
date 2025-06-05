
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

  // Calculate positions for faceted sparkles based on facets count
  const sparklePositions = Array.from({ length: Math.min(facets, 8) }, (_, i) => {
    const angle = (360 / facets) * i;
    const radius = 0.3;
    const x = 50 + Math.cos((angle * Math.PI) / 180) * radius * 100;
    const y = 50 + Math.sin((angle * Math.PI) / 180) * radius * 100;
    return { x, y, delay: i * 0.2 };
  });

  // Base opacity calculations
  const baseOpacity = crystalIntensity / 100;
  const clarityMultiplier = clarity / 100;

  return (
    <>
      {/* Main Crystal Shine Layer */}
      <div
        className="absolute inset-0 z-15"
        style={{
          background: `radial-gradient(
            circle at ${50 + mousePosition.x * 5}% ${50 + mousePosition.y * 5}%,
            rgba(255, 255, 255, ${baseOpacity * clarityMultiplier * 0.2}) 0%,
            rgba(255, 255, 255, ${baseOpacity * clarityMultiplier * 0.1}) 30%,
            transparent 70%
          )`,
          opacity: 0.8
        }}
      />

      {/* Faceted Sparkle Points */}
      {sparkle && sparklePositions.map((pos, index) => (
        <div
          key={index}
          className="absolute z-16"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            width: '4px',
            height: '4px',
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, rgba(255, 255, 255, ${baseOpacity * 0.9}) 0%, transparent 100%)`,
            borderRadius: '50%',
            opacity: clarityMultiplier,
            animation: `crystal-sparkle 2s ease-in-out infinite ${pos.delay}s`
          }}
        />
      ))}

      {/* Central Diamond Flare */}
      <div
        className="absolute z-17"
        style={{
          left: '50%',
          top: '50%',
          width: '2px',
          height: `${20 + (crystalIntensity * 0.3)}px`,
          background: `linear-gradient(0deg, transparent, rgba(255, 255, 255, ${baseOpacity * 0.8}), transparent)`,
          transform: 'translate(-50%, -50%)',
          opacity: clarityMultiplier
        }}
      />
      <div
        className="absolute z-17"
        style={{
          left: '50%',
          top: '50%',
          width: `${20 + (crystalIntensity * 0.3)}px`,
          height: '2px',
          background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, ${baseOpacity * 0.8}), transparent)`,
          transform: 'translate(-50%, -50%)',
          opacity: clarityMultiplier
        }}
      />

      {/* Light Dispersion (only if dispersion > 0) */}
      {dispersion > 0 && (
        <div
          className="absolute inset-0 z-18"
          style={{
            background: `linear-gradient(
              ${mousePosition.x * 30}deg,
              rgba(255, 100, 100, ${baseOpacity * (dispersion / 100) * 0.08}) 0%,
              rgba(100, 255, 100, ${baseOpacity * (dispersion / 100) * 0.08}) 50%,
              rgba(100, 100, 255, ${baseOpacity * (dispersion / 100) * 0.08}) 100%
            )`,
            mask: `radial-gradient(
              circle at 50% 50%,
              rgba(255, 255, 255, 0.6) 40%,
              transparent 80%
            )`,
            WebkitMask: `radial-gradient(
              circle at 50% 50%,
              rgba(255, 255, 255, 0.6) 40%,
              transparent 80%
            )`,
            opacity: 0.4
          }}
        />
      )}

      {/* CSS Animation Keyframes */}
      <style>
        {`
          @keyframes crystal-sparkle {
            0%, 100% { 
              opacity: ${clarityMultiplier * 0.3}; 
              transform: translate(-50%, -50%) scale(0.8); 
            }
            50% { 
              opacity: ${clarityMultiplier}; 
              transform: translate(-50%, -50%) scale(1.2); 
            }
          }
        `}
      </style>
    </>
  );
};
