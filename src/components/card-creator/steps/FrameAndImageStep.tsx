
import React from 'react';
import { MinimalistFrameCarousel } from '@/components/editor/frames/MinimalistFrameCarousel';

interface FrameAndImageStepProps {
  selectedFrame?: string;
  uploadedImage?: string;
  onFrameSelect: (frameId: string) => void;
  onImageUpload: (imageUrl: string) => void;
}

export const FrameAndImageStep: React.FC<FrameAndImageStepProps> = ({
  selectedFrame,
  uploadedImage,
  onFrameSelect,
  onImageUpload
}) => {
  return (
    <div className="w-full h-full min-h-[600px]">
      <MinimalistFrameCarousel
        selectedFrame={selectedFrame}
        uploadedImage={uploadedImage}
        onFrameSelect={onFrameSelect}
        onImageUpload={onImageUpload}
      />
    </div>
  );
};
