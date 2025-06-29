
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { EnhancedProcessedPSD, ProcessedPSDLayer } from '@/types/psdTypes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Eye, 
  EyeOff, 
  Focus,
  Layers,
  MousePointer
} from 'lucide-react';

interface EnhancedPSDCanvasPreviewProps {
  processedPSD: EnhancedProcessedPSD;
  selectedLayerId: string;
  hiddenLayers: Set<string>;
  onLayerSelect: (layerId: string) => void;
  focusMode?: boolean;
  onFocusModeToggle?: () => void;
  showBackground?: boolean;
  onToggleBackground?: () => void;
  viewMode?: 'inspect' | 'frame' | 'build';
}

export const EnhancedPSDCanvasPreview: React.FC<EnhancedPSDCanvasPreviewProps> = ({
  processedPSD,
  selectedLayerId,
  hiddenLayers,
  onLayerSelect,
  focusMode = false,
  onFocusModeToggle,
  showBackground = true,
  onToggleBackground,
  viewMode = 'inspect'
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const selectedLayer = processedPSD.layers.find(layer => layer.id === selectedLayerId);
  const visibleLayers = processedPSD.layers.filter(layer => !hiddenLayers.has(layer.id));

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.1));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPanX(0);
    setPanY(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanX(e.clientX - dragStart.x);
    setPanY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleLayerClick = (layerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onLayerSelect(layerId);
  };

  const getLayerStyle = (layer: ProcessedPSDLayer) => ({
    position: 'absolute' as const,
    left: `${layer.bounds.left}px`,
    top: `${layer.bounds.top}px`,
    width: `${layer.bounds.right - layer.bounds.left}px`,
    height: `${layer.bounds.bottom - layer.bounds.top}px`,
    opacity: layer.properties.opacity,
    zIndex: processedPSD.layers.indexOf(layer),
    cursor: 'pointer',
    border: selectedLayerId === layer.id ? '2px solid #10B981' : '1px solid transparent',
    boxShadow: selectedLayerId === layer.id ? '0 0 10px rgba(16, 185, 129, 0.5)' : 'none',
    transition: 'all 0.2s ease'
  });

  return (
    <div className="h-full flex flex-col bg-[#0a0a0b]">
      {/* Enhanced Control Panel */}
      <div className="bg-[#1a1f2e] border-b border-slate-700 p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm text-slate-300 min-w-[60px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button variant="outline" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>

            <Button variant="outline" size="sm" onClick={handleRotate}>
              <RotateCw className="w-4 h-4" />
            </Button>

            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset View
            </Button>
          </div>

          {/* Center Info */}
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-slate-800 text-slate-300">
              {visibleLayers.length} / {processedPSD.layers.length} layers
            </Badge>
            
            {selectedLayer && (
              <Badge className="bg-crd-green text-black">
                {selectedLayer.name}
              </Badge>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            {onFocusModeToggle && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">Focus</span>
                <Switch checked={focusMode} onCheckedChange={onFocusModeToggle} />
              </div>
            )}
            
            {onToggleBackground && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">Background</span>
                <Switch checked={showBackground} onCheckedChange={onToggleBackground} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-hidden relative">
        <div
          ref={canvasRef}
          className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Main Canvas Container */}
          <div
            className="relative bg-white shadow-2xl"
            style={{
              width: `${processedPSD.width}px`,
              height: `${processedPSD.height}px`,
              transform: `scale(${zoom}) rotate(${rotation}deg) translate(${panX}px, ${panY}px)`,
              transformOrigin: 'center',
              transition: isDragging ? 'none' : 'transform 0.2s ease'
            }}
          >
            {/* Background Layer */}
            {showBackground && processedPSD.extractedImages.flattenedImageUrl && (
              <img
                src={processedPSD.extractedImages.flattenedImageUrl}
                alt="PSD Background"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ zIndex: 0 }}
              />
            )}

            {/* Individual Layers */}
            {processedPSD.layers.map((layer) => {
              if (hiddenLayers.has(layer.id)) return null;
              if (focusMode && selectedLayerId && layer.id !== selectedLayerId) return null;

              return (
                <div
                  key={layer.id}
                  style={getLayerStyle(layer)}
                  onClick={(e) => handleLayerClick(layer.id, e)}
                  className="hover:ring-2 hover:ring-crd-blue/50 transition-all"
                >
                  {layer.thumbnailUrl ? (
                    <img
                      src={layer.thumbnailUrl}
                      alt={layer.name}
                      className="w-full h-full object-contain"
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 rounded flex items-center justify-center">
                      <span className="text-slate-600 text-xs font-medium">
                        {layer.name}
                      </span>
                    </div>
                  )}
                  
                  {/* Layer Label */}
                  <div className="absolute -top-6 left-0 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                    {layer.name}
                  </div>
                </div>
              );
            })}

            {/* Selection Indicator */}
            {selectedLayer && (
              <div
                className="absolute border-2 border-crd-green pointer-events-none"
                style={{
                  left: `${selectedLayer.bounds.left}px`,
                  top: `${selectedLayer.bounds.top}px`,
                  width: `${selectedLayer.bounds.right - selectedLayer.bounds.left}px`,
                  height: `${selectedLayer.bounds.bottom - selectedLayer.bounds.top}px`,
                  zIndex: 9999
                }}
              >
                <div className="absolute -top-8 left-0 bg-crd-green text-black text-xs px-2 py-1 rounded font-medium">
                  {selectedLayer.name}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Overlay Instructions */}
        <div className="absolute bottom-4 left-4 bg-black/70 text-white text-sm px-3 py-2 rounded backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <MousePointer className="w-4 h-4" />
            Click layers to select • Drag to pan • Use controls to zoom/rotate
          </div>
        </div>

        {/* View Mode Indicator */}
        <div className="absolute top-4 right-4 bg-black/70 text-white text-sm px-3 py-2 rounded backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            {viewMode === 'inspect' && 'Layer Inspection Mode'}
            {viewMode === 'frame' && 'Frame Fitting Mode'}
            {viewMode === 'build' && 'Frame Building Mode'}
          </div>
        </div>
      </div>
    </div>
  );
};
