
import React from 'react';
import { useEffectContext } from '../contexts/EffectContext';

export const CardInteractiveLighting: React.FC = () => {
  const {
    interactiveLighting,
    isHovering,
    mousePosition,
    effectValues
  } = useEffectContext();

  if (!interactiveLighting || !isHovering) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse 200% 150% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(255, 255, 255, 0.1) 0%,
              rgba(255, 255, 255, 0.05) 30%,
              transparent 70%
            )
          `,
          mixBlendMode: 'overlay',
          transition: 'opacity 0.2s ease'
        }}
      />
    </div>
  );
};
