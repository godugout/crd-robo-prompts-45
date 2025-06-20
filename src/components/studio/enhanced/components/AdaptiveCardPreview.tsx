
import React from 'react';
import { StudioCardPreview } from './StudioCardPreview';
import { ProcessedImage } from '@/services/imageProcessing/ImageProcessingService';
import { type CardOrientation } from '@/utils/cardDimensions';

interface AdaptiveCardPreviewProps {
  currentPhase: string;
  uploadedImage: string;
  selectedFrame: string;
  effectValues: Record<string, any>;
  processedImage: ProcessedImage | null;
  isProcessing: boolean;
  cardOrientation: CardOrientation;
  onImageUpload: () => void;
}

export const AdaptiveCardPreview: React.FC<AdaptiveCardPreviewProps> = ({
  currentPhase,
  uploadedImage,
  selectedFrame,
  effectValues,
  processedImage,
  isProcessing,
  cardOrientation,
  onImageUpload
}) => {
  // Use processed image if available, otherwise use uploaded image
  const displayImage = processedImage?.processedUrl || uploadedImage;

  return (
    <div className="flex items-center justify-center h-full">
      <StudioCardPreview
        uploadedImage={displayImage}
        selectedFrame={selectedFrame}
        orientation={cardOrientation}
        show3DPreview={currentPhase === 'export'}
        cardName="PLAYER NAME"
        onImageUpload={onImageUpload}
      />
      
      {/* Processing Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-black/80 rounded-lg p-4 text-center">
            <div className="w-8 h-8 border-2 border-crd-green border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-white text-sm">Processing image...</p>
          </div>
        </div>
      )}
    </div>
  );
};
