
import React from 'react';
import { 
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ViewerControlsProps {
  showEffects: boolean;
  autoRotate: boolean;
  onToggleEffects: () => void;
  onToggleAutoRotate: () => void;
  onReset: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const ViewerControls: React.FC<ViewerControlsProps> = ({
  showEffects,
  autoRotate,
  onToggleEffects,
  onToggleAutoRotate,
  onReset,
  onZoomIn,
  onZoomOut
}) => {
  return (
    <div className="absolute bottom-4 left-4 flex space-x-2 z-10">
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleEffects}
        className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur border border-white/20"
      >
        {showEffects ? <Eye className="w-4 h-4 text-white" /> : <EyeOff className="w-4 h-4 text-white" />}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleAutoRotate}
        className={`bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur border border-white/20 ${autoRotate ? 'bg-opacity-40' : ''}`}
      >
        <RotateCw className="w-4 h-4 text-white" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onReset}
        className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur border border-white/20"
      >
        <Move className="w-4 h-4 text-white" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onZoomIn}
        className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur border border-white/20"
      >
        <ZoomIn className="w-4 h-4 text-white" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onZoomOut}
        className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur border border-white/20"
      >
        <ZoomOut className="w-4 h-4 text-white" />
      </Button>
    </div>
  );
};
