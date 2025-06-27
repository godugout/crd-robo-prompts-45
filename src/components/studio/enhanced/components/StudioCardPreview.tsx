
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImagePlus, Camera, Upload } from 'lucide-react';
import { calculateFlexibleCardSize, type CardOrientation } from '@/utils/cardDimensions';
import { FramePreviewRenderer } from '../../frames/FramePreviewRenderer';
import { ENHANCED_FRAME_TEMPLATES } from '../../frames/EnhancedFrameTemplates';

interface StudioCardPreviewProps {
  uploadedImage?: string;
  selectedFrame?: string;
  orientation: CardOrientation;
  show3DPreview: boolean;
  cardName: string;
  onImageUpload?: () => void;
}

export const StudioCardPreview: React.FC<StudioCardPreviewProps> = ({
  uploadedImage,
  selectedFrame,
  orientation,
  show3DPreview,
  cardName,
  onImageUpload
}) => {
  const cardDimensions = calculateFlexibleCardSize(400, 500, orientation, 3, 0.5);
  const frameTemplate = selectedFrame ? ENHANCED_FRAME_TEMPLATES.find(f => f.id === selectedFrame) : null;

  return (
    <div className="relative flex items-center justify-center min-h-[400px] p-4">
      {frameTemplate && (uploadedImage || cardName) ? (
        // Show frame with content
        <div 
          className="relative transition-all duration-300 hover:scale-105"
          style={{
            transform: show3DPreview ? 'perspective(1000px) rotateX(5deg) rotateY(-5deg)' : 'none'
          }}
        >
          <FramePreviewRenderer
            template={frameTemplate}
            width={cardDimensions.width}
            height={cardDimensions.height}
            showContent={true}
            uploadedImage={uploadedImage}
            cardName={cardName}
            previewMode="interactive"
          />
          
          {/* Edit overlay for uploaded image */}
          {uploadedImage && onImageUpload && (
            <button
              onClick={onImageUpload}
              className="absolute top-2 left-2 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-colors"
              title="Change image"
            >
              <Camera className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        // Show upload area
        <Card 
          className="bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 border-white/20 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-crd-green/20"
          style={{
            width: cardDimensions.width,
            height: cardDimensions.height,
            transform: show3DPreview ? 'perspective(1000px) rotateX(5deg) rotateY(-5deg)' : 'none'
          }}
        >
          <div className="relative w-full h-full p-6">
            <div 
              className="w-full h-full rounded-2xl border-2 border-dashed border-white/30 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:border-crd-green/50 hover:bg-crd-green/5"
              onClick={onImageUpload}
            >
              <div className="text-center text-white/80 max-w-xs px-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-crd-green/20 to-blue-500/20 flex items-center justify-center">
                  <ImagePlus className="w-8 h-8 text-crd-green" />
                </div>
                <h3 className="text-lg font-bold mb-2">Add Your Image</h3>
                <p className="text-sm mb-4 text-white/70">
                  Upload your photo to start creating
                </p>
                <Button 
                  className="bg-crd-green hover:bg-crd-green/90 text-black font-bold px-6 py-2 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onImageUpload?.();
                  }}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Browse Files
                </Button>
                <p className="text-xs text-white/50 mt-3">
                  Supports JPG, PNG, WebP • Up to 50MB
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Dimension Info */}
      <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/10">
        <div className="text-white text-xs font-medium">
          {Math.round(cardDimensions.width)}×{Math.round(cardDimensions.height)}
          {frameTemplate && (
            <span className="ml-2 text-crd-green">• {frameTemplate.name}</span>
          )}
        </div>
      </div>

      {/* Frame info */}
      {frameTemplate && (
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/10">
          <div className="text-white text-xs font-medium">
            {frameTemplate.category} • {frameTemplate.rarity}
          </div>
        </div>
      )}
    </div>
  );
};
