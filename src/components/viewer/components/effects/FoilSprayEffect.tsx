
import React from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface FoilSprayEffectProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const FoilSprayEffect: React.FC<FoilSprayEffectProps> = ({
  effectValues,
  mousePosition
}) => {
  // Helper function to safely get effect parameter values
  const getEffectParam = (effectId: string, paramId: string, defaultValue: any = 0) => {
    return effectValues?.[effectId]?.[paramId] ?? defaultValue;
  };

  const foilsprayIntensity = getEffectParam('foilspray', 'intensity', 0);

  if (foilsprayIntensity <= 0) return null;

  return (
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
  );
};
