
import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCw, RotateCcw, RefreshCw } from 'lucide-react';

interface ViewerControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: () => void;
  onFlip: () => void;
  onReset: () => void;
}

export const ViewerControls: React.FC<ViewerControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onRotate,
  onFlip,
  onReset
}) => {
  return (
    <div className="flex items-center justify-center gap-4 p-4 border-t border-white/10">
      <Button
        variant="outline"
        size="sm"
        onClick={onZoomOut}
        className="border-white/20 text-white hover:bg-white/10"
      >
        <ZoomOut className="w-4 h-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onZoomIn}
        className="border-white/20 text-white hover:bg-white/10"
      >
        <ZoomIn className="w-4 h-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onRotate}
        className="border-white/20 text-white hover:bg-white/10"
      >
        <RotateCw className="w-4 h-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onFlip}
        className="border-white/20 text-white hover:bg-white/10"
      >
        <RotateCcw className="w-4 h-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        className="border-white/20 text-white hover:bg-white/10"
      >
        <RefreshCw className="w-4 h-4" />
      </Button>
    </div>
  );
};
