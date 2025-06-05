
import React from 'react';
import { RotateCcw, ZoomIn, ZoomOut, Sparkles, RotateCw, Move, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileViewerControlsProps {
  showEffects: boolean;
  autoRotate: boolean;
  onToggleEffects: () => void;
  onToggleAutoRotate: () => void;
  onReset: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onShowGestureHelp: () => void;
  className?: string;
}

export const MobileViewerControls: React.FC<MobileViewerControlsProps> = ({
  showEffects,
  autoRotate,
  onToggleEffects,
  onToggleAutoRotate,
  onReset,
  onZoomIn,
  onZoomOut,
  onShowGestureHelp,
  className = ''
}) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {/* Primary Controls Row */}
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="lg"
          onClick={onToggleEffects}
          className={`
            bg-black bg-opacity-70 hover:bg-opacity-80 backdrop-blur border border-white/20 
            text-white min-h-[48px] min-w-[48px] touch-manipulation
            ${showEffects ? 'ring-2 ring-crd-green' : ''}
          `}
          aria-label="Toggle Effects"
        >
          <Sparkles className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="lg"
          onClick={onToggleAutoRotate}
          className={`
            bg-black bg-opacity-70 hover:bg-opacity-80 backdrop-blur border border-white/20 
            text-white min-h-[48px] min-w-[48px] touch-manipulation
            ${autoRotate ? 'ring-2 ring-crd-green' : ''}
          `}
          aria-label="Auto Rotate"
        >
          <RotateCw className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="lg"
          onClick={onReset}
          className="bg-black bg-opacity-70 hover:bg-opacity-80 backdrop-blur border border-white/20 text-white min-h-[48px] min-w-[48px] touch-manipulation"
          aria-label="Reset View"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>

      {/* Zoom Controls Row */}
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="lg"
          onClick={onZoomOut}
          className="bg-black bg-opacity-70 hover:bg-opacity-80 backdrop-blur border border-white/20 text-white min-h-[48px] min-w-[48px] touch-manipulation"
          aria-label="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="lg"
          onClick={onZoomIn}
          className="bg-black bg-opacity-70 hover:bg-opacity-80 backdrop-blur border border-white/20 text-white min-h-[48px] min-w-[48px] touch-manipulation"
          aria-label="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="lg"
          onClick={onShowGestureHelp}
          className="bg-black bg-opacity-70 hover:bg-opacity-80 backdrop-blur border border-white/20 text-white min-h-[48px] min-w-[48px] touch-manipulation"
          aria-label="Gesture Help"
        >
          <Info className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
