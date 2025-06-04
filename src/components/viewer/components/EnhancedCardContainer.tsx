
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import { CardFront } from './CardFront';
import { CardBack } from './CardBack';
import { CardEffectsLayer } from './CardEffectsLayer';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface EnhancedCardContainerProps {
  card: CardData;
  isFlipped: boolean;
  isHovering: boolean;
  showEffects: boolean;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  rotation: { x: number; y: number };
  zoom: number;
  isDragging: boolean;
  frameStyles: React.CSSProperties;
  enhancedEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
  interactiveLighting?: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

export const EnhancedCardContainer: React.FC<EnhancedCardContainerProps> = ({
  card,
  isFlipped,
  isHovering,
  showEffects,
  effectValues,
  mousePosition,
  rotation,
  zoom,
  isDragging,
  frameStyles,
  enhancedEffectStyles,
  SurfaceTexture,
  interactiveLighting = false,
  onMouseDown,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  onClick
}) => {
  // Calculate dynamic lighting effect for 3D transform
  const getDynamicTransform = () => {
    let baseTransform = `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
    
    // Add subtle interactive lighting-based depth effect
    if (interactiveLighting && isHovering) {
      const lightDepth = (mousePosition.x - 0.5) * 2; // -1 to 1
      const additionalRotateY = lightDepth * 2; // Max 2 degrees
      baseTransform = `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y + additionalRotateY}deg)`;
    }
    
    return baseTransform;
  };

  return (
    <div 
      className={`relative z-20 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        transform: `scale(${zoom})`,
        transition: isDragging ? 'none' : 'transform 0.3s ease',
        filter: `brightness(${interactiveLighting && isHovering ? 1.3 : 1.2}) contrast(1.1)`
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Enhanced 3D Card */}
      <div
        className="relative"
        style={{
          width: '400px',
          height: '560px',
          transform: getDynamicTransform(),
          transformStyle: 'preserve-3d',
          transition: isDragging ? 'none' : 'transform 0.1s ease',
          filter: `drop-shadow(0 25px 50px rgba(0,0,0,${interactiveLighting && isHovering ? 0.9 : 0.8}))`
        }}
        onClick={onClick}
      >
        {/* Front of Card */}
        <div 
          className={`absolute inset-0 rounded-xl overflow-hidden ${
            isFlipped ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 0.6s ease-in-out, opacity 0.3s ease',
            backfaceVisibility: 'hidden',
            ...frameStyles
          }}
        >
          {/* Enhanced Effects Layer with Individual Effect Values */}
          <CardEffectsLayer
            showEffects={showEffects}
            isHovering={isHovering}
            effectIntensity={[50]} // Keep for backward compatibility
            mousePosition={mousePosition}
            physicalEffectStyles={enhancedEffectStyles}
            effectValues={effectValues}
            interactiveLighting={interactiveLighting}
          />

          {/* Surface Texture - Now layered properly */}
          <div className="relative z-20">
            {SurfaceTexture}
          </div>

          {/* Card Content */}
          <div className="relative h-full p-6 flex flex-col z-15">
            {/* Image Section */}
            {card.image_url && (
              <div className="flex-1 mb-6 relative overflow-hidden rounded-lg">
                <img 
                  src={card.image_url} 
                  alt={card.title}
                  className="w-full h-full object-cover"
                  style={{
                    filter: isHovering ? 
                      `brightness(${interactiveLighting ? 1.2 : 1.1}) contrast(${interactiveLighting ? 1.1 : 1.05})` : 
                      'brightness(1)'
                  }}
                />
              </div>
            )}
            
            {/* Details Section */}
            <div className="mt-auto p-4 rounded-lg bg-black bg-opacity-60 backdrop-blur-sm">
              <h3 className="text-white text-xl font-bold mb-2">{card.title}</h3>
              {card.description && (
                <p className="text-gray-300 text-sm mb-2">{card.description}</p>
              )}
              {card.rarity && (
                <p className="text-gray-400 text-xs uppercase tracking-wide">{card.rarity}</p>
              )}
            </div>
          </div>

          {/* Interactive Shine Effect - Enhanced with interactive lighting */}
          {isHovering && (
            <div 
              className="absolute inset-0 pointer-events-none z-30"
              style={{
                background: `linear-gradient(105deg, 
                  transparent 40%, 
                  rgba(255, 255, 255, ${interactiveLighting ? 0.7 : 0.5}) 50%, 
                  transparent 60%)`,
                transform: `translateX(${(mousePosition.x - 0.5) * 100}%)`,
                transition: 'transform 0.1s ease',
                mixBlendMode: 'overlay'
              }}
            />
          )}
        </div>

        {/* Back of Card - UPDATED WITH NEW CRD LOGO DESIGN */}
        <div 
          className={`absolute inset-0 rounded-xl overflow-hidden ${
            isFlipped ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(-180deg)',
            transition: 'transform 0.6s ease-in-out, opacity 0.3s ease',
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
            backgroundColor: '#0a0a0a',
            border: '1px solid rgba(255,255,255,0.1)',
            ...frameStyles
          }}
        >
          {/* Back Effects Layer with Individual Effect Values */}
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

          {/* NEW Back Content - Centered CRD Logo Only */}
          <div className="relative h-full flex items-center justify-center z-30">
            <div className="flex items-center justify-center">
              <img 
                src="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png" 
                alt="CRD Logo" 
                className="w-48 h-auto opacity-90"
                style={{
                  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
                }}
                onLoad={() => console.log('EnhancedCardContainer CRD logo loaded successfully')}
                onError={() => console.log('Error loading EnhancedCardContainer CRD logo')}
              />
            </div>
          </div>

          {/* Apply same effects as front for consistency */}
          <div className="absolute inset-0 pointer-events-none z-40">
            {/* Lighting effects overlay */}
            {interactiveLighting && isHovering && (
              <div
                className="absolute inset-0"
                style={{
                  background: `
                    radial-gradient(
                      ellipse 180% 140% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                      rgba(255, 255, 255, 0.02) 0%,
                      rgba(255, 255, 255, 0.01) 50%,
                      transparent 85%
                    )
                  `,
                  mixBlendMode: 'overlay',
                  transition: 'opacity 0.2s ease'
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
