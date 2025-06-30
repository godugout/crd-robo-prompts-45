import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ProcessedPSDLayer } from '@/types/psdTypes';
import { Button } from '@/components/ui/button';

interface PreviewModeViewProps {
  layer: ProcessedPSDLayer;
}

export const PreviewModeView: React.FC<PreviewModeViewProps> = ({ layer }) => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <Card className="bg-slate-800 border-slate-700 p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-white">{layer.name}</h4>
        <Button variant="ghost" size="icon" onClick={toggleVisibility}>
          {isVisible ? 'Hide' : 'Show'}
        </Button>
      </div>
      <div className="h-24 bg-slate-700 rounded">
        {/* Placeholder for layer preview */}
      </div>
    </Card>
  );
};
