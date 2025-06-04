
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

  if (crystalIntensity <= 0) return null;

  // Calculate intensity-based opacity
  const baseOpacity = crystalIntensity / 100;

  return (
    <>
      {/* CSS Keyframes for Simple Animations */}
      <style>
        {`
          @keyframes diamond-sparkle {
            0%, 100% { opacity: 0; transform: scale(0.5); }
            50% { opacity: 1; transform: scale(1.2); }
          }
          @keyframes diamond-flare {
            0%, 100% { opacity: 0; transform: scale(0.8) rotate(0deg); }
            50% { opacity: 0.8; transform: scale(1) rotate(45deg); }
          }
          @keyframes subtle-shimmer {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.7; }
          }
        `}
      </style>

      {/* Base Crystal Overlay */}
      <div
        className="absolute inset-0 z-15"
        style={{
          background: `radial-gradient(
            ellipse at ${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%,
            rgba(255, 255, 255, ${baseOpacity * 0.1}) 0%,
            rgba(255, 255, 255, ${baseOpacity * 0.05}) 40%,
            transparent 70%
          )`,
          opacity: 0.6
        }}
      />

      {/* Diamond Sparkle Points */}
      <div
        className="absolute inset-0 z-16"
        style={{
          background: `
            radial-gradient(circle at ${25 + mousePosition.x * 30}% ${25 + mousePosition.y * 30}%, 
              rgba(255, 255, 255, ${baseOpacity * 0.9}) 0%, 
              rgba(255, 255, 255, ${baseOpacity * 0.4}) 1px, 
              transparent 2px),
            radial-gradient(circle at ${75 - mousePosition.x * 20}% ${35 + mousePosition.y * 25}%, 
              rgba(255, 255, 255, ${baseOpacity * 0.8}) 0%, 
              rgba(255, 255, 255, ${baseOpacity * 0.3}) 1px, 
              transparent 2px),
            radial-gradient(circle at ${60 + mousePosition.x * 15}% ${80 - mousePosition.y * 30}%, 
              rgba(255, 255, 255, ${baseOpacity * 0.7}) 0%, 
              rgba(255, 255, 255, ${baseOpacity * 0.35}) 1px, 
              transparent 2px)
          `,
          backgroundSize: '100px 100px, 120px 120px, 80px 80px',
          mixBlendMode: 'screen',
          animation: 'diamond-sparkle 3s ease-in-out infinite'
        }}
      />

      {/* Cross-shaped Star Flares */}
      <div
        className="absolute inset-0 z-17"
        style={{
          background: `
            linear-gradient(0deg, transparent 48%, rgba(255, 255, 255, ${baseOpacity * 0.6}) 49%, rgba(255, 255, 255, ${baseOpacity * 0.8}) 50%, rgba(255, 255, 255, ${baseOpacity * 0.6}) 51%, transparent 52%),
            linear-gradient(90deg, transparent 48%, rgba(255, 255, 255, ${baseOpacity * 0.6}) 49%, rgba(255, 255, 255, ${baseOpacity * 0.8}) 50%, rgba(255, 255, 255, ${baseOpacity * 0.6}) 51%, transparent 52%)
          `,
          backgroundPosition: `
            ${25 + mousePosition.x * 30}% ${25 + mousePosition.y * 30}%,
            ${25 + mousePosition.x * 30}% ${25 + mousePosition.y * 30}%
          `,
          backgroundSize: '40px 40px, 40px 40px',
          mixBlendMode: 'screen',
          animation: 'diamond-flare 4s ease-in-out infinite 1s'
        }}
      />

      {/* Secondary Flare at Different Position */}
      <div
        className="absolute inset-0 z-17"
        style={{
          background: `
            linear-gradient(45deg, transparent 48%, rgba(255, 255, 255, ${baseOpacity * 0.4}) 49%, rgba(255, 255, 255, ${baseOpacity * 0.6}) 50%, rgba(255, 255, 255, ${baseOpacity * 0.4}) 51%, transparent 52%),
            linear-gradient(-45deg, transparent 48%, rgba(255, 255, 255, ${baseOpacity * 0.4}) 49%, rgba(255, 255, 255, ${baseOpacity * 0.6}) 50%, rgba(255, 255, 255, ${baseOpacity * 0.4}) 51%, transparent 52%)
          `,
          backgroundPosition: `
            ${75 - mousePosition.x * 20}% ${75 - mousePosition.y * 20}%,
            ${75 - mousePosition.x * 20}% ${75 - mousePosition.y * 20}%
          `,
          backgroundSize: '30px 30px, 30px 30px',
          mixBlendMode: 'screen',
          animation: 'diamond-flare 3.5s ease-in-out infinite 2s'
        }}
      />

      {/* Subtle Faceted Pattern Based on Facets Parameter */}
      <div
        className="absolute inset-0 z-18"
        style={{
          background: `conic-gradient(
            from ${mousePosition.x * facets * 5}deg at 50% 50%,
            ${Array.from({ length: facets }, (_, i) => {
              const angle = (360 / facets) * i;
              const nextAngle = (360 / facets) * (i + 1);
              return `transparent ${angle}deg, rgba(255, 255, 255, ${baseOpacity * 0.1}) ${angle + 5}deg, rgba(255, 255, 255, ${baseOpacity * 0.15}) ${nextAngle - 5}deg, transparent ${nextAngle}deg`;
            }).join(', ')}
          )`,
          mask: `radial-gradient(
            ellipse at ${50 + mousePosition.x * 5}% ${50 + mousePosition.y * 5}%,
            rgba(255, 255, 255, 0.8) 20%,
            rgba(255, 255, 255, 0.4) 60%,
            transparent 80%
          )`,
          WebkitMask: `radial-gradient(
            ellipse at ${50 + mousePosition.x * 5}% ${50 + mousePosition.y * 5}%,
            rgba(255, 255, 255, 0.8) 20%,
            rgba(255, 255, 255, 0.4) 60%,
            transparent 80%
          )`,
          mixBlendMode: 'overlay',
          animation: 'subtle-shimmer 5s ease-in-out infinite'
        }}
      />

      {/* Light Dispersion Effect */}
      {dispersion > 0 && (
        <div
          className="absolute inset-0 z-19"
          style={{
            background: `linear-gradient(
              ${mousePosition.x * 60}deg,
              rgba(255, 200, 255, ${baseOpacity * (dispersion / 100) * 0.05}) 0%,
              rgba(200, 255, 255, ${baseOpacity * (dispersion / 100) * 0.04}) 25%,
              rgba(255, 255, 200, ${baseOpacity * (dispersion / 100) * 0.05}) 50%,
              rgba(200, 255, 200, ${baseOpacity * (dispersion / 100) * 0.04}) 75%,
              rgba(255, 200, 200, ${baseOpacity * (dispersion / 100) * 0.05}) 100%
            )`,
            mask: `radial-gradient(
              ellipse at ${50 + mousePosition.x * 8}% ${50 + mousePosition.y * 8}%,
              rgba(255, 255, 255, 0.6) 30%,
              rgba(255, 255, 255, 0.2) 70%,
              transparent 90%
            )`,
            WebkitMask: `radial-gradient(
              ellipse at ${50 + mousePosition.x * 8}% ${50 + mousePosition.y * 8}%,
              rgba(255, 255, 255, 0.6) 30%,
              rgba(255, 255, 255, 0.2) 70%,
              transparent 90%
            )`,
            mixBlendMode: 'color-dodge',
            opacity: 0.3
          }}
        />
      )}
    </>
  );
};
