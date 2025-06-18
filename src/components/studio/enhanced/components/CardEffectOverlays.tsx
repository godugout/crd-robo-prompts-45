
import React from 'react';

interface CardEffectOverlaysProps {
  effectValues: Record<string, Record<string, any>>;
}

export const CardEffectOverlays: React.FC<CardEffectOverlaysProps> = ({ effectValues }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <style>
        {`
        @keyframes holographic-shift {
          0% { background-position: 0% 50%; }
          25% { background-position: 100% 50%; }
          50% { background-position: 100% 50%; }
          75% { background-position: 0% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes foil-shimmer {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
        
        @keyframes crystal-sparkle {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        `}
      </style>

      {/* Holographic overlay */}
      {effectValues.holographic?.intensity > 0 && (
        <div
          className="absolute inset-0 rounded-lg overflow-hidden"
          style={{
            background: `linear-gradient(45deg, 
              rgba(255, 0, 150, ${effectValues.holographic.intensity / 200}) 0%, 
              rgba(0, 255, 255, ${effectValues.holographic.intensity / 200}) 25%, 
              rgba(255, 255, 0, ${effectValues.holographic.intensity / 200}) 50%, 
              rgba(255, 0, 150, ${effectValues.holographic.intensity / 200}) 75%, 
              rgba(0, 255, 255, ${effectValues.holographic.intensity / 200}) 100%)`,
            backgroundSize: '400% 400%',
            animation: effectValues.holographic.animated !== false ? 'holographic-shift 3s ease infinite' : 'none',
            mixBlendMode: 'overlay'
          }}
        />
      )}

      {/* Foil Spray overlay */}
      {effectValues.foilspray?.intensity > 0 && (
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at 30% 70%, 
                rgba(255, 215, 0, ${effectValues.foilspray.intensity / 300}) 0%,
                rgba(255, 165, 0, ${effectValues.foilspray.intensity / 400}) 50%,
                transparent 70%)`,
              mixBlendMode: 'multiply'
            }}
          />
          <div
            className="absolute top-0 left-0 w-1/3 h-full opacity-70"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
              animation: 'foil-shimmer 2s ease-in-out infinite'
            }}
          />
        </div>
      )}

      {/* Crystal sparkle overlay */}
      {effectValues.crystal?.intensity > 0 && (
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            background: `repeating-linear-gradient(
              45deg,
              rgba(255, 255, 255, ${effectValues.crystal.intensity / 400}) 0px,
              transparent 2px,
              transparent 10px,
              rgba(255, 255, 255, ${effectValues.crystal.intensity / 500}) 12px
            )`,
            animation: effectValues.crystal.sparkle !== false ? 'crystal-sparkle 2s ease-in-out infinite' : 'none',
            mixBlendMode: 'screen'
          }}
        />
      )}

      {/* Chrome reflection overlay */}
      {effectValues.chrome?.intensity > 0 && (
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            background: `linear-gradient(90deg, 
              transparent 0%,
              rgba(255, 255, 255, ${effectValues.chrome.intensity / 300}) 50%,
              transparent 100%)`,
            mixBlendMode: 'overlay'
          }}
        />
      )}

      {/* Prizm effect overlay */}
      {effectValues.prizm?.intensity > 0 && (
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            background: `conic-gradient(from 0deg, 
              rgba(255, 0, 255, ${effectValues.prizm.intensity / 400}),
              rgba(0, 255, 255, ${effectValues.prizm.intensity / 400}),
              rgba(255, 255, 0, ${effectValues.prizm.intensity / 400}),
              rgba(255, 0, 255, ${effectValues.prizm.intensity / 400}))`,
            mixBlendMode: 'color-dodge'
          }}
        />
      )}

      {/* Gold effect overlay */}
      {effectValues.gold?.intensity > 0 && (
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            background: `linear-gradient(135deg, 
              rgba(255, 215, 0, ${effectValues.gold.intensity / 300}) 0%,
              rgba(255, 165, 0, ${effectValues.gold.intensity / 400}) 50%,
              rgba(255, 215, 0, ${effectValues.gold.intensity / 300}) 100%)`,
            mixBlendMode: 'multiply'
          }}
        />
      )}
    </div>
  );
};
