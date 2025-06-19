
import React from 'react';
import { EffectsPhase } from './EffectsPhase';

interface EffectControlsPhaseProps {
  effectValues: Record<string, any>;
  onEffectChange: (effectId: string, value: any) => void;
  uploadedImage?: string;
  selectedFrame?: string;
}

export const EffectControlsPhase: React.FC<EffectControlsPhaseProps> = ({
  effectValues,
  onEffectChange,
  uploadedImage,
  selectedFrame
}) => {
  return (
    <div className="p-6">
      <EffectsPhase
        effectValues={effectValues}
        onEffectChange={onEffectChange}
      />
    </div>
  );
};
