
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
    
    // Enhanced effects for specific materials
    const materialSpecificEffects = selectedMaterial.id === 'starlight' 
      ? `drop-shadow(0 0 ${30 + intensity * 50}px rgba(255, 107, 53, ${0.4 + intensity * 0.5}))
         drop-shadow(0 0 ${50 + intensity * 70}px rgba(79, 172, 254, ${0.3 + intensity * 0.4}))`
      : selectedMaterial.id === 'gold'
      ? `drop-shadow(0 0 ${25 + intensity * 40}px rgba(255, 215, 0, ${0.5 + intensity * 0.6}))
         drop-shadow(0 0 ${15 + intensity * 25}px rgba(255, 255, 255, ${0.3 + intensity * 0.4}))`
      : `drop-shadow(0 0 ${20 + intensity * 30}px rgba(255, 215, 0, ${0.3 + intensity * 0.4}))
         drop-shadow(0 0 ${40 + intensity * 60}px rgba(59, 130, 246, ${0.2 + intensity * 0.3}))`;
    
    return {
      filter: `
        ${baseTreatment.filter}
        ${materialSpecificEffects}
        brightness(${1 + intensity * 0.4})
        contrast(${1.1 + intensity * 0.3})
      `,
      transform: `${baseTreatment.transform} scale(${1 + intensity * 0.08})`,
      opacity: baseTreatment.opacity + intensity * 0.15
    };
  };

  // Create dynamic frame styles combining base styles with material properties
  const dynamicFrameStyles = {
    ...frameStyles,
    background: selectedMaterial.background,
    border: `2px solid ${selectedMaterial.borderColor}`,
    opacity: selectedMaterial.opacity,
    ...(selectedMaterial.blur && {
      backdropFilter: `blur(${selectedMaterial.blur}px)`
    }),
    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: `
      0 0 30px ${selectedMaterial.borderColor},
      inset 0 0 20px rgba(255, 255, 255, 0.1)
    `
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
      data-material={selectedMaterial.id}
      data-material-name={selectedMaterial.name}
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

      {/* Enhanced dynamic texture overlays */}
      {selectedMaterial.texture === 'noise' && (
        <div 
          className="absolute inset-0 z-25 opacity-30 mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: '256px 256px',
            animation: 'noise-shift 8s ease-in-out infinite alternate'
          }}
        />
      )}

      {/* Starlight cosmic texture */}
      {selectedMaterial.texture === 'stars' && (
        <>
          <div 
            className="absolute inset-0 z-25 opacity-40"
            style={{
              background: `
                radial-gradient(1px 1px at 20px 30px, rgba(255, 255, 255, 0.8), transparent),
                radial-gradient(1px 1px at 40px 70px, rgba(255, 210, 63, 0.6), transparent),
                radial-gradient(1px 1px at 90px 40px, rgba(79, 172, 254, 0.7), transparent),
                radial-gradient(1px 1px at 130px 80px, rgba(255, 255, 255, 0.9), transparent),
                radial-gradient(1px 1px at 160px 30px, rgba(255, 107, 53, 0.8), transparent)
              `,
              backgroundRepeat: 'repeat',
              backgroundSize: '200px 100px',
              animation: 'starlight-twinkle 6s ease-in-out infinite alternate'
            }}
          />
          <div 
            className="absolute inset-0 z-26 opacity-20"
            style={{
              background: `
                radial-gradient(ellipse 300% 100% at 50% 0%, rgba(255, 107, 53, 0.3) 0%, transparent 40%),
                radial-gradient(ellipse 200% 80% at 80% 100%, rgba(79, 172, 254, 0.4) 0%, transparent 50%)
              `,
              animation: 'cosmic-drift 12s ease-in-out infinite alternate'
            }}
          />
        </>
      )}

      {/* Material-specific accent overlay */}
      <div 
        className="absolute inset-0 z-27"
        style={{
          background: selectedMaterial.id === 'starlight' 
            ? `radial-gradient(
                circle at 30% 30%, 
                rgba(255, 107, 53, 0.2) 0%, 
                transparent 40%
              ), radial-gradient(
                circle at 70% 70%, 
                rgba(79, 172, 254, 0.15) 0%, 
                transparent 30%
              )`
            : selectedMaterial.id === 'gold'
            ? `radial-gradient(
                circle at 40% 20%, 
                rgba(255, 255, 255, 0.3) 0%, 
                transparent 35%
              ), radial-gradient(
                circle at 60% 80%, 
                rgba(255, 215, 0, 0.2) 0%, 
                transparent 40%
              )`
            : `radial-gradient(
                circle at 30% 30%, 
                ${selectedMaterial.borderColor} 0%, 
                transparent 40%
              ), radial-gradient(
                circle at 70% 70%, 
                rgba(255, 255, 255, 0.1) 0%, 
                transparent 30%
              )`,
          mixBlendMode: 'overlay',
          opacity: 0.6
        }}
      />

      {/* Enhanced CRD Logo with Dynamic Material Treatment */}
      <div className="relative h-full flex items-center justify-center z-30">
        <img 
          src="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png" 
          alt="CRD Logo" 
          className="w-64 h-auto relative z-10 transition-all duration-700 ease-out"
          style={{
            ...getLogoEffects(),
            imageRendering: 'crisp-edges',
            objectFit: 'contain',
            animation: interactiveLighting && isHovering ? 'logo-glow-pulse 4s ease-in-out infinite' : 'none'
          }}
          onLoad={() => console.log('✅ Enhanced CRD logo loaded successfully')}
          onError={() => console.log('❌ Error loading enhanced CRD logo')}
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
                  ${selectedMaterial.borderColor.replace(')', ', 0.08)')} 0%,
                  rgba(255, 255, 255, 0.03) 30%,
                  transparent 70%
                )
              `,
              mixBlendMode: 'overlay',
              transition: 'opacity 0.2s ease'
            }}
          />
        </div>
      )}

      {/* Enhanced CSS animations */}
      <style>
        {`
          @keyframes noise-shift {
            0% { transform: translate(0, 0); }
            100% { transform: translate(-20px, -20px); }
          }
          
          @keyframes starlight-twinkle {
            0% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.1); }
            100% { opacity: 0.4; transform: scale(1); }
          }
          
          @keyframes cosmic-drift {
            0% { transform: translateX(0) rotate(0deg); }
            100% { transform: translateX(-10px) rotate(2deg); }
          }
          
          @keyframes logo-glow-pulse {
            0% { filter: brightness(1) drop-shadow(0 0 20px rgba(255, 255, 255, 0.3)); }
            50% { filter: brightness(1.2) drop-shadow(0 0 40px rgba(255, 255, 255, 0.6)); }
            100% { filter: brightness(1) drop-shadow(0 0 20px rgba(255, 255, 255, 0.3)); }
          }
        `}
      </style>
    </div>
  );
};
