
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

  if (crystalIntensity <= 0) return null;

  // Pre-calculate common values for performance
  const intensityFactor = crystalIntensity / 100;
  const translucencyLevel = Math.max(0, intensityFactor * 0.15);
  const mouseX = mousePosition.x;
  const mouseY = mousePosition.y;

  return (
    <>
      {/* Optimized CSS Keyframes - Reduced from 8 to 4 animations */}
      <style>{`
        @keyframes crystal-glitter {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes crystal-starburst {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 0.8; transform: scale(1) rotate(180deg); }
        }
        @keyframes crystal-shimmer {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateX(200%); opacity: 0; }
        }
        @keyframes crystal-facet {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .crystal-layer { will-change: transform; }
      `}</style>

      {/* Card Translucency Base */}
      <div
        className="absolute inset-0 z-5 crystal-layer"
        style={{
          background: `rgba(255, 255, 255, ${translucencyLevel})`,
          opacity: 0.6
        }}
      />
      
      {/* Simplified Internal Crystal Structure */}
      <div
        className="absolute inset-0 z-15 crystal-layer"
        style={{
          background: `radial-gradient(
            ellipse at ${40 + mouseX * 20}% ${40 + mouseY * 20}%,
            rgba(255, 255, 255, ${intensityFactor * 0.08}) 0%,
            rgba(248, 252, 255, ${intensityFactor * 0.06}) 30%,
            transparent 70%
          )`,
          mixBlendMode: 'overlay',
          opacity: 0.7,
          filter: `blur(${translucencyLevel * 2}px)`
        }}
      />
      
      {/* Optimized Crystal Facets */}
      <div
        className="absolute inset-0 z-16 crystal-layer"
        style={{
          background: `conic-gradient(
            from ${mouseX * 20}deg at ${50 + mouseX * 15}% ${50 + mouseY * 15}%,
            transparent 0deg,
            rgba(255, 255, 255, ${intensityFactor * 0.12}) 60deg,
            transparent 120deg,
            rgba(255, 255, 255, ${intensityFactor * 0.14}) 180deg,
            transparent 240deg,
            rgba(255, 255, 255, ${intensityFactor * 0.12}) 300deg,
            transparent 360deg
          )`,
          mixBlendMode: 'soft-light',
          opacity: 0.5,
          animation: 'crystal-facet 3s ease-in-out infinite'
        }}
      />
      
      {/* Consolidated Glitter Layer */}
      <div
        className="absolute inset-0 z-18 crystal-layer"
        style={{
          background: `
            radial-gradient(circle at ${25 + mouseX * 50}% ${25 + mouseY * 50}%, 
              rgba(255, 255, 255, ${intensityFactor}) 0%, 
              rgba(255, 255, 255, ${intensityFactor * 0.6}) 1px, 
              transparent 2px),
            radial-gradient(circle at ${75 - mouseX * 30}% ${65 + mouseY * 25}%, 
              rgba(255, 255, 255, ${intensityFactor * 0.9}) 0%, 
              rgba(255, 255, 255, ${intensityFactor * 0.4}) 1.5px, 
              transparent 3px)
          `,
          backgroundSize: '60px 60px, 80px 80px',
          mixBlendMode: 'screen',
          opacity: 0.9,
          animation: 'crystal-glitter 3s ease-in-out infinite'
        }}
      />

      {/* Consolidated Starburst Layer */}
      <div
        className="absolute inset-0 z-19 crystal-layer"
        style={{
          background: `
            linear-gradient(0deg, transparent 48%, rgba(255, 255, 255, ${intensityFactor * 0.8}) 50%, transparent 52%),
            linear-gradient(90deg, transparent 48%, rgba(255, 255, 255, ${intensityFactor * 0.8}) 50%, transparent 52%),
            linear-gradient(45deg, transparent 48%, rgba(255, 255, 255, ${intensityFactor * 0.6}) 50%, transparent 52%)
          `,
          backgroundPosition: `
            ${25 + mouseX * 50}% ${25 + mouseY * 50}%,
            ${75 - mouseX * 30}% ${75 - mouseY * 30}%,
            ${50 + mouseX * 20}% ${50 + mouseY * 20}%
          `,
          backgroundSize: '30px 30px, 35px 35px, 25px 25px',
          mixBlendMode: 'color-dodge',
          opacity: 0.6,
          animation: 'crystal-starburst 4s ease-in-out infinite'
        }}
      />

      {/* Optimized Shimmer Wave */}
      <div
        className="absolute inset-0 z-20 crystal-layer"
        style={{
          background: `linear-gradient(
            ${75 + mouseX * 30}deg,
            transparent 0%,
            rgba(255, 255, 255, ${intensityFactor * 0.1}) 25%,
            rgba(255, 255, 255, ${intensityFactor * 0.6}) 50%,
            rgba(255, 255, 255, ${intensityFactor * 0.1}) 75%,
            transparent 100%
          )`,
          mixBlendMode: 'overlay',
          opacity: 0.8,
          animation: 'crystal-shimmer 4s ease-in-out infinite',
          filter: `blur(${translucencyLevel * 0.5}px)`
        }}
      />

      {/* Simplified Prismatic Edge Enhancement */}
      <div
        className="absolute inset-0 z-21 crystal-layer"
        style={{
          background: `radial-gradient(
            ellipse at ${50 + mouseX * 10}% ${50 + mouseY * 10}%,
            rgba(255, 200, 255, ${intensityFactor * 0.08}) 15%,
            rgba(200, 255, 255, ${intensityFactor * 0.06}) 40%,
            rgba(255, 255, 200, ${intensityFactor * 0.07}) 65%,
            transparent 100%
          )`,
          mixBlendMode: 'color-dodge',
          opacity: 0.5,
          filter: `blur(${translucencyLevel * 2}px)`
        }}
      />
    </>
  );
};
