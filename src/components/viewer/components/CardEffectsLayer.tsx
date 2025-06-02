
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

  // Reduced intensity cap for more realistic effects
  const cappedIntensity = Math.min(effectIntensity[0], 60);
  const intensityFactor = cappedIntensity / 100;

  return (
    <>
      {/* Physical Effects Layer - z-index 4 */}
      <div 
        className="absolute inset-0 pointer-events-none z-40" 
        style={{
          ...physicalEffectStyles,
          opacity: Math.min(0.7, (physicalEffectStyles.opacity as number || 1) * 1.2)
        }} 
      />
      
      {/* Subtle Specular Highlight Layer - z-index 5 */}
      {isHovering && (
        <div 
          className="absolute inset-0 pointer-events-none z-50"
          style={{
            background: `radial-gradient(ellipse 300px 150px at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
              rgba(255,255,255,${cappedIntensity * 0.008}) 0%, 
              rgba(255,255,255,${cappedIntensity * 0.006}) 30%,
              rgba(240,245,255,${cappedIntensity * 0.004}) 60%,
              transparent 90%)`,
            mixBlendMode: 'screen'
          }}
        />
      )}

      {/* Gentle Moving Shine Effect - z-index 6 */}
      {isHovering && (
        <div 
          className="absolute inset-0 pointer-events-none z-60"
          style={{
            background: `linear-gradient(${Math.atan2(mousePosition.y - 0.5, mousePosition.x - 0.5) * 180 / Math.PI + 90}deg, 
              transparent 35%, 
              rgba(255, 255, 255, ${cappedIntensity * 0.012}) 45%,
              rgba(255, 255, 255, ${cappedIntensity * 0.018}) 50%, 
              rgba(255, 255, 255, ${cappedIntensity * 0.012}) 55%,
              transparent 65%)`,
            transform: `translateX(${(mousePosition.x - 0.5) * 20}%) translateY(${(mousePosition.y - 0.5) * 15}%)`,
            transition: 'transform 0.15s ease',
            mixBlendMode: 'overlay'
          }}
        />
      )}

      {/* Subtle Edge Lighting - z-index 7 */}
      {isHovering && (
        <div 
          className="absolute inset-0 pointer-events-none z-70"
          style={{
            background: `
              radial-gradient(ellipse 120% 100% at 0% 50%, 
                rgba(255,255,255,${intensityFactor * 0.04}) 0%, 
                transparent 50%),
              radial-gradient(ellipse 120% 100% at 100% 50%, 
                rgba(255,255,255,${intensityFactor * 0.04}) 0%, 
                transparent 50%),
              radial-gradient(ellipse 100% 120% at 50% 0%, 
                rgba(255,255,255,${intensityFactor * 0.03}) 0%, 
                transparent 50%),
              radial-gradient(ellipse 100% 120% at 50% 100%, 
                rgba(255,255,255,${intensityFactor * 0.03}) 0%, 
                transparent 50%)
            `,
            mixBlendMode: 'soft-light'
          }}
        />
      )}
    </>
  );
};
