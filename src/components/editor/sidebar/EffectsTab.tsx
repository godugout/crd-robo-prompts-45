
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { QuickAdjustments } from './effects/QuickAdjustments';
import { VisualEffectsList } from './effects/VisualEffectsList';
import { EffectPresets } from './effects/EffectPresets';
import { EffectsPreview } from './effects/EffectsPreview';
import { AdvancedEffectsControls } from '../effects/AdvancedEffectsControls';
import { useCardEditor } from '@/hooks/useCardEditor';

interface EffectsTabProps {
  searchQuery?: string;
  onEffectsComplete?: () => void;
  cardEditor?: ReturnType<typeof useCardEditor>;
}

export const EffectsTab = ({ searchQuery = '', onEffectsComplete, cardEditor }: EffectsTabProps) => {
  return (
    <ScrollArea className="h-full px-4">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-white font-medium text-lg mb-2">Visual Effects</h3>
          <p className="text-crd-lightGray text-sm">
            Add stunning visual effects to your card
          </p>
        </div>

        {/* Advanced Effects Controls - only show if cardEditor is available */}
        {cardEditor && <AdvancedEffectsControls cardEditor={cardEditor} />}

        <QuickAdjustments />
        <VisualEffectsList searchQuery={searchQuery} />
        <EffectPresets />
        <EffectsPreview />
      </div>
    </ScrollArea>
  );
};
