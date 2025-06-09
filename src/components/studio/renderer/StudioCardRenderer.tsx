
import React from 'react';
import { Camera } from 'lucide-react';
import type { CardData } from '@/hooks/useCardEditor';
import type { StudioState } from '@/hooks/useStudioState';

interface StudioCardRendererProps {
  template: {
    id: string;
    name: string;
    template_data: Record<string, any>;
  };
  cardData: CardData;
  currentPhoto?: string;
  studioState: StudioState;
  scaleFactor?: number;
  onPhotoUpload?: () => void;
  onElementSelect?: (elementId: string) => void;
  dimensions?: {
    width: number;
    height: number;
  };
}

export const StudioCardRenderer: React.FC<StudioCardRendererProps> = ({
  template,
  cardData,
  currentPhoto,
  studioState,
  scaleFactor = 1,
  onPhotoUpload,
  onElementSelect,
  dimensions
}) => {
  const { lighting, design, layers } = studioState;
  
  // Calculate actual dimensions
  const actualWidth = dimensions?.width || (300 * scaleFactor);
  const actualHeight = dimensions?.height || (420 * scaleFactor);

  // Generate lighting effects CSS
  const getLightingStyles = () => {
    const colorTempFilter = lighting.colorTemperature > 5500 ? 'brightness(1.1) contrast(1.05)' : 
                           lighting.colorTemperature < 4000 ? 'sepia(0.3) brightness(0.95)' : 'none';
    
    const shadowStyle = `drop-shadow(0 ${lighting.shadowIntensity / 10}px ${lighting.shadowIntensity / 5}px rgba(0,0,0,${lighting.shadowIntensity / 200}))`;
    
    return {
      filter: `brightness(${lighting.ambientIntensity / 100}) contrast(${lighting.directionalIntensity / 100}) ${colorTempFilter} ${shadowStyle}`,
      transition: 'filter 0.3s ease'
    };
  };

  // Generate design effects CSS
  const getDesignStyles = () => ({
    backgroundColor: design.backgroundColor,
    borderRadius: `${design.borderRadius}px`,
    opacity: design.opacity / 100,
    fontFamily: design.fontFamily,
    fontSize: `${design.fontSize}px`,
    color: design.textColor,
    fontWeight: design.fontWeight as 'normal' | 'bold',
    fontStyle: design.fontStyle as 'normal' | 'italic',
    textDecoration: design.textDecoration as 'none' | 'underline',
    textAlign: design.textAlign as 'left' | 'center' | 'right'
  });

  // Get layer styles with proper typing
  const getLayerStyles = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (!layer) return {};
    
    return {
      opacity: layer.visible ? layer.opacity / 100 : 0,
      mixBlendMode: layer.blendMode as 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light' | 'hard-light' | 'color-dodge' | 'color-burn' | 'darken' | 'lighten' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity',
      zIndex: layer.zIndex,
      pointerEvents: (layer.locked ? 'none' : 'auto') as 'none' | 'auto',
      transition: 'opacity 0.3s ease'
    };
  };

  // Extract template colors with fallbacks
  const templateData = template.template_data;
  const colors = templateData.colors || {
    background: design.backgroundColor,
    primary: design.primaryColor,
    secondary: '#f59e0b',
    accent: '#8b5cf6',
    text: design.textColor
  };

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

  return (
    <div 
      className="relative rounded-xl shadow-2xl border-4 border-crd-green/30 overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer group"
      style={{ 
        width: actualWidth, 
        height: actualHeight,
        ...getLightingStyles(),
        ...getDesignStyles()
      }}
    >
      {/* Background Layer */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundColor: colors.background,
          ...getLayerStyles('background')
        }}
      />

      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-crd-green/10 to-crd-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Image Layer */}
      <div 
        className="absolute overflow-hidden rounded border-2 border-white/50"
        style={{
          left: 20 * scaleFactor,
          top: 60 * scaleFactor,
          width: (actualWidth - 40),
          height: (actualHeight - 140),
          ...getLayerStyles('image')
        }}
      >
        {currentPhoto || cardData.image_url ? (
          <img 
            src={currentPhoto || cardData.image_url} 
            alt="Card" 
            className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => onElementSelect?.('image')}
            style={getLightingStyles()}
          />
        ) : (
          <div 
            className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={onPhotoUpload}
          >
            <Camera className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-xs text-gray-500 text-center px-2">Click to add photo</span>
          </div>
        )}
      </div>

      {/* Title Layer */}
      <div 
        className="absolute flex items-center justify-center text-white font-bold rounded shadow-lg px-3 py-2"
        style={{
          left: 20 * scaleFactor,
          top: 20 * scaleFactor,
          width: (actualWidth - 40),
          height: 30 * scaleFactor,
          backgroundColor: colors.primary,
          ...getLayerStyles('title'),
          ...getDesignStyles()
        }}
        onClick={() => onElementSelect?.('title')}
      >
        <span className="truncate">{cardData.title}</span>
      </div>

      {/* Description/Stats */}
      <div 
        className="absolute p-2 text-xs rounded shadow-inner"
        style={{
          left: 20 * scaleFactor,
          bottom: 40 * scaleFactor,
          width: (actualWidth - 40),
          height: 60 * scaleFactor,
          backgroundColor: colors.secondary,
          color: design.textColor,
          ...getLayerStyles('description')
        }}
      >
        <div className="font-semibold mb-1">Description:</div>
        <div className="text-xs opacity-90 line-clamp-2">{cardData.description || 'Add a description for your card'}</div>
        <div className="mt-1 text-xs flex justify-between">
          <div>Rarity: {cardData.rarity}</div>
          <div>Edition: {cardData.edition_size || 1}/1</div>
        </div>
      </div>

      {/* Rarity badge */}
      <div 
        className="absolute top-2 right-2 px-2 py-1 text-xs font-bold text-white rounded-full shadow-lg"
        style={{ 
          backgroundColor: getRarityColor(cardData.rarity),
          ...getLayerStyles('rarity')
        }}
      >
        {cardData.rarity.toUpperCase()}
      </div>

      {/* Selected layer indicator */}
      {studioState.selectedLayerId && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 border-2 border-crd-green border-dashed opacity-50 animate-pulse" />
        </div>
      )}
    </div>
  );
};
