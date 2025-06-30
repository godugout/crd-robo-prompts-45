
import React from 'react';
import { useEffectContext } from '../contexts/EffectContext';

export const CardInteractiveLighting: React.FC = () => {
  const {
    isHovering,
    showEffects,
    mousePosition,
    interactiveLighting
  } = useEffectContext();

  if (!interactiveLighting || !isHovering) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 z-50 pointer-events-none"
      style={{
        background: `
          radial-gradient(
            ellipse 180% 140% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
            rgba(255, 255, 255, 0.08) 0%,
            rgba(255, 255, 255, 0.04) 50%,
            transparent 85%
          )
        `,
        mixBlendMode: 'overlay',
        transition: 'opacity 0.2s ease',
        opacity: showEffects ? 1 : 0.5
      }}
    />
  );
};
