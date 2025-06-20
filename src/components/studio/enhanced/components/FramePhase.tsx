
import React from 'react';
import { StudioFrameSelector } from './StudioFrameSelector';

interface FramePhaseProps {
  selectedFrame: string;
  onFrameSelect: (frameId: string) => void;
}

export const FramePhase: React.FC<FramePhaseProps> = ({
  selectedFrame,
  onFrameSelect
}) => {
  return (
    <div className="p-6 space-y-6">
      <StudioFrameSelector
        selectedFrame={selectedFrame}
        onFrameSelect={onFrameSelect}
      />
    </div>
  );
};
