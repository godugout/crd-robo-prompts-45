
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ProcessedPSD } from '@/services/psdProcessor/psdProcessingService';
import { ZoomIn, ZoomOut, RotateCcw, Eye, EyeOff, Layers } from 'lucide-react';

interface LayerCanvasViewerProps {
  processedPSD: ProcessedPSD;
}

export const LayerCanvasViewer: React.FC<LayerCanvasViewerProps> = ({
  processedPSD
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [hiddenLayers, setHiddenLayers] = useState<Set<string>>(new Set());
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 400 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate canvas size based on PSD dimensions
    const maxSize = 400;
    const aspectRatio = processedPSD.width / processedPSD.height;
    let width, height;

    if (aspectRatio > 1) {
      width = maxSize;
      height = maxSize / aspectRatio;
    } else {
      width = maxSize * aspectRatio;
      height = maxSize;
    }

    setCanvasSize({ width, height });
    canvas.width = width * zoom;
    canvas.height = height * zoom;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Clear canvas
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw layers
    processedPSD.layers
      .filter(layer => !hiddenLayers.has(layer.id))
      .forEach((layer, index) => {
        const scaleX = (width * zoom) / processedPSD.width;
        const scaleY = (height * zoom) / processedPSD.height;

        const x = layer.bounds.left * scaleX;
        const y = layer.bounds.top * scaleY;
        const w = (layer.bounds.right - layer.bounds.left) * scaleX;
        const h = (layer.bounds.bottom - layer.bounds.top) * scaleY;

        // Draw layer bounds
        ctx.strokeStyle = selectedLayerId === layer.id ? '#22d3ee' : '#64748b';
        ctx.lineWidth = selectedLayerId === layer.id ? 2 : 1;
        ctx.strokeRect(x, y, w, h);

        // Fill with semi-transparent color based on layer type
        const colors: Record<string, string> = {
          'text': 'rgba(59, 130, 246, 0.3)',
          'image': 'rgba(34, 197, 94, 0.3)',
          'shape': 'rgba(168, 85, 247, 0.3)',
          'group': 'rgba(249, 115, 22, 0.3)',
          'adjustment': 'rgba(239, 68, 68, 0.3)',
          'effect': 'rgba(234, 179, 8, 0.3)'
        };
        
        ctx.fillStyle = colors[layer.type] || 'rgba(100, 116, 139, 0.3)';
        ctx.fillRect(x, y, w, h);

        // Draw layer name
        if (w > 50 && h > 20) {
          ctx.fillStyle = '#ffffff';
          ctx.font = `${Math.max(10, 12 * zoom)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText(
            layer.name.length > 15 ? layer.name.substring(0, 15) + '...' : layer.name,
            x + w/2,
            y + h/2
          );
        }
      });
  }, [processedPSD, zoom, selectedLayerId, hiddenLayers]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = (event.clientX - rect.left) * zoom;
    const clickY = (event.clientY - rect.top) * zoom;

    // Find clicked layer
    const scaleX = (canvasSize.width * zoom) / processedPSD.width;
    const scaleY = (canvasSize.height * zoom) / processedPSD.height;

    for (const layer of processedPSD.layers) {
      if (hiddenLayers.has(layer.id)) continue;

      const x = layer.bounds.left * scaleX;
      const y = layer.bounds.top * scaleY;
      const w = (layer.bounds.right - layer.bounds.left) * scaleX;
      const h = (layer.bounds.bottom - layer.bounds.top) * scaleY;

      if (clickX >= x && clickX <= x + w && clickY >= y && clickY <= y + h) {
        setSelectedLayerId(layer.id);
        break;
      }
    }
  };

  const toggleLayerVisibility = (layerId: string) => {
    setHiddenLayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(layerId)) {
        newSet.delete(layerId);
      } else {
        newSet.add(layerId);
      }
      return newSet;
    });
  };

  const resetView = () => {
    setZoom(1);
    setSelectedLayerId(null);
  };

  return (
    <div className="space-y-6">
      {/* Canvas Controls */}
      <Card className="bg-slate-800 border-slate-600">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-crd-green" />
              Interactive Canvas
            </h4>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-white text-sm min-w-16 text-center">{Math.round(zoom * 100)}%</span>
              <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(3, zoom + 0.25))}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={resetView}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-300">Zoom:</span>
            <Slider
              value={[zoom]}
              onValueChange={(value) => setZoom(value[0])}
              min={0.5}
              max={3}
              step={0.25}
              className="flex-1 max-w-xs"
            />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-800 border-slate-600">
            <div className="p-4">
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  className="border border-slate-600 cursor-crosshair"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Layer List */}
        <div>
          <Card className="bg-slate-800 border-slate-600">
            <div className="p-4">
              <h4 className="text-lg font-semibold text-white mb-4">Layers</h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {processedPSD.layers.map((layer) => (
                  <div
                    key={layer.id}
                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-slate-700 ${
                      selectedLayerId === layer.id ? 'bg-slate-600' : ''
                    }`}
                    onClick={() => setSelectedLayerId(layer.id)}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: {
                            'text': '#3b82f6',
                            'image': '#22c55e',
                            'shape': '#a855f7',
                            'group': '#f97316',
                            'adjustment': '#ef4444',
                            'effect': '#eab308'
                          }[layer.type] || '#64748b'
                        }}
                      />
                      <span className="text-sm text-white truncate">{layer.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-6 h-6 flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLayerVisibility(layer.id);
                      }}
                    >
                      {hiddenLayers.has(layer.id) ? (
                        <EyeOff className="w-3 h-3" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
