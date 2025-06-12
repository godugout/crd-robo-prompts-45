
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Layers } from 'lucide-react';
import { LayeredTemplate } from '@/types/layeredTemplate';

interface LayeredTemplatePreviewProps {
  template: LayeredTemplate;
  isSelected: boolean;
  onSelect: () => void;
  compact?: boolean;
}

export const LayeredTemplatePreview: React.FC<LayeredTemplatePreviewProps> = ({
  template,
  isSelected,
  onSelect,
  compact = false
}) => {
  const [visibleLayers, setVisibleLayers] = useState({
    image: true,
    frame: true,
    stickers: true,
    effects: true
  });

  const toggleLayer = (layerType: keyof typeof visibleLayers) => {
    setVisibleLayers(prev => ({
      ...prev,
      [layerType]: !prev[layerType]
    }));
  };

  const layerInfo = [
    { type: 'image' as const, name: 'Image', color: 'bg-blue-500', icon: '🖼️' },
    { type: 'frame' as const, name: 'Frame', color: 'bg-green-500', icon: '🖼️' },
    { type: 'stickers' as const, name: 'Stickers', color: 'bg-yellow-500', icon: '⭐' },
    { type: 'effects' as const, name: 'Effects', color: 'bg-purple-500', icon: '✨' }
  ];

  return (
    <Card
      className={`cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'ring-2 ring-crd-green scale-105 bg-editor-tool' 
          : 'bg-editor-dark hover:bg-editor-tool'
      } border-editor-border`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        {/* Template Preview */}
        <div className="aspect-[3/4] bg-gradient-to-br from-crd-mediumGray to-crd-lightGray rounded-lg mb-3 relative overflow-hidden">
          {/* Background Image Layer */}
          {visibleLayers.image && (
            <img 
              src={template.thumbnail} 
              alt={template.name}
              className="w-full h-full object-cover absolute inset-0"
              style={{ opacity: template.layers.image.opacity / 100 }}
            />
          )}
          
          {/* Frame Layer */}
          {visibleLayers.frame && (
            <div 
              className="absolute inset-0"
              style={{ opacity: template.layers.frame.opacity / 100 }}
            >
              {/* Frame Border */}
              <div 
                className="absolute inset-0 border-4 rounded"
                style={{ 
                  borderColor: template.layers.frame.border.color,
                  borderWidth: `${template.layers.frame.border.thickness}px`,
                  padding: `${template.layers.frame.border.padding}px`
                }}
              />
              
              {/* Cutout Area Indicator */}
              <div
                className="absolute border-2 border-dashed border-white/50 bg-transparent"
                style={{
                  left: `${template.layers.frame.cutoutArea.x}%`,
                  top: `${template.layers.frame.cutoutArea.y}%`,
                  width: `${template.layers.frame.cutoutArea.width}%`,
                  height: `${template.layers.frame.cutoutArea.height}%`,
                }}
              />
              
              {/* Text Areas */}
              {template.layers.frame.textAreas.map((textArea) => (
                <div
                  key={textArea.id}
                  className="absolute bg-crd-green/20 border border-crd-green"
                  style={{
                    left: `${textArea.x}%`,
                    top: `${textArea.y}%`,
                    width: `${textArea.width}%`,
                    height: `${textArea.height}%`,
                  }}
                >
                  <div className="text-xs text-white p-1 truncate">
                    {textArea.size} text
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Stickers Layer */}
          {visibleLayers.stickers && (
            <div 
              className="absolute inset-0"
              style={{ opacity: template.layers.stickers.opacity / 100 }}
            >
              {template.layers.stickers.availableStickers.map((sticker) => (
                <div
                  key={sticker.id}
                  className="absolute bg-crd-orange/30 border border-crd-orange rounded"
                  style={{
                    left: `${sticker.position.x}%`,
                    top: `${sticker.position.y}%`,
                    width: `${sticker.size.width}%`,
                    height: `${sticker.size.height}%`,
                  }}
                >
                  <div className="text-xs text-white text-center truncate">
                    {sticker.type === 'crd-logo' ? 'CRD' : 
                     sticker.type === 'nameplate' ? 'NAME' :
                     sticker.type === 'rookie-trophy' ? '🏆' : '⭐'}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Effects Layer */}
          {visibleLayers.effects && (
            <div 
              className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-gold-500/10 rounded"
              style={{ opacity: template.layers.effects.opacity / 100 }}
            />
          )}
          
          {/* Layer Controls (compact mode) */}
          {compact && (
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              {layerInfo.map((layer) => (
                <Button
                  key={layer.type}
                  size="sm"
                  variant="ghost"
                  className={`w-6 h-6 p-0 ${layer.color} hover:opacity-80`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLayer(layer.type);
                  }}
                >
                  {visibleLayers[layer.type] ? (
                    <Eye className="w-3 h-3" />
                  ) : (
                    <EyeOff className="w-3 h-3" />
                  )}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Template Info */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-crd-white font-semibold text-sm">{template.name}</h3>
            <Badge variant="outline" className="text-xs border-editor-border text-crd-lightGray">
              {template.category}
            </Badge>
          </div>
          
          {/* Layer Summary */}
          <div className="flex flex-wrap gap-1 mb-2">
            {layerInfo.map((layer) => (
              <Badge
                key={layer.type}
                variant="outline"
                className={`text-xs border-editor-border ${
                  visibleLayers[layer.type] ? 'text-crd-white' : 'text-crd-lightGray opacity-50'
                }`}
              >
                {layer.icon} {layer.name}
              </Badge>
            ))}
          </div>
          
          {/* Layer Details (non-compact mode) */}
          {!compact && (
            <div className="space-y-1">
              <div className="text-xs text-crd-lightGray">
                Frame: {template.layers.frame.textAreas.length} text areas
              </div>
              <div className="text-xs text-crd-lightGray">
                Stickers: {template.layers.stickers.availableStickers.length} available
              </div>
              <div className="text-xs text-crd-lightGray">
                Effects: {template.layers.effects.availableEffects.length} available
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
