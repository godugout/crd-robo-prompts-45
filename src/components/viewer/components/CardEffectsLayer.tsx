
import React from 'react';
import { useEffectContext } from '../contexts/EffectContext';

interface CardEffectsLayerProps {
  // Remove all the previously passed props since we'll get them from context
}

export const CardEffectsLayer: React.FC<CardEffectsLayerProps> = () => {
  const {
    showEffects,
    isHovering,
    effectIntensity,
    mousePosition,
    effectValues,
    materialSettings,
    interactiveLighting
  } = useEffectContext();

  if (!showEffects) {
    return null;
  }

  // Create physical effect styles based on context values
  const physicalEffectStyles: React.CSSProperties = {
    transform: `perspective(1000px) rotateX(${mousePosition.y * 10}deg) rotateY(${mousePosition.x * 10}deg)`,
    transition: 'transform 0.1s ease-out',
  };

  return (
    <div className="absolute inset-0 z-40 pointer-events-none">
      {/* Metallic reflection overlay */}
      {(effectValues.chrome?.intensity > 0 || effectValues.gold?.intensity > 0) && (
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                ${45 + mousePosition.x * 30}deg,
                rgba(255, 255, 255, ${0.1 * (materialSettings.reflectivity / 100)}) 0%,
                rgba(255, 255, 255, ${0.3 * (materialSettings.reflectivity / 100)}) 50%,
                rgba(255, 255, 255, ${0.1 * (materialSettings.reflectivity / 100)}) 100%
              )
            `,
            mixBlendMode: 'overlay',
            opacity: isHovering ? 0.8 : 0.4,
            transition: 'opacity 0.3s ease',
            ...physicalEffectStyles
          }}
        />
      )}

      {/* Holographic prismatic effects */}
      {effectValues.holographic?.intensity > 0 && (
        <div
          className="absolute inset-0"
          style={{
            background: `
              conic-gradient(
                from ${mousePosition.x * 360}deg,
                transparent 0deg,
                rgba(255, 0, 150, 0.1) 60deg,
                rgba(0, 255, 255, 0.1) 120deg,
                rgba(255, 255, 0, 0.1) 180deg,
                rgba(255, 0, 150, 0.1) 240deg,
                rgba(0, 255, 255, 0.1) 300deg,
                transparent 360deg
              )
            `,
            mixBlendMode: 'screen',
            opacity: (effectValues.holographic.intensity / 100) * 0.6,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}

      {/* Crystal facet effects */}
      {effectValues.crystal?.intensity > 0 && (
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(
                ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                rgba(255, 255, 255, 0.2) 0%,
                rgba(255, 255, 255, 0.1) 30%,
                transparent 70%
              )
            `,
            mixBlendMode: 'overlay',
            opacity: effectValues.crystal.intensity / 100,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}
    </div>
  );
};
