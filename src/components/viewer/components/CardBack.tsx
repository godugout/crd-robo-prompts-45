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
      className="absolute inset-0 rounded-xl overflow-hidden"
      style={{
        transform: 'rotateY(180deg)',
        backfaceVisibility: 'hidden',
        ...frameStyles
      }}
    >
      {/* Base Material Layer */}
      <div className="absolute inset-0" style={physicalEffectStyles} />
      
      {/* Surface Texture Layer */}
      <div className="absolute inset-0 z-10">
        {SurfaceTexture}
      </div>
      
      {/* Material Effects Layer */}
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
      <div className="absolute inset-0 bg-black bg-opacity-30 z-20" />
      
      {/* Baseball Card-Inspired Layout */}
      <div className="relative h-full p-6 flex flex-col z-30">
        {/* Header Section - Logo and Title */}
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <img 
              src="/lovable-uploads/a10f1aa8-5e9a-4f0b-b7c6-dea5208cebde.png" 
              alt="CRD Logo" 
              className="w-24 h-auto opacity-95"
              style={{
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))'
              }}
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg tracking-wide">
            {card.title}
          </h1>
          {card.series && (
            <p className="text-sm text-gray-200 uppercase tracking-wider drop-shadow-md font-medium">
              {card.series} Series
            </p>
          )}
        </div>
        
        {/* Info Grid Section - Baseball Card Style */}
        <div className="mb-6">
          <div className="bg-black bg-opacity-60 backdrop-blur-sm border border-white border-opacity-30 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-300 uppercase tracking-wide">Edition</span>
                  <span className="text-sm font-medium text-white">
                    {card.template_id ? `${card.template_id.charAt(0).toUpperCase()}${card.template_id.slice(1)}` : 'Standard'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-300 uppercase tracking-wide">Card ID</span>
                  <span className="text-sm font-mono text-white">#{card.id?.slice(-6) || 'N/A'}</span>
                </div>
              </div>
              
              {/* Right Column */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-300 uppercase tracking-wide">Status</span>
                  <span className="text-sm font-medium text-green-400">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-300 uppercase tracking-wide">Year</span>
                  <span className="text-sm font-medium text-white">2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tags Section */}
        {card.tags.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-300 mb-3 uppercase tracking-wider">
              Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {card.tags.slice(0, 4).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-gray-100 border border-white border-opacity-30 backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Description Section - Story */}
        {card.description && (
          <div className="flex-1 mb-6">
            <h3 className="text-xs font-semibold text-gray-300 mb-3 uppercase tracking-wider">
              Story
            </h3>
            <div className="bg-black bg-opacity-50 backdrop-blur-sm border border-white border-opacity-20 rounded-lg p-4">
              <p className="text-sm text-gray-100 leading-relaxed drop-shadow-md">
                {card.description}
              </p>
            </div>
          </div>
        )}

        {/* Footer - CRD Branding */}
        <div className="mt-auto pt-4 border-t border-white border-opacity-20">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-300">
              <span className="uppercase tracking-wide">Cardshow Digital</span>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-white tracking-wider drop-shadow-lg">
                CRD
              </div>
              <div className="text-xs text-gray-300 -mt-1">
                Premium Collection
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
