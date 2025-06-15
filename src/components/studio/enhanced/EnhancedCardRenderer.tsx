
import React from 'react';
import { Camera, Star, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EnhancedCardRendererProps {
  cardData: any;
  currentPhoto?: string;
  width?: number;
  height?: number;
  effects?: {
    holographic_intensity?: number;
    glow_effect?: number;
    border_thickness?: number;
    shadow_depth?: number;
    background_gradient?: string;
    background_texture?: string;
  };
}

export const EnhancedCardRenderer: React.FC<EnhancedCardRendererProps> = ({
  cardData,
  currentPhoto,
  width = 300,
  height = 420,
  effects = {}
}) => {
  const {
    holographic_intensity = 0,
    glow_effect = 0,
    border_thickness = 3,
    shadow_depth = 15,
    background_gradient,
    background_texture
  } = effects;

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: '#6b7280',
      uncommon: '#10b981',
      rare: '#3b82f6',
      epic: '#8b5cf6',
      legendary: '#f59e0b'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const getRarityGlow = (rarity: string) => {
    const glows = {
      common: 'rgba(107, 114, 128, 0.5)',
      uncommon: 'rgba(16, 185, 129, 0.5)',
      rare: 'rgba(59, 130, 246, 0.5)',
      epic: 'rgba(139, 92, 246, 0.5)',
      legendary: 'rgba(245, 158, 11, 0.5)'
    };
    return glows[rarity as keyof typeof glows] || glows.common;
  };

  const cardStyle = {
    width,
    height,
    background: background_gradient || `linear-gradient(135deg, 
      ${getRarityColor(cardData.rarity)}15 0%, 
      #1e293b 50%, 
      ${getRarityColor(cardData.rarity)}10 100%)`,
    boxShadow: `
      0 ${shadow_depth}px ${shadow_depth * 2}px rgba(0,0,0,0.4),
      0 0 ${glow_effect}px ${getRarityGlow(cardData.rarity)},
      inset 0 1px 0 rgba(255,255,255,0.1)
    `,
    border: `${border_thickness}px solid ${getRarityColor(cardData.rarity)}`,
    backdropFilter: 'blur(10px)'
  };

  const holographicOverlay = holographic_intensity > 0 && (
    <div 
      className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden"
      style={{
        background: `linear-gradient(45deg, 
          rgba(255,0,110,${holographic_intensity / 200}) 0%, 
          rgba(131,56,236,${holographic_intensity / 200}) 25%, 
          rgba(58,134,255,${holographic_intensity / 200}) 50%, 
          rgba(255,206,84,${holographic_intensity / 200}) 75%, 
          rgba(255,0,110,${holographic_intensity / 200}) 100%)`,
        animation: 'holographic-shimmer 3s ease-in-out infinite',
        mixBlendMode: 'overlay'
      }}
    />
  );

  const getTextureOverlay = () => {
    if (!background_texture) return null;
    
    const textures = {
      'Carbon Fiber': 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)',
      'Chrome': 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 100%)',
      'Hologram': 'radial-gradient(circle at 30% 70%, rgba(255,0,255,0.2), transparent 50%), radial-gradient(circle at 70% 30%, rgba(0,255,255,0.2), transparent 50%)',
      'Metallic': 'linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(255,165,0,0.2) 50%, rgba(255,215,0,0.1) 100%)'
    };

    return (
      <div 
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background: textures[background_texture as keyof typeof textures],
          mixBlendMode: 'overlay'
        }}
      />
    );
  };

  return (
    <div className="relative group">
      <style>
        {`
          @keyframes holographic-shimmer {
            0%, 100% { transform: translateX(-10px) rotate(-1deg) scale(1); opacity: 0.8; }
            25% { transform: translateX(5px) rotate(0.5deg) scale(1.01); opacity: 1; }
            50% { transform: translateX(10px) rotate(1deg) scale(1.02); opacity: 0.9; }
            75% { transform: translateX(-5px) rotate(-0.5deg) scale(1.01); opacity: 1; }
          }
          @keyframes rare-pulse {
            0%, 100% { box-shadow: 0 0 5px ${getRarityGlow(cardData.rarity)}; }
            50% { box-shadow: 0 0 20px ${getRarityGlow(cardData.rarity)}, 0 0 30px ${getRarityGlow(cardData.rarity)}; }
          }
        `}
      </style>
      
      <div
        className={`relative rounded-xl overflow-hidden transition-all duration-500 cursor-pointer
          ${cardData.rarity === 'legendary' ? 'animate-pulse' : ''}`}
        style={{
          ...cardStyle,
          animation: cardData.rarity === 'epic' || cardData.rarity === 'legendary' ? 'rare-pulse 2s ease-in-out infinite' : undefined
        }}
      >
        {/* Background Texture */}
        {getTextureOverlay()}

        {/* Holographic Overlay */}
        {holographicOverlay}

        {/* Card Content */}
        <div className="relative z-10 p-4 h-full flex flex-col">
          {/* Enhanced Header with Rarity Indicator */}
          <div className="mb-3 relative">
            <div 
              className="px-3 py-2 rounded-lg text-center font-bold text-white shadow-lg relative overflow-hidden"
              style={{ 
                backgroundColor: getRarityColor(cardData.rarity),
                boxShadow: `0 4px 12px ${getRarityGlow(cardData.rarity)}`
              }}
            >
              {/* Rarity shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-200px] group-hover:translate-x-[300px] transition-transform duration-1000" />
              
              <div className="relative flex items-center justify-center gap-2">
                {cardData.rarity === 'legendary' && <Star className="w-4 h-4 fill-current" />}
                <h3 className="text-lg font-black tracking-wide truncate">
                  {cardData.title}
                </h3>
                {cardData.rarity === 'legendary' && <Star className="w-4 h-4 fill-current" />}
              </div>
            </div>
            
            {/* Power indicator for high-tier cards */}
            {(cardData.rarity === 'epic' || cardData.rarity === 'legendary') && (
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-1">
                <Zap className="w-3 h-3 text-white fill-current" />
              </div>
            )}
          </div>

          {/* Enhanced Image Area with Dynamic Framing */}
          <div className="flex-1 mb-3 relative">
            <div 
              className="w-full h-full rounded-lg overflow-hidden border-2 relative"
              style={{
                borderColor: `${getRarityColor(cardData.rarity)}80`,
                boxShadow: `inset 0 0 20px ${getRarityGlow(cardData.rarity)}`
              }}
            >
              {currentPhoto || cardData.image_url ? (
                <>
                  <img 
                    src={currentPhoto || cardData.image_url} 
                    alt="Card" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Image overlay effects based on rarity */}
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: cardData.rarity === 'legendary' 
                        ? 'linear-gradient(45deg, transparent 30%, rgba(255,215,0,0.2) 50%, transparent 70%)'
                        : cardData.rarity === 'epic'
                        ? 'linear-gradient(45deg, transparent 30%, rgba(139,92,246,0.1) 50%, transparent 70%)'
                        : 'none'
                    }}
                  />
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gradient-to-br from-gray-800 to-gray-900">
                  <Camera className="w-12 h-12 mb-2 opacity-50" />
                  <span className="text-sm font-medium opacity-75">Add Image</span>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Stats/Description Area */}
          <div className="bg-black/30 backdrop-blur-md rounded-lg p-3 text-white border border-white/10">
            <div className="flex justify-between items-center mb-2">
              <Badge 
                variant="outline" 
                className={`text-xs font-bold border-2 ${
                  cardData.rarity === 'legendary' ? 'animate-pulse' : ''
                }`}
                style={{ 
                  borderColor: getRarityColor(cardData.rarity),
                  color: getRarityColor(cardData.rarity),
                  backgroundColor: `${getRarityColor(cardData.rarity)}10`
                }}
              >
                {cardData.rarity.toUpperCase()}
              </Badge>
              <span className="text-xs opacity-75 bg-white/10 px-2 py-1 rounded">
                #{cardData.edition_size || 1}/1
              </span>
            </div>
            
            <p className="text-xs opacity-90 line-clamp-2 leading-relaxed">
              {cardData.description || 'Professional trading card with premium finish and authentic design.'}
            </p>
            
            {cardData.tags && cardData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {cardData.tags.slice(0, 3).map((tag: string, index: number) => (
                  <span 
                    key={index} 
                    className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full border border-white/10"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Premium Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none transform -rotate-12 scale-150" />
        
        {/* Rarity-specific corner accents */}
        {(cardData.rarity === 'epic' || cardData.rarity === 'legendary') && (
          <>
            <div 
              className="absolute top-0 left-0 w-6 h-6 transform -translate-x-3 -translate-y-3"
              style={{
                background: `radial-gradient(circle, ${getRarityColor(cardData.rarity)} 0%, transparent 70%)`,
                filter: 'blur(1px)'
              }}
            />
            <div 
              className="absolute bottom-0 right-0 w-6 h-6 transform translate-x-3 translate-y-3"
              style={{
                background: `radial-gradient(circle, ${getRarityColor(cardData.rarity)} 0%, transparent 70%)`,
                filter: 'blur(1px)'
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};
