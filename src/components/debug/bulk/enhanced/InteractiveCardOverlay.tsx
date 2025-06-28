
import React, { useRef, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProcessedPSD, ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { Eye, EyeOff, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface InteractiveCardOverlayProps {
  processedPSD: ProcessedPSD;
  selectedLayers: Set<string>;
  onLayerSelect: (layerId: string) => void;
  onLayerToggle: (layerId: string) => void;
}

export const InteractiveCardOverlay: React.FC<InteractiveCardOverlayProps> = ({
  processedPSD,
  selectedLayers,
  onLayerSelect,
  onLayerToggle
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [hiddenLayers, setHiddenLayers] = useState<Set<string>>(new Set());
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);

  const getSemanticTypeColor = (type?: string) => {
    const colors: Record<string, string> = {
      'player': 'rgba(34, 197, 94, 0.3)',      // emerald
      'background': 'rgba(99, 102, 241, 0.3)', // indigo
      'stats': 'rgba(6, 182, 212, 0.3)',       // cyan
      'logo': 'rgba(236, 72, 153, 0.3)',       // pink
      'border': 'rgba(245, 158, 11, 0.3)',     // amber
      'text': 'rgba(59, 130, 246, 0.3)'        // blue
    };
    return colors[type || ''] || 'rgba(100, 116, 139, 0.3)';
  };

  const getSemanticTypeBorder = (type?: string) => {
    const colors: Record<string, string> = {
      'player': 'rgba(34, 197, 94, 0.8)',      // emerald
      'background': 'rgba(99, 102, 241, 0.8)', // indigo
      'stats': 'rgba(6, 182, 212, 0.8)',       // cyan
      'logo': 'rgba(236, 72, 153, 0.8)',       // pink
      'border': 'rgba(245, 158, 11, 0.8)',     // amber
      'text': 'rgba(59, 130, 246, 0.8)'        // blue
    };
    return colors[type || ''] || 'rgba(100, 116, 139, 0.8)';
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const containerWidth = container.clientWidth;
    const maxHeight = 600;
    const aspectRatio = processedPSD.width / processedPSD.height;
    
    let canvasWidth = containerWidth;
    let canvasHeight = containerWidth / aspectRatio;
    
    if (canvasHeight > maxHeight) {
      canvasHeight = maxHeight;
      canvasWidth = maxHeight * aspectRatio;
    }

    canvas.width = canvasWidth * zoom;
    canvas.height = canvasHeight * zoom;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    // Clear canvas
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw card background placeholder
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#334155');
    gradient.addColorStop(1, '#1e293b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate scale factors
    const scaleX = (canvasWidth * zoom) / processedPSD.width;
    const scaleY = (canvasHeight * zoom) / processedPSD.height;

    // Draw layer overlays
    processedPSD.layers
      .filter(layer => !hiddenLayers.has(layer.id))
      .forEach((layer) => {
        const x = layer.bounds.left * scaleX;
        const y = layer.bounds.top * scaleY;
        const w = (layer.bounds.right - layer.bounds.left) * scaleX;
        const h = (layer.bounds.bottom - layer.bounds.top) * scaleY;

        // Fill with semantic color
        ctx.fillStyle = getSemanticTypeColor(layer.semanticType);
        ctx.fillRect(x, y, w, h);

        // Border styling
        const isSelected = selectedLayers.has(layer.id);
        const isHovered = hoveredLayer === layer.id;
        
        ctx.strokeStyle = isSelected 
          ? '#22d3ee' 
          : isHovered 
            ? '#ffffff' 
            : getSemanticTypeBorder(layer.semanticType);
        ctx.lineWidth = isSelected ? 3 : isHovered ? 2 : 1;
        ctx.strokeRect(x, y, w, h);

        // Layer label
        if (w > 50 && h > 20) {
          ctx.fillStyle = isSelected ? '#22d3ee' : '#ffffff';
          ctx.font = `${Math.max(10, 12 * zoom)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.shadowColor = 'rgba(0,0,0,0.8)';
          ctx.shadowBlur = 2;
          
          const text = layer.semanticType || layer.name;
          const shortText = text.length > 15 ? text.substring(0, 15) + '...' : text;
          ctx.fillText(shortText, x + w/2, y + h/2);
          
          ctx.shadowBlur = 0;
        }
      });
  }, [processedPSD, zoom, selectedLayers, hiddenLayers, hoveredLayer]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = (event.clientX - rect.left) * zoom;
    const clickY = (event.clientY - rect.top) * zoom;

    const containerWidth = canvas.offsetWidth;
    const canvasHeight = canvas.offsetHeight;
    const scaleX = (containerWidth * zoom) / processedPSD.width;
    const scaleY = (canvasHeight * zoom) / processedPSD.height;

    // Find clicked layer (from top to bottom)
    for (let i = processedPSD.layers.length - 1; i >= 0; i--) {
      const layer = processedPSD.layers[i];
      if (hiddenLayers.has(layer.id)) continue;

      const x = layer.bounds.left * scaleX;
      const y = layer.bounds.top * scaleY;
      const w = (layer.bounds.right - layer.bounds.left) * scaleX;
      const h = (layer.bounds.bottom - layer.bounds.top) * scaleY;

      if (clickX >= x && clickX <= x + w && clickY >= y && clickY <= y + h) {
        onLayerSelect(layer.id);
        break;
      }
    }
  };

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = (event.clientX - rect.left) * zoom;
    const mouseY = (event.clientY - rect.top) * zoom;

    const containerWidth = canvas.offsetWidth;
    const canvasHeight = canvas.offsetHeight;
    const scaleX = (containerWidth * zoom) / processedPSD.width;
    const scaleY = (canvasHeight * zoom) / processedPSD.height;

    let foundLayer = null;
    for (let i = processedPSD.layers.length - 1; i >= 0; i--) {
      const layer = processedPSD.layers[i];
      if (hiddenLayers.has(layer.id)) continue;

      const x = layer.bounds.left * scaleX;
      const y = layer.bounds.top * scaleY;
      const w = (layer.bounds.right - layer.bounds.left) * scaleX;
      const h = (layer.bounds.bottom - layer.bounds.top) * scaleY;

      if (mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h) {
        foundLayer = layer.id;
        break;
      }
    }

    setHoveredLayer(foundLayer);
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

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card className="bg-slate-800 border-slate-600">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-semibold">Interactive Card Overlay</h4>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-white text-sm min-w-16 text-center">{Math.round(zoom * 100)}%</span>
              <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(3, zoom + 0.25))}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setZoom(1)}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Interactive Canvas */}
      <Card className="bg-slate-800 border-slate-600">
        <div className="p-4">
          <div ref={containerRef} className="flex justify-center">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              onMouseMove={handleCanvasMouseMove}
              onMouseLeave={() => setHoveredLayer(null)}
              className="border border-slate-600 cursor-crosshair"
            />
          </div>
        </div>
      </Card>

      {/* Layer Legend */}
      <Card className="bg-slate-800 border-slate-600">
        <div className="p-4">
          <h4 className="text-white font-semibold mb-3">Color-Coded Elements</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { type: 'player', color: 'bg-emerald-500', label: 'Player' },
              { type: 'background', color: 'bg-indigo-500', label: 'Background' },
              { type: 'stats', color: 'bg-cyan-500', label: 'Stats' },
              { type: 'logo', color: 'bg-pink-500', label: 'Logo' },
              { type: 'border', color: 'bg-amber-500', label: 'Border' },
              { type: 'text', color: 'bg-blue-500', label: 'Text' }
            ].map(({ type, color, label }) => (
              <div key={type} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${color}`} />
                <span className="text-slate-300 text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
