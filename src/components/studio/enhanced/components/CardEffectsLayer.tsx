
import React from 'react';

interface CardEffectsLayerProps {
  effectValues: Record<string, Record<string, any>>;
  children: React.ReactNode;
}

export const CardEffectsLayer: React.FC<CardEffectsLayerProps> = ({ effectValues, children }) => {
  const generateCardEffectStyles = (): React.CSSProperties => {
    console.log('CardEffectsLayer - Generating effects for card surface:', effectValues);
    
    const styles: React.CSSProperties = {};
    const filters: string[] = [];
    let hasActiveEffects = false;

    // Holographic effect
    if (effectValues.holographic?.intensity > 0) {
      hasActiveEffects = true;
      const intensity = effectValues.holographic.intensity / 100;
      console.log('Applying holographic effect to card surface, intensity:', intensity);
      
      filters.push(`hue-rotate(${(effectValues.holographic.shiftSpeed || 100) * 0.01 * 360}deg)`);
      filters.push(`saturate(${1 + intensity * 0.8})`);
      filters.push(`brightness(${1 + intensity * 0.2})`);
    }

    // Foil Spray effect
    if (effectValues.foilspray?.intensity > 0) {
      hasActiveEffects = true;
      const intensity = effectValues.foilspray.intensity / 100;
      console.log('Applying foil spray effect to card surface, intensity:', intensity);
      
      filters.push(`contrast(${1 + intensity * 0.4})`);
      filters.push(`saturate(${1 + intensity * 0.6})`);
    }

    // Prizm effect
    if (effectValues.prizm?.intensity > 0) {
      hasActiveEffects = true;
      const intensity = effectValues.prizm.intensity / 100;
      console.log('Applying prizm effect to card surface, intensity:', intensity);
      
      filters.push(`contrast(${1 + intensity * 0.5})`);
      filters.push(`hue-rotate(${intensity * 180}deg)`);
    }

    // Chrome effect
    if (effectValues.chrome?.intensity > 0) {
      hasActiveEffects = true;
      const intensity = effectValues.chrome.intensity / 100;
      console.log('Applying chrome effect to card surface, intensity:', intensity);
      
      filters.push(`contrast(${1 + intensity * 0.3})`);
      filters.push(`brightness(${1 + intensity * 0.2})`);
      filters.push(`saturate(${0.5 + intensity * 0.5})`);
    }

    // Crystal effect
    if (effectValues.crystal?.intensity > 0) {
      hasActiveEffects = true;
      const intensity = effectValues.crystal.intensity / 100;
      console.log('Applying crystal effect to card surface, intensity:', intensity);
      
      filters.push(`brightness(${1 + intensity * 0.4})`);
      filters.push(`contrast(${1 + intensity * 0.6})`);
      
      if (effectValues.crystal.sparkle) {
        styles.boxShadow = `inset 0 0 ${30 * intensity}px rgba(255, 255, 255, ${0.4 * intensity})`;
      }
    }

    // Gold effect
    if (effectValues.gold?.intensity > 0) {
      hasActiveEffects = true;
      const intensity = effectValues.gold.intensity / 100;
      console.log('Applying gold effect to card surface, intensity:', intensity);
      
      filters.push(`sepia(${intensity * 0.9})`);
      filters.push(`saturate(${1 + intensity * 0.7})`);
      filters.push(`hue-rotate(${effectValues.gold.goldTone === 'rose' ? '30deg' : '45deg'})`);
      
      if (effectValues.gold.colorEnhancement) {
        filters.push(`brightness(${1 + intensity * 0.15})`);
      }
    }

    if (filters.length > 0) {
      styles.filter = filters.join(' ');
      console.log('Applied card surface filters:', styles.filter);
    }

    styles.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    
    return styles;
  };

  return (
    <div className="relative w-full h-full" style={generateCardEffectStyles()}>
      {children}
    </div>
  );
};
