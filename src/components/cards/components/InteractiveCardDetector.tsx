
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Move, Square, RotateCw, Check, X } from 'lucide-react';

interface DetectionRegion {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  confidence: number;
}

interface InteractiveCardDetectorProps {
  image: HTMLImageElement;
  initialRegions: DetectionRegion[];
  onRegionsUpdate: (regions: DetectionRegion[]) => void;
  onConfirm: (regions: DetectionRegion[]) => void;
}

export const InteractiveCardDetector: React.FC<InteractiveCardDetectorProps> = ({
  image,
  initialRegions,
  onRegionsUpdate,
  onConfirm
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [regions, setRegions] = useState<DetectionRegion[]>(initialRegions);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mode, setMode] = useState<'select' | 'create'>('select');

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match image
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw image
    ctx.drawImage(image, 0, 0);

    // Draw regions
    regions.forEach(region => {
      const isSelected = region.id === selectedRegion;
      
      ctx.save();
      ctx.translate(region.x + region.width / 2, region.y + region.height / 2);
      ctx.rotate((region.rotation * Math.PI) / 180);
      
      // Draw rectangle
      ctx.strokeStyle = isSelected ? '#10b981' : '#ef4444';
      ctx.lineWidth = 3;
      ctx.fillStyle = isSelected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';
      
      const x = -region.width / 2;
      const y = -region.height / 2;
      
      ctx.fillRect(x, y, region.width, region.height);
      ctx.strokeRect(x, y, region.width, region.height);
      
      // Draw handles for selected region
      if (isSelected) {
        ctx.fillStyle = '#10b981';
        const handleSize = 8;
        
        // Corner handles
        ctx.fillRect(x - handleSize/2, y - handleSize/2, handleSize, handleSize);
        ctx.fillRect(x + region.width - handleSize/2, y - handleSize/2, handleSize, handleSize);
        ctx.fillRect(x - handleSize/2, y + region.height - handleSize/2, handleSize, handleSize);
        ctx.fillRect(x + region.width - handleSize/2, y + region.height - handleSize/2, handleSize, handleSize);
        
        // Rotation handle
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(0, y - 20, 6, 0, 2 * Math.PI);
        ctx.fill();
      }
      
      ctx.restore();
      
      // Draw confidence label
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(region.x, region.y - 25, 80, 25);
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.fillText(
        `${Math.round(region.confidence * 100)}%`,
        region.x + 5,
        region.y - 8
      );
    });
  }, [image, regions, selectedRegion]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const isPointInRegion = (x: number, y: number, region: DetectionRegion) => {
    return x >= region.x && x <= region.x + region.width &&
           y >= region.y && y <= region.y + region.height;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    
    if (mode === 'create') {
      // Create new region
      const newRegion: DetectionRegion = {
        id: `region-${Date.now()}`,
        x: pos.x,
        y: pos.y,
        width: 100,
        height: 140,
        rotation: 0,
        confidence: 1.0
      };
      
      setRegions(prev => [...prev, newRegion]);
      setSelectedRegion(newRegion.id);
      setIsResizing(true);
      setDragStart(pos);
      return;
    }

    // Select existing region
    const clickedRegion = regions.find(region => isPointInRegion(pos.x, pos.y, region));
    
    if (clickedRegion) {
      setSelectedRegion(clickedRegion.id);
      setIsDragging(true);
      setDragStart(pos);
    } else {
      setSelectedRegion(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    
    if (isDragging && selectedRegion) {
      const dx = pos.x - dragStart.x;
      const dy = pos.y - dragStart.y;
      
      setRegions(prev => prev.map(region => 
        region.id === selectedRegion
          ? { ...region, x: region.x + dx, y: region.y + dy }
          : region
      ));
      
      setDragStart(pos);
    }
    
    if (isResizing && selectedRegion) {
      const region = regions.find(r => r.id === selectedRegion);
      if (region) {
        const width = Math.max(20, pos.x - region.x);
        const height = Math.max(20, pos.y - region.y);
        
        setRegions(prev => prev.map(r => 
          r.id === selectedRegion
            ? { ...r, width, height }
            : r
        ));
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setIsRotating(false);
  };

  const rotateSelected = () => {
    if (!selectedRegion) return;
    
    setRegions(prev => prev.map(region => 
      region.id === selectedRegion
        ? { ...region, rotation: (region.rotation + 15) % 360 }
        : region
    ));
  };

  const deleteSelected = () => {
    if (!selectedRegion) return;
    
    setRegions(prev => prev.filter(region => region.id !== selectedRegion));
    setSelectedRegion(null);
  };

  const addNewRegion = () => {
    const newRegion: DetectionRegion = {
      id: `region-${Date.now()}`,
      x: 50,
      y: 50,
      width: 200,
      height: 280,
      rotation: 0,
      confidence: 1.0
    };
    
    setRegions(prev => [...prev, newRegion]);
    setSelectedRegion(newRegion.id);
  };

  const handleConfirm = () => {
    onRegionsUpdate(regions);
    onConfirm(regions);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-4 bg-editor-tool rounded-lg">
        <Button
          variant={mode === 'select' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('select')}
          className="text-white"
        >
          <Move className="w-4 h-4 mr-2" />
          Select
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={addNewRegion}
          className="text-white border-crd-mediumGray"
        >
          <Square className="w-4 h-4 mr-2" />
          Add Region
        </Button>
        
        {selectedRegion && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={rotateSelected}
              className="text-white border-crd-mediumGray"
            >
              <RotateCw className="w-4 h-4 mr-2" />
              Rotate 15°
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={deleteSelected}
              className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
            >
              <X className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </>
        )}
        
        <div className="flex-1" />
        
        <Button
          onClick={handleConfirm}
          disabled={regions.length === 0}
          className="bg-crd-green hover:bg-crd-green/90 text-black"
        >
          <Check className="w-4 h-4 mr-2" />
          Extract {regions.length} Cards
        </Button>
      </div>

      {/* Canvas */}
      <div className="bg-editor-dark rounded-lg p-4">
        <canvas
          ref={canvasRef}
          className="max-w-full h-auto border border-crd-mediumGray rounded cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ maxHeight: '70vh' }}
        />
      </div>

      {/* Instructions */}
      <div className="text-sm text-crd-lightGray bg-editor-tool p-3 rounded-lg">
        <p className="mb-2"><strong>Instructions:</strong></p>
        <ul className="space-y-1">
          <li>• Click and drag rectangles to move them</li>
          <li>• Drag from bottom-right corner to resize</li>
          <li>• Use "Rotate 15°" button to rotate selected region</li>
          <li>• Add new regions with "Add Region" button</li>
          <li>• Delete unwanted regions with "Delete" button</li>
        </ul>
      </div>
    </div>
  );
};
