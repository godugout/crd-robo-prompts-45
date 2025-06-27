
import React from 'react';
import { EnhancedFrameSelector } from '../frames/EnhancedFrameSelector';

interface FrameSelectionStepProps {
  selectedFrame?: string;
  onFrameSelect: (frameId: string) => void;
  onComplete: () => void;
}

export const FrameSelectionStep: React.FC<FrameSelectionStepProps> = ({
  selectedFrame,
  onFrameSelect,
  onComplete
}) => {
  return (
    <EnhancedFrameSelector
      selectedFrame={selectedFrame}
      onFrameSelect={onFrameSelect}
      onComplete={onComplete}
    />
  );
};
