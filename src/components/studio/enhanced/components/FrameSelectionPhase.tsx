
import React from 'react';
import { FramePhase } from './FramePhase';

interface FrameSelectionPhaseProps {
  selectedFrame?: string;
  onFrameSelect: (frameId: string) => void;
  uploadedImage?: string;
}

export const FrameSelectionPhase: React.FC<FrameSelectionPhaseProps> = ({
  selectedFrame,
  onFrameSelect,
  uploadedImage
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
