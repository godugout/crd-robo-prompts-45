
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCw, Move, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageAdjustments {
  position: { x: number; y: number };
  scale: number;
  rotation: number;
}

interface ImageAdjustmentStepProps {
  imageUrl?: string;
  selectedFrame?: string;
  adjustments?: ImageAdjustments;
  onAdjustmentsChange: (adjustments: ImageAdjustments) => void;
}

export const ImageAdjustmentStep: React.FC<ImageAdjustmentStepProps> = ({
  imageUrl,
  selectedFrame,
  adjustments = { position: { x: 0, y: 0 }, scale: 1, rotation: 0 },
  onAdjustmentsChange
}) => {
  const [localAdjustments, setLocalAdjustments] = useState(adjustments);

  const updateAdjustments = (updates: Partial<ImageAdjustments>) => {
    const newAdjustments = { ...localAdjustments, ...updates };
    setLocalAdjustments(newAdjustments);
    onAdjustmentsChange(newAdjustments);
  };

  const resetAdjustments = () => {
    const defaultAdjustments = { position: { x: 0, y: 0 }, scale: 1, rotation: 0 };
    setLocalAdjustments(defaultAdjustments);
    onAdjustmentsChange(defaultAdjustments);
  };

  return (
    <div className="flex h-full">
      {/* Controls */}
      <div className="w-80 bg-editor-dark border-r border-editor-border p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-2">Adjust Your Image</h3>
          <p className="text-gray-400 text-sm">
            Position and resize your image to fit perfectly in the frame.
          </p>
        </div>

        <div className="space-y-6">
          {/* Position Controls */}
          <div>
            <h4 className="text-white font-medium mb-3 flex items-center">
              <Move className="w-4 h-4 mr-2" />
              Position
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateAdjustments({ 
                  position: { x: localAdjustments.position.x - 10, y: localAdjustments.position.y - 10 } 
                })}
                className="border-gray-600 text-white"
              >
                ↖
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateAdjustments({ 
                  position: { x: localAdjustments.position.x, y: localAdjustments.position.y - 10 } 
                })}
                className="border-gray-600 text-white"
              >
                ↑
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateAdjustments({ 
                  position: { x: localAdjustments.position.x + 10, y: localAdjustments.position.y - 10 } 
                })}
                className="border-gray-600 text-white"
              >
                ↗
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateAdjustments({ 
                  position: { x: localAdjustments.position.x - 10, y: localAdjustments.position.y } 
                })}
                className="border-gray-600 text-white"
              >
                ←
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateAdjustments({ position: { x: 0, y: 0 } })}
                className="border-gray-600 text-white"
              >
                ●
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateAdjustments({ 
                  position: { x: localAdjustments.position.x + 10, y: localAdjustments.position.y } 
                })}
                className="border-gray-600 text-white"
              >
                →
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateAdjustments({ 
                  position: { x: localAdjustments.position.x - 10, y: localAdjustments.position.y + 10 } 
                })}
                className="border-gray-600 text-white"
              >
                ↙
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateAdjustments({ 
                  position: { x: localAdjustments.position.x, y: localAdjustments.position.y + 10 } 
                })}
                className="border-gray-600 text-white"
              >
                ↓
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateAdjustments({ 
                  position: { x: localAdjustments.position.x + 10, y: localAdjustments.position.y + 10 } 
                })}
                className="border-gray-600 text-white"
              >
                ↘
              </Button>
            </div>
          </div>

          {/* Scale Controls */}
          <div>
            <h4 className="text-white font-medium mb-3">Scale</h4>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateAdjustments({ scale: Math.max(0.1, localAdjustments.scale - 0.1) })}
                className="border-gray-600 text-white"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-white text-sm flex-1 text-center">
                {Math.round(localAdjustments.scale * 100)}%
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateAdjustments({ scale: Math.min(3, localAdjustments.scale + 0.1) })}
                className="border-gray-600 text-white"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={localAdjustments.scale}
              onChange={(e) => updateAdjustments({ scale: parseFloat(e.target.value) })}
              className="w-full mt-2 accent-crd-green"
            />
          </div>

          {/* Rotation Controls */}
          <div>
            <h4 className="text-white font-medium mb-3 flex items-center">
              <RotateCw className="w-4 h-4 mr-2" />
              Rotation
            </h4>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateAdjustments({ rotation: localAdjustments.rotation - 15 })}
                className="border-gray-600 text-white"
              >
                -15°
              </Button>
              <span className="text-white text-sm flex-1 text-center">
                {localAdjustments.rotation}°
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateAdjustments({ rotation: localAdjustments.rotation + 15 })}
                className="border-gray-600 text-white"
              >
                +15°
              </Button>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              step="15"
              value={localAdjustments.rotation}
              onChange={(e) => updateAdjustments({ rotation: parseInt(e.target.value) })}
              className="w-full mt-2 accent-crd-green"
            />
          </div>

          {/* Reset Button */}
          <Button
            onClick={resetAdjustments}
            variant="outline"
            className="w-full border-gray-600 text-white"
          >
            Reset to Default
          </Button>
        </div>
      </div>

      {/* Live Preview */}
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="aspect-[5/7] w-80 bg-gray-800 rounded-lg border border-gray-700 relative overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Card preview"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-200"
              style={{
                transform: `translate(${localAdjustments.position.x}px, ${localAdjustments.position.y}px) scale(${localAdjustments.scale}) rotate(${localAdjustments.rotation}deg)`,
                transformOrigin: 'center center'
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-700 rounded mx-auto mb-4"></div>
                <p className="text-sm">No image uploaded</p>
              </div>
            </div>
          )}
          
          {/* Frame overlay would go here */}
          <div className="absolute inset-0 pointer-events-none border-4 border-dashed border-crd-green/30 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};
