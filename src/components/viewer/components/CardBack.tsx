
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import { CardEffectsLayer } from './CardEffectsLayer';
import { useDynamicCardBackMaterials } from '../hooks/useDynamicCardBackMaterials';
import { useEffectContext } from '../contexts/EffectContext';

interface CardBackProps {
  card: CardData;
  isFlipped: boolean;
  physicalEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
}

export const CardBack: React.FC<CardBackProps> = ({
  card,
  isFlipped,
  physicalEffectStyles,
  SurfaceTexture
}) => {
  // Get effect data from context
  const {
    isHovering,
    showEffects,
    effectIntensity,
    mousePosition,
    effectValues,
    materialSettings,
    interactiveLighting
  } = useEffectContext();

  // Get dynamic material based on card metadata and effects
  const { selectedMaterial } = useDynamicCardBackMaterials(effectValues || {}, card);
  
  console.log('CardBack: Selected material for card:', card.title, 'Material:', selectedMaterial.name);

  return (
    <div className="absolute inset-0 rounded-xl overflow-hidden">
      {/* Dynamic Material Background Base - z-index 10 */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          background: selectedMaterial.background,
          opacity: selectedMaterial.opacity,
          filter: selectedMaterial.blur ? `blur(${selectedMaterial.blur}px)` : undefined,
          borderColor: selectedMaterial.borderColor,
          transition: 'all 0.5s ease'
        }}
      />
      
      {/* Enhanced Surface Texture Layer - z-index 20 */}
      <div className="absolute inset-0 z-20" style={{ opacity: 0.6 }}>
        {SurfaceTexture}
      </div>
      
      {/* Material-specific texture overlay - z-index 25 */}
      {selectedMaterial.texture && (
        <div 
          className="absolute inset-0 z-25"
          style={{
            background: selectedMaterial.texture === 'noise' 
              ? `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
              : undefined,
            opacity: 0.1,
            mixBlendMode: 'overlay'
          }}
        />
      )}
      
      {/* Centered CRD Logo with Dynamic Treatment - z-index 30 */}
      <div className="absolute inset-0 flex items-center justify-center z-30">
        <div className="flex items-center justify-center">
          <img 
            src="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png" 
            alt="CRD Logo" 
            className="w-48 h-auto transition-all duration-500 ease-in-out"
            style={{
              filter: selectedMaterial.logoTreatment.filter,
              opacity: selectedMaterial.logoTreatment.opacity,
              transform: selectedMaterial.logoTreatment.transform,
            }}
            onLoad={() => console.log('CardBack: CRD logo loaded with material:', selectedMaterial.name)}
            onError={() => console.error('CardBack: Error loading CRD logo')}
          />
        </div>
      </div>

      {/* Material-specific accent patterns - z-index 35 */}
      {selectedMaterial.id === 'holographic' && (
        <div 
          className="absolute inset-0 z-35"
          style={{
            background: `
              conic-gradient(
                from ${mousePosition.x * 360}deg at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                rgba(138, 43, 226, 0.1) 0deg,
                rgba(255, 0, 128, 0.1) 90deg,
                rgba(0, 255, 255, 0.1) 180deg,
                rgba(138, 43, 226, 0.1) 270deg,
                rgba(138, 43, 226, 0.1) 360deg
              )
            `,
            opacity: isHovering ? 0.6 : 0.3,
            transition: 'opacity 0.3s ease',
            mixBlendMode: 'screen'
          }}
        />
      )}

      {selectedMaterial.id === 'crystal' && (
        <div 
          className="absolute inset-0 z-35"
          style={{
            background: `
              radial-gradient(
                ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                rgba(123, 179, 189, 0.2) 0%,
                rgba(123, 179, 189, 0.1) 40%,
                transparent 80%
              )
            `,
            opacity: isHovering ? 0.8 : 0.4,
            transition: 'opacity 0.3s ease',
            mixBlendMode: 'overlay'
          }}
        />
      )}

      {selectedMaterial.id === 'gold' && (
        <div 
          className="absolute inset-0 z-35"
          style={{
            background: `
              linear-gradient(
                ${mousePosition.x * 180}deg,
                rgba(255, 215, 0, 0.15) 0%,
                rgba(255, 223, 0, 0.25) 50%,
                rgba(255, 215, 0, 0.15) 100%
              )
            `,
            opacity: isHovering ? 0.7 : 0.4,
            transition: 'opacity 0.3s ease',
            mixBlendMode: 'screen'
          }}
        />
      )}

      {/* Effects Layer - z-index 40 - Above everything else */}
      <CardEffectsLayer />

      {/* Material-specific border enhancement - z-index 45 */}
      <div 
        className="absolute inset-0 z-45 rounded-xl pointer-events-none"
        style={{
          border: `2px solid ${selectedMaterial.borderColor}`,
          opacity: showEffects ? 0.6 : 0.3,
          transition: 'opacity 0.3s ease'
        }}
      />
    </div>
  );
};
