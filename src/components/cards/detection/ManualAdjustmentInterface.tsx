
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RotateCcw, Move, Crop, RotateCw, Check, X } from 'lucide-react';

interface CardRegion {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
}

interface ManualAdjustmentInterfaceProps {
  image: HTMLImageElement;
  regions: CardRegion[];
  selectedRegionId: string | null;
  onRegionUpdate: (regionId: string, updates: Partial<CardRegion>) => void;
  onRegionSelect: (regionId: string | null) => void;
  onConfirmAdjustment: () => void;
  onCancelAdjustment: () => void;
}

export const ManualAdjustmentInterface: React.FC<ManualAdjustmentInterfaceProps> = ({
  image,
  regions,
  selectedRegionId,
  onRegionUpdate,
  onRegionSelect,
  onConfirmAdjustment,
  onCancelAdjustment
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [adjustmentMode, setAdjustmentMode] = useState<'move' | 'resize' | null>(null);
  const [scale, setScale] = useState(1);

  const selectedRegion = regions.find(r => r.id === selectedRegionId);

  // Draw the interface
  useEffect(() => {
    if (!canvasRef.current || !image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    
    // Set canvas size to fit container while maintaining aspect ratio
    const containerWidth = canvas.parentElement?.clientWidth || 800;
    const containerHeight = 600;
    
    const imageAspect = image.width / image.height;
    const containerAspect = containerWidth / containerHeight;
    
    let displayWidth, displayHeight;
    if (imageAspect > containerAspect) {
      displayWidth = containerWidth;
      displayHeight = containerWidth / imageAspect;
    } else {
      displayHeight = containerHeight;
      displayWidth = containerHeight * imageAspect;
    }
    
    canvas.width = displayWidth;
    canvas.height = displayHeight;
    
    const scaleX = displayWidth / image.width;
    const scaleY = displayHeight / image.height;
    setScale(Math.min(scaleX, scaleY));
    
    // Clear and draw image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, displayWidth, displayHeight);
    
    // Draw all regions
    regions.forEach(region => {
      const isSelected = region.id === selectedRegionId;
      
      ctx.strokeStyle = isSelected ? '#22c55e' : '#ef4444';
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.setLineDash(isSelected ? [] : [5, 5]);
      
      const x = region.x * scaleX;
      const y = region.y * scaleY;
      const width = region.width * scaleX;
      const height = region.height * scaleY;
      
      ctx.strokeRect(x, y, width, height);
      
      // Draw confidence badge
      ctx.fillStyle = isSelected ? '#22c55e' : '#ef4444';
      ctx.fillRect(x, y - 20, 60, 20);
      ctx.fillStyle = 'white';
      ctx.font = '12px sans-serif';
      ctx.fillText(`${Math.round(region.confidence * 100)}%`, x + 5, y - 5);
      
      // Draw resize handles for selected region
      if (isSelected) {
        const handleSize = 8;
        ctx.fillStyle = '#22c55e';
        
        // Corner handles
        ctx.fillRect(x - handleSize/2, y - handleSize/2, handleSize, handleSize);
        ctx.fillRect(x + width - handleSize/2, y - handleSize/2, handleSize, handleSize);
        ctx.fillRect(x + width - handleSize/2, y + height - handleSize/2, handleSize, handleSize);
        ctx.fillRect(x - handleSize/2, y + height - handleSize/2, handleSize, handleSize);
        
        // Edge handles
        ctx.fillRect(x + width/2 - handleSize/2, y - handleSize/2, handleSize, handleSize);
        ctx.fillRect(x + width - handleSize/2, y + height/2 - handleSize/2, handleSize, handleSize);
        ctx.fillRect(x + width/2 - handleSize/2, y + height - handleSize/2, handleSize, handleSize);
        ctx.fillRect(x - handleSize/2, y + height/2 - handleSize/2, handleSize, handleSize);
      }
    });
    
    ctx.setLineDash([]);
  }, [image, regions, selectedRegionId, scale]);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !image) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    // Find clicked region
    const clickedRegion = regions.find(region => 
      x >= region.x && x <= region.x + region.width &&
      y >= region.y && y <= region.y + region.height
    );

    onRegionSelect(clickedRegion?.id || null);
  }, [image, regions, scale, onRegionSelect]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedRegion || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    setIsDragging(true);
    setDragStart({ x, y });
    
    // Determine if we're near a resize handle
    const handleSize = 8;
    const region = selectedRegion;
    
    const handles = [
      { x: region.x, y: region.y, type: 'resize' },
      { x: region.x + region.width, y: region.y, type: 'resize' },
      { x: region.x + region.width, y: region.y + region.height, type: 'resize' },
      { x: region.x, y: region.y + region.height, type: 'resize' }
    ];
    
    const nearHandle = handles.find(handle => 
      Math.abs(x - handle.x) < handleSize && Math.abs(y - handle.y) < handleSize
    );
    
    setAdjustmentMode(nearHandle ? 'resize' : 'move');
  }, [selectedRegion, scale]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedRegion || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    const deltaX = x - dragStart.x;
    const deltaY = y - dragStart.y;

    if (adjustmentMode === 'move') {
      onRegionUpdate(selectedRegion.id, {
        x: Math.max(0, Math.min(image.width - selectedRegion.width, selectedRegion.x + deltaX)),
        y: Math.max(0, Math.min(image.height - selectedRegion.height, selectedRegion.y + deltaY))
      });
    } else if (adjustmentMode === 'resize') {
      const newWidth = Math.max(50, selectedRegion.width + deltaX);
      const newHeight = Math.max(70, selectedRegion.height + deltaY);
      
      onRegionUpdate(selectedRegion.id, {
        width: Math.min(image.width - selectedRegion.x, newWidth),
        height: Math.min(image.height - selectedRegion.y, newHeight)
      });
    }

    setDragStart({ x, y });
  }, [isDragging, selectedRegion, scale, dragStart, adjustmentMode, onRegionUpdate, image]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setAdjustmentMode(null);
  }, []);

  const handlePreciseAdjustment = useCallback((property: keyof CardRegion, value: number) => {
    if (!selectedRegion) return;
    onRegionUpdate(selectedRegion.id, { [property]: value });
  }, [selectedRegion, onRegionUpdate]);

  return (
    <Card className="bg-editor-dark border-editor-border">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Manual Adjustment</h3>
            <div className="flex gap-2">
              <Button
                onClick={onCancelAdjustment}
                variant="outline"
                size="sm"
                className="border-red-500 text-red-400 hover:bg-red-500/10"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={onConfirmAdjustment}
                variant="default"
                size="sm"
                className="bg-crd-green hover:bg-crd-green/80 text-black"
              >
                <Check className="w-4 h-4 mr-2" />
                Confirm
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main canvas area */}
            <div className="lg:col-span-2">
              <div className="border border-editor-border rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  className="w-full h-auto cursor-crosshair"
                  style={{ maxHeight: '600px' }}
                />
              </div>
              <div className="mt-2 text-sm text-crd-lightGray">
                Click to select regions • Drag to move • Drag corners to resize
              </div>
            </div>

            {/* Controls panel */}
            <div className="space-y-4">
              {selectedRegion && (
                <>
                  <div>
                    <h4 className="text-sm font-medium text-white mb-2">Region Controls</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-crd-lightGray">X Position</label>
                        <Slider
                          value={[selectedRegion.x]}
                          onValueChange={([value]) => handlePreciseAdjustment('x', value)}
                          max={image?.width || 1000}
                          step={1}
                          className="mt-1"
                        />
                        <div className="text-xs text-crd-lightGray mt-1">{Math.round(selectedRegion.x)}px</div>
                      </div>
                      
                      <div>
                        <label className="text-xs text-crd-lightGray">Y Position</label>
                        <Slider
                          value={[selectedRegion.y]}
                          onValueChange={([value]) => handlePreciseAdjustment('y', value)}
                          max={image?.height || 1000}
                          step={1}
                          className="mt-1"
                        />
                        <div className="text-xs text-crd-lightGray mt-1">{Math.round(selectedRegion.y)}px</div>
                      </div>
                      
                      <div>
                        <label className="text-xs text-crd-lightGray">Width</label>
                        <Slider
                          value={[selectedRegion.width]}
                          onValueChange={([value]) => handlePreciseAdjustment('width', value)}
                          min={50}
                          max={image?.width || 1000}
                          step={1}
                          className="mt-1"
                        />
                        <div className="text-xs text-crd-lightGray mt-1">{Math.round(selectedRegion.width)}px</div>
                      </div>
                      
                      <div>
                        <label className="text-xs text-crd-lightGray">Height</label>
                        <Slider
                          value={[selectedRegion.height]}
                          onValueChange={([value]) => handlePreciseAdjustment('height', value)}
                          min={70}
                          max={image?.height || 1000}
                          step={1}
                          className="mt-1"
                        />
                        <div className="text-xs text-crd-lightGray mt-1">{Math.round(selectedRegion.height)}px</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-white mb-2">Quick Actions</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => {
                          const aspectRatio = 2.5 / 3.5;
                          const newHeight = selectedRegion.width / aspectRatio;
                          handlePreciseAdjustment('height', newHeight);
                        }}
                        variant="outline"
                        size="sm"
                        className="text-xs border-crd-mediumGray text-crd-lightGray hover:text-white"
                      >
                        <Crop className="w-3 h-3 mr-1" />
                        Fix Ratio
                      </Button>
                      
                      <Button
                        onClick={() => {
                          const centerX = (image?.width || 0) / 2 - selectedRegion.width / 2;
                          const centerY = (image?.height || 0) / 2 - selectedRegion.height / 2;
                          onRegionUpdate(selectedRegion.id, { x: centerX, y: centerY });
                        }}
                        variant="outline"
                        size="sm"
                        className="text-xs border-crd-mediumGray text-crd-lightGray hover:text-white"
                      >
                        <Move className="w-3 h-3 mr-1" />
                        Center
                      </Button>
                    </div>
                  </div>
                </>
              )}

              <div>
                <h4 className="text-sm font-medium text-white mb-2">Detection Info</h4>
                <div className="text-xs text-crd-lightGray space-y-1">
                  <div>Regions detected: {regions.length}</div>
                  {selectedRegion && (
                    <>
                      <div>Confidence: {Math.round(selectedRegion.confidence * 100)}%</div>
                      <div>Size: {Math.round(selectedRegion.width)}×{Math.round(selectedRegion.height)}</div>
                      <div>Aspect: {(selectedRegion.width / selectedRegion.height).toFixed(2)}</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
