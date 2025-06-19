
import React from 'react';
import { FramePhase } from './FramePhase';
import { ProcessedImage } from '@/services/imageProcessing/ImageProcessingService';

interface FrameSelectionPhaseProps {
  selectedFrame?: string;
  onFrameSelect: (frameId: string) => void;
  uploadedImage?: string;
  processedImage?: ProcessedImage | null;
}

export const FrameSelectionPhase: React.FC<FrameSelectionPhaseProps> = ({
  selectedFrame,
  onFrameSelect,
  uploadedImage,
  processedImage
}) => {
  return (
    <div className="p-6">
      <FramePhase
        selectedFrame={selectedFrame}
        onFrameSelect={onFrameSelect}
        orientation="portrait"
      />
    </div>
  );
};
