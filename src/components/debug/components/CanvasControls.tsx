
import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, Eye, EyeOff, Image, Layers } from 'lucide-react';

interface CanvasControlsProps {
  zoom: number;
  isPanning: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToScreen: () => void;
  onResetView: () => void;
  focusMode?: boolean;
  showBackground?: boolean;
  onToggleFocusMode?: () => void;
  onToggleBackground?: () => void;
  frameBuilderMode?: boolean;
}

export const CanvasControls: React.FC<CanvasControlsProps> = ({
  zoom,
  isPanning,
  onZoomIn,
  onZoomOut,
  onFitToScreen,
  onResetView,
  focusMode = false,
  showBackground = true,
  onToggleFocusMode,
  onToggleBackground,
  frameBuilderMode = false
}) => {
  return (
    <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 bg-black/80 backdrop-blur-sm rounded-lg p-2 border border-slate-600">
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={onZoomIn}
          className="text-white hover:bg-white/20 h-8 w-8 p-0"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={onZoomOut}
          className="text-white hover:bg-white/20 h-8 w-8 p-0"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={onFitToScreen}
          className="text-white hover:bg-white/20 h-8 w-8 p-0"
          title="Fit to Screen"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={onResetView}
          className="text-white hover:bg-white/20 h-8 w-8 p-0"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* New toggle controls */}
      {onToggleBackground && (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={onToggleBackground}
            className={`text-white hover:bg-white/20 h-8 w-8 p-0 ${
              showBackground ? 'bg-white/20' : ''
            }`}
            title={`${showBackground ? 'Hide' : 'Show'} Background (B)`}
          >
            <Image className="w-4 h-4" />
          </Button>

          {onToggleFocusMode && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onToggleFocusMode}
              className={`text-white hover:bg-white/20 h-8 w-8 p-0 ${
                focusMode ? 'bg-blue-500/50' : ''
              }`}
              title={`${focusMode ? 'Exit' : 'Enter'} Focus Mode (F)`}
            >
              <Layers className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
      
      <div className="text-xs text-slate-300 text-center px-2">
        {(zoom * 100).toFixed(0)}%
      </div>
      
      {isPanning && (
        <div className="text-xs text-green-400 text-center px-2">
          Panning
        </div>
      )}
      
      {focusMode && (
        <div className="flex items-center gap-1 text-xs text-blue-400 px-2">
          <Layers className="w-3 h-3" />
          Focus
        </div>
      )}

      {showBackground !== undefined && (
        <div className="flex items-center gap-1 text-xs text-slate-400 px-2">
          <Image className="w-3 h-3" />
          {showBackground ? 'BG On' : 'BG Off'}
        </div>
      )}
    </div>
  );
};
