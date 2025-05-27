
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Eye,
  EyeOff
} from 'lucide-react';

interface ReviewCanvasControlsProps {
  currentImageIndex: number;
  totalImages: number;
  totalCards: number;
  selectedCount: number;
  showAllBoxes: boolean;
  zoom: number;
  onToggleShowAll: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
}

export const ReviewCanvasControls: React.FC<ReviewCanvasControlsProps> = ({
  currentImageIndex,
  totalImages,
  totalCards,
  selectedCount,
  showAllBoxes,
  zoom,
  onToggleShowAll,
  onZoomIn,
  onZoomOut,
  onResetView
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
      <div className="flex items-center gap-4">
        <h3 className="text-white font-medium">
          Image {currentImageIndex + 1} of {totalImages}
        </h3>
        <Badge variant="secondary">
          {totalCards} cards • {selectedCount} selected
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleShowAll}
          className="text-gray-300"
        >
          {showAllBoxes ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showAllBoxes ? 'Hide Unselected' : 'Show All'}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onZoomOut}
          disabled={zoom <= 0.5}
          className="text-gray-300"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>

        <span className="text-gray-300 text-sm">{Math.round(zoom * 100)}%</span>

        <Button
          variant="outline"
          size="sm"
          onClick={onZoomIn}
          disabled={zoom >= 3}
          className="text-gray-300"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onResetView}
          className="text-gray-300"
        >
          <RotateCcw className="w-4 h-4" />
          Reset View
        </Button>
      </div>
    </div>
  );
};
