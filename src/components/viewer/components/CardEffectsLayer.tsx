
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

  return (
    <>
      {/* Physical Effects Layer - z-index 4 - Higher opacity for better visibility */}
      <div 
        className="absolute inset-0 pointer-events-none z-40" 
        style={{
          ...physicalEffectStyles,
          opacity: Math.min(1, (physicalEffectStyles.opacity as number || 1) * 1.8)
        }} 
      />
      
      {/* Enhanced Specular Highlight Layer - z-index 5 - More intense */}
      {isHovering && (
        <div 
          className="absolute inset-0 pointer-events-none z-50"
          style={{
            background: `radial-gradient(ellipse 300px 150px at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
              rgba(255,255,255,${effectIntensity[0] * 0.012}) 0%, 
              rgba(255,255,255,${effectIntensity[0] * 0.008}) 30%,
              transparent 70%)`,
            mixBlendMode: 'screen'
          }}
        />
      )}

      {/* Enhanced Moving Shine Effect - z-index 6 - Much more visible */}
      {isHovering && (
        <div 
          className="absolute inset-0 pointer-events-none z-60"
          style={{
            background: `linear-gradient(${Math.atan2(mousePosition.y - 0.5, mousePosition.x - 0.5) * 180 / Math.PI + 90}deg, 
              transparent 20%, 
              rgba(255, 255, 255, ${effectIntensity[0] * 0.025}) 35%,
              rgba(255, 255, 255, ${effectIntensity[0] * 0.035}) 50%, 
              rgba(255, 255, 255, ${effectIntensity[0] * 0.025}) 65%,
              transparent 80%)`,
            transform: `translateX(${(mousePosition.x - 0.5) * 60}%) translateY(${(mousePosition.y - 0.5) * 40}%)`,
            transition: 'transform 0.1s ease',
            mixBlendMode: 'screen'
          }}
        />
      )}
      
      {/* Additional Interactive Light Effect - z-index 7 */}
      {isHovering && (
        <div 
          className="absolute inset-0 pointer-events-none z-70"
          style={{
            background: `conic-gradient(from ${mousePosition.x * 360}deg at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
              rgba(255,255,255,${effectIntensity[0] * 0.006}) 0deg,
              rgba(200,200,255,${effectIntensity[0] * 0.008}) 120deg,
              rgba(255,255,255,${effectIntensity[0] * 0.006}) 240deg,
              rgba(255,200,255,${effectIntensity[0] * 0.008}) 360deg)`,
            mixBlendMode: 'color-dodge'
          }}
        />
      )}
    </>
  );
};
