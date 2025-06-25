
import React from 'react';
import { EnhancedCardStudio } from '@/components/studio/enhanced/EnhancedCardStudio';

interface FrameAndImageStepProps {
  selectedFrame: string;
  uploadedImage?: string;
  onFrameSelect: (frameId: string) => void;
  onImageUpload: (imageUrl: string) => void;
  theme: string;
  primaryColor: string;
}

export const FrameAndImageStep: React.FC<FrameAndImageStepProps> = ({
  selectedFrame,
  uploadedImage,
  onFrameSelect,
  onImageUpload,
  theme,
  primaryColor
}) => {
  console.log('Enhanced Studio with:', { selectedFrame, uploadedImage });
  
  return (
    <EnhancedCardStudio
      selectedFrame={selectedFrame}
      uploadedImage={uploadedImage}
      onFrameSelect={onFrameSelect}
      onImageUpload={onImageUpload}
      theme={theme}
      primaryColor={primaryColor}
    />
  );
};
