
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';

interface CardContainerProps {
  card: CardData;
  isFlipped: boolean;
  isHovering: boolean;
  showEffects: boolean;
  effectIntensity: number[];
  mousePosition: { x: number; y: number };
  rotation: { x: number; y: number };
  zoom: number;
  isDragging: boolean;
  frameStyles: React.CSSProperties;
  physicalEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

export const CardContainer: React.FC<CardContainerProps> = ({
  card,
  isFlipped,
  isHovering,
  showEffects,
  effectIntensity,
  mousePosition,
  rotation,
  zoom,
  isDragging,
  frameStyles,
  physicalEffectStyles,
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
        {/* Front of Card with Enhanced Effects */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden backface-hidden"
          style={{
            ...frameStyles,
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            backfaceVisibility: 'hidden'
          }}
        >
          {/* Base Card Layer */}
          <div className="absolute inset-0" style={frameStyles} />
          
          {/* Surface Texture Layer */}
          {SurfaceTexture}
          
          {/* Physical Effects Layer */}
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={physicalEffectStyles} 
          />
          
          {/* Specular Highlight Layer */}
          {showEffects && isHovering && (
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 200px 100px at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
                  rgba(255,255,255,${effectIntensity[0] * 0.003}) 0%, 
                  transparent 70%)`,
                mixBlendMode: 'screen'
              }}
            />
          )}
          
          {/* Card Content */}
          <div className="relative h-full p-6 flex flex-col z-10">
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

          {/* Enhanced Moving Shine Effect */}
          {isHovering && showEffects && (
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(${Math.atan2(mousePosition.y - 0.5, mousePosition.x - 0.5) * 180 / Math.PI + 90}deg, 
                  transparent 30%, 
                  rgba(255, 255, 255, ${effectIntensity[0] * 0.008}) 50%, 
                  transparent 70%)`,
                transform: `translateX(${(mousePosition.x - 0.5) * 50}%) translateY(${(mousePosition.y - 0.5) * 30}%)`,
                transition: 'transform 0.1s ease',
                mixBlendMode: 'screen'
              }}
            />
          )}
        </div>

        {/* Back of Card - Dark Pattern Background for Testing Effects */}
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
              opacity: (physicalEffectStyles.opacity as number || 1) * 1.5 // Make effects more visible on dark background
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
      </div>
    </div>
  );
};
