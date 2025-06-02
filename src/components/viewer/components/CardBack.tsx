
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';

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
            linear-gradient(45deg, #1a1a1a 25%, transparent 25%), 
            linear-gradient(-45deg, #1a1a1a 25%, transparent 25%), 
            linear-gradient(45deg, transparent 75%, #1a1a1a 75%), 
            linear-gradient(-45deg, transparent 75%, #1a1a1a 75%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          backgroundColor: '#0a0a0a'
        }}
      />
      
      {/* Surface Texture Layer on Back */}
      {SurfaceTexture}
      
      {/* Physical Effects Layer on Back - More Visible */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          ...physicalEffectStyles,
          opacity: (physicalEffectStyles.opacity as number || 1) * 1.5
        }} 
      />
      
      {/* Enhanced Specular Highlight on Back */}
      {showEffects && isHovering && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 300px 150px at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
              rgba(255,255,255,${effectIntensity[0] * 0.01}) 0%, 
              transparent 70%)`,
            mixBlendMode: 'screen'
          }}
        />
      )}
      
      {/* Card Back Content */}
      <div className="relative h-full p-6 flex flex-col z-10">
        <h3 className="text-xl font-bold mb-4 text-white">
          Card Details
        </h3>
        
        <div className="space-y-3 mb-4">
          <div className="flex justify-between p-2 rounded bg-gray-800 bg-opacity-60">
            <span className="text-sm text-gray-300">Type:</span>
            <span className="font-medium text-white">{card.type || 'Character'}</span>
          </div>
          
          <div className="flex justify-between p-2 rounded bg-gray-800 bg-opacity-60">
            <span className="text-sm text-gray-300">Rarity:</span>
            <span className="font-medium text-white">{card.rarity}</span>
          </div>

          {card.tags.length > 0 && (
            <div className="p-2 rounded bg-gray-800 bg-opacity-60">
              <span className="text-sm block mb-1 text-gray-300">Tags:</span>
              <div className="flex flex-wrap gap-1">
                {card.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-700 bg-opacity-60 text-gray-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {card.description && (
          <p className="text-sm mt-auto text-gray-300">
            {card.description}
          </p>
        )}
      </div>

      {/* Enhanced Moving Shine Effect on Back */}
      {isHovering && showEffects && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(${Math.atan2(mousePosition.y - 0.5, mousePosition.x - 0.5) * 180 / Math.PI + 90}deg, 
              transparent 20%, 
              rgba(255, 255, 255, ${effectIntensity[0] * 0.015}) 50%, 
              transparent 80%)`,
            transform: `translateX(${(mousePosition.x - 0.5) * 50}%) translateY(${(mousePosition.y - 0.5) * 30}%)`,
            transition: 'transform 0.1s ease',
            mixBlendMode: 'screen'
          }}
        />
      )}
    </div>
  );
};
