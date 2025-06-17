
import React from 'react';
import { EnhancedImageCropper } from './crop/EnhancedImageCropper';

interface ImageCropperProps {
  imageUrl: string;
  onCropComplete: (croppedImageUrl: string) => void;
  aspectRatio?: number;
  className?: string;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  imageUrl,
  onCropComplete,
  aspectRatio = 2.5 / 3.5,
  className = ""
}) => {
  return (
    <EnhancedImageCropper
      imageUrl={imageUrl}
      onCropComplete={onCropComplete}
      aspectRatio={aspectRatio}
      className={className}
    />
  );
};
