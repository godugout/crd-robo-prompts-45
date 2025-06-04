
import React from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface CrystalEffectProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const CrystalEffect: React.FC<CrystalEffectProps> = ({
  effectValues,
  mousePosition
}) => {
  // Helper function to safely get effect parameter values
  const getEffectParam = (effectId: string, paramId: string, defaultValue: any = 0) => {
    return effectValues?.[effectId]?.[paramId] ?? defaultValue;
  };

  const crystalIntensity = getEffectParam('crystal', 'intensity', 0);

  if (crystalIntensity <= 0) return null;

  // Calculate intensity-based effects for translucency
  const translucencyLevel = Math.max(0, (crystalIntensity / 100) * 0.15);

  return (
    <>
      {/* CSS Keyframes for Dynamic Animations */}
      <style jsx>{`
        @keyframes crystal-glitter-1 {
          0%, 100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(45deg); }
        }
        @keyframes crystal-glitter-2 {
          0%, 100% { opacity: 0; transform: scale(0.3) rotate(90deg); }
          60% { opacity: 0.8; transform: scale(1) rotate(180deg); }
        }
        @keyframes crystal-glitter-3 {
          0%, 100% { opacity: 0; transform: scale(0.8) rotate(180deg); }
          40% { opacity: 1; transform: scale(1.5) rotate(270deg); }
        }
        @keyframes crystal-starburst {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 0.9; transform: scale(1) rotate(90deg); }
        }
        @keyframes crystal-shimmer-wave {
          0% { transform: translateX(-100%) skewX(-15deg); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateX(200%) skewX(-15deg); opacity: 0; }
        }
        @keyframes crystal-prismatic {
          0%, 100% { filter: hue-rotate(0deg); }
          33% { filter: hue-rotate(120deg); }
          66% { filter: hue-rotate(240deg); }
        }
      `}</style>

      {/* Card Translucency Base - Makes the entire card slightly translucent */}
      <div
        className="absolute inset-0 z-5"
        style={{
          background: `rgba(255, 255, 255, ${translucencyLevel})`,
          mixBlendMode: 'normal',
          opacity: 0.6
        }}
      />
      
      {/* Internal Crystal Structure - Appears to be inside the card */}
      <div
        className="absolute inset-0 z-15"
        style={{
          background: `
            radial-gradient(
              ellipse at ${40 + mousePosition.x * 20}% ${40 + mousePosition.y * 20}%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.08}) 0%,
              rgba(248, 252, 255, ${(crystalIntensity / 100) * 0.06}) 30%,
              rgba(240, 248, 255, ${(crystalIntensity / 100) * 0.04}) 60%,
              transparent 85%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.7,
          filter: `blur(${translucencyLevel * 2}px)`,
          transform: 'translateZ(-1px)'
        }}
      />
      
      {/* Subtle Internal Facets - Geometric crystal structure */}
      <div
        className="absolute inset-0 z-16"
        style={{
          background: `
            conic-gradient(
              from ${mousePosition.x * 20}deg at ${50 + mousePosition.x * 15}% ${50 + mousePosition.y * 15}%,
              transparent 0deg,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.12}) 30deg,
              transparent 60deg,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.10}) 90deg,
              transparent 120deg,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.14}) 150deg,
              transparent 180deg,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.10}) 210deg,
              transparent 240deg,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.12}) 270deg,
              transparent 300deg,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.10}) 330deg,
              transparent 360deg
            )
          `,
          maskImage: `
            polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)
          `,
          WebkitMaskImage: `
            polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)
          `,
          mixBlendMode: 'soft-light',
          opacity: 0.5,
          filter: `blur(${translucencyLevel * 1.5}px)`,
          transform: 'translateZ(-0.5px)'
        }}
      />
      
      {/* Light Transmission Through Crystal */}
      <div
        className="absolute inset-0 z-17"
        style={{
          background: `
            linear-gradient(
              ${20 + mousePosition.y * 30}deg,
              transparent 40%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.25}) 48%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.35}) 50%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.25}) 52%,
              transparent 60%
            )
          `,
          maskImage: `
            radial-gradient(
              ellipse at ${30 + mousePosition.x * 40}% ${30 + mousePosition.y * 40}%,
              rgba(255, 255, 255, 0.8) 0%,
              rgba(255, 255, 255, 0.4) 40%,
              rgba(255, 255, 255, 0.1) 70%,
              transparent 100%
            )
          `,
          WebkitMaskImage: `
            radial-gradient(
              ellipse at ${30 + mousePosition.x * 40}% ${30 + mousePosition.y * 40}%,
              rgba(255, 255, 255, 0.8) 0%,
              rgba(255, 255, 255, 0.4) 40%,
              rgba(255, 255, 255, 0.1) 70%,
              transparent 100%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.6,
          filter: `blur(${translucencyLevel}px)`
        }}
      />
      
      {/* Dynamic Glitter Points - Group 1 */}
      <div
        className="absolute inset-0 z-18"
        style={{
          background: `
            radial-gradient(circle at ${25 + mousePosition.x * 50}% ${25 + mousePosition.y * 50}%, 
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.9}) 0%, 
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.4}) 0.5px, 
              transparent 1px),
            radial-gradient(circle at ${75 - mousePosition.x * 30}% ${35 + mousePosition.y * 30}%, 
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.8}) 0%, 
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.3}) 0.8px, 
              transparent 1.2px),
            radial-gradient(circle at ${60 + mousePosition.x * 20}% ${80 - mousePosition.y * 40}%, 
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.7}) 0%, 
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.35}) 0.6px, 
              transparent 1px)
          `,
          backgroundSize: '80px 80px, 100px 100px, 120px 120px',
          mixBlendMode: 'screen',
          opacity: 0.9,
          animation: 'crystal-glitter-1 2.5s ease-in-out infinite'
        }}
      />

      {/* Dynamic Glitter Points - Group 2 */}
      <div
        className="absolute inset-0 z-18"
        style={{
          background: `
            radial-gradient(circle at ${40 + mousePosition.x * 35}% ${60 + mousePosition.y * 25}%, 
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.8}) 0%, 
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.4}) 0.7px, 
              transparent 1.1px),
            radial-gradient(circle at ${20 + mousePosition.x * 60}% ${40 + mousePosition.y * 45}%, 
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.9}) 0%, 
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.3}) 0.4px, 
              transparent 0.8px),
            radial-gradient(circle at ${85 - mousePosition.x * 25}% ${70 - mousePosition.y * 35}%, 
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.7}) 0%, 
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.4}) 0.9px, 
              transparent 1.3px)
          `,
          backgroundSize: '90px 90px, 110px 110px, 130px 130px',
          mixBlendMode: 'screen',
          opacity: 0.8,
          animation: 'crystal-glitter-2 3.2s ease-in-out infinite 0.8s'
        }}
      />

      {/* Starburst Effects */}
      <div
        className="absolute inset-0 z-19"
        style={{
          background: `
            linear-gradient(0deg, transparent 47%, rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.6}) 49%, rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.8}) 50%, rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.6}) 51%, transparent 53%),
            linear-gradient(90deg, transparent 47%, rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.6}) 49%, rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.8}) 50%, rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.6}) 51%, transparent 53%),
            linear-gradient(45deg, transparent 47%, rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.4}) 49%, rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.6}) 50%, rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.4}) 51%, transparent 53%),
            linear-gradient(-45deg, transparent 47%, rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.4}) 49%, rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.6}) 50%, rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.4}) 51%, transparent 53%)
          `,
          backgroundPosition: `
            ${25 + mousePosition.x * 50}% ${25 + mousePosition.y * 50}%,
            ${25 + mousePosition.x * 50}% ${25 + mousePosition.y * 50}%,
            ${75 - mousePosition.x * 30}% ${75 - mousePosition.y * 30}%,
            ${75 - mousePosition.x * 30}% ${75 - mousePosition.y * 30}%
          `,
          backgroundSize: '60px 60px, 60px 60px, 40px 40px, 40px 40px',
          mixBlendMode: 'color-dodge',
          opacity: 0.6,
          animation: 'crystal-starburst 4s ease-in-out infinite 1.5s'
        }}
      />

      {/* Moving Shimmer Wave */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            linear-gradient(
              ${75 + mousePosition.x * 30}deg,
              transparent 0%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.15}) 30%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.4}) 50%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.15}) 70%,
              transparent 100%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.7,
          animation: 'crystal-shimmer-wave 3.5s ease-in-out infinite',
          filter: `blur(${translucencyLevel * 0.5}px)`
        }}
      />

      {/* Prismatic Edge Enhancement */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            linear-gradient(
              ${mousePosition.x * 60}deg,
              rgba(255, 200, 255, ${(crystalIntensity / 100) * 0.06}) 0%,
              rgba(200, 255, 255, ${(crystalIntensity / 100) * 0.05}) 25%,
              rgba(255, 255, 200, ${(crystalIntensity / 100) * 0.06}) 50%,
              rgba(200, 255, 200, ${(crystalIntensity / 100) * 0.05}) 75%,
              rgba(255, 200, 200, ${(crystalIntensity / 100) * 0.06}) 100%
            )
          `,
          maskImage: `
            radial-gradient(
              ellipse at ${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%,
              rgba(255, 255, 255, 0.6) 20%,
              rgba(255, 255, 255, 0.3) 60%,
              rgba(255, 255, 255, 0.1) 80%,
              transparent 100%
            )
          `,
          WebkitMaskImage: `
            radial-gradient(
              ellipse at ${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%,
              rgba(255, 255, 255, 0.6) 20%,
              rgba(255, 255, 255, 0.3) 60%,
              rgba(255, 255, 255, 0.1) 80%,
              transparent 100%
            )
          `,
          mixBlendMode: 'color-dodge',
          opacity: 0.4,
          animation: 'crystal-prismatic 6s ease-in-out infinite',
          filter: `blur(${translucencyLevel * 3}px)`
        }}
      />
    </>
  );
};
