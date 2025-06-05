
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import { CardEffectsLayer } from './CardEffectsLayer';

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
  // Debug logging to see if this component is being used
  console.log('CardBack component rendering with isFlipped:', isFlipped);
  
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
      
      {/* Centered CRD Logo Only */}
      <div className="relative h-full flex items-center justify-center z-30">
        <div className="flex items-center justify-center">
          <img 
            src="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png" 
            alt="CRD Logo" 
            className="w-48 h-auto opacity-90"
            style={{
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
            }}
            onLoad={() => console.log('New CRD logo loaded successfully')}
            onError={() => console.log('Error loading new CRD logo')}
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
