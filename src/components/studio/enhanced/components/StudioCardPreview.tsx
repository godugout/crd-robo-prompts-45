
import React from 'react';
import { EnhancedStudioPreview } from './EnhancedStudioPreview';
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
  return (
    <EnhancedStudioPreview
      uploadedImage={uploadedImage}
      selectedFrame={selectedFrame}
      orientation={orientation}
      show3DPreview={show3DPreview}
      cardName={cardName || 'PLAYER NAME'}
      onImageUpload={onImageUpload}
    />
  );
};
