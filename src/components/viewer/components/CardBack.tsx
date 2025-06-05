
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
  
  // Debug logging to see if this component is being used
  console.log('CardBack component rendering with isFlipped:', isFlipped);
  
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
      
      {/* Centered CRD Logo with Responsive Sizing */}
      <div className="relative h-full flex items-center justify-center z-30">
        <div className="flex items-center justify-center">
          <img 
            src="/lovable-uploads/4f657da6-41f2-4015-a9a8-022d755fd472.png"
            srcSet="/lovable-uploads/4f657da6-41f2-4015-a9a8-022d755fd472.png 1x, /lovable-uploads/4f657da6-41f2-4015-a9a8-022d755fd472.png 2x"
            alt="CRD Logo" 
            className={`${getLogoSize()} opacity-90 transition-all duration-300 ease-out`}
            style={{
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
              imageRendering: '-webkit-optimize-contrast',
              objectFit: 'contain'
            }}
            onLoad={() => console.log('Enhanced CRD logo loaded successfully')}
            onError={() => console.log('Error loading enhanced CRD logo')}
          />
        </div>
      </div>

      {/* Unified Effects Layer - Same as front */}
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
