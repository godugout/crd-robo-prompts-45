
import React, { useState, useRef, useEffect } from 'react';
import { ProcessedPSD } from '@/services/psdProcessor/psdProcessingService';
import { PSDCard } from '@/components/ui/design-system/PSDCard';
import { PSDButton } from '@/components/ui/design-system/PSDButton';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Move, 
  Layers,
  FrameIcon,
  Image as ImageIcon,
  Target
} from 'lucide-react';

interface Frame {
  id: string;
  name: string;
  svgContent: string;
  category: string;
}

interface EnhancedCardFrameFittingInterfaceProps {
  processedPSD: ProcessedPSD;
  selectedLayerId: string;
  hiddenLayers: Set<string>;
  onLayerSelect: (layerId: string) => void;
  selectedFrame: string;
  availableFrames?: Frame[];
  onFrameSelect?: (frameId: string) => void;
}

export const EnhancedCardFrameFittingInterface: React.FC<EnhancedCardFrameFittingInterfaceProps> = ({
  processedPSD,
  selectedLayerId,
  hiddenLayers,
  onLayerSelect,
  selectedFrame,
  availableFrames = [],
  onFrameSelect
}) => {
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [imageScale, setImageScale] = useState(1);
  const [frameOpacity, setFrameOpacity] = useState(80);
  const [imageOpacity, setImageOpacity] = useState(100);
  const [frameInFront, setFrameInFront] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showGuides, setShowGuides] = useState(true);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const selectedLayer = processedPSD.layers.find(layer => layer.id === selectedLayerId);

  // Mock frames for demonstration
  const mockFrames = [
    {
      id: 'classic-sports',
      name: 'Classic Sports',
      category: 'Sports',
      svgContent: `
        <svg width="300" height="420" viewBox="0 0 300 420">
          <rect x="0" y="0" width="300" height="420" fill="#1a1a1a" stroke="#333" stroke-width="3" rx="12"/>
          <rect x="15" y="15" width="270" height="280" fill="none" stroke="#666" stroke-width="1" stroke-dasharray="2,2"/>
          <rect x="15" y="310" width="270" height="35" fill="#2a2a2a" stroke="#555" stroke-width="1" rx="4"/>
          <text x="150" y="330" font-family="Arial" font-size="14" fill="#ccc" text-anchor="middle">PLAYER NAME</text>
          <rect x="15" y="355" width="130" height="25" fill="#1e1e1e" stroke="#444" stroke-width="1" rx="2"/>
          <rect x="155" y="355" width="130" height="25" fill="#1e1e1e" stroke="#444" stroke-width="1" rx="2"/>
        </svg>
      `
    }
  ];

  const frames = availableFrames.length > 0 ? availableFrames : mockFrames;
  const currentFrame = frames.find(f => f.id === selectedFrame) || frames[0];

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isHovering) return;
    setIsDragging(true);
    setDragStart({ 
      x: e.clientX - imagePosition.x, 
      y: e.clientY - imagePosition.y 
    });
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
    if (!isHovering) return;
    e.preventDefault();
    
    const delta = e.deltaY * -0.01;
    const newScale = Math.max(0.1, Math.min(3.0, imageScale + delta));
    setImageScale(newScale);
  };

  const resetPosition = () => {
    setImagePosition({ x: 0, y: 0 });
    setImageScale(1);
  };

  const autoFit = () => {
    // Auto-fit the image to the frame's image area
    setImagePosition({ x: 15, y: 15 });
    setImageScale(0.9);
  };

  if (!selectedLayer) {
    return (
      <PSDCard variant="elevated">
        <div className="p-8 text-center">
          <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white">No Layer Selected</h3>
          <p className="text-slate-400">Select a layer from the inspector to begin fitting</p>
        </div>
      </PSDCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Frame Selection */}
      <PSDCard variant="elevated">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <FrameIcon className="w-5 h-5 text-crd-blue" />
            Frame Selection
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {frames.map((frame) => (
              <div
                key={frame.id}
                className={`
                  flex-shrink-0 cursor-pointer border-2 rounded-lg p-2 transition-all
                  ${selectedFrame === frame.id 
                    ? 'border-crd-green bg-crd-green/10' 
                    : 'border-slate-600 hover:border-slate-500'
                  }
                `}
                onClick={() => onFrameSelect?.(frame.id)}
              >
                <div 
                  className="w-16 h-22 bg-white rounded"
                  dangerouslySetInnerHTML={{ __html: frame.svgContent }}
                />
                <p className="text-xs text-center text-white mt-1 w-16 truncate">
                  {frame.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </PSDCard>

      {/* Main Fitting Interface */}
      <PSDCard variant="elevated">
        <div className="p-6">
          {/* Controls Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Badge className="bg-crd-green text-black">
                Fitting: {selectedLayer.name}
              </Badge>
              <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-600">
                Scale: {Math.round(imageScale * 100)}%
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <PSDButton
                variant="ghost"
                size="sm"
                onClick={() => setShowGuides(!showGuides)}
              >
                <Target className="w-4 h-4 mr-1" />
                Guides
              </PSDButton>
              <PSDButton
                variant="ghost"
                size="sm"
                onClick={autoFit}
              >
                Auto Fit
              </PSDButton>
              <PSDButton
                variant="ghost"
                size="sm"
                onClick={resetPosition}
              >
                <RotateCcw className="w-4 h-4" />
              </PSDButton>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="bg-slate-900 rounded-lg p-8 min-h-[500px] flex items-center justify-center relative">
            <div
              ref={canvasRef}
              className="relative cursor-move"
              style={{ width: 300, height: 420 }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onWheel={handleWheel}
            >
              {/* Background Layer - Frame behind */}
              {!frameInFront && currentFrame && (
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{ opacity: frameOpacity / 100 }}
                  dangerouslySetInnerHTML={{ __html: currentFrame.svgContent }}
                />
              )}

              {/* Image Layer */}
              {selectedLayer.imageUrl && (
                <img
                  src={selectedLayer.imageUrl}
                  alt={selectedLayer.name}
                  className="absolute pointer-events-none"
                  style={{
                    transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageScale})`,
                    opacity: imageOpacity / 100,
                    transformOrigin: 'center center',
                    maxWidth: '300px',
                    maxHeight: '420px',
                    objectFit: 'cover'
                  }}
                  draggable={false}
                />
              )}

              {/* Foreground Layer - Frame in front */}
              {frameInFront && currentFrame && (
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{ opacity: frameOpacity / 100 }}
                  dangerouslySetInnerHTML={{ __html: currentFrame.svgContent }}
                />
              )}

              {/* Guides */}
              {showGuides && (
                <>
                  <div className="absolute inset-0 border border-crd-blue/30 pointer-events-none" />
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-crd-blue/20 pointer-events-none" />
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-crd-blue/20 pointer-events-none" />
                </>
              )}

              {/* Hover Indicator */}
              {isHovering && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-700 text-white text-xs px-2 py-1 rounded pointer-events-none">
                  {isDragging ? 'Dragging...' : 'Scroll to zoom, drag to move'}
                </div>
              )}
            </div>
          </div>

          {/* Control Sliders */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Frame Opacity */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center gap-2">
                <FrameIcon className="w-4 h-4" />
                Frame Opacity
              </label>
              <Slider
                value={[frameOpacity]}
                onValueChange={(value) => setFrameOpacity(value[0])}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="text-xs text-slate-400">{frameOpacity}%</div>
            </div>

            {/* Image Opacity */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Image Opacity
              </label>
              <Slider
                value={[imageOpacity]}
                onValueChange={(value) => setImageOpacity(value[0])}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="text-xs text-slate-400">{imageOpacity}%</div>
            </div>

            {/* Layer Order Toggle */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Layer Order
              </label>
              <PSDButton
                variant={frameInFront ? "primary" : "secondary"}
                onClick={() => setFrameInFront(!frameInFront)}
                className="w-full"
              >
                Frame {frameInFront ? 'Front' : 'Behind'}
              </PSDButton>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <PSDButton variant="secondary" size="sm">
              Save Position
            </PSDButton>
            <PSDButton variant="secondary" size="sm">
              Export Preview
            </PSDButton>
            <PSDButton variant="primary" size="sm">
              Apply & Continue
            </PSDButton>
          </div>
        </div>
      </PSDCard>
    </div>
  );
};
