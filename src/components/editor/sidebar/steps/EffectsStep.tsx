
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { EffectsTab } from '../EffectsTab';

interface EffectsStepProps {
  searchQuery: string;
  onEffectsComplete: () => void;
}

export const EffectsStep = ({ searchQuery, onEffectsComplete }: EffectsStepProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <EffectsTab searchQuery={searchQuery} onEffectsComplete={onEffectsComplete} />
      </div>
    </div>
  );
};
