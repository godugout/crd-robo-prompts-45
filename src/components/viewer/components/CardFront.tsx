
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import { CardEffectsLayer } from './CardEffectsLayer';

interface CardFrontProps {
  card: CardData;
  isFlipped: boolean;
  isHovering: boolean;
  showEffects: boolean;
  effectIntensity: number[];
  mousePosition: { x: number; y: number };
  physicalEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
  frameStyles?: React.CSSProperties;
  effectValues?: any;
  materialSettings?: any;
  interactiveLighting?: boolean;
}

export const CardFront: React.FC<CardFrontProps> = ({
  card,
  isFlipped,
  isHovering,
  showEffects,
  effectIntensity,
  mousePosition,
  physicalEffectStyles,
  SurfaceTexture,
  frameStyles,
  effectValues,
  materialSettings,
  interactiveLighting
}) => {
  return (
    <div
      className="absolute inset-0 rounded-xl overflow-hidden backface-hidden"
      style={{
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        backfaceVisibility: 'hidden',
        ...frameStyles
      }}
    >
      {/* Base Layer */}
      <div className="absolute inset-0" style={physicalEffectStyles} />
      
      {/* Image Layer */}
      {card.image_url && (
        <div className="absolute inset-0 z-10">
          <img 
            src={card.image_url} 
            alt={card.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Surface Texture Layer */}
      <div className="absolute inset-0 z-15">
        {SurfaceTexture}
      </div>
      
      {/* Unified Effects Layer */}
      <CardEffectsLayer
        showEffects={showEffects}
        isHovering={isHovering}
        effectIntensity={effectIntensity}
        mousePosition={mousePosition}
        physicalEffectStyles={physicalEffectStyles}
        materialSettings={materialSettings}
        interactiveLighting={interactiveLighting}
        effectValues={effectValues}
      />
      
      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        <div className="bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-16">
          <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
            {card.title}
          </h2>
          {card.description && (
            <p className="text-sm text-gray-200 leading-relaxed drop-shadow-md">
              {card.description}
            </p>
          )}
          {card.rarity && (
            <div className="mt-3">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                card.rarity === 'legendary' ? 'bg-yellow-500 text-black' :
                card.rarity === 'epic' ? 'bg-purple-500 text-white' :
                card.rarity === 'rare' ? 'bg-blue-500 text-white' :
                card.rarity === 'uncommon' ? 'bg-green-500 text-white' :
                'bg-gray-500 text-white'
              }`}>
                {card.rarity}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
