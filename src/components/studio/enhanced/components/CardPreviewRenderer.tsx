
import React from 'react';
import { Card } from '@/components/ui/card';
import { getStudioFrameById } from '../frames/CardFrameConfigs';
import { calculateFlexibleCardSize, type CardOrientation } from '@/utils/cardDimensions';

interface CardPreviewRendererProps {
  uploadedImage?: string;
  selectedFrame?: string;
  orientation: CardOrientation;
  show3DPreview: boolean;
  cardName: string;
  showImageControls: boolean;
}

export const CardPreviewRenderer: React.FC<CardPreviewRendererProps> = ({
  uploadedImage,
  selectedFrame,
  orientation,
  show3DPreview,
  cardName,
  showImageControls
}) => {
  const cardDimensions = calculateFlexibleCardSize(400, 500, orientation, 3, 0.5);
  const frameConfig = selectedFrame ? getStudioFrameById(selectedFrame) : null;

  if (uploadedImage && frameConfig) {
    return (
      <div className="relative w-full h-full">
        {/* Simple frame preview with the studio frame config */}
        <div 
          className="w-full h-full rounded-lg border-2 overflow-hidden"
          style={{
            background: frameConfig.background.type === 'gradient' 
              ? `linear-gradient(135deg, ${frameConfig.background.colors.join(', ')})`
              : frameConfig.background.colors[0],
            borderColor: frameConfig.borders.outer?.color || '#ccc',
            borderWidth: frameConfig.borders.outer?.width || 2
          }}
        >
          <div className="relative w-full h-full p-4">
            {/* Image area */}
            <div className="relative w-full h-3/4 rounded overflow-hidden">
              <img 
                src={uploadedImage} 
                alt="Card content"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Text area */}
            <div className="absolute bottom-4 left-4 right-4">
              <h3 
                className="font-bold text-lg truncate"
                style={{ color: frameConfig.textStyles.title.color }}
              >
                {cardName || 'PLAYER NAME'}
              </h3>
              <p 
                className="text-sm truncate"
                style={{ color: frameConfig.textStyles.subtitle.color }}
              >
                ROOKIE CARD • 2024
              </p>
            </div>
            
            {/* Emblem */}
            {frameConfig.emblem && (
              <div className="absolute top-4 right-4">
                <div 
                  className="text-xs font-bold px-2 py-1 rounded"
                  style={{ 
                    color: frameConfig.emblem.color,
                    backgroundColor: 'rgba(0,0,0,0.3)'
                  }}
                >
                  {frameConfig.emblem.text}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Image adjustment overlay */}
        {showImageControls && (
          <div className="absolute inset-0 bg-black/20 border-2 border-crd-green rounded-lg">
            <div className="absolute inset-4 border border-dashed border-crd-green rounded-md">
              <div className="absolute -top-8 left-0 right-0 flex justify-center">
                <div className="bg-black/80 rounded-lg px-2 py-1 text-xs text-white">
                  Image Positioning Mode
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (uploadedImage && !selectedFrame) {
    return (
      <Card className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 border-white/20 rounded-3xl overflow-hidden shadow-2xl">
        <div className="relative w-full h-full p-6">
          <div className="relative w-full h-full rounded-2xl overflow-hidden group">
            <img 
              src={uploadedImage} 
              alt="Card content"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-white text-xl font-bold mb-1 truncate">
                {cardName || 'Your Card'}
              </h3>
              <p className="text-gray-200 text-sm truncate">
                Select a frame to see the full design
              </p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return null;
};
