
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { EnhancedImageAdjustmentStep } from './EnhancedImageAdjustmentStep';
import { CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ImageAdjustmentStepProps {
  selectedPhoto: string;
  selectedFrame?: any;
  onImageAdjusted: (adjustedImageUrl: string) => void;
  onFrameChanged?: (frameId: string) => void;
  onSkip?: () => void;
}

export const ImageAdjustmentStep = ({ 
  selectedPhoto, 
  selectedFrame,
  onImageAdjusted, 
  onFrameChanged,
  onSkip 
}: ImageAdjustmentStepProps) => {
  // Use the enhanced version directly
  return (
    <EnhancedImageAdjustmentStep
      selectedPhoto={selectedPhoto}
      selectedFrame={selectedFrame}
      onImageAdjusted={onImageAdjusted}
      onFrameChanged={onFrameChanged}
      onSkip={onSkip}
    />
  );
};
