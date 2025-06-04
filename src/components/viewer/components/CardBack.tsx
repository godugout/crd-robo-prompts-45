
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
  frameStyles?: React.CSSProperties;
  effectValues?: any;
  materialSettings?: any;
  interactiveLighting?: boolean;
}

export const CardBack: React.FC<CardBackProps> = ({
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
        transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(-180deg)',
        backfaceVisibility: 'hidden',
        ...frameStyles
      }}
    >
      {/* Base Material Layer - Same as front */}
      <div className="absolute inset-0" style={physicalEffectStyles} />
      
      {/* Surface Texture Layer - Same as front */}
      <div className="absolute inset-0 z-10">
        {SurfaceTexture}
      </div>
      
      {/* Material Effects Layer - Same as front */}
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
      
      {/* Content Overlay for Readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-20" />
      
      {/* Card Back Content with CRD Branding */}
      <div className="relative h-full p-6 flex flex-col z-30">
        {/* New Gradient CRD Logo at Top */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <img 
              src="/lovable-uploads/dac1449a-924d-4d34-9a82-a461fee3505d.png" 
              alt="CRD Logo" 
              className="w-28 h-auto opacity-95"
              style={{
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))'
              }}
            />
          </div>
        </div>
        
        {/* Card Title */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
            {card.title}
          </h1>
          {card.series && (
            <p className="text-sm text-gray-200 uppercase tracking-wide drop-shadow-md">
              {card.series}
            </p>
          )}
        </div>
        
        {/* Card Details Grid */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between p-3 rounded-lg bg-black bg-opacity-60 backdrop-blur-sm border border-white border-opacity-20">
            <span className="text-sm text-gray-200">Type:</span>
            <span className="font-medium text-white">{card.type || 'Character'}</span>
          </div>
          
          <div className="flex justify-between p-3 rounded-lg bg-black bg-opacity-60 backdrop-blur-sm border border-white border-opacity-20">
            <span className="text-sm text-gray-200">Rarity:</span>
            <span className={`font-medium capitalize ${
              card.rarity === 'legendary' ? 'text-yellow-400' :
              card.rarity === 'epic' ? 'text-purple-400' :
              card.rarity === 'rare' ? 'text-blue-400' :
              card.rarity === 'uncommon' ? 'text-green-400' :
              'text-gray-200'
            }`}>
              {card.rarity}
            </span>
          </div>

          {card.tags.length > 0 && (
            <div className="p-3 rounded-lg bg-black bg-opacity-60 backdrop-blur-sm border border-white border-opacity-20">
              <span className="text-sm block mb-2 text-gray-200">Tags:</span>
              <div className="flex flex-wrap gap-2">
                {card.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-gray-100 border border-white border-opacity-30 backdrop-blur-sm"
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
            <h3 className="text-sm font-semibold text-gray-200 mb-2 uppercase tracking-wide drop-shadow-md">
              Description
            </h3>
            <p className="text-sm text-gray-100 leading-relaxed drop-shadow-md bg-black bg-opacity-40 p-3 rounded-lg border border-white border-opacity-20 backdrop-blur-sm">
              {card.description}
            </p>
          </div>
        )}

        {/* Card ID and CRD branding at bottom */}
        <div className="mt-4 pt-4 border-t border-white border-opacity-30">
          <div className="flex justify-between items-center text-xs text-gray-200">
            <span className="drop-shadow-md">Card ID: {card.id || 'N/A'}</span>
            <div className="flex items-center gap-2">
              {card.template_id && (
                <span className="capitalize drop-shadow-md">{card.template_id} Edition</span>
              )}
              <span className="text-white font-bold drop-shadow-md tracking-wider">CRD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
