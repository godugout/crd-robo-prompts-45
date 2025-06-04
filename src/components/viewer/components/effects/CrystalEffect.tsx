
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
      <style>{`
        @keyframes crystal-glitter-1 {
          0%, 100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
          25% { opacity: 0.8; transform: scale(1.2) rotate(15deg); }
          50% { opacity: 1; transform: scale(1.5) rotate(45deg); }
          75% { opacity: 0.6; transform: scale(1) rotate(30deg); }
        }
        @keyframes crystal-glitter-2 {
          0%, 100% { opacity: 0; transform: scale(0.3) rotate(90deg); }
          30% { opacity: 0.9; transform: scale(1.3) rotate(120deg); }
          60% { opacity: 0.8; transform: scale(1) rotate(180deg); }
          80% { opacity: 0.4; transform: scale(0.8) rotate(150deg); }
        }
        @keyframes crystal-glitter-3 {
          0%, 100% { opacity: 0; transform: scale(0.8) rotate(180deg); }
          20% { opacity: 0.7; transform: scale(1.4) rotate(210deg); }
          40% { opacity: 1; transform: scale(1.8) rotate(270deg); }
          70% { opacity: 0.5; transform: scale(1.1) rotate(240deg); }
        }
        @keyframes crystal-starburst-1 {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          30% { opacity: 0.9; transform: scale(1.2) rotate(45deg); }
          60% { opacity: 0.7; transform: scale(0.8) rotate(90deg); }
        }
        @keyframes crystal-starburst-2 {
          0%, 100% { opacity: 0; transform: scale(0) rotate(180deg); }
          40% { opacity: 0.8; transform: scale(1) rotate(225deg); }
          80% { opacity: 0.6; transform: scale(0.6) rotate(270deg); }
        }
        @keyframes crystal-shimmer-wave-1 {
          0% { transform: translateX(-120%) skewX(-20deg); opacity: 0; }
          30% { opacity: 0.6; }
          60% { opacity: 0.9; }
          100% { transform: translateX(220%) skewX(-20deg); opacity: 0; }
        }
        @keyframes crystal-shimmer-wave-2 {
          0% { transform: translateY(-120%) skewY(-15deg); opacity: 0; }
          40% { opacity: 0.7; }
          70% { opacity: 0.8; }
          100% { transform: translateY(220%) skewY(-15deg); opacity: 0; }
        }
        @keyframes crystal-prismatic {
          0%, 100% { filter: hue-rotate(0deg) saturate(1.2); }
          25% { filter: hue-rotate(60deg) saturate(1.4); }
          50% { filter: hue-rotate(120deg) saturate(1.6); }
          75% { filter: hue-rotate(180deg) saturate(1.3); }
        }
        @keyframes crystal-facet-glow {
          0%, 100% { opacity: 0.3; transform: scale(1) rotate(0deg); }
          50% { opacity: 0.8; transform: scale(1.1) rotate(5deg); }
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
          transform: 'translateZ(-0.5px)',
          animation: 'crystal-facet-glow 3s ease-in-out infinite'
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
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 1}) 0%, 
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.6}) 1px, 
              transparent 2px),
            radial-gradient(circle at ${75 - mousePosition.x * 30}% ${35 + mousePosition.y * 30}%, 
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.9}) 0%, 
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.4}) 1.5px, 
              transparent 3px),
            radial-gradient(circle at ${60 + mousePosition.x * 20}% ${80 - mousePosition.y * 40}%, 
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.8}) 0%, 
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.5}) 1px, 
              transparent 2.5px)
          `,
          backgroundSize: '50px 50px, 70px 70px, 60px 60px',
          mixBlendMode: 'screen',
          opacity: 0.9,
          animation: 'crystal-glitter-1 2.8s ease-in-out infinite'
        }}
      />

      {/* Dynamic Glitter Points - Group 2 */}
      <div
        className="absolute inset-0 z-18"
        style={{
          background: `
            radial-gradient(circle at ${40 + mousePosition.x * 35}% ${60 + mousePosition.y * 25}%, 
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.9}) 0%, 
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.5}) 1.2px, 
              transparent 2.8px),
            radial-gradient(circle at ${20 + mousePosition.x * 60}% ${40 + mousePosition.y * 45}%, 
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 1}) 0%, 
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.4}) 0.8px, 
              transparent 2px),
            radial-gradient(circle at ${85 - mousePosition.x * 25}% ${70 - mousePosition.y * 35}%, 
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.8}) 0%, 
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.6}) 1.5px, 
              transparent 3.2px)
          `,
          backgroundSize: '65px 65px, 45px 45px, 80px 80px',
          mixBlendMode: 'screen',
          opacity: 0.8,
          animation: 'crystal-glitter-2 3.5s ease-in-out infinite 1.2s'
        }}
      />

      {/* Dynamic Glitter Points - Group 3 */}
      <div
        className="absolute inset-0 z-18"
        style={{
          background: `
            radial-gradient(circle at ${30 + mousePosition.x * 45}% ${50 + mousePosition.y * 35}%, 
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.7}) 0%, 
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.4}) 1px, 
              transparent 2.5px),
            radial-gradient(circle at ${70 + mousePosition.x * 20}% ${25 + mousePosition.y * 55}%, 
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.9}) 0%, 
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.3}) 0.6px, 
              transparent 1.8px)
          `,
          backgroundSize: '55px 55px, 75px 75px',
          mixBlendMode: 'screen',
          opacity: 0.7,
          animation: 'crystal-glitter-3 4.2s ease-in-out infinite 2.1s'
        }}
      />

      {/* Starburst Effects - Group 1 */}
      <div
        className="absolute inset-0 z-19"
        style={{
          background: `
            linear-gradient(0deg, transparent 48%, rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.8}) 49.5%, rgba(255, 255, 255, ${(crystalIntensity / 100) * 1}) 50%, rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.8}) 50.5%, transparent 52%),
            linear-gradient(90deg, transparent 48%, rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.8}) 49.5%, rgba(255, 255, 255, ${(crystalIntensity / 100) * 1}) 50%, rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.8}) 50.5%, transparent 52%),
            linear-gradient(45deg, transparent 48%, rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.6}) 49.5%, rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.8}) 50%, rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.6}) 50.5%, transparent 52%),
            linear-gradient(-45deg, transparent 48%, rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.6}) 49.5%, rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.8}) 50%, rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.6}) 50.5%, transparent 52%)
          `,
          backgroundPosition: `
            ${25 + mousePosition.x * 50}% ${25 + mousePosition.y * 50}%,
            ${25 + mousePosition.x * 50}% ${25 + mousePosition.y * 50}%,
            ${25 + mousePosition.x * 50}% ${25 + mousePosition.y * 50}%,
            ${25 + mousePosition.x * 50}% ${25 + mousePosition.y * 50}%
          `,
          backgroundSize: '30px 30px, 30px 30px, 25px 25px, 25px 25px',
          mixBlendMode: 'color-dodge',
          opacity: 0.7,
          animation: 'crystal-starburst-1 3.8s ease-in-out infinite'
        }}
      />

      {/* Starburst Effects - Group 2 */}
      <div
        className="absolute inset-0 z-19"
        style={{
          background: `
            linear-gradient(22.5deg, transparent 48%, rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.7}) 49.5%, rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.9}) 50%, rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.7}) 50.5%, transparent 52%),
            linear-gradient(112.5deg, transparent 48%, rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.7}) 49.5%, rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.9}) 50%, rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.7}) 50.5%, transparent 52%)
          `,
          backgroundPosition: `
            ${75 - mousePosition.x * 30}% ${75 - mousePosition.y * 30}%,
            ${75 - mousePosition.x * 30}% ${75 - mousePosition.y * 30}%
          `,
          backgroundSize: '35px 35px, 35px 35px',
          mixBlendMode: 'color-dodge',
          opacity: 0.6,
          animation: 'crystal-starburst-2 4.5s ease-in-out infinite 1.8s'
        }}
      />

      {/* Moving Shimmer Wave 1 */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            linear-gradient(
              ${75 + mousePosition.x * 30}deg,
              transparent 0%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.1}) 25%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.4}) 45%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.6}) 50%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.4}) 55%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.1}) 75%,
              transparent 100%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.8,
          animation: 'crystal-shimmer-wave-1 4.2s ease-in-out infinite',
          filter: `blur(${translucencyLevel * 0.5}px)`
        }}
      />

      {/* Moving Shimmer Wave 2 */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            linear-gradient(
              ${45 - mousePosition.y * 25}deg,
              transparent 0%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.08}) 30%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.3}) 47%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.5}) 50%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.3}) 53%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.08}) 70%,
              transparent 100%
            )
          `,
          mixBlendMode: 'soft-light',
          opacity: 0.6,
          animation: 'crystal-shimmer-wave-2 5.1s ease-in-out infinite 2.5s',
          filter: `blur(${translucencyLevel * 0.8}px)`
        }}
      />

      {/* Prismatic Edge Enhancement */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            linear-gradient(
              ${mousePosition.x * 60}deg,
              rgba(255, 200, 255, ${(crystalIntensity / 100) * 0.08}) 0%,
              rgba(200, 255, 255, ${(crystalIntensity / 100) * 0.06}) 20%,
              rgba(255, 255, 200, ${(crystalIntensity / 100) * 0.09}) 40%,
              rgba(200, 255, 200, ${(crystalIntensity / 100) * 0.07}) 60%,
              rgba(255, 200, 200, ${(crystalIntensity / 100) * 0.08}) 80%,
              rgba(220, 220, 255, ${(crystalIntensity / 100) * 0.06}) 100%
            )
          `,
          maskImage: `
            radial-gradient(
              ellipse at ${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%,
              rgba(255, 255, 255, 0.7) 15%,
              rgba(255, 255, 255, 0.4) 50%,
              rgba(255, 255, 255, 0.2) 75%,
              transparent 100%
            )
          `,
          WebkitMaskImage: `
            radial-gradient(
              ellipse at ${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%,
              rgba(255, 255, 255, 0.7) 15%,
              rgba(255, 255, 255, 0.4) 50%,
              rgba(255, 255, 255, 0.2) 75%,
              transparent 100%
            )
          `,
          mixBlendMode: 'color-dodge',
          opacity: 0.5,
          animation: 'crystal-prismatic 6.8s ease-in-out infinite',
          filter: `blur(${translucencyLevel * 2}px)`
        }}
      />
    </>
  );
};
