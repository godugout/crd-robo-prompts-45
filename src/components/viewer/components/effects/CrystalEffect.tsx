
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

  // Calculate soft, performance-friendly values
  const opacity = Math.min(crystalIntensity / 100, 0.6);
  const softGlow = opacity * 0.3;

  return (
    <>
      {/* Soft Crystal Base - Creates gentle translucency */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: `rgba(255, 255, 255, ${softGlow})`,
          backdropFilter: `blur(${opacity}px)`,
          opacity: 0.7
        }}
      />
      
      {/* Internal Crystal Light - Soft radial glow */}
      <div
        className="absolute inset-0 z-11"
        style={{
          background: `radial-gradient(
            ellipse at ${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%,
            rgba(255, 255, 255, ${opacity * 0.4}) 0%,
            rgba(240, 248, 255, ${opacity * 0.2}) 40%,
            transparent 70%
          )`,
          mixBlendMode: 'soft-light',
          opacity: 0.8
        }}
      />
      
      {/* Gentle Crystal Facets - Simple geometric pattern */}
      <div
        className="absolute inset-0 z-12"
        style={{
          background: `linear-gradient(
            ${mousePosition.x * 45}deg,
            rgba(255, 255, 255, ${opacity * 0.15}) 0%,
            transparent 30%,
            rgba(255, 255, 255, ${opacity * 0.1}) 50%,
            transparent 70%,
            rgba(255, 255, 255, ${opacity * 0.12}) 100%
          )`,
          opacity: 0.6
        }}
      />
      
      {/* Soft Edge Enhancement */}
      <div
        className="absolute inset-0 z-13"
        style={{
          background: `radial-gradient(
            circle at ${30 + mousePosition.x * 40}% ${30 + mousePosition.y * 40}%,
            rgba(255, 255, 255, ${opacity * 0.2}) 0%,
            transparent 60%
          )`,
          mixBlendMode: 'overlay',
          opacity: 0.5
        }}
      />
      
      {/* Gentle Sparkle Points - Minimal animation */}
      <div
        className="absolute inset-0 z-14 animate-pulse"
        style={{
          background: `
            radial-gradient(
              circle at ${25 + mousePosition.x * 50}% ${75 - mousePosition.y * 50}%,
              rgba(255, 255, 255, ${opacity * 0.6}) 0%,
              transparent 2px
            ),
            radial-gradient(
              circle at ${75 - mousePosition.x * 25}% ${25 + mousePosition.y * 50}%,
              rgba(255, 255, 255, ${opacity * 0.4}) 0%,
              transparent 1px
            )
          `,
          mixBlendMode: 'screen',
          opacity: 0.7,
          animationDuration: '3s'
        }}
      />
    </>
  );
};
