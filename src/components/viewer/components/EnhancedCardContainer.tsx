
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
  onMouseDown,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  onClick
}) => {
  return (
    <div 
      className={`relative z-20 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        transform: `scale(${zoom})`,
        transition: isDragging ? 'none' : 'transform 0.3s ease',
        filter: 'brightness(1.2) contrast(1.1)'
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
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: 'preserve-3d',
          transition: isDragging ? 'none' : 'transform 0.1s ease',
          filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.8))'
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
          {/* Enhanced Effects Layer */}
          <div 
            className="absolute inset-0 pointer-events-none z-10" 
            style={enhancedEffectStyles}
          />

          {/* Surface Texture */}
          {SurfaceTexture}

          {/* Card Content */}
          <div className="relative h-full p-6 flex flex-col z-20">
            {/* Image Section */}
            {card.image_url && (
              <div className="flex-1 mb-6 relative overflow-hidden rounded-lg">
                <img 
                  src={card.image_url} 
                  alt={card.title}
                  className="w-full h-full object-cover"
                  style={{
                    filter: isHovering ? 'brightness(1.1)' : 'brightness(1)'
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

          {/* Interactive Shine Effect */}
          {isHovering && (
            <div 
              className="absolute inset-0 pointer-events-none z-30"
              style={{
                background: `linear-gradient(105deg, 
                  transparent 40%, 
                  rgba(255, 255, 255, 0.3) 50%, 
                  transparent 60%)`,
                transform: `translateX(${(mousePosition.x - 0.5) * 100}%)`,
                transition: 'transform 0.1s ease'
              }}
            />
          )}
        </div>

        {/* Back of Card */}
        <div 
          className={`absolute inset-0 rounded-xl overflow-hidden ${
            isFlipped ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(-180deg)',
            transition: 'transform 0.6s ease-in-out, opacity 0.3s ease',
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          {/* Back Effects Layer */}
          <div 
            className="absolute inset-0 pointer-events-none z-10 opacity-50" 
            style={enhancedEffectStyles}
          />

          {/* Back Content */}
          <div className="relative h-full p-6 flex flex-col items-center justify-center text-center z-20">
            <div className="w-32 h-32 bg-gradient-to-br from-crd-green to-crd-orange rounded-full mb-6 flex items-center justify-center">
              <span className="text-black font-bold text-2xl">CARD</span>
            </div>
            <h3 className="text-white text-lg font-medium mb-2">Card Back</h3>
            <p className="text-gray-400 text-sm">Click to flip back</p>
          </div>
        </div>
      </div>
    </div>
  );
};
