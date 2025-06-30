
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImagePlus, Camera, Upload } from 'lucide-react';
import { calculateFlexibleCardSize, type CardOrientation } from '@/utils/cardDimensions';

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

  return (
    <div className="relative flex items-center justify-center min-h-[400px] p-4">
      <Card 
        className="bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 border-white/20 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-crd-green/20"
        style={{
          width: cardDimensions.width,
          height: cardDimensions.height,
          transform: show3DPreview ? 'perspective(1000px) rotateX(5deg) rotateY(-5deg)' : 'none'
        }}
      >
        <div className="relative w-full h-full p-6">
          {uploadedImage ? (
            <div className="relative w-full h-full rounded-2xl overflow-hidden group">
              <img 
                src={uploadedImage} 
                alt="Card content"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
              
              {/* Card Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white text-xl font-bold mb-1 truncate">
                  {cardName || 'Your Card'}
                </h3>
                <p className="text-gray-200 text-sm truncate">
                  Frame: {selectedFrame || 'Default'} • Effect: Active
                </p>
              </div>

              {/* Premium Effects Overlay */}
              {selectedFrame && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
                </div>
              )}
            </div>
          ) : (
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
          )}
        </div>
      </Card>

      {/* Dimension Info */}
      <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/10">
        <div className="text-white text-xs font-medium">
          {Math.round(cardDimensions.width)}×{Math.round(cardDimensions.height)}
        </div>
      </div>
    </div>
  );
};
