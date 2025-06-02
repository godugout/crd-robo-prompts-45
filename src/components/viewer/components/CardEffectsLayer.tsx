
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
      {/* Physical Effects Layer - z-index 4 - Enhanced opacity for more pop */}
      <div 
        className="absolute inset-0 pointer-events-none z-40" 
        style={{
          ...physicalEffectStyles,
          opacity: Math.min(1, (physicalEffectStyles.opacity as number || 1) * 1.4),
          filter: 'blur(0.5px)' // Slight blur to soften geometric lines
        }} 
      />
      
      {/* Enhanced Blue-Cyan Specular Highlight Layer - z-index 5 */}
      {isHovering && (
        <div 
          className="absolute inset-0 pointer-events-none z-50"
          style={{
            background: `radial-gradient(ellipse 500px 300px at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
              rgba(0, 150, 255, ${cappedIntensity * 0.008}) 0%, 
              rgba(100, 200, 255, ${cappedIntensity * 0.006}) 30%,
              rgba(0, 100, 255, ${cappedIntensity * 0.004}) 60%,
              transparent 90%)`,
            mixBlendMode: 'color-dodge',
            filter: 'blur(1px)' // Soften the boundaries
          }}
        />
      )}

      {/* Vibrant Moving Color Shine Effect - z-index 6 */}
      {isHovering && (
        <div 
          className="absolute inset-0 pointer-events-none z-60"
          style={{
            background: `linear-gradient(${Math.atan2(mousePosition.y - 0.5, mousePosition.x - 0.5) * 180 / Math.PI + 90}deg, 
              transparent 20%, 
              rgba(0, 150, 255, ${cappedIntensity * 0.012}) 35%,
              rgba(100, 255, 200, ${cappedIntensity * 0.015}) 45%, 
              rgba(50, 100, 255, ${cappedIntensity * 0.018}) 50%, 
              rgba(150, 200, 255, ${cappedIntensity * 0.015}) 55%,
              rgba(0, 200, 255, ${cappedIntensity * 0.012}) 65%,
              transparent 80%)`,
            transform: `translateX(${(mousePosition.x - 0.5) * 30}%) translateY(${(mousePosition.y - 0.5) * 20}%)`,
            transition: 'transform 0.2s ease',
            mixBlendMode: 'screen',
            filter: 'blur(1.5px)' // Heavy blur for smooth color blending
          }}
        />
      )}
      
      {/* Enhanced Interactive Blue-Purple Light Effect - z-index 7 */}
      {isHovering && cappedIntensity > 30 && (
        <div 
          className="absolute inset-0 pointer-events-none z-70"
          style={{
            background: `conic-gradient(from ${mousePosition.x * 360}deg at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
              rgba(0, 100, 255, ${cappedIntensity * 0.006}) 0deg,
              rgba(100, 150, 255, ${cappedIntensity * 0.008}) 60deg,
              rgba(50, 200, 255, ${cappedIntensity * 0.010}) 120deg,
              rgba(150, 100, 255, ${cappedIntensity * 0.008}) 180deg,
              rgba(0, 150, 255, ${cappedIntensity * 0.006}) 240deg,
              rgba(100, 200, 255, ${cappedIntensity * 0.008}) 300deg,
              rgba(0, 100, 255, ${cappedIntensity * 0.006}) 360deg)`,
            mixBlendMode: 'color-dodge',
            filter: 'blur(2px)' // Strong blur for seamless color transitions
          }}
        />
      )}

      {/* Ambient Blue Glow Layer - z-index 8 */}
      {isHovering && cappedIntensity > 50 && (
        <div 
          className="absolute inset-0 pointer-events-none z-80"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
              rgba(0, 150, 255, ${cappedIntensity * 0.004}) 0%, 
              rgba(50, 100, 255, ${cappedIntensity * 0.002}) 40%,
              transparent 70%)`,
            mixBlendMode: 'soft-light',
            filter: 'blur(3px)' // Maximum blur for ambient glow
          }}
        />
      )}
    </>
  );
};
