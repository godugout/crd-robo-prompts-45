
import React from 'react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { CardEffectsLayer } from './CardEffectsLayer';
import { useDynamicCardBackMaterials } from '../hooks/useDynamicCardBackMaterials';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

interface CardBackContainerProps {
  isFlipped: boolean;
  isHovering: boolean;
  showEffects: boolean;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  frameStyles: React.CSSProperties;
  enhancedEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
}

export const CardBackContainer: React.FC<CardBackContainerProps> = ({
  isFlipped,
  isHovering,
  showEffects,
  effectValues,
  mousePosition,
  frameStyles,
  enhancedEffectStyles,
  SurfaceTexture
}) => {
  const { isMobile, isTablet, currentBreakpoint } = useResponsiveLayout();
  
  // Get dynamic material based on current effects
  const { selectedMaterial } = useDynamicCardBackMaterials(effectValues);
  
  // Enhanced responsive logo sizing
  const getLogoSize = () => {
    if (isMobile) return 'w-32 h-auto'; // 128px
    if (isTablet) return 'w-48 h-auto'; // 192px
    if (currentBreakpoint === '2xl') return 'w-80 h-auto'; // 320px for extra large
    return 'w-64 h-auto'; // 256px for desktop
  };
  
  // Enhanced logo effects based on material
  const getLogoEffects = () => {
    const baseTreatment = selectedMaterial.logoTreatment;
    
    return {
      filter: baseTreatment.filter,
      transform: baseTreatment.transform,
      opacity: baseTreatment.opacity,
      imageRendering: '-webkit-optimize-contrast' as const,
      objectFit: 'contain' as const
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
      />

      {/* Surface Texture on Back */}
      <div className="relative z-20">
        {SurfaceTexture}
      </div>

      {/* Enhanced dynamic texture overlay */}
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

      {/* Material-specific accent overlay */}
      <div 
        className="absolute inset-0 z-26"
        style={{
          background: `radial-gradient(
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

      {/* Enhanced CRD Logo with Dynamic Material Treatment and New Gradient Logo */}
      <div className="relative h-full flex items-center justify-center z-30">
        <img 
          src="/lovable-uploads/f8aeaf57-4a95-4ebe-8874-2df97ff6adf6.png"
          alt="CRD Logo" 
          className={`${getLogoSize()} relative z-10 transition-all duration-700 ease-out`}
          style={{
            ...getLogoEffects(),
            filter: `${getLogoEffects().filter} drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))`
          }}
          onLoad={() => console.log('✅ Enhanced responsive gradient CRD logo loaded successfully')}
          onError={(e) => {
            console.error('❌ Error loading enhanced responsive gradient CRD logo');
            // Enhanced fallback handling
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const fallback = document.createElement('div');
            fallback.className = 'text-white/70 text-3xl font-bold tracking-wider';
            fallback.style.filter = 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))';
            fallback.textContent = 'CRD';
            target.parentNode?.appendChild(fallback);
          }}
        />
      </div>

      {/* CSS animations */}
      <style>
        {`
          @keyframes noise-shift {
            0% { transform: translate(0, 0); }
            100% { transform: translate(-20px, -20px); }
          }
        `}
      </style>
    </div>
  );
};
