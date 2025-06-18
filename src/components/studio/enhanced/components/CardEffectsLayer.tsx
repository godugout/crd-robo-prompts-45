
import React from 'react';

interface CardEffectsLayerProps {
  effectValues: Record<string, Record<string, any>>;
  children: React.ReactNode;
}

export const CardEffectsLayer: React.FC<CardEffectsLayerProps> = ({ effectValues, children }) => {
  console.log('🎨 CardEffectsLayer - Rendering with effectValues:', effectValues);

  const getEffectStyles = () => {
    const styles: React.CSSProperties = {};
    let hasActiveEffects = false;

    // Holographic Effect - Rainbow shifting with prismatic effects
    if (effectValues.holographic?.intensity > 0) {
      hasActiveEffects = true;
      const intensity = effectValues.holographic.intensity / 100;
      styles.filter = `${styles.filter || ''} hue-rotate(${intensity * 180}deg) saturate(${1 + intensity})`;
      styles.background = `linear-gradient(45deg, 
        rgba(255,0,150,${intensity * 0.3}) 0%, 
        rgba(0,255,255,${intensity * 0.2}) 25%, 
        rgba(255,255,0,${intensity * 0.3}) 50%, 
        rgba(255,0,255,${intensity * 0.2}) 75%, 
        rgba(0,255,150,${intensity * 0.3}) 100%)`;
      styles.backgroundBlendMode = 'overlay';
      console.log('🌈 Holographic effect applied:', intensity);
    }

    // Chrome Effect - Metallic mirror-like reflections
    if (effectValues.chrome?.intensity > 0) {
      hasActiveEffects = true;
      const intensity = effectValues.chrome.intensity / 100;
      styles.filter = `${styles.filter || ''} contrast(${1 + intensity * 0.5}) brightness(${1 + intensity * 0.3})`;
      styles.background = `${styles.background || ''}, linear-gradient(135deg, 
        rgba(192,192,192,${intensity * 0.4}) 0%, 
        rgba(255,255,255,${intensity * 0.6}) 25%, 
        rgba(169,169,169,${intensity * 0.3}) 50%, 
        rgba(255,255,255,${intensity * 0.5}) 75%, 
        rgba(192,192,192,${intensity * 0.4}) 100%)`;
      styles.backgroundBlendMode = 'multiply';
      console.log('🪞 Chrome effect applied:', intensity);
    }

    // Crystal Effect - Crystalline faceted surface with light dispersion
    if (effectValues.crystal?.intensity > 0) {
      hasActiveEffects = true;
      const intensity = effectValues.crystal.intensity / 100;
      styles.filter = `${styles.filter || ''} brightness(${1 + intensity * 0.4}) contrast(${1 + intensity * 0.3})`;
      styles.background = `${styles.background || ''}, repeating-linear-gradient(45deg,
        rgba(255,255,255,${intensity * 0.2}) 0px,
        transparent 2px,
        rgba(200,200,255,${intensity * 0.3}) 4px,
        transparent 6px,
        rgba(255,255,255,${intensity * 0.2}) 8px)`;
      styles.backgroundBlendMode = 'screen';
      console.log('💎 Crystal effect applied:', intensity);
    }

    // Gold Effect - Luxurious gold plating with authentic shimmer
    if (effectValues.gold?.intensity > 0) {
      hasActiveEffects = true;
      const intensity = effectValues.gold.intensity / 100;
      styles.filter = `${styles.filter || ''} sepia(${intensity}) hue-rotate(30deg) saturate(${1 + intensity})`;
      styles.background = `${styles.background || ''}, linear-gradient(45deg,
        rgba(255,215,0,${intensity * 0.4}) 0%,
        rgba(255,223,0,${intensity * 0.6}) 25%,
        rgba(255,215,0,${intensity * 0.3}) 50%,
        rgba(255,223,0,${intensity * 0.5}) 75%,
        rgba(255,215,0,${intensity * 0.4}) 100%)`;
      styles.backgroundBlendMode = 'multiply';
      console.log('🥇 Gold effect applied:', intensity);
    }

    // Foil Spray Effect - Metallic spray pattern with directional flow
    if (effectValues.foilspray?.intensity > 0) {
      hasActiveEffects = true;
      const intensity = effectValues.foilspray.intensity / 100;
      styles.filter = `${styles.filter || ''} brightness(${1 + intensity * 0.2}) saturate(${1 + intensity * 0.5})`;
      styles.background = `${styles.background || ''}, radial-gradient(ellipse at center,
        rgba(200,200,200,${intensity * 0.3}) 0%,
        rgba(255,255,255,${intensity * 0.4}) 30%,
        rgba(180,180,180,${intensity * 0.2}) 60%,
        transparent 80%)`;
      styles.backgroundBlendMode = 'overlay';
      console.log('✨ Foil Spray effect applied:', intensity);
    }

    // Prizm Effect - Geometric prismatic patterns with color separation
    if (effectValues.prizm?.intensity > 0) {
      hasActiveEffects = true;
      const intensity = effectValues.prizm.intensity / 100;
      styles.filter = `${styles.filter || ''} hue-rotate(${intensity * 90}deg) saturate(${1 + intensity * 0.8})`;
      styles.background = `${styles.background || ''}, conic-gradient(from 0deg,
        rgba(255,0,100,${intensity * 0.3}) 0deg,
        rgba(0,255,255,${intensity * 0.4}) 60deg,
        rgba(255,255,0,${intensity * 0.3}) 120deg,
        rgba(255,0,255,${intensity * 0.4}) 180deg,
        rgba(0,255,100,${intensity * 0.3}) 240deg,
        rgba(100,100,255,${intensity * 0.4}) 300deg,
        rgba(255,0,100,${intensity * 0.3}) 360deg)`;
      styles.backgroundBlendMode = 'color-burn';
      console.log('🔮 Prizm effect applied:', intensity);
    }

    if (hasActiveEffects) {
      console.log('🎨 CardEffectsLayer - Final computed styles:', styles);
    } else {
      console.log('🎨 CardEffectsLayer - No active effects detected');
    }

    return styles;
  };

  const effectStyles = getEffectStyles();
  const hasEffects = Object.keys(effectStyles).length > 0;

  return (
    <div className="relative w-full h-full">
      {/* Base image */}
      <div className="absolute inset-0">
        {children}
      </div>
      
      {/* Effects overlay */}
      {hasEffects && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={effectStyles}
        />
      )}
    </div>
  );
};
