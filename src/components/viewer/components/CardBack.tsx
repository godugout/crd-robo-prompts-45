
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
      
      {/* Card Back Content with New Logo */}
      <div className="relative h-full p-6 flex flex-col z-30">
        {/* New Logo at Top */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <img 
              src="/lovable-uploads/a2352583-e5d8-40a2-9378-e29efd277d3c.png" 
              alt="Card Logo" 
              className="w-32 h-auto opacity-90"
            />
          </div>
        </div>
        
        {/* Card Title */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">
            {card.title}
          </h1>
          {card.series && (
            <p className="text-sm text-gray-400 uppercase tracking-wide">
              {card.series}
            </p>
          )}
        </div>
        
        {/* Card Details Grid */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between p-3 rounded-lg bg-gray-800 bg-opacity-70">
            <span className="text-sm text-gray-300">Type:</span>
            <span className="font-medium text-white">{card.type || 'Character'}</span>
          </div>
          
          <div className="flex justify-between p-3 rounded-lg bg-gray-800 bg-opacity-70">
            <span className="text-sm text-gray-300">Rarity:</span>
            <span className={`font-medium capitalize ${
              card.rarity === 'legendary' ? 'text-yellow-400' :
              card.rarity === 'epic' ? 'text-purple-400' :
              card.rarity === 'rare' ? 'text-blue-400' :
              card.rarity === 'uncommon' ? 'text-green-400' :
              'text-gray-300'
            }`}>
              {card.rarity}
            </span>
          </div>

          {card.tags.length > 0 && (
            <div className="p-3 rounded-lg bg-gray-800 bg-opacity-70">
              <span className="text-sm block mb-2 text-gray-300">Tags:</span>
              <div className="flex flex-wrap gap-2">
                {card.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-700 bg-opacity-80 text-gray-200 border border-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Description - Takes remaining space */}
        {card.description && (
          <div className="mt-auto">
            <h3 className="text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
              Description
            </h3>
            <p className="text-sm text-gray-200 leading-relaxed">
              {card.description}
            </p>
          </div>
        )}

        {/* Card ID and CRD branding at bottom */}
        <div className="mt-4 pt-4 border-t border-gray-700 border-opacity-50">
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>Card ID: {card.id || 'N/A'}</span>
            <div className="flex items-center gap-2">
              {card.template_id && (
                <span className="capitalize">{card.template_id} Edition</span>
              )}
              <span className="text-crd-green font-semibold">CRD</span>
            </div>
          </div>
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
