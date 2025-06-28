
import React, { useState, useRef, useEffect } from 'react';
import { ProcessedPSD, ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { PSDCard } from '@/components/ui/design-system/PSDCard';
import { PSDButton } from '@/components/ui/design-system/PSDButton';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Eye,
  EyeOff,
  Move,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Layers,
  Frame,
  Upload
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
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [imageScale, setImageScale] = useState(1);
  const [frameOpacity, setFrameOpacity] = useState(1);
  const [showFrameBehind, setShowFrameBehind] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [uploadedImage, setUploadedImage] = useState<string>('');

  // Card dimensions in pixels (2.5" x 3.5" at 96 DPI)
  const CARD_WIDTH = 240; // 2.5 * 96
  const CARD_HEIGHT = 336; // 3.5 * 96

  const selectedLayer = processedPSD.layers.find(layer => layer.id === selectedLayerId);

  // Update canvas size on mount and resize
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const width = window.innerWidth;
        const height = window.innerHeight - 200; // Account for header
        setCanvasSize({ width, height });
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        drawCanvas();
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Draw canvas with graph paper background and card guide
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvasSize;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw graph paper background
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.1)'; // slate-500 with low opacity
    ctx.lineWidth = 0.5;
    
    const gridSize = 20;
    
    // Vertical lines
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Calculate card guide position (centered)
    const cardX = (width - CARD_WIDTH) / 2;
    const cardY = (height - CARD_HEIGHT) / 2;

    // Draw card guide
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.8)'; // crd-green
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(cardX, cardY, CARD_WIDTH, CARD_HEIGHT);
    ctx.setLineDash([]);

    // Draw corner markers
    ctx.fillStyle = 'rgba(34, 197, 94, 0.8)';
    const cornerSize = 8;
    const corners = [
      [cardX, cardY], // top-left
      [cardX + CARD_WIDTH, cardY], // top-right
      [cardX, cardY + CARD_HEIGHT], // bottom-left
      [cardX + CARD_WIDTH, cardY + CARD_HEIGHT] // bottom-right
    ];
    
    corners.forEach(([x, y]) => {
      ctx.fillRect(x - cornerSize/2, y - cornerSize/2, cornerSize, cornerSize);
    });

    // Draw dimension labels
    ctx.fillStyle = 'rgba(148, 163, 184, 0.9)'; // slate-400
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    
    // Width label
    ctx.fillText('2.5"', cardX + CARD_WIDTH/2, cardY - 10);
    
    // Height label
    ctx.save();
    ctx.translate(cardX - 15, cardY + CARD_HEIGHT/2);
    ctx.rotate(-Math.PI/2);
    ctx.fillText('3.5"', 0, 0);
    ctx.restore();

    // Draw uploaded image if available
    if (uploadedImage) {
      const img = new Image();
      img.onload = () => {
        const imgX = cardX + imagePosition.x;
        const imgY = cardY + imagePosition.y;
        const imgWidth = img.width * imageScale;
        const imgHeight = img.height * imageScale;
        
        ctx.save();
        ctx.globalAlpha = showFrameBehind ? 0.8 : 1;
        ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
        ctx.restore();
      };
      img.src = uploadedImage;
    }
  };

  // Redraw canvas when dependencies change
  useEffect(() => {
    drawCanvas();
  }, [canvasSize, imagePosition, imageScale, frameOpacity, showFrameBehind, uploadedImage]);

  // Handle mouse interactions
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setImageScale(prev => Math.max(0.1, Math.min(5, prev * delta)));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Canvas Controls */}
      <div className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-crd-green" />
            <label className="cursor-pointer">
              <span className="text-sm text-white">Upload Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
          
          <div className="flex items-center gap-2">
            <Move className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">Drag to move</span>
          </div>
          
          <div className="flex items-center gap-2">
            <ZoomIn className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">Scroll to zoom</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Scale:</span>
            <Badge variant="outline" className="bg-slate-700 text-slate-300 border-slate-600">
              {Math.round(imageScale * 100)}%
            </Badge>
          </div>
          
          <PSDButton
            variant={showFrameBehind ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setShowFrameBehind(!showFrameBehind)}
          >
            <Frame className="w-4 h-4 mr-2" />
            {showFrameBehind ? 'Frame Behind' : 'Frame Front'}
          </PSDButton>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 cursor-move"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        />
      </div>

      {/* Bottom Controls */}
      <div className="p-4 bg-slate-800 border-t border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Frame Opacity:</span>
              <div className="w-32">
                <Slider
                  value={[frameOpacity]}
                  onValueChange={(value) => setFrameOpacity(value[0])}
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </div>
              <Badge variant="outline" className="bg-slate-700 text-slate-300 border-slate-600">
                {Math.round(frameOpacity * 100)}%
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <PSDButton
              variant="secondary"
              size="sm"
              onClick={() => {
                setImagePosition({ x: 0, y: 0 });
                setImageScale(1);
              }}
            >
              <RotateCw className="w-4 h-4 mr-2" />
              Reset Position
            </PSDButton>
          </div>
        </div>
      </div>
    </div>
  );
};
