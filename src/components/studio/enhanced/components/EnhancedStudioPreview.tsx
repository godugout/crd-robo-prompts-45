
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImagePlus, Move, RotateCw, Crop, ZoomIn, ZoomOut } from 'lucide-react';
import { ModularFrameBuilder } from '@/components/editor/frames/ModularFrameBuilder';
import { getFrameById } from '../frames/CardFrameConfigs';
import { calculateFlexibleCardSize, type CardOrientation } from '@/utils/cardDimensions';

interface ImageTransform {
  scale: number;
  rotation: number;
  offsetX: number;
  offsetY: number;
}

interface EnhancedStudioPreviewProps {
  uploadedImage?: string;
  selectedFrame?: string;
  orientation: CardOrientation;
  show3DPreview: boolean;
  cardName: string;
  onImageUpload?: () => void;
}

export const EnhancedStudioPreview: React.FC<EnhancedStudioPreviewProps> = ({
  uploadedImage,
  selectedFrame,
  orientation,
  show3DPreview,
  cardName,
  onImageUpload
}) => {
  const [imageTransform, setImageTransform] = useState<ImageTransform>({
    scale: 1,
    rotation: 0,
    offsetX: 0,
    offsetY: 0
  });
  const [showImageControls, setShowImageControls] = useState(false);

  // Debug logging for prop changes
  useEffect(() => {
    console.log('🎨 EnhancedStudioPreview - Props updated:', {
      uploadedImage: uploadedImage ? 'Present' : 'None',
      selectedFrame: selectedFrame || 'None',
      orientation,
      show3DPreview,
      cardName
    });
  }, [uploadedImage, selectedFrame, orientation, show3DPreview, cardName]);

  const cardDimensions = calculateFlexibleCardSize(400, 500, orientation, 3, 0.5);
  const frameConfig = selectedFrame ? getFrameById(selectedFrame) : null;

  // Debug frame config resolution
  useEffect(() => {
    console.log('🔧 Frame config resolution:', {
      selectedFrame,
      frameConfig: frameConfig ? 'Found' : 'Not found',
      frameConfigId: frameConfig?.id,
      frameConfigName: frameConfig?.name
    });
  }, [selectedFrame, frameConfig]);

  const handleImageTransform = (updates: Partial<ImageTransform>) => {
    setImageTransform(prev => ({ ...prev, ...updates }));
  };

  const resetImageTransform = () => {
    setImageTransform({
      scale: 1,
      rotation: 0,
      offsetX: 0,
      offsetY: 0
    });
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[400px] p-4">
      {/* Card Preview */}
      <div
        className="relative transition-all duration-300 hover:shadow-2xl"
        style={{
          width: cardDimensions.width,
          height: cardDimensions.height,
          transform: show3DPreview ? 'perspective(1000px) rotateX(5deg) rotateY(-5deg)' : 'none'
        }}
      >
        {uploadedImage && frameConfig ? (
          <div className="relative w-full h-full">
            {console.log('🖼️ Rendering ModularFrameBuilder with:', { frameConfig: frameConfig.name, uploadedImage: 'present' })}
            {/* Frame with integrated image */}
            <ModularFrameBuilder
              config={frameConfig}
              imageUrl={uploadedImage}
              title={cardName || 'PLAYER NAME'}
              subtitle="ROOKIE CARD • 2024"
              width={cardDimensions.width}
              height={cardDimensions.height}
            />
            
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
        ) : uploadedImage && !selectedFrame ? (
          /* Uploaded image without frame */
          <Card 
            className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 border-white/20 rounded-3xl overflow-hidden shadow-2xl"
          >
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
        ) : (
          /* Empty state */
          <Card 
            className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 border-white/20 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div 
              className="w-full h-full rounded-2xl border-2 border-dashed border-white/30 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:border-crd-green/50 hover:bg-crd-green/5"
              onClick={onImageUpload}
            >
              <div className="text-center text-white/80 max-w-xs px-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-crd-green/20 to-blue-500/20 flex items-center justify-center">
                  <ImagePlus className="w-8 h-8 text-crd-green" />
                </div>
                <h3 className="text-lg font-bold mb-2">Upload Your Image</h3>
                <p className="text-sm mb-4 text-white/70">
                  Add your photo to start creating
                </p>
                <Button 
                  className="bg-crd-green hover:bg-crd-green/90 text-black font-bold px-6 py-2 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onImageUpload?.();
                  }}
                >
                  Browse Files
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Image Transform Controls */}
      {uploadedImage && selectedFrame && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Button
              variant={showImageControls ? "default" : "outline"}
              size="sm"
              onClick={() => setShowImageControls(!showImageControls)}
              className={showImageControls ? 'bg-crd-green text-black' : ''}
            >
              <Move className="w-4 h-4 mr-2" />
              {showImageControls ? 'Done' : 'Adjust Image'}
            </Button>
          </div>

          {showImageControls && (
            <div className="bg-black/80 rounded-lg p-4 border border-white/10">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleImageTransform({ scale: Math.min(imageTransform.scale + 0.1, 2) })}
                  className="text-white border-white/20"
                >
                  <ZoomIn className="w-4 h-4 mr-2" />
                  Zoom In
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleImageTransform({ scale: Math.max(imageTransform.scale - 0.1, 0.5) })}
                  className="text-white border-white/20"
                >
                  <ZoomOut className="w-4 h-4 mr-2" />
                  Zoom Out
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleImageTransform({ rotation: imageTransform.rotation + 90 })}
                  className="text-white border-white/20"
                >
                  <RotateCw className="w-4 h-4 mr-2" />
                  Rotate
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetImageTransform}
                  className="text-white border-white/20"
                >
                  Reset
                </Button>
              </div>
              
              <div className="mt-3 text-center">
                <p className="text-white/70 text-xs">
                  Scale: {Math.round(imageTransform.scale * 100)}% • 
                  Rotation: {imageTransform.rotation}°
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Frame Info */}
      {frameConfig && (
        <div className="mt-3 text-center">
          <p className="text-white/90 font-medium">{frameConfig.name}</p>
          <p className="text-white/60 text-sm">
            {orientation === 'portrait' ? 'Portrait' : 'Landscape'} • 
            {Math.round(cardDimensions.width)}×{Math.round(cardDimensions.height)}
          </p>
        </div>
      )}

      {/* Dimension Info */}
      <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/10">
        <div className="text-white text-xs font-medium">
          {Math.round(cardDimensions.width)}×{Math.round(cardDimensions.height)}
        </div>
      </div>

      {/* Debug Info (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 bg-black/80 text-white text-xs p-2 rounded max-w-xs">
          <div>Image: {uploadedImage ? '✓' : '✗'}</div>
          <div>Frame: {selectedFrame || 'None'}</div>
          <div>Config: {frameConfig ? frameConfig.name : 'None'}</div>
          <div>Orientation: {orientation}</div>
        </div>
      )}
    </div>
  );
};
