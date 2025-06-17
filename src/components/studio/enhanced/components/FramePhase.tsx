
import React from 'react';
import { EnhancedFrameBrowser } from '../EnhancedFrameBrowser';
import { type CardOrientation } from '@/utils/cardDimensions';

interface FramePhaseProps {
  selectedFrame?: string;
  onFrameSelect: (frameId: string) => void;
  orientation: CardOrientation;
}

export const FramePhase: React.FC<FramePhaseProps> = ({
  selectedFrame,
  onFrameSelect,
  orientation
}) => {
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-300 mb-4">
        Choose the structural design and layout for your card.
      </div>

      <EnhancedFrameBrowser
        onFrameSelect={onFrameSelect}
        selectedFrame={selectedFrame}
        orientation={orientation}
      />
    </div>
  );
};
