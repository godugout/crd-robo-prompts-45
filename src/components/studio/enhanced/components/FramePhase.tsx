
import React from 'react';
import { StudioFrameSelector } from './StudioFrameSelector';
import { type CardOrientation } from '@/utils/cardDimensions';

interface FramePhaseProps {
  selectedFrame: string;
  onFrameSelect: (frameId: string) => void;
  orientation: CardOrientation;
}

export const FramePhase: React.FC<FramePhaseProps> = ({
  selectedFrame,
  onFrameSelect,
  orientation
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
