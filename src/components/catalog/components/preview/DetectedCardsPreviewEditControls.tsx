
import React from 'react';
import { Button } from '@/components/ui/button';
import { Move, Crop, RotateCw } from 'lucide-react';

export const DetectedCardsPreviewEditControls: React.FC = () => {
  return (
    <div className="absolute top-2 right-2 bg-black/70 rounded p-2 space-y-2">
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-white hover:bg-gray-700"
      >
        <Move className="w-4 h-4 mr-2" />
        Move
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-white hover:bg-gray-700"
      >
        <Crop className="w-4 h-4 mr-2" />
        Resize
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-white hover:bg-gray-700"
      >
        <RotateCw className="w-4 h-4 mr-2" />
        Rotate
      </Button>
    </div>
  );
};
