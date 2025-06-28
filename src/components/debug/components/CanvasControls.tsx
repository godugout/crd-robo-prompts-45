
import React from 'react';
import { PSDButton } from '@/components/ui/design-system/PSDButton';
import { Badge } from '@/components/ui/badge';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw,
  Move
} from 'lucide-react';

interface CanvasControlsProps {
  zoom: number;
  isPanning: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToScreen: () => void;
  onResetView: () => void;
  minZoom?: number;
  maxZoom?: number;
}

export const CanvasControls: React.FC<CanvasControlsProps> = ({
  zoom,
  isPanning,
  onZoomIn,
  onZoomOut,
  onFitToScreen,
  onResetView,
  minZoom = 0.1,
  maxZoom = 5
}) => {
  const zoomPercentage = Math.round(zoom * 100);

  return (
    <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
      {/* Zoom Controls */}
      <div className="bg-[#1a1f2e] border border-slate-700 rounded-lg p-1 flex items-center gap-1">
        <PSDButton
          variant="ghost"
          size="sm"
          onClick={onZoomOut}
          disabled={zoom <= minZoom}
          className="p-2"
        >
          <ZoomOut className="w-4 h-4" />
        </PSDButton>
        
        <Badge 
          variant="outline" 
          className="bg-slate-800 text-slate-300 border-slate-600 min-w-[60px] text-center"
        >
          {zoomPercentage}%
        </Badge>
        
        <PSDButton
          variant="ghost"
          size="sm"
          onClick={onZoomIn}
          disabled={zoom >= maxZoom}
          className="p-2"
        >
          <ZoomIn className="w-4 h-4" />
        </PSDButton>
      </div>

      {/* View Controls */}
      <div className="bg-[#1a1f2e] border border-slate-700 rounded-lg p-1 flex items-center gap-1">
        <PSDButton
          variant="ghost"
          size="sm"
          onClick={onFitToScreen}
          className="p-2"
        >
          <Maximize2 className="w-4 h-4" />
        </PSDButton>
        
        <PSDButton
          variant="ghost"
          size="sm"
          onClick={onResetView}
          className="p-2"
        >
          <RotateCcw className="w-4 h-4" />
        </PSDButton>
      </div>

      {/* Pan Indicator */}
      {isPanning && (
        <div className="bg-crd-blue/20 border border-crd-blue rounded-lg p-2 flex items-center gap-2">
          <Move className="w-4 h-4 text-crd-blue" />
          <span className="text-sm text-crd-blue font-medium">Panning</span>
        </div>
      )}
    </div>
  );
};
