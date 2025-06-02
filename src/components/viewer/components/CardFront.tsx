
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
  frameStyles: React.CSSProperties;
  physicalEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
}

export const CardFront: React.FC<CardFrontProps> = ({
  card,
  isFlipped,
  isHovering,
  showEffects,
  effectIntensity,
  mousePosition,
  frameStyles,
  physicalEffectStyles,
  SurfaceTexture
}) => {
  return (
    <div
      className="absolute inset-0 rounded-xl overflow-hidden backface-hidden"
      style={{
        ...frameStyles,
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        backfaceVisibility: 'hidden'
      }}
    >
      {/* Base Card Layer - z-index 1 */}
      <div className="absolute inset-0 z-10" style={frameStyles} />
      
      {/* Surface Texture Layer - z-index 2 */}
      <div className="absolute inset-0 z-20">
        {SurfaceTexture}
      </div>
      
      {/* Card Content - z-index 3 */}
      <div className="relative h-full p-6 flex flex-col z-30">
        {/* Image Section */}
        {card.image_url && (
          <div className="flex-1 mb-6 relative overflow-hidden rounded-lg">
            <img 
              src={card.image_url} 
              alt={card.title}
              className="w-full h-full object-cover"
            />
            {/* Image overlay effects */}
            {showEffects && (
              <div className="absolute inset-0 mix-blend-overlay">
                <div className="w-full h-full bg-gradient-to-br from-transparent via-white to-transparent opacity-20" />
              </div>
            )}
          </div>
        )}
        
        {/* Details Section */}
        <div className={`mt-auto p-4 rounded-lg ${
          card.template_id === 'neon'
            ? 'bg-black bg-opacity-80'
            : 'bg-white bg-opacity-90'
        }`}>
          <h2 className={`text-2xl font-bold mb-1 ${
            card.template_id === 'neon'
              ? 'text-white'
              : 'text-gray-900'
          }`}>
            {card.title}
          </h2>
          {card.description && (
            <p className={`text-lg ${
              card.template_id === 'neon'
                ? 'text-gray-300'
                : 'text-gray-600'
            }`}>
              {card.description}
            </p>
          )}
          {card.series && (
            <p className={`text-sm ${
              card.template_id === 'neon'
                ? 'text-gray-400'
                : 'text-gray-500'
            }`}>
              Series: {card.series}
            </p>
          )}
          <div className="flex items-center justify-between mt-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              card.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
              card.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
              card.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
              card.rarity === 'uncommon' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {card.rarity}
            </span>
          </div>
        </div>
      </div>
      
      {/* Effects Layer */}
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
