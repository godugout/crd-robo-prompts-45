
import React from 'react';

interface CardEffectOverlaysProps {
  effectValues: Record<string, Record<string, any>>;
}

export const CardEffectOverlays: React.FC<CardEffectOverlaysProps> = ({ effectValues }) => {
  console.log('✨ CardEffectOverlays - Rendering with effectValues:', effectValues);

  const renderEffectOverlays = () => {
    const overlays: React.ReactNode[] = [];

    // Holographic sparkle overlay
    if (effectValues.holographic?.intensity > 0) {
      const intensity = effectValues.holographic.intensity / 100;
      overlays.push(
        <div 
          key="holographic-sparkle"
          className="absolute inset-0 pointer-events-none animate-pulse"
          style={{
            background: `radial-gradient(circle at 20% 20%, rgba(255,0,255,${intensity * 0.3}) 0%, transparent 20%),
                        radial-gradient(circle at 80% 30%, rgba(0,255,255,${intensity * 0.3}) 0%, transparent 20%),
                        radial-gradient(circle at 30% 80%, rgba(255,255,0,${intensity * 0.3}) 0%, transparent 20%),
                        radial-gradient(circle at 70% 70%, rgba(255,0,150,${intensity * 0.3}) 0%, transparent 20%)`,
            animation: `holographic-shift 3s infinite ease-in-out`,
            opacity: intensity
          }}
        />
      );
      console.log('🌈 Holographic sparkle overlay added');
    }

    // Chrome reflection overlay
    if (effectValues.chrome?.intensity > 0) {
      const intensity = effectValues.chrome.intensity / 100;
      overlays.push(
        <div 
          key="chrome-reflection"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(45deg, 
              transparent 0%, 
              rgba(255,255,255,${intensity * 0.6}) 45%, 
              rgba(255,255,255,${intensity * 0.8}) 55%, 
              transparent 100%)`,
            animation: `gradient-shift 4s infinite ease-in-out`,
            transform: 'skewX(-15deg)',
            opacity: intensity * 0.7
          }}
        />
      );
      console.log('🪞 Chrome reflection overlay added');
    }

    // Crystal facet overlay
    if (effectValues.crystal?.intensity > 0) {
      const intensity = effectValues.crystal.intensity / 100;
      overlays.push(
        <div 
          key="crystal-facets"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `conic-gradient(from 45deg, 
              rgba(255,255,255,${intensity * 0.4}) 0deg,
              transparent 30deg,
              rgba(200,200,255,${intensity * 0.5}) 60deg,
              transparent 90deg,
              rgba(255,255,255,${intensity * 0.4}) 120deg,
              transparent 150deg,
              rgba(255,200,255,${intensity * 0.5}) 180deg,
              transparent 210deg,
              rgba(255,255,255,${intensity * 0.4}) 240deg,
              transparent 270deg,
              rgba(200,255,255,${intensity * 0.5}) 300deg,
              transparent 330deg,
              rgba(255,255,255,${intensity * 0.4}) 360deg)`,
            animation: `crystal-glow 2s infinite ease-in-out`,
            opacity: intensity * 0.8
          }}
        />
      );
      console.log('💎 Crystal facet overlay added');
    }

    // Gold shimmer overlay
    if (effectValues.gold?.intensity > 0) {
      const intensity = effectValues.gold.intensity / 100;
      overlays.push(
        <div 
          key="gold-shimmer"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `repeating-linear-gradient(45deg,
              transparent 0px,
              rgba(255,215,0,${intensity * 0.4}) 2px,
              rgba(255,223,0,${intensity * 0.6}) 4px,
              rgba(255,215,0,${intensity * 0.4}) 6px,
              transparent 8px,
              transparent 16px)`,
            animation: `sparkle 1.5s infinite ease-in-out`,
            opacity: intensity * 0.9
          }}
        />
      );
      console.log('🥇 Gold shimmer overlay added');
    }

    return overlays;
  };

  const overlays = renderEffectOverlays();
  console.log('✨ CardEffectOverlays - Generated', overlays.length, 'overlay effects');

  return (
    <>
      {overlays}
    </>
  );
};
