
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Eye, Image as ImageIcon, Upload, Wand2 } from 'lucide-react';
import { EnhancedStudioCardPreview } from './EnhancedStudioCardPreview';
import { FrameRenderer } from '@/components/editor/frames/FrameRenderer';
import { ProcessedImage } from '@/services/imageProcessing/ImageProcessingService';

type StudioPhase = 'upload' | 'frames' | 'effects' | 'layers' | 'export';
type CardOrientation = 'portrait' | 'landscape';

interface AdaptiveCardPreviewProps {
  currentPhase: StudioPhase;
  uploadedImage?: string;
  selectedFrame?: string;
  effectValues?: Record<string, any>;
  processedImage?: ProcessedImage | null;
  isProcessing?: boolean;
  cardOrientation?: CardOrientation;
  onImageUpload?: () => void;
}

const Simple2DPreview: React.FC<{
  phase: StudioPhase;
  uploadedImage?: string;
  selectedFrame?: string;
  effectValues?: Record<string, any>;
  cardOrientation?: CardOrientation;
  onImageUpload?: () => void;
}> = ({ phase, uploadedImage, selectedFrame, effectValues, cardOrientation = 'portrait', onImageUpload }) => {
  // Calculate card dimensions based on orientation
  const cardDimensions = useMemo(() => {
    const baseWidth = 300;
    const baseHeight = 420;
    return cardOrientation === 'portrait' 
      ? { width: baseWidth, height: baseHeight }
      : { width: baseHeight, height: baseWidth };
  }, [cardOrientation]);

  const getPreviewContent = () => {
    switch (phase) {
      case 'upload':
        return uploadedImage ? (
          <div className="relative w-full h-full rounded-2xl overflow-hidden">
            <img 
              src={uploadedImage} 
              alt="Uploaded" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-white text-lg font-bold">Image Uploaded</h3>
              <p className="text-white/80 text-sm">
                {cardOrientation === 'portrait' ? 'Portrait' : 'Landscape'} Trading Card
              </p>
              <p className="text-white/60 text-xs">Ready for frame selection</p>
            </div>
          </div>
        ) : (
          <div 
            className="w-full h-full border-2 border-dashed border-white/30 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:border-crd-green/50 hover:bg-crd-green/5"
            onClick={onImageUpload}
          >
            <Upload className="w-12 h-12 text-white/60 mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">Upload Your Image</h3>
            <p className="text-white/70 text-sm text-center max-w-xs">
              Choose a high-quality image for your {cardOrientation} trading card
            </p>
          </div>
        );

      case 'frames':
        return (
          <div className="w-full h-full relative">
            {selectedFrame && uploadedImage ? (
              <FrameRenderer
                frameId={selectedFrame}
                imageUrl={uploadedImage}
                title="Preview Card"
                subtitle="Frame Applied"
                width={cardDimensions.width}
                height={cardDimensions.height}
              />
            ) : uploadedImage ? (
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <img 
                  src={uploadedImage} 
                  alt="Card preview" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white text-lg font-bold">Select a Frame</h3>
                  <p className="text-white/80 text-sm">Choose from the sidebar</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex flex-col items-center justify-center">
                <ImageIcon className="w-12 h-12 text-white/60 mb-4" />
                <h3 className="text-white text-lg font-semibold mb-2">Upload Image First</h3>
                <p className="text-white/70 text-sm text-center">
                  Go back to upload phase to add your image
                </p>
              </div>
            )}
          </div>
        );

      case 'effects':
      case 'layers':
      case 'export':
        return (
          <div className="w-full h-full relative">
            <FrameRenderer
              frameId={selectedFrame || 'classic-sports'}
              imageUrl={uploadedImage}
              title="Enhanced Card"
              subtitle="Effects Applied"
              width={cardDimensions.width}
              height={cardDimensions.height}
            />
            {/* CSS-based effect overlays */}
            {effectValues && Object.keys(effectValues).length > 0 && (
              <div className="absolute inset-0 pointer-events-none">
                {Object.entries(effectValues).map(([effectId, value]) => {
                  if (!value || !value.intensity || value.intensity === 0) return null;
                  
                  switch (effectId) {
                    case 'holographic':
                      return (
                        <div 
                          key={effectId}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse rounded-2xl"
                          style={{ opacity: value.intensity / 100 }}
                        />
                      );
                    case 'chrome':
                      return (
                        <div 
                          key={effectId}
                          className="absolute inset-0 bg-gradient-to-br from-gray-300/20 to-gray-600/20 rounded-2xl"
                          style={{ opacity: value.intensity / 100 }}
                        />
                      );
                    case 'gold':
                      return (
                        <div 
                          key={effectId}
                          className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-yellow-600/30 rounded-2xl"
                          style={{ opacity: value.intensity / 100 }}
                        />
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <Wand2 className="w-12 h-12 text-white/60 mx-auto mb-4" />
              <h3 className="text-white text-lg font-semibold">Card Preview</h3>
              <p className="text-white/60 text-sm mt-2">
                {cardOrientation === 'portrait' ? 'Portrait' : 'Landscape'} Format
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div style={{ width: cardDimensions.width, height: cardDimensions.height }}>
        <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-white/20 rounded-3xl overflow-hidden shadow-2xl h-full">
          <CardContent className="p-6 h-full">
            {getPreviewContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const AdaptiveCardPreview: React.FC<AdaptiveCardPreviewProps> = ({
  currentPhase,
  uploadedImage,
  selectedFrame,
  effectValues = {},
  processedImage,
  isProcessing = false,
  cardOrientation = 'portrait',
  onImageUpload
}) => {
  const [previewMode, setPreviewMode] = useState<'2d' | '3d'>('2d');
  const [userHasToggled, setUserHasToggled] = useState(false);

  // Determine if 3D should be available based on content
  const is3DReady = useMemo(() => {
    return !!(uploadedImage && selectedFrame && currentPhase !== 'upload');
  }, [uploadedImage, selectedFrame, currentPhase]);

  // Auto-enable 3D when content is ready, but only if user hasn't manually toggled
  useEffect(() => {
    if (is3DReady && !userHasToggled && currentPhase === 'effects') {
      setPreviewMode('3d');
    }
  }, [is3DReady, userHasToggled, currentPhase]);

  const handleTogglePreview = () => {
    if (is3DReady) {
      setPreviewMode(prev => prev === '2d' ? '3d' : '2d');
      setUserHasToggled(true);
    }
  };

  const showToggleButton = is3DReady && currentPhase !== 'upload';

  return (
    <div className="w-full h-full bg-black relative flex items-center justify-center">
      {/* Preview Mode Toggle */}
      {showToggleButton && (
        <div className="absolute top-4 right-4 z-10">
          <Button
            onClick={handleTogglePreview}
            className={`${
              previewMode === '3d' 
                ? 'bg-crd-green text-black hover:bg-crd-green/90' 
                : 'bg-black/80 border-white/20 text-white hover:bg-white/10'
            } transition-all duration-200`}
            size="sm"
          >
            {previewMode === '3d' ? (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                3D View
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                2D View
              </>
            )}
          </Button>
        </div>
      )}

      {/* Phase Indicator */}
      <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur rounded-lg px-3 py-1">
        <span className="text-white text-sm font-medium capitalize">
          {currentPhase} Phase
        </span>
        <span className="text-white/60 text-xs ml-2">
          ({cardOrientation})
        </span>
      </div>

      {/* Preview Content */}
      <div className="w-full h-full flex items-center justify-center p-8">
        {previewMode === '3d' && is3DReady ? (
          <div className="w-full h-full">
            <EnhancedStudioCardPreview
              uploadedImage={uploadedImage}
              selectedFrame={selectedFrame}
              effectValues={effectValues}
              processedImage={processedImage}
              isProcessing={isProcessing}
            />
          </div>
        ) : (
          <Simple2DPreview
            phase={currentPhase}
            uploadedImage={uploadedImage}
            selectedFrame={selectedFrame}
            effectValues={effectValues}
            cardOrientation={cardOrientation}
            onImageUpload={onImageUpload}
          />
        )}
      </div>

      {/* 3D Ready Notification */}
      {is3DReady && previewMode === '2d' && !userHasToggled && currentPhase === 'frames' && (
        <div className="absolute bottom-4 right-4 z-10">
          <Button
            onClick={handleTogglePreview}
            className="bg-crd-green text-black hover:bg-crd-green/90 shadow-lg animate-pulse"
            size="sm"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Try 3D View
          </Button>
        </div>
      )}
    </div>
  );
};
