
import React from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface VintageEffectProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const VintageEffect: React.FC<VintageEffectProps> = ({
  effectValues,
  mousePosition
}) => {
  // Helper function to safely get effect parameter values
  const getEffectParam = (effectId: string, paramId: string, defaultValue: any = 0) => {
    return effectValues?.[effectId]?.[paramId] ?? defaultValue;
  };

  const vintageIntensity = getEffectParam('vintage', 'intensity', 0);

  if (vintageIntensity <= 0) return null;

  return (
    <>
      {/* Cardstock base texture with paper fibers */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            linear-gradient(
              0deg,
              rgba(245, 240, 230, ${(vintageIntensity / 100) * 0.4}) 0%,
              rgba(250, 245, 235, ${(vintageIntensity / 100) * 0.3}) 50%,
              rgba(248, 243, 233, ${(vintageIntensity / 100) * 0.35}) 100%
            )
          `,
          mixBlendMode: 'multiply',
          opacity: 0.8
        }}
      />
      
      {/* Paper fiber grain texture */}
      <div
        className="absolute inset-0 z-21"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              ${getEffectParam('vintage', 'aging', 40) > 50 ? 88 : 92}deg,
              transparent 0px,
              rgba(220, 210, 190, ${(vintageIntensity / 100) * 0.15}) 0.5px,
              transparent 1px,
              transparent 2px,
              rgba(235, 225, 205, ${(vintageIntensity / 100) * 0.1}) 2.5px,
              transparent 3px
            ),
            repeating-linear-gradient(
              ${getEffectParam('vintage', 'aging', 40) > 50 ? 2 : -2}deg,
              transparent 0px,
              rgba(210, 200, 180, ${(vintageIntensity / 100) * 0.08}) 1px,
              transparent 3px
            )
          `,
          mixBlendMode: 'multiply',
          opacity: 0.6
        }}
      />
      
      {/* Aging spots and discoloration */}
      <div
        className="absolute inset-0 z-22"
        style={{
          backgroundImage: `
            radial-gradient(
              ellipse at 20% 30%, 
              rgba(200, 180, 140, ${(vintageIntensity / 100) * 0.2}) 0%, 
              transparent 3%
            ),
            radial-gradient(
              ellipse at 70% 80%, 
              rgba(190, 170, 130, ${(vintageIntensity / 100) * 0.15}) 0%, 
              transparent 4%
            ),
            radial-gradient(
              ellipse at 85% 15%, 
              rgba(210, 190, 150, ${(vintageIntensity / 100) * 0.18}) 0%, 
              transparent 2%
            ),
            radial-gradient(
              ellipse at 15% 85%, 
              rgba(180, 160, 120, ${(vintageIntensity / 100) * 0.12}) 0%, 
              transparent 3%
            )
          `,
          mixBlendMode: 'multiply',
          opacity: Math.min(getEffectParam('vintage', 'aging', 40) / 100, 0.7)
        }}
      />
      
      {/* Edge wear and patina */}
      <div
        className="absolute inset-0 z-23"
        style={{
          background: `
            radial-gradient(
              ellipse at center,
              transparent 60%,
              rgba(160, 140, 100, ${(vintageIntensity / 100) * 0.25}) 85%,
              rgba(140, 120, 80, ${(vintageIntensity / 100) * 0.15}) 100%
            )
          `,
          mixBlendMode: 'multiply',
          opacity: Math.min(getEffectParam('vintage', 'aging', 40) / 150, 0.5)
        }}
      />
      
      {/* Paper texture noise */}
      <div
        className="absolute inset-0 z-24"
        style={{
          backgroundImage: `
            radial-gradient(circle at 30% 30%, rgba(230, 220, 200, ${(vintageIntensity / 100) * 0.08}) 1px, transparent 1px),
            radial-gradient(circle at 70% 70%, rgba(240, 230, 210, ${(vintageIntensity / 100) * 0.06}) 1px, transparent 1px),
            radial-gradient(circle at 20% 80%, rgba(225, 215, 195, ${(vintageIntensity / 100) * 0.07}) 1px, transparent 1px)
          `,
          backgroundSize: '15px 15px, 20px 20px, 18px 18px',
          backgroundPosition: '0 0, 10px 10px, 5px 15px',
          mixBlendMode: 'overlay',
          opacity: 0.4
        }}
      />
    </>
  );
};
