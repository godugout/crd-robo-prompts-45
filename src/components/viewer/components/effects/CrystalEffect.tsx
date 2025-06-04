
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

  // Pre-calculate values to avoid re-computation
  const intensityFactor = crystalIntensity / 100;
  const baseOpacity = Math.min(intensityFactor * 0.6, 0.6);
  const mouseX = mousePosition.x;
  const mouseY = mousePosition.y;

  return (
    <>
      {/* Simple CSS animations - minimal and GPU-accelerated */}
      <style>{`
        @keyframes crystal-shimmer {
          0%, 100% { opacity: 0.3; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.8; transform: translateX(50%) scale(1.05); }
        }
        @keyframes crystal-sparkle {
          0%, 100% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .crystal-gpu { will-change: transform, opacity; transform: translate3d(0,0,0); }
      `}</style>

      {/* Base translucency layer */}
      <div
        className="absolute inset-0 z-10 crystal-gpu"
        style={{
          background: `rgba(255, 255, 255, ${intensityFactor * 0.15})`,
          opacity: baseOpacity
        }}
      />
      
      {/* Simple radial highlight following mouse */}
      <div
        className="absolute inset-0 z-11 crystal-gpu"
        style={{
          background: `radial-gradient(
            circle at ${50 + mouseX * 20}% ${50 + mouseY * 20}%,
            rgba(255, 255, 255, ${intensityFactor * 0.4}) 0%,
            rgba(255, 255, 255, ${intensityFactor * 0.2}) 30%,
            transparent 60%
          )`,
          mixBlendMode: 'overlay',
          opacity: baseOpacity * 0.8
        }}
      />
      
      {/* Animated shimmer sweep */}
      <div
        className="absolute inset-0 z-12 crystal-gpu"
        style={{
          background: `linear-gradient(
            ${45 + mouseX * 30}deg,
            transparent 40%,
            rgba(255, 255, 255, ${intensityFactor * 0.3}) 50%,
            transparent 60%
          )`,
          mixBlendMode: 'soft-light',
          opacity: baseOpacity * 0.7,
          animation: 'crystal-shimmer 3s ease-in-out infinite'
        }}
      />

      {/* Subtle sparkle effect */}
      <div
        className="absolute inset-0 z-13 crystal-gpu"
        style={{
          background: `
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, ${intensityFactor * 0.6}) 1px, transparent 2px),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, ${intensityFactor * 0.5}) 1px, transparent 2px),
            radial-gradient(circle at 50% 25%, rgba(255, 255, 255, ${intensityFactor * 0.4}) 1px, transparent 2px)
          `,
          backgroundSize: '100px 100px, 120px 120px, 80px 80px',
          mixBlendMode: 'screen',
          opacity: baseOpacity * 0.6,
          animation: 'crystal-sparkle 4s ease-in-out infinite'
        }}
      />
    </>
  );
};
