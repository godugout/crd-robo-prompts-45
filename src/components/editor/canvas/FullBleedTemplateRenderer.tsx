
import React, { useState } from 'react';
import { Camera, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StickerLayer } from '../stickers/StickerLayer';
import type { CardData } from '@/hooks/useCardEditor';

interface StickerData {
  id: string;
  type: 'emoji' | 'icon' | 'shape';
  content: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color?: string;
}

interface FullBleedTemplateRendererProps {
  template: {
    id: string;
    name: string;
    template_data: any;
  };
  cardData: CardData;
  currentPhoto?: string;
  scaleFactor?: number;
  onPhotoUpload?: () => void;
  onElementSelect?: (elementId: string) => void;
  dimensions?: {
    width: number;
    height: number;
  };
  stickers?: StickerData[];
  onStickersChange?: (stickers: StickerData[]) => void;
  selectedStickerId?: string;
  onStickerSelect?: (id: string) => void;
}

export const FullBleedTemplateRenderer: React.FC<FullBleedTemplateRendererProps> = ({
  template,
  cardData,
  currentPhoto,
  scaleFactor = 1,
  onPhotoUpload,
  onElementSelect,
  dimensions,
  stickers = [],
  onStickersChange = () => {},
  selectedStickerId,
  onStickerSelect = () => {}
}) => {
  const actualWidth = dimensions?.width || (300 * scaleFactor);
  const actualHeight = dimensions?.height || (420 * scaleFactor);
  const templateData = template.template_data;
  const isMinimal = templateData.layout_type === 'full-bleed-minimal';
  const isSocial = templateData.layout_type === 'full-bleed-social';

  const handleStickerUpdate = (updatedSticker: StickerData) => {
    const newStickers = stickers.map(s => 
      s.id === updatedSticker.id ? updatedSticker : s
    );
    onStickersChange(newStickers);
  };

  const handleStickerDelete = (stickerId: string) => {
    const newStickers = stickers.filter(s => s.id !== stickerId);
    onStickersChange(newStickers);
  };

  const handleStickerDuplicate = (sticker: StickerData) => {
    const duplicated: StickerData = {
      ...sticker,
      id: `${sticker.id}-copy-${Date.now()}`,
      x: sticker.x + 20,
      y: sticker.y + 20
    };
    onStickersChange([...stickers, duplicated]);
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
        backgroundColor: templateData.colors.background 
      }}
    >
      {/* Full-bleed background image */}
      <div className="absolute inset-0">
        {currentPhoto || cardData.image_url ? (
          <img 
            src={currentPhoto || cardData.image_url} 
            alt="Card background" 
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => onElementSelect?.('background')}
          />
        ) : (
          <div 
            className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors"
            onClick={onPhotoUpload}
          >
            <Camera className="w-12 h-12 text-gray-400 mb-4" />
            <span className="text-sm text-gray-300 text-center px-4">
              Click to add your photo
            </span>
            <span className="text-xs text-gray-400 text-center px-4 mt-2">
              This will be your full-card background
            </span>
          </div>
        )}
      </div>

      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />

      {/* Minimal template overlays */}
      {isMinimal && (
        <>
          {/* CRD Logo */}
          <div 
            className="absolute flex items-center justify-center text-xs font-bold text-white bg-crd-green rounded px-2 py-1"
            style={{
              left: 15 * scaleFactor,
              top: 15 * scaleFactor,
              fontSize: `${10 * scaleFactor}px`
            }}
          >
            CRD
          </div>

          {/* Card Name */}
          <div 
            className="absolute flex items-center px-3 py-2 text-white font-bold bg-black/70 rounded backdrop-blur-sm"
            style={{
              left: 15 * scaleFactor,
              bottom: 15 * scaleFactor,
              maxWidth: (200 * scaleFactor),
              fontSize: `${14 * scaleFactor}px`
            }}
          >
            {cardData.title}
          </div>

          {/* Card Number */}
          <div 
            className="absolute flex items-center justify-center text-xs font-mono text-white bg-black/70 rounded px-2 py-1 backdrop-blur-sm"
            style={{
              right: 15 * scaleFactor,
              top: 15 * scaleFactor,
              fontSize: `${10 * scaleFactor}px`
            }}
          >
            #{cardData.edition_size || 1}
          </div>

          {/* Rarity badge */}
          <div 
            className="absolute px-2 py-1 text-xs font-bold text-white rounded-full"
            style={{ 
              right: 15 * scaleFactor,
              bottom: 15 * scaleFactor,
              backgroundColor: getRarityColor(cardData.rarity),
              fontSize: `${10 * scaleFactor}px`
            }}
          >
            {cardData.rarity.toUpperCase()}
          </div>
        </>
      )}

      {/* Social template stickers */}
      {isSocial && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="relative w-full h-full pointer-events-auto">
            {stickers.map((sticker) => (
              <StickerLayer
                key={sticker.id}
                sticker={sticker}
                isSelected={selectedStickerId === sticker.id}
                onUpdate={handleStickerUpdate}
                onSelect={() => onStickerSelect(sticker.id)}
                onDelete={() => handleStickerDelete(sticker.id)}
                onDuplicate={() => handleStickerDuplicate(sticker)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-crd-green/10 to-crd-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};
