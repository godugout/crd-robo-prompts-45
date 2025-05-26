
import React, { useState } from 'react';
import { Move, RotateCw, Crop, ZoomIn, ZoomOut, RotateCcw, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export interface CardAdjustment {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scale: number;
}

interface InteractiveCardToolbarProps {
  adjustment: CardAdjustment;
  onAdjustmentChange: (adjustment: CardAdjustment) => void;
  onConfirm: () => void;
  onCancel: () => void;
  disabled?: boolean;
}

export const InteractiveCardToolbar = ({
  adjustment,
  onAdjustmentChange,
  onConfirm,
  onCancel,
  disabled = false
}: InteractiveCardToolbarProps) => {
  const [activeMode, setActiveMode] = useState<'move' | 'crop' | 'rotate' | null>(null);

  const updateAdjustment = (updates: Partial<CardAdjustment>) => {
    onAdjustmentChange({ ...adjustment, ...updates });
  };

  const handleModeClick = (mode: 'move' | 'crop' | 'rotate') => {
    setActiveMode(activeMode === mode ? null : mode);
  };

  const handleRotate = (degrees: number) => {
    updateAdjustment({ rotation: adjustment.rotation + degrees });
  };

  const handleScale = (scale: number) => {
    updateAdjustment({ scale });
  };

  const handleReset = () => {
    onAdjustmentChange({
      x: 0,
      y: 0,
      width: 100,
      height: 140,
      rotation: 0,
      scale: 1
    });
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-4">
      {/* Mode Selection */}
      <div className="flex items-center justify-center space-x-2">
        <Button
          variant={activeMode === 'move' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleModeClick('move')}
          disabled={disabled}
          className={activeMode === 'move' ? 'bg-blue-600' : ''}
        >
          <Move className="w-4 h-4 mr-1" />
          Move
        </Button>
        <Button
          variant={activeMode === 'crop' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleModeClick('crop')}
          disabled={disabled}
          className={activeMode === 'crop' ? 'bg-green-600' : ''}
        >
          <Crop className="w-4 h-4 mr-1" />
          Crop
        </Button>
        <Button
          variant={activeMode === 'rotate' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleModeClick('rotate')}
          disabled={disabled}
          className={activeMode === 'rotate' ? 'bg-purple-600' : ''}
        >
          <RotateCw className="w-4 h-4 mr-1" />
          Rotate
        </Button>
      </div>

      {/* Rotation Controls */}
      <div className="space-y-2">
        <label className="text-white text-xs font-medium">Rotation</label>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRotate(-15)}
            disabled={disabled}
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
          <Slider
            value={[adjustment.rotation]}
            onValueChange={([value]) => updateAdjustment({ rotation: value })}
            min={-180}
            max={180}
            step={1}
            className="flex-1"
            disabled={disabled}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRotate(15)}
            disabled={disabled}
          >
            <RotateCw className="w-3 h-3" />
          </Button>
          <span className="text-white text-xs w-12 text-right">
            {Math.round(adjustment.rotation)}°
          </span>
        </div>
      </div>

      {/* Scale Controls */}
      <div className="space-y-2">
        <label className="text-white text-xs font-medium">Scale</label>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleScale(Math.max(0.1, adjustment.scale - 0.1))}
            disabled={disabled}
          >
            <ZoomOut className="w-3 h-3" />
          </Button>
          <Slider
            value={[adjustment.scale]}
            onValueChange={([value]) => updateAdjustment({ scale: value })}
            min={0.1}
            max={3}
            step={0.1}
            className="flex-1"
            disabled={disabled}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleScale(Math.min(3, adjustment.scale + 0.1))}
            disabled={disabled}
          >
            <ZoomIn className="w-3 h-3" />
          </Button>
          <span className="text-white text-xs w-12 text-right">
            {adjustment.scale.toFixed(1)}x
          </span>
        </div>
      </div>

      {/* Position Fine-Tuning */}
      {activeMode === 'move' && (
        <div className="space-y-2">
          <label className="text-white text-xs font-medium">Position</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-gray-400 text-xs">X</label>
              <Slider
                value={[adjustment.x]}
                onValueChange={([value]) => updateAdjustment({ x: value })}
                min={-50}
                max={50}
                step={1}
                disabled={disabled}
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs">Y</label>
              <Slider
                value={[adjustment.y]}
                onValueChange={([value]) => updateAdjustment({ y: value })}
                min={-50}
                max={50}
                step={1}
                disabled={disabled}
              />
            </div>
          </div>
        </div>
      )}

      {/* Size Fine-Tuning */}
      {activeMode === 'crop' && (
        <div className="space-y-2">
          <label className="text-white text-xs font-medium">Size</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-gray-400 text-xs">Width</label>
              <Slider
                value={[adjustment.width]}
                onValueChange={([value]) => updateAdjustment({ width: value })}
                min={20}
                max={200}
                step={1}
                disabled={disabled}
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs">Height</label>
              <Slider
                value={[adjustment.height]}
                onValueChange={([value]) => updateAdjustment({ height: value })}
                min={28}
                max={280}
                step={1}
                disabled={disabled}
              />
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-700">
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          disabled={disabled}
          className="text-gray-400"
        >
          Reset
        </Button>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={disabled}
          >
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onConfirm}
            disabled={disabled}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="w-4 h-4 mr-1" />
            Apply
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-xs text-gray-400 text-center">
        {activeMode === 'move' && 'Click and drag the card to reposition it'}
        {activeMode === 'crop' && 'Drag the corners to resize the crop area'}
        {activeMode === 'rotate' && 'Use rotation controls or drag to rotate'}
        {!activeMode && 'Select a tool above to begin editing'}
      </div>
    </div>
  );
};
