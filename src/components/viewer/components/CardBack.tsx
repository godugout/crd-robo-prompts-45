
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import { CardEffectsLayer } from './CardEffectsLayer';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

interface CardBackProps {
  card: CardData;
  isFlipped: boolean;
  isHovering: boolean;
  showEffects: boolean;
  effectIntensity: number[];
  mousePosition: { x: number; y: number };
  physicalEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
}

export const CardBack: React.FC<CardBackProps> = ({
  card,
  isFlipped,
  isHovering,
  showEffects,
  effectIntensity,
  mousePosition,
  physicalEffectStyles,
  SurfaceTexture
}) => {
  const { isMobile, isTablet } = useResponsiveLayout();
  
  // Responsive logo sizing for card backs
  const getLogoSize = () => {
    if (isMobile) return 'w-32 h-auto'; // 128px
    if (isTablet) return 'w-48 h-auto'; // 192px
    return 'w-64 h-auto'; // 256px for desktop
  };
  
  return (
    <div
      className="absolute inset-0 rounded-xl overflow-hidden backface-hidden"
      style={{
        transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(-180deg)',
        backfaceVisibility: 'hidden'
      }}
    >
      {/* Dark Pattern Background Base */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)
          `,
          backgroundColor: '#0a0a0a'
        }}
      />
      
      {/* Surface Texture Layer on Back */}
      <div className="absolute inset-0 z-20">
        {SurfaceTexture}
      </div>
      
      {/* Centered CRD Logo with Responsive Sizing and Updated Source */}
      <div className="relative h-full flex items-center justify-center z-30">
        <div className="flex items-center justify-center">
          <img 
            src="/lovable-uploads/f8aeaf57-4a95-4ebe-8874-2df97ff6adf6.png"
            alt="CRD Logo" 
            className={`${getLogoSize()} opacity-90 transition-all duration-300 ease-out`}
            style={{
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
              imageRendering: '-webkit-optimize-contrast',
              objectFit: 'contain'
            }}
            onLoad={() => console.log('✅ New gradient CRD logo loaded successfully')}
            onError={(e) => {
              console.error('❌ Error loading new gradient CRD logo');
              // Fallback to text if image fails
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = document.createElement('div');
              fallback.className = 'text-white/60 text-2xl font-bold';
              fallback.textContent = 'CRD';
              target.parentNode?.appendChild(fallback);
            }}
          />
        </div>
      </div>

      {/* Unified Effects Layer */}
      <CardEffectsLayer
        showEffects={showEffects}
        isHovering={isHovering}
        effectIntensity={effectIntensity}
        mousePosition={mousePosition}
        physicalEffectStyles={physicalEffectStyles}
      />
    </div>
  );
};
