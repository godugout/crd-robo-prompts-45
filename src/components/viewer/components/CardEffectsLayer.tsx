
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

  // Enhanced intensity cap for more visible effects
  const cappedIntensity = Math.min(effectIntensity[0], 95);
  const intensityFactor = cappedIntensity / 100;

  return (
    <>
      {/* Physical Effects Layer - z-index 4 - Enhanced visibility */}
      <div 
        className="absolute inset-0 pointer-events-none z-40" 
        style={{
          ...physicalEffectStyles,
          opacity: Math.min(1, (physicalEffectStyles.opacity as number || 1) * 1.8)
        }} 
      />
      
      {/* Enhanced Specular Highlight Layer - z-index 5 */}
      {isHovering && (
        <div 
          className="absolute inset-0 pointer-events-none z-50"
          style={{
            background: `radial-gradient(ellipse 350px 180px at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
              rgba(255,255,255,${cappedIntensity * 0.015}) 0%, 
              rgba(255,255,255,${cappedIntensity * 0.012}) 30%,
              rgba(200,220,255,${cappedIntensity * 0.008}) 60%,
              transparent 90%)`,
            mixBlendMode: 'screen'
          }}
        />
      )}

      {/* Dynamic Moving Shine Effect - z-index 6 */}
      {isHovering && (
        <div 
          className="absolute inset-0 pointer-events-none z-60"
          style={{
            background: `linear-gradient(${Math.atan2(mousePosition.y - 0.5, mousePosition.x - 0.5) * 180 / Math.PI + 90}deg, 
              transparent 25%, 
              rgba(255, 255, 255, ${cappedIntensity * 0.025}) 40%,
              rgba(255, 255, 255, ${cappedIntensity * 0.035}) 50%, 
              rgba(255, 255, 255, ${cappedIntensity * 0.025}) 60%,
              transparent 75%)`,
            transform: `translateX(${(mousePosition.x - 0.5) * 35}%) translateY(${(mousePosition.y - 0.5) * 20}%)`,
            transition: 'transform 0.12s ease',
            mixBlendMode: 'overlay'
          }}
        />
      )}
      
      {/* Vibrant Interactive Light Effect - z-index 7 */}
      {isHovering && cappedIntensity > 30 && (
        <div 
          className="absolute inset-0 pointer-events-none z-70"
          style={{
            background: `conic-gradient(from ${mousePosition.x * 360}deg at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
              rgba(255,80,150,${cappedIntensity * 0.012}) 0deg,
              rgba(80,150,255,${cappedIntensity * 0.015}) 90deg,
              rgba(150,255,80,${cappedIntensity * 0.012}) 180deg,
              rgba(255,150,80,${cappedIntensity * 0.015}) 270deg,
              rgba(255,80,150,${cappedIntensity * 0.012}) 360deg)`,
            mixBlendMode: 'color-dodge'
          }}
        />
      )}

      {/* Fresnel Edge Lighting - z-index 8 */}
      {isHovering && (
        <div 
          className="absolute inset-0 pointer-events-none z-[80]"
          style={{
            background: `
              radial-gradient(ellipse 120% 100% at 0% 50%, 
                rgba(255,255,255,${intensityFactor * 0.08}) 0%, 
                transparent 40%),
              radial-gradient(ellipse 120% 100% at 100% 50%, 
                rgba(255,255,255,${intensityFactor * 0.08}) 0%, 
                transparent 40%),
              radial-gradient(ellipse 100% 120% at 50% 0%, 
                rgba(255,255,255,${intensityFactor * 0.06}) 0%, 
                transparent 40%),
              radial-gradient(ellipse 100% 120% at 50% 100%, 
                rgba(255,255,255,${intensityFactor * 0.06}) 0%, 
                transparent 40%)
            `,
            mixBlendMode: 'soft-light'
          }}
        />
      )}

      {/* Color Temperature Shift - z-index 9 */}
      {isHovering && cappedIntensity > 50 && (
        <div 
          className="absolute inset-0 pointer-events-none z-90"
          style={{
            background: `
              linear-gradient(${mousePosition.x * 180}deg,
                rgba(255,180,100,${intensityFactor * 0.06}) 0%,
                transparent 50%,
                rgba(100,180,255,${intensityFactor * 0.06}) 100%)
            `,
            mixBlendMode: 'overlay'
          }}
        />
      )}
    </>
  );
};
