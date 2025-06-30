
import React from 'react';
import { MinimalistFrameCarousel } from '@/components/editor/frames/MinimalistFrameCarousel';

interface EnhancedCardStudioProps {
  selectedFrame?: string;
  uploadedImage?: string;
  onFrameSelect: (frameId: string) => void;
  onImageUpload: (imageUrl: string) => void;
  theme?: string;
  primaryColor?: string;
}

export const EnhancedCardStudio: React.FC<EnhancedCardStudioProps> = ({
  selectedFrame,
  uploadedImage,
  onFrameSelect,
  onImageUpload,
  theme = 'default',
  primaryColor = '#00ff88'
}) => {
  console.log('EnhancedCardStudio rendering with:', { 
    selectedFrame, 
    uploadedImage, 
    theme, 
    primaryColor 
  });

  return (
    <div className="w-full h-full min-h-[600px]" style={{
      '--primary-color': primaryColor
    } as React.CSSProperties}>
      <MinimalistFrameCarousel
        selectedFrame={selectedFrame}
        uploadedImage={uploadedImage}
        onFrameSelect={onFrameSelect}
        onImageUpload={onImageUpload}
      />
    </div>
  );
};
