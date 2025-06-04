
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';

interface EnhancedCardCanvasProps {
  card: CardData;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
  rotation: { x: number; y: number };
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  overallBrightness: number;
  interactiveLighting: boolean;
  materialSettings: MaterialSettings;
  onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  width: number;
  height: number;
}

export const EnhancedCardCanvas: React.FC<EnhancedCardCanvasProps> = ({
  card,
  effectValues,
  mousePosition,
  isHovering,
  rotation,
  selectedScene,
  selectedLighting,
  overallBrightness,
  interactiveLighting,
  materialSettings,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  width,
  height
}) => {
  // Simple card display for now - this would be enhanced with actual 3D rendering
  return (
    <div
      className="relative cursor-pointer select-none"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.3s ease'
      }}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Card container */}
      <div
        className="absolute inset-0 rounded-lg shadow-2xl overflow-hidden"
        style={{
          background: selectedScene.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          filter: `brightness(${overallBrightness}%)`
        }}
      >
        {/* Card content */}
        <div className="relative w-full h-full p-4 flex flex-col">
          {/* Card name */}
          <div className="text-white text-xl font-bold mb-2">
            {card.name || 'Card Name'}
          </div>
          
          {/* Card image area */}
          <div className="flex-1 bg-white/10 rounded backdrop-blur-sm flex items-center justify-center">
            {card.image_url ? (
              <img 
                src={card.image_url} 
                alt={card.name}
                className="max-w-full max-h-full object-contain rounded"
              />
            ) : (
              <div className="text-white/70 text-center">
                <div className="text-4xl mb-2">🃏</div>
                <div>Card Image</div>
              </div>
            )}
          </div>
          
          {/* Card stats */}
          <div className="mt-2 text-white/90 text-sm">
            <div>Rarity: {card.rarity || 'Common'}</div>
            <div>Set: {card.set_name || 'Custom Set'}</div>
          </div>
        </div>
        
        {/* Effects overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.3,
            background: `
              radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                rgba(255, 255, 255, 0.3) 0%,
                transparent 70%)
            `
          }}
        />
      </div>
    </div>
  );
};
