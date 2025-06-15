
import React from 'react';
import { Camera } from 'lucide-react';
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

  const cardStyle = {
    width,
    height,
    background: background_gradient || 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    boxShadow: `0 ${shadow_depth}px ${shadow_depth * 2}px rgba(0,0,0,0.3)`,
    border: `${border_thickness}px solid ${getRarityColor(cardData.rarity)}`,
    filter: glow_effect > 0 ? `drop-shadow(0 0 ${glow_effect}px ${getRarityColor(cardData.rarity)})` : 'none'
  };

  const holographicOverlay = holographic_intensity > 0 && (
    <div 
      className="absolute inset-0 pointer-events-none rounded-xl"
      style={{
        background: `linear-gradient(45deg, 
          rgba(255,0,110,${holographic_intensity / 200}) 0%, 
          rgba(131,56,236,${holographic_intensity / 200}) 25%, 
          rgba(58,134,255,${holographic_intensity / 200}) 50%, 
          rgba(255,206,84,${holographic_intensity / 200}) 75%, 
          rgba(255,0,110,${holographic_intensity / 200}) 100%)`,
        animation: 'holographic 3s ease-in-out infinite'
      }}
    />
  );

  return (
    <div className="relative">
      <div
        className="relative rounded-xl overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer group"
        style={cardStyle}
      >
        {/* Background Pattern/Texture */}
        {background_texture && (
          <div className={`absolute inset-0 opacity-20 ${
            background_texture === 'Carbon Fiber' ? 'bg-gray-900' :
            background_texture === 'Chrome' ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
            background_texture === 'Hologram' ? 'bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500' :
            'bg-gradient-radial from-yellow-400 to-yellow-700'
          }`} />
        )}

        {/* Holographic Overlay */}
        {holographicOverlay}

        {/* Card Content */}
        <div className="relative z-10 p-4 h-full flex flex-col">
          {/* Header with Title */}
          <div className="mb-3">
            <div 
              className="px-3 py-2 rounded-lg text-center font-bold text-white shadow-lg"
              style={{ backgroundColor: getRarityColor(cardData.rarity) }}
            >
              <h3 className="text-lg font-black tracking-wide truncate">
                {cardData.title}
              </h3>
            </div>
          </div>

          {/* Main Image Area */}
          <div className="flex-1 mb-3 relative">
            <div className="w-full h-full rounded-lg overflow-hidden border-2 border-white/50 bg-gradient-to-br from-gray-100 to-gray-300">
              {currentPhoto || cardData.image_url ? (
                <img 
                  src={currentPhoto || cardData.image_url} 
                  alt="Card" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                  <Camera className="w-12 h-12 mb-2" />
                  <span className="text-sm font-medium">Add Image</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats/Description Area */}
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 text-white">
            <div className="flex justify-between items-center mb-2">
              <Badge 
                variant="outline" 
                className="text-xs font-bold"
                style={{ 
                  borderColor: getRarityColor(cardData.rarity),
                  color: getRarityColor(cardData.rarity)
                }}
              >
                {cardData.rarity.toUpperCase()}
              </Badge>
              <span className="text-xs opacity-75">
                #{cardData.edition_size || 1}/1
              </span>
            </div>
            
            <p className="text-xs opacity-90 line-clamp-2">
              {cardData.description || 'Professional trading card with premium finish and authentic design.'}
            </p>
            
            {cardData.tags && cardData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {cardData.tags.slice(0, 3).map((tag: string, index: number) => (
                  <span key={index} className="text-xs bg-white/20 px-2 py-1 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Premium Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      {/* CSS for holographic animation */}
      <style jsx>{`
        @keyframes holographic {
          0%, 100% { transform: translateX(-10px) rotate(-1deg); }
          50% { transform: translateX(10px) rotate(1deg); }
        }
      `}</style>
    </div>
  );
};
