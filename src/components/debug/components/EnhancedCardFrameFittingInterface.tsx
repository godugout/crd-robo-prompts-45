
import React, { useState, useRef, useEffect } from 'react';
import { ProcessedPSD, ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { PSDCard } from '@/components/ui/design-system/PSDCard';
import { PSDButton } from '@/components/ui/design-system/PSDButton';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Move, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Square
} from 'lucide-react';

interface EnhancedCardFrameFittingInterfaceProps {
  processedPSD: ProcessedPSD;
  selectedLayerId: string;
  hiddenLayers: Set<string>;
  onLayerSelect: (layerId: string) => void;
  selectedFrame: string;
  availableFrames: any[];
  onFrameSelect: (frameId: string) => void;
}

export const EnhancedCardFrameFittingInterface: React.FC<EnhancedCardFrameFittingInterfaceProps> = ({
  processedPSD,
  selectedLayerId,
  hiddenLayers,
  onLayerSelect,
  selectedFrame,
  availableFrames,
  onFrameSelect
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [imageScale, setImageScale] = useState(1);
  const [imageRotation, setImageRotation] = useState(0);
  const [frameBounds, setFrameBounds] = useState({ x: 50, y: 50, width: 650, height: 650 });
  const [showFrame, setShowFrame] = useState(true);
  const [transparency, setTransparency] = useState([80]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const selectedLayer = processedPSD.layers.find(layer => layer.id === selectedLayerId);
  const visibleLayers = processedPSD.layers.filter(layer => !hiddenLayers.has(layer.id));

  // Generate a placeholder image URL for layers that don't have imageData
  const getLayerImageUrl = (layer: ProcessedPSDLayer): string => {
    if (layer.imageData) {
      return layer.imageData;
    }
    
    // Generate a placeholder based on layer properties
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(200, layer.bounds.right - layer.bounds.left);
    canvas.height = Math.max(200, layer.bounds.bottom - layer.bounds.top);
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#3b82f6');
      gradient.addColorStop(1, '#1e40af');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add layer name if it's text
      if (layer.textContent) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(layer.textContent, canvas.width / 2, canvas.height / 2);
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(layer.name, canvas.width / 2, canvas.height / 2);
      }
    }
    
    return canvas.toDataURL('image/png');
  };

  // Draw the fitting interface
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedLayer) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1e293b');
    gradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw frame outline if enabled
    if (showFrame) {
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(frameBounds.x, frameBounds.y, frameBounds.width, frameBounds.height);
      ctx.setLineDash([]);
    }

    // Load and draw the selected layer image
    const img = new Image();
    img.onload = () => {
      ctx.save();
      
      // Apply transformations
      const centerX = frameBounds.x + frameBounds.width / 2;
      const centerY = frameBounds.y + frameBounds.height / 2;
      
      ctx.translate(centerX + imagePosition.x, centerY + imagePosition.y);
      ctx.rotate((imageRotation * Math.PI) / 180);
      ctx.scale(imageScale, imageScale);
      
      // Set transparency
      ctx.globalAlpha = transparency[0] / 100;
      
      // Draw image centered
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      
      ctx.restore();
    };
    
    img.src = getLayerImageUrl(selectedLayer);
    
  }, [selectedLayer, imagePosition, imageScale, imageRotation, frameBounds, showFrame, transparency]);

  // Handle mouse interactions for dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDragging(true);
    setDragStart({ x: x - imagePosition.x, y: y - imagePosition.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setImagePosition({
      x: x - dragStart.x,
      y: y - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Auto-fit layer to frame
  const handleAutoFit = () => {
    if (!selectedLayer) return;
    
    const layerWidth = selectedLayer.bounds.right - selectedLayer.bounds.left;
    const layerHeight = selectedLayer.bounds.bottom - selectedLayer.bounds.top;
    
    const scaleX = frameBounds.width / layerWidth;
    const scaleY = frameBounds.height / layerHeight;
    const optimalScale = Math.min(scaleX, scaleY) * 0.9; // 90% to leave some padding
    
    setImageScale(optimalScale);
    setImagePosition({ x: 0, y: 0 });
    setImageRotation(0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Main Canvas Area */}
      <div className="lg:col-span-2">
        <PSDCard variant="elevated">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Card Frame Fitting</h3>
              <div className="flex items-center gap-2">
                <PSDButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFrame(!showFrame)}
                >
                  {showFrame ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  Frame Guide
                </PSDButton>
                <PSDButton
                  variant="secondary"
                  size="sm"
                  onClick={handleAutoFit}
                >
                  <Maximize2 className="w-4 h-4 mr-2" />
                  Auto Fit
                </PSDButton>
              </div>
            </div>
            
            <div className="relative bg-slate-900 rounded-lg overflow-hidden">
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="w-full cursor-move"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
            </div>
          </div>
        </PSDCard>
      </div>

      {/* Controls Panel */}
      <div className="space-y-4">
        {/* Layer Selection */}
        <PSDCard variant="elevated">
          <div className="p-4">
            <h4 className="font-semibold text-white mb-3">Active Layer</h4>
            {selectedLayer ? (
              <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                <ImageIcon className="w-5 h-5 text-crd-green" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{selectedLayer.name}</p>
                  <p className="text-xs text-slate-400">
                    {Math.round(selectedLayer.bounds.right - selectedLayer.bounds.left)} × {Math.round(selectedLayer.bounds.bottom - selectedLayer.bounds.top)}px
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-sm">No layer selected</p>
            )}
          </div>
        </PSDCard>

        {/* Transform Controls */}
        <PSDCard variant="elevated">
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-white">Transform Controls</h4>
            
            {/* Position */}
            <div>
              <label className="text-sm text-slate-300 mb-2 block">Position</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400">X</label>
                  <input
                    type="number"
                    value={Math.round(imagePosition.x)}
                    onChange={(e) => setImagePosition(prev => ({ ...prev, x: parseInt(e.target.value) || 0 }))}
                    className="w-full px-2 py-1 bg-slate-800 text-white rounded text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Y</label>
                  <input
                    type="number"
                    value={Math.round(imagePosition.y)}
                    onChange={(e) => setImagePosition(prev => ({ ...prev, y: parseInt(e.target.value) || 0 }))}
                    className="w-full px-2 py-1 bg-slate-800 text-white rounded text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Scale */}
            <div>
              <label className="text-sm text-slate-300 mb-2 block">
                Scale: {Math.round(imageScale * 100)}%
              </label>
              <Slider
                value={[imageScale * 100]}
                onValueChange={(value) => setImageScale(value[0] / 100)}
                min={10}
                max={300}
                step={5}
                className="w-full"
              />
            </div>

            {/* Rotation */}
            <div>
              <label className="text-sm text-slate-300 mb-2 block">
                Rotation: {imageRotation}°
              </label>
              <Slider
                value={[imageRotation]}
                onValueChange={(value) => setImageRotation(value[0])}
                min={-180}
                max={180}
                step={1}
                className="w-full"
              />
            </div>

            {/* Transparency */}
            <div>
              <label className="text-sm text-slate-300 mb-2 block">
                Opacity: {transparency[0]}%
              </label>
              <Slider
                value={transparency}
                onValueChange={setTransparency}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          </div>
        </PSDCard>

        {/* Quick Actions */}
        <PSDCard variant="elevated">
          <div className="p-4">
            <h4 className="font-semibold text-white mb-3">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <PSDButton
                variant="ghost"
                size="sm"
                onClick={() => setImagePosition({ x: 0, y: 0 })}
              >
                <Move className="w-4 h-4 mr-1" />
                Center
              </PSDButton>
              <PSDButton
                variant="ghost"
                size="sm"
                onClick={() => setImageRotation(0)}
              >
                <RotateCw className="w-4 h-4 mr-1" />
                Reset Rotation
              </PSDButton>
              <PSDButton
                variant="ghost"
                size="sm"
                onClick={() => setImageScale(imageScale * 1.1)}
              >
                <ZoomIn className="w-4 h-4 mr-1" />
                Zoom In
              </PSDButton>
              <PSDButton
                variant="ghost"
                size="sm"
                onClick={() => setImageScale(Math.max(0.1, imageScale * 0.9))}
              >
                <ZoomOut className="w-4 h-4 mr-1" />
                Zoom Out
              </PSDButton>
            </div>
          </div>
        </PSDCard>

        {/* Layer List */}
        <PSDCard variant="elevated">
          <div className="p-4">
            <h4 className="font-semibold text-white mb-3">Available Layers</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {visibleLayers.map((layer) => (
                <div
                  key={layer.id}
                  className={`
                    flex items-center gap-2 p-2 rounded cursor-pointer transition-colors
                    ${selectedLayerId === layer.id 
                      ? 'bg-crd-green/20 border border-crd-green/50' 
                      : 'hover:bg-slate-800'
                    }
                  `}
                  onClick={() => onLayerSelect(layer.id)}
                >
                  <Square className="w-4 h-4 text-slate-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{layer.name}</p>
                    <p className="text-xs text-slate-400">
                      {layer.type} • {Math.round(layer.opacity * 100)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PSDCard>
      </div>
    </div>
  );
};
