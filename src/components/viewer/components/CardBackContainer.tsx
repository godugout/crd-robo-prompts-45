
import React from 'react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { CardEffectsLayer } from './CardEffectsLayer';
import { useDynamicCardBackMaterials } from '../hooks/useDynamicCardBackMaterials';

interface CardBackContainerProps {
  isFlipped: boolean;
  isHovering: boolean;
  showEffects: boolean;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  frameStyles: React.CSSProperties;
  enhancedEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
  interactiveLighting?: boolean;
}

export const CardBackContainer: React.FC<CardBackContainerProps> = ({
  isFlipped,
  isHovering,
  showEffects,
  effectValues,
  mousePosition,
  frameStyles,
  enhancedEffectStyles,
  SurfaceTexture,
  interactiveLighting = false
}) => {
  // Get dynamic material based on current effects
  const { selectedMaterial } = useDynamicCardBackMaterials(effectValues);
  
  // Enhanced logo effects based on mouse position, lighting, and material
  const getLogoEffects = () => {
    const baseTreatment = selectedMaterial.logoTreatment;
    
    if (!interactiveLighting || !isHovering) {
      return {
        filter: baseTreatment.filter,
        transform: baseTreatment.transform,
        opacity: baseTreatment.opacity
      };
    }

    const intensity = Math.sqrt(
      Math.pow(mousePosition.x - 0.5, 2) + Math.pow(mousePosition.y - 0.5, 2)
    );
    
    return {
      filter: `
        ${baseTreatment.filter}
        drop-shadow(0 0 ${20 + intensity * 30}px rgba(255, 215, 0, ${0.3 + intensity * 0.4}))
        drop-shadow(0 0 ${40 + intensity * 60}px rgba(59, 130, 246, ${0.2 + intensity * 0.3}))
        brightness(${1 + intensity * 0.3})
        contrast(${1.1 + intensity * 0.2})
      `,
      transform: `${baseTreatment.transform} scale(${1 + intensity * 0.05})`,
      opacity: baseTreatment.opacity + intensity * 0.1
    };
  };

  // Create dynamic frame styles combining base styles with material properties
  const dynamicFrameStyles = {
    ...frameStyles,
    background: selectedMaterial.background,
    border: `1px solid ${selectedMaterial.borderColor}`,
    opacity: selectedMaterial.opacity,
    ...(selectedMaterial.blur && {
      backdropFilter: `blur(${selectedMaterial.blur}px)`
    }),
    transition: 'all 0.6s ease-in-out'
  };

  return (
    <div 
      className={`absolute inset-0 rounded-xl overflow-hidden ${
        isFlipped ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(-180deg)',
        transition: 'transform 0.6s ease-in-out, opacity 0.3s ease',
        backfaceVisibility: 'hidden',
        ...dynamicFrameStyles
      }}
    >
      {/* Back Effects Layer */}
      <CardEffectsLayer
        showEffects={showEffects}
        isHovering={isHovering}
        effectIntensity={[50]} // Keep for backward compatibility
        mousePosition={mousePosition}
        physicalEffectStyles={enhancedEffectStyles}
        effectValues={effectValues}
        interactiveLighting={interactiveLighting}
      />

      {/* Surface Texture on Back */}
      <div className="relative z-20">
        {SurfaceTexture}
      </div>

      {/* Dynamic texture overlay for vintage effect */}
      {selectedMaterial.texture === 'noise' && (
        <div 
          className="absolute inset-0 z-25 opacity-20 mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: '256px 256px'
          }}
        />
      )}

      {/* Enhanced CRD Logo with Dynamic Material Treatment */}
      <div className="relative h-full flex items-center justify-center z-30">
        <img 
          src="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png" 
          alt="CRD Logo" 
          className="w-64 h-auto relative z-10 transition-all duration-500 ease-out"
          style={{
            ...getLogoEffects(),
            imageRendering: 'crisp-edges',
            objectFit: 'contain',
            animation: interactiveLighting && isHovering ? 'logo-glow-pulse 4s ease-in-out infinite' : 'none'
          }}
          onLoad={() => console.log('Enhanced CRD logo loaded successfully')}
          onError={() => console.log('Error loading enhanced CRD logo')}
        />
      </div>

      {/* Enhanced Interactive Lighting with Material Awareness */}
      {interactiveLighting && isHovering && (
        <div className="absolute inset-0 pointer-events-none z-40">
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(
                  ellipse 200% 150% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                  rgba(255, 255, 255, ${selectedMaterial.id === 'crystal' ? 0.04 : 0.02}) 0%,
                  rgba(255, 215, 0, ${selectedMaterial.id === 'gold' ? 0.03 : 0.01}) 30%,
                  rgba(59, 130, 246, ${selectedMaterial.id === 'holographic' ? 0.02 : 0.005}) 60%,
                  transparent 85%
                )
              `,
              mixBlendMode: 'overlay',
              transition: 'opacity 0.2s ease'
            }}
          />
        </div>
      )}
    </div>
  );
};
