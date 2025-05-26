
import React, { useRef, useEffect, useCallback } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import type { ManualRegion, DragState } from '../hooks/types';

interface EnhancedCanvasRegionEditorProps {
  originalImage: HTMLImageElement;
  detectedRegions: ManualRegion[];
  selectedRegions: Set<string>;
  isEditMode: boolean;
  dragState: DragState;
  onRegionSelect: (regionId: string) => void;
  onRegionToggle: (regionId: string) => void;
  onCanvasMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onCanvasMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onCanvasMouseUp: () => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
}

export const EnhancedCanvasRegionEditor = ({
  originalImage,
  detectedRegions,
  selectedRegions,
  isEditMode,
  dragState,
  onRegionSelect,
  onRegionToggle,
  onCanvasMouseDown,
  onCanvasMouseMove,
  onCanvasMouseUp,
  onSelectAll,
  onClearSelection
}: EnhancedCanvasRegionEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawCanvas = useCallback(() => {
    if (!canvasRef.current || !originalImage) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    
    ctx.drawImage(originalImage, 0, 0);
    
    detectedRegions.forEach(region => {
      const isSelected = selectedRegions.has(region.id);
      
      ctx.strokeStyle = isSelected ? '#10b981' : '#6b7280';
      ctx.lineWidth = 3;
      ctx.fillStyle = isSelected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)';
      
      ctx.fillRect(region.x, region.y, region.width, region.height);
      ctx.strokeRect(region.x, region.y, region.width, region.height);
      
      if (isEditMode && isSelected) {
        ctx.fillStyle = '#10b981';
        const handleSize = 8;
        
        ctx.fillRect(region.x - handleSize/2, region.y - handleSize/2, handleSize, handleSize);
        ctx.fillRect(region.x + region.width - handleSize/2, region.y - handleSize/2, handleSize, handleSize);
        ctx.fillRect(region.x - handleSize/2, region.y + region.height - handleSize/2, handleSize, handleSize);
        ctx.fillRect(region.x + region.width - handleSize/2, region.y + region.height - handleSize/2, handleSize, handleSize);
      }
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px sans-serif';
      ctx.fillText(
        region.isManual ? 'Manual' : `Card ${detectedRegions.indexOf(region) + 1}`,
        region.x + 5,
        region.y + 20
      );
    });
  }, [originalImage, detectedRegions, selectedRegions, isEditMode]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  return (
    <div className="h-full flex">
      <div className="flex-1 overflow-auto p-4">
        <div className="bg-gray-800 rounded-lg p-4">
          {isEditMode && (
            <div className="mb-4 p-3 bg-blue-600/20 border border-blue-500 rounded-lg">
              <p className="text-blue-300 text-sm">
                <strong>Edit Mode:</strong> Click and drag to create new card regions. 
                Click existing regions to select them. Use Delete button to remove selected regions.
              </p>
            </div>
          )}
          
          <canvas
            ref={canvasRef}
            className="max-w-full h-auto border border-gray-600 rounded cursor-crosshair"
            onMouseDown={onCanvasMouseDown}
            onMouseMove={onCanvasMouseMove}
            onMouseUp={onCanvasMouseUp}
          />
        </div>
      </div>
      
      <div className="w-80 border-l border-gray-700 bg-gray-800 p-4">
        <h3 className="text-white font-medium mb-4">Detected Regions ({detectedRegions.length})</h3>
        <ScrollArea className="h-96">
          <div className="space-y-2">
            {detectedRegions.map((region, index) => (
              <div
                key={region.id}
                className={`p-3 rounded border cursor-pointer transition-colors ${
                  selectedRegions.has(region.id)
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                onClick={() => onRegionToggle(region.id)}
              >
                <div className="text-white text-sm font-medium">
                  {region.isManual ? 'Manual Region' : `Card ${index + 1}`}
                </div>
                <div className="text-gray-400 text-xs">
                  {Math.round(region.width)} × {Math.round(region.height)}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="mt-4 space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSelectAll}
            className="w-full border-gray-600 text-white hover:bg-gray-700"
          >
            Select All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearSelection}
            className="w-full border-gray-600 text-white hover:bg-gray-700"
          >
            Clear Selection
          </Button>
        </div>
      </div>
    </div>
  );
};
