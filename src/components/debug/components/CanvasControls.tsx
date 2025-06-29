
import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, Image, Focus } from 'lucide-react';

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
    <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-black/90 backdrop-blur-sm rounded-xl p-3 border border-slate-600 shadow-2xl">
      {/* Zoom Controls */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={onZoomIn}
          className="text-white hover:bg-white/20 h-9 w-9 p-0 rounded-lg"
          title="Zoom In (⌘ + Scroll)"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={onZoomOut}
          className="text-white hover:bg-white/20 h-9 w-9 p-0 rounded-lg"
          title="Zoom Out (⌘ + Scroll)"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        
        <div className="w-px h-6 bg-slate-600 mx-1"></div>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={onFitToScreen}
          className="text-white hover:bg-white/20 h-9 w-9 p-0 rounded-lg"
          title="Fit to Screen"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={onResetView}
          className="text-white hover:bg-white/20 h-9 w-9 p-0 rounded-lg"
          title="Reset View (R)"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* View Mode Controls */}
      {(onToggleBackground || onToggleFocusMode) && (
        <>
          <div className="w-full h-px bg-slate-600"></div>
          <div className="flex items-center gap-2">
            {onToggleBackground && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onToggleBackground}
                className={`text-white hover:bg-white/20 h-9 px-3 rounded-lg transition-all ${
                  showBackground 
                    ? 'bg-white/10 shadow-inner' 
                    : 'bg-transparent'
                }`}
                title={`${showBackground ? 'Hide' : 'Show'} Background (B)`}
              >
                <Image className="w-4 h-4 mr-2" />
                <span className="text-xs">BG</span>
              </Button>
            )}

            {onToggleFocusMode && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onToggleFocusMode}
                className={`text-white hover:bg-white/20 h-9 px-3 rounded-lg transition-all ${
                  focusMode 
                    ? 'bg-blue-500/30 shadow-inner border border-blue-400/30' 
                    : 'bg-transparent'
                }`}
                title={`${focusMode ? 'Exit' : 'Enter'} Focus Mode (F)`}
              >
                <Focus className="w-4 h-4 mr-2" />
                <span className="text-xs">Focus</span>
              </Button>
            )}
          </div>
        </>
      )}
      
      {/* Status Display */}
      <div className="text-center">
        <div className="text-xs text-slate-300 font-medium">
          {(zoom * 100).toFixed(0)}%
        </div>
        
        {isPanning && (
          <div className="text-xs text-green-400 mt-1 flex items-center justify-center gap-1">
            <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
            Panning
          </div>
        )}
        
        {focusMode && (
          <div className="text-xs text-blue-400 mt-1 flex items-center justify-center gap-1">
            <Focus className="w-3 h-3" />
            Focus
          </div>
        )}
      </div>
    </div>
  );
};
