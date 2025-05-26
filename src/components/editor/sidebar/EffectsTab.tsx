
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { QuickAdjustments } from './effects/QuickAdjustments';
import { VisualEffectsList } from './effects/VisualEffectsList';
import { EffectPresets } from './effects/EffectPresets';
import { EffectsPreview } from './effects/EffectsPreview';

interface EffectsTabProps {
  searchQuery?: string;
  onEffectsComplete?: () => void;
}

export const EffectsTab = ({ searchQuery = '', onEffectsComplete }: EffectsTabProps) => {
  return (
    <ScrollArea className="h-full px-4">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-white font-medium text-lg mb-2">Visual Effects</h3>
          <p className="text-crd-lightGray text-sm">
            Add stunning visual effects to your card
          </p>
        </div>

        <QuickAdjustments />
        <VisualEffectsList searchQuery={searchQuery} />
        <EffectPresets />
        <EffectsPreview />
      </div>
    </ScrollArea>
  );
};
