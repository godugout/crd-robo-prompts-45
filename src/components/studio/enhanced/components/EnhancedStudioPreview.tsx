
import React, { useState, useEffect } from 'react';
import { calculateFlexibleCardSize, type CardOrientation } from '@/utils/cardDimensions';
import { getFrameById } from '../frames/CardFrameConfigs';
import { CardPreviewRenderer } from './CardPreviewRenderer';
import { EmptyCardState } from './EmptyCardState';
import { ImageTransformControls } from './ImageTransformControls';
import { PreviewMetadata } from './PreviewMetadata';

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
    
    // Log ModularFrameBuilder rendering when both image and frame are present
    if (uploadedImage && frameConfig) {
      console.log('🖼️ Rendering ModularFrameBuilder with:', { 
        frameConfig: frameConfig.name, 
        uploadedImage: 'present' 
      });
    }
  }, [selectedFrame, frameConfig, uploadedImage]);

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
        {(uploadedImage && frameConfig) || (uploadedImage && !selectedFrame) ? (
          <CardPreviewRenderer
            uploadedImage={uploadedImage}
            selectedFrame={selectedFrame}
            orientation={orientation}
            show3DPreview={show3DPreview}
            cardName={cardName}
            showImageControls={showImageControls}
          />
        ) : (
          <EmptyCardState onImageUpload={onImageUpload} />
        )}
      </div>

      {/* Image Transform Controls */}
      {uploadedImage && selectedFrame && (
        <ImageTransformControls
          imageTransform={imageTransform}
          showImageControls={showImageControls}
          onToggleControls={() => setShowImageControls(!showImageControls)}
          onImageTransform={handleImageTransform}
          onResetTransform={resetImageTransform}
        />
      )}

      {/* Preview Metadata */}
      <PreviewMetadata
        selectedFrame={selectedFrame}
        orientation={orientation}
        uploadedImage={uploadedImage}
      />
    </div>
  );
};
