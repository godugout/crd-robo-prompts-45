
import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut } from 'lucide-react';

export const DetectedCardsPreviewHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between">
      <h4 className="text-white font-medium">Detection Preview</h4>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-gray-700"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-gray-700"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
