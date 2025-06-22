
import React from 'react';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2, RotateCcw, Box, Square } from 'lucide-react';

interface ViewerControlButtonsProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  is3DEnabled?: boolean;
  onToggle3D?: () => void;
  onReset?: () => void;
  webgl3DSupported?: boolean;
}

export const ViewerControlButtons: React.FC<ViewerControlButtonsProps> = ({
  isFullscreen,
  onToggleFullscreen,
  is3DEnabled = false,
  onToggle3D,
  onReset,
  webgl3DSupported = true
}) => {
  return (
    <div className="absolute top-4 right-4 z-50 flex gap-2">
      {/* 3D Toggle */}
      {webgl3DSupported && onToggle3D && (
        <Button
          variant={is3DEnabled ? "default" : "outline"}
          size="sm"
          onClick={onToggle3D}
          className={`${
            is3DEnabled 
              ? 'bg-crd-green text-black hover:bg-crd-green/90' 
              : 'bg-black/50 text-white hover:bg-black/70 border-white/20'
          }`}
        >
          {is3DEnabled ? <Box className="w-4 h-4" /> : <Square className="w-4 h-4" />}
          <span className="ml-1">{is3DEnabled ? '3D' : '2D'}</span>
        </Button>
      )}

      {/* Reset View */}
      {onReset && (
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="bg-black/50 text-white hover:bg-black/70 border-white/20"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      )}

      {/* Fullscreen Toggle */}
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleFullscreen}
        className="bg-black/50 text-white hover:bg-black/70 border-white/20"
      >
        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </Button>
    </div>
  );
};
