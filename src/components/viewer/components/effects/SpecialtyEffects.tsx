
import React from 'react';

interface SpecialtyEffectsProps {
  interferenceIntensity: number;
  prizemIntensity: number;
  foilsprayIntensity: number;
  mousePosition: { x: number; y: number };
}

export const SpecialtyEffects: React.FC<SpecialtyEffectsProps> = ({
  interferenceIntensity,
  prizemIntensity,
  foilsprayIntensity,
  mousePosition
}) => {
  return (
    <>
      {/* Interference Effect - Soap Bubble Patterns */}
      {interferenceIntensity > 0 && (
        <div
          className="absolute inset-0 z-20"
          style={{
            background: `
              radial-gradient(
                ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                rgba(255, 200, 255, ${(interferenceIntensity / 100) * 0.15}) 0%,
                rgba(200, 255, 200, ${(interferenceIntensity / 100) * 0.2}) 20%,
                rgba(200, 200, 255, ${(interferenceIntensity / 100) * 0.15}) 40%,
                rgba(255, 255, 200, ${(interferenceIntensity / 100) * 0.2}) 60%,
                rgba(255, 200, 200, ${(interferenceIntensity / 100) * 0.15}) 80%,
                transparent 100%
              )
            `,
            mixBlendMode: 'screen',
            opacity: 0.3,
            animation: 'pulse 3s ease-in-out infinite'
          }}
        />
      )}

      {/* Prizm Effect - Geometric Light Separation */}
      {prizemIntensity > 0 && (
        <div
          className="absolute inset-0 z-20"
          style={{
            background: `
              conic-gradient(
                from ${mousePosition.x * 120}deg at 50% 50%,
                transparent 0deg,
                rgba(255, 0, 0, ${(prizemIntensity / 100) * 0.2}) 30deg,
                transparent 60deg,
                rgba(0, 255, 0, ${(prizemIntensity / 100) * 0.2}) 90deg,
                transparent 120deg,
                rgba(0, 0, 255, ${(prizemIntensity / 100) * 0.2}) 150deg,
                transparent 180deg,
                rgba(255, 255, 0, ${(prizemIntensity / 100) * 0.2}) 210deg,
                transparent 240deg,
                rgba(255, 0, 255, ${(prizemIntensity / 100) * 0.2}) 270deg,
                transparent 300deg,
                rgba(0, 255, 255, ${(prizemIntensity / 100) * 0.2}) 330deg,
                transparent 360deg
              )
            `,
            mixBlendMode: 'overlay',
            opacity: 0.5,
            clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)'
          }}
        />
      )}

      {/* Foil Spray Effect - Scattered Metallic Particles */}
      {foilsprayIntensity > 0 && (
        <div
          className="absolute inset-0 z-20"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(192, 192, 192, ${(foilsprayIntensity / 100) * 0.2}) 1px, transparent 2px),
              radial-gradient(circle at 60% 70%, rgba(255, 255, 255, ${(foilsprayIntensity / 100) * 0.15}) 1px, transparent 2px),
              radial-gradient(circle at 80% 20%, rgba(176, 176, 176, ${(foilsprayIntensity / 100) * 0.2}) 1px, transparent 2px),
              radial-gradient(circle at 30% 80%, rgba(208, 208, 208, ${(foilsprayIntensity / 100) * 0.15}) 1px, transparent 2px),
              radial-gradient(circle at 70% 40%, rgba(224, 224, 224, ${(foilsprayIntensity / 100) * 0.15}) 1px, transparent 2px)
            `,
            backgroundSize: '40px 40px, 35px 35px, 45px 45px, 38px 38px, 42px 42px',
            backgroundPosition: `${mousePosition.x * 10}px ${mousePosition.y * 10}px, 
                               ${mousePosition.x * -8}px ${mousePosition.y * 12}px,
                               ${mousePosition.x * 15}px ${mousePosition.y * -5}px,
                               ${mousePosition.x * -12}px ${mousePosition.y * -8}px,
                               ${mousePosition.x * 6}px ${mousePosition.y * 14}px`,
            mixBlendMode: 'screen',
            opacity: 0.4
          }}
        />
      )}
    </>
  );
};
