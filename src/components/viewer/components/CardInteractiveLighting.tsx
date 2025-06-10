
import React from 'react';

interface CardInteractiveLightingProps {
  isHovering: boolean;
  showEffects: boolean;
  mousePosition: { x: number; y: number };
  interactiveLighting?: boolean;
}

export const CardInteractiveLighting: React.FC<CardInteractiveLightingProps> = ({
  isHovering,
  showEffects,
  mousePosition,
  interactiveLighting = false
}) => {
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
