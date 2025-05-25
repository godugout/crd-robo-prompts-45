
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CardGenerator } from '../CardGenerator';

export const GeneratorTab = () => {
  return (
    <ScrollArea className="h-full px-4">
      <div className="space-y-4">
        <CardGenerator />
      </div>
    </ScrollArea>
  );
};
