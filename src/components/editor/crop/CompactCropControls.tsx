
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, RotateCw, Move, Maximize2, Undo, Redo } from 'lucide-react';

interface CropState {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface CompactCropControlsProps {
  cropState: CropState;
  onReset: () => void;
  onCenter: () => void;
  onFit: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onRotationChange: (rotation: number) => void;
}

export const CompactCropControls: React.FC<CompactCropControlsProps> = ({
  cropState,
  onReset,
  onCenter,
  onFit,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onRotationChange
}) => {
  const handleRotateBy = (degrees: number) => {
    const newRotation = (cropState.rotation + degrees) % 360;
    onRotationChange(newRotation);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-3 space-y-3">
      {/* Quick Actions Row */}
      <div className="flex gap-2 justify-center">
        <Button
          onClick={onCenter}
          size="sm"
          variant="outline"
          className="border-gray-600 text-white hover:bg-gray-700 text-xs"
        >
          <Move className="w-3 h-3 mr-1" />
          Center
        </Button>
        <Button
          onClick={onFit}
          size="sm"
          variant="outline"
          className="border-gray-600 text-white hover:bg-gray-700 text-xs"
        >
          <Maximize2 className="w-3 h-3 mr-1" />
          Fit
        </Button>
        <Button
          onClick={onReset}
          size="sm"
          variant="outline"
          className="border-gray-600 text-white hover:bg-gray-700 text-xs"
        >
          Reset
        </Button>
      </div>

      {/* Rotation & History Row */}
      <div className="flex justify-between items-center">
        {/* Rotation Controls */}
        <div className="flex items-center gap-1">
          <Button
            onClick={() => handleRotateBy(-15)}
            size="sm"
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-700 w-8 h-8 p-0"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
          <span className="text-white text-xs px-2">{Math.round(cropState.rotation)}°</span>
          <Button
            onClick={() => handleRotateBy(15)}
            size="sm"
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-700 w-8 h-8 p-0"
          >
            <RotateCw className="w-3 h-3" />
          </Button>
        </div>

        {/* Undo/Redo */}
        <div className="flex gap-1">
          <Button
            onClick={onUndo}
            disabled={!canUndo}
            size="sm"
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-700 disabled:opacity-50 w-8 h-8 p-0"
          >
            <Undo className="w-3 h-3" />
          </Button>
          <Button
            onClick={onRedo}
            disabled={!canRedo}
            size="sm"
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-700 disabled:opacity-50 w-8 h-8 p-0"
          >
            <Redo className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
