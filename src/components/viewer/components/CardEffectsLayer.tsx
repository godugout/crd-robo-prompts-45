
import React from 'react';

interface CardEffectsLayerProps {
  showEffects: boolean;
  isHovering: boolean;
  effectIntensity: number[];
  mousePosition: { x: number; y: number };
  physicalEffectStyles: React.CSSProperties;
}

export const CardEffectsLayer: React.FC<CardEffectsLayerProps> = ({
  showEffects,
  isHovering,
  effectIntensity,
  mousePosition,
  physicalEffectStyles
}) => {
  if (!showEffects) return null;

  // Cap the effect intensity to prevent blinding effects
  const cappedIntensity = Math.min(effectIntensity[0], 80);

  return (
    <>
      {/* Physical Effects Layer - z-index 4 - Normal opacity */}
      <div 
        className="absolute inset-0 pointer-events-none z-40" 
        style={{
          ...physicalEffectStyles,
          opacity: Math.min(1, (physicalEffectStyles.opacity as number || 1) * 1.2)
        }} 
      />
      
      {/* Subtle Specular Highlight Layer - z-index 5 - Much softer */}
      {isHovering && (
        <div 
          className="absolute inset-0 pointer-events-none z-50"
          style={{
            background: `radial-gradient(ellipse 400px 200px at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
              rgba(255,255,255,${cappedIntensity * 0.003}) 0%, 
              rgba(255,255,255,${cappedIntensity * 0.002}) 40%,
              transparent 80%)`,
            mixBlendMode: 'overlay'
          }}
        />
      )}

      {/* Subtle Moving Shine Effect - z-index 6 - Much more gentle */}
      {isHovering && (
        <div 
          className="absolute inset-0 pointer-events-none z-60"
          style={{
            background: `linear-gradient(${Math.atan2(mousePosition.y - 0.5, mousePosition.x - 0.5) * 180 / Math.PI + 90}deg, 
              transparent 30%, 
              rgba(255, 255, 255, ${cappedIntensity * 0.006}) 45%,
              rgba(255, 255, 255, ${cappedIntensity * 0.008}) 50%, 
              rgba(255, 255, 255, ${cappedIntensity * 0.006}) 55%,
              transparent 70%)`,
            transform: `translateX(${(mousePosition.x - 0.5) * 40}%) translateY(${(mousePosition.y - 0.5) * 25}%)`,
            transition: 'transform 0.15s ease',
            mixBlendMode: 'soft-light'
          }}
        />
      )}
      
      {/* Gentle Interactive Light Effect - z-index 7 - Very subtle */}
      {isHovering && cappedIntensity > 40 && (
        <div 
          className="absolute inset-0 pointer-events-none z-70"
          style={{
            background: `conic-gradient(from ${mousePosition.x * 360}deg at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
              rgba(255,255,255,${cappedIntensity * 0.002}) 0deg,
              rgba(200,200,255,${cappedIntensity * 0.003}) 120deg,
              rgba(255,255,255,${cappedIntensity * 0.002}) 240deg,
              rgba(255,200,255,${cappedIntensity * 0.003}) 360deg)`,
            mixBlendMode: 'overlay'
          }}
        />
      )}
    </>
  );
};
