
import React, { useEffect, useRef } from 'react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { CardBackMaterial } from '../hooks/useDynamicCardBackMaterials';
import { CardEffectsLayer } from './CardEffectsLayer';

interface PreRenderedCardBackProps {
  comboId: string;
  material: CardBackMaterial;
  effects: EffectValues;
  isActive: boolean;
  isHovering: boolean;
  mousePosition: { x: number; y: number };
  frameStyles: React.CSSProperties;
  enhancedEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
  interactiveLighting?: boolean;
}

export const PreRenderedCardBack: React.FC<PreRenderedCardBackProps> = ({
  comboId,
  material,
  effects,
  isActive,
  isHovering,
  mousePosition,
  frameStyles,
  enhancedEffectStyles,
  SurfaceTexture,
  interactiveLighting = false
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const lastActiveRef = useRef(isActive);

  // Enhanced state change logging and DOM management
  useEffect(() => {
    if (lastActiveRef.current !== isActive) {
      console.log(`🎪 ${comboId} visibility: ${lastActiveRef.current ? 'ACTIVE' : 'HIDDEN'} → ${isActive ? 'ACTIVE' : 'HIDDEN'}`);
      
      // Force DOM update for visibility change
      if (elementRef.current) {
        elementRef.current.style.opacity = isActive ? '1' : '0';
        elementRef.current.style.visibility = isActive ? 'visible' : 'hidden';
        elementRef.current.style.zIndex = isActive ? '10' : '0';
      }
      
      lastActiveRef.current = isActive;
    }
  }, [isActive, comboId]);

  // Enhanced logo effects based on material
  const getLogoEffects = () => {
    const baseTreatment = material.logoTreatment;
    
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
        brightness(${1 + intensity * 0.3})
      `,
      transform: `${baseTreatment.transform} scale(${1 + intensity * 0.05})`,
      opacity: baseTreatment.opacity + intensity * 0.1
    };
  };

  // Dynamic frame styles with material properties
  const dynamicFrameStyles = {
    ...frameStyles,
    background: material.background,
    border: `2px solid ${material.borderColor}`,
    opacity: material.opacity,
    ...(material.blur && {
      backdropFilter: `blur(${material.blur}px)`
    }),
    boxShadow: `
      0 0 30px ${material.borderColor},
      inset 0 0 20px rgba(255, 255, 255, 0.1)
    `
  };

  // Enhanced visibility control with instant switching
  const visibilityStyle = {
    ...dynamicFrameStyles,
    opacity: isActive ? 1 : 0,
    visibility: isActive ? 'visible' : 'hidden',
    zIndex: isActive ? 10 : 0,
    transition: 'opacity 0.1s ease-out, visibility 0s linear',
    backfaceVisibility: 'hidden',
    transform: 'rotateY(180deg)',
    pointerEvents: isActive ? 'auto' : 'none'
  } as React.CSSProperties;

  return (
    <div 
      ref={elementRef}
      className="absolute inset-0 rounded-xl overflow-hidden"
      style={visibilityStyle}
      data-combo={comboId}
      data-material={material.id}
      data-is-active={isActive}
      data-debug-visibility={isActive ? 'visible' : 'hidden'}
    >
      {/* Active combo indicator */}
      {process.env.NODE_ENV === 'development' && isActive && (
        <div className="absolute top-8 right-2 z-50 bg-green-500/90 text-white text-xs px-2 py-1 rounded pointer-events-none font-bold">
          {comboId}
        </div>
      )}

      {/* Effects Layer with combo-specific key for proper re-rendering */}
      <CardEffectsLayer
        key={`effects-${comboId}-${isActive}`}
        showEffects={true}
        isHovering={isHovering}
        effectIntensity={[50]}
        mousePosition={mousePosition}
        physicalEffectStyles={enhancedEffectStyles}
        effectValues={effects}
        interactiveLighting={interactiveLighting}
      />

      {/* Surface Texture */}
      <div className="relative z-20">
        {SurfaceTexture}
      </div>

      {/* Material-specific texture overlay */}
      {material.texture === 'noise' && (
        <div 
          className="absolute inset-0 z-25 opacity-30 mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: '256px 256px'
          }}
        />
      )}

      {/* Material accent overlay */}
      <div 
        className="absolute inset-0 z-26"
        style={{
          background: `radial-gradient(
            circle at 30% 30%, 
            ${material.borderColor} 0%, 
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

      {/* CRD Logo with Material Treatment */}
      <div className="relative h-full flex items-center justify-center z-30">
        <img 
          src="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png" 
          alt="CRD Logo" 
          className="w-64 h-auto relative z-10 transition-all duration-300 ease-out"
          style={{
            ...getLogoEffects(),
            imageRendering: 'crisp-edges',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* Interactive Lighting */}
      {interactiveLighting && isHovering && (
        <div className="absolute inset-0 pointer-events-none z-40">
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(
                  ellipse 200% 150% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                  ${material.borderColor.replace(')', ', 0.08)')} 0%,
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
    </div>
  );
};
