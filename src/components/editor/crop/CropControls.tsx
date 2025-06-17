
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RotateCcw, RotateCw, Move, Maximize2, Undo, Redo } from 'lucide-react';

interface CropState {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface CropControlsProps {
  cropState: CropState;
  onPositionChange: (x: number, y: number) => void;
  onSizeChange: (width: number, height: number) => void;
  onRotationChange: (rotation: number) => void;
  onReset: () => void;
  onCenter: () => void;
  onFit: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  aspectRatio: number;
}

export const CropControls: React.FC<CropControlsProps> = ({
  cropState,
  onPositionChange,
  onSizeChange,
  onRotationChange,
  onReset,
  onCenter,
  onFit,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  aspectRatio
}) => {
  const handlePositionChange = (field: 'x' | 'y', value: string) => {
    const numValue = parseFloat(value) || 0;
    if (field === 'x') {
      onPositionChange(numValue, cropState.y);
    } else {
      onPositionChange(cropState.x, numValue);
    }
  };

  const handleSizeChange = (field: 'width' | 'height', value: string) => {
    const numValue = parseFloat(value) || 0;
    if (field === 'width') {
      const newHeight = numValue / aspectRatio;
      onSizeChange(numValue, newHeight);
    } else {
      const newWidth = numValue * aspectRatio;
      onSizeChange(newWidth, numValue);
    }
  };

  const handleRotationChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    onRotationChange(numValue % 360);
  };

  const handleRotateBy = (degrees: number) => {
    const newRotation = (cropState.rotation + degrees) % 360;
    onRotationChange(newRotation);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-4">
      {/* Position Controls */}
      <div className="space-y-2">
        <Label className="text-white font-medium">Position</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="pos-x" className="text-sm text-gray-300">X</Label>
            <Input
              id="pos-x"
              type="number"
              value={Math.round(cropState.x)}
              onChange={(e) => handlePositionChange('x', e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <div>
            <Label htmlFor="pos-y" className="text-sm text-gray-300">Y</Label>
            <Input
              id="pos-y"
              type="number"
              value={Math.round(cropState.y)}
              onChange={(e) => handlePositionChange('y', e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </div>
      </div>

      {/* Size Controls */}
      <div className="space-y-2">
        <Label className="text-white font-medium">Size</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="size-w" className="text-sm text-gray-300">Width</Label>
            <Input
              id="size-w"
              type="number"
              value={Math.round(cropState.width)}
              onChange={(e) => handleSizeChange('width', e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <div>
            <Label htmlFor="size-h" className="text-sm text-gray-300">Height</Label>
            <Input
              id="size-h"
              type="number"
              value={Math.round(cropState.height)}
              onChange={(e) => handleSizeChange('height', e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </div>
        <div className="text-xs text-gray-400">
          Aspect ratio locked to {aspectRatio.toFixed(2)}:1
        </div>
      </div>

      {/* Rotation Controls */}
      <div className="space-y-2">
        <Label className="text-white font-medium">Rotation</Label>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleRotateBy(-15)}
            size="sm"
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-700"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Input
            type="number"
            value={Math.round(cropState.rotation)}
            onChange={(e) => handleRotationChange(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white flex-1"
            placeholder="0°"
          />
          <Button
            onClick={() => handleRotateBy(15)}
            size="sm"
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-700"
          >
            <RotateCw className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => onRotationChange(0)}
            size="sm"
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-700 text-xs"
          >
            0°
          </Button>
          <Button
            onClick={() => onRotationChange(90)}
            size="sm"
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-700 text-xs"
          >
            90°
          </Button>
          <Button
            onClick={() => onRotationChange(180)}
            size="sm"
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-700 text-xs"
          >
            180°
          </Button>
          <Button
            onClick={() => onRotationChange(270)}
            size="sm"
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-700 text-xs"
          >
            270°
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <Label className="text-white font-medium">Quick Actions</Label>
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={onCenter}
            size="sm"
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-700"
          >
            <Move className="w-4 h-4 mr-1" />
            Center
          </Button>
          <Button
            onClick={onFit}
            size="sm"
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-700"
          >
            <Maximize2 className="w-4 h-4 mr-1" />
            Fit
          </Button>
          <Button
            onClick={onReset}
            size="sm"
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-700"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Undo/Redo */}
      <div className="flex gap-2">
        <Button
          onClick={onUndo}
          disabled={!canUndo}
          size="sm"
          variant="outline"
          className="border-gray-600 text-white hover:bg-gray-700 disabled:opacity-50"
        >
          <Undo className="w-4 h-4 mr-1" />
          Undo
        </Button>
        <Button
          onClick={onRedo}
          disabled={!canRedo}
          size="sm"
          variant="outline"
          className="border-gray-600 text-white hover:bg-gray-700 disabled:opacity-50"
        >
          <Redo className="w-4 h-4 mr-1" />
          Redo
        </Button>
      </div>
    </div>
  );
};
