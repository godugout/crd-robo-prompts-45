import React, { useRef, useEffect, useState } from 'react';
import { ProcessedPSD } from '@/services/psdProcessor/psdProcessingService';
import { LayerGroup } from '@/services/psdProcessor/layerGroupingService';
import { useCanvasNavigation } from '@/hooks/useCanvasNavigation';
import { CanvasControls } from './CanvasControls';

interface PSDCanvasPreviewProps {
  processedPSD: ProcessedPSD;
  selectedLayerId: string;
  hiddenLayers: Set<string>;
  layerGroups: LayerGroup[];
  onLayerSelect: (layerId: string) => void;
  frameBuilderMode?: boolean;
  focusMode?: boolean;
}

export const PSDCanvasPreview: React.FC<PSDCanvasPreviewProps> = ({
  processedPSD,
  selectedLayerId,
  hiddenLayers,
  onLayerSelect,
  focusMode = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredLayerId, setHoveredLayerId] = useState<string | null>(null);
  
  const {
    transform,
    isPanning,
    zoomIn,
    zoomOut,
    resetView,
    fitToScreen,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    getTransformStyle
  } = useCanvasNavigation();

  const handleFitToScreen = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      fitToScreen(
        container.clientWidth,
        container.clientHeight,
        processedPSD.width,
        processedPSD.height
      );
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        zoomIn();
      } else if (e.key === '-') {
        e.preventDefault();
        zoomOut();
      } else if (e.key === '0') {
        e.preventDefault();
        resetView();
      } else if (e.key === '1') {
        e.preventDefault();
        handleFitToScreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomIn, zoomOut, resetView, handleFitToScreen]);

  // Create grid pattern
  const createGridPattern = () => {
    const svg = `
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <!-- Fine grid lines every 20px -->
            <path d="M 20 0 L 20 100 M 40 0 L 40 100 M 60 0 L 60 100 M 80 0 L 80 100" 
                  stroke="#1e293b" stroke-width="0.5" opacity="0.3"/>
            <path d="M 0 20 L 100 20 M 0 40 L 100 40 M 0 60 L 100 60 M 0 80 L 100 80" 
                  stroke="#1e293b" stroke-width="0.5" opacity="0.3"/>
            <!-- Major grid lines every 100px -->
            <path d="M 100 0 L 100 100 M 0 100 L 100 100" 
                  stroke="#334155" stroke-width="1" opacity="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const selectedLayer = processedPSD.layers.find(layer => layer.id === selectedLayerId);
  const hoveredLayer = processedPSD.layers.find(layer => layer.id === hoveredLayerId);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0a0a0b]">
      {/* Canvas Controls */}
      <CanvasControls
        zoom={transform.scale}
        isPanning={isPanning}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onFitToScreen={handleFitToScreen}
        onResetView={resetView}
      />

      {/* Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full relative"
        style={{
          backgroundImage: `url("${createGridPattern()}")`,
          backgroundSize: `${100 * transform.scale}px ${100 * transform.scale}px`,
          backgroundPosition: `${transform.translateX}px ${transform.translateY}px`,
          cursor: isPanning ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Card Container */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={getTransformStyle()}
        >
          <div className="relative">
            {/* Base transparent image */}
            <img
              src={processedPSD.transparentFlattenedImageUrl}
              alt="PSD Preview (Transparent)"
              className={`
                max-w-none shadow-2xl opacity-30
                ${focusMode ? 'rounded-lg' : ''}
              `}
              style={{
                width: `${processedPSD.width}px`,
                height: `${processedPSD.height}px`
              }}
              draggable={false}
            />

            {/* Hovered Layer - Light Preview */}
            {hoveredLayerId && hoveredLayer?.fullColorImageUrl && hoveredLayerId !== selectedLayerId && (
              <img
                src={hoveredLayer.fullColorImageUrl}
                alt={hoveredLayer.name}
                className={`
                  max-w-none opacity-60 transition-opacity duration-200
                  ${focusMode ? 'rounded-lg' : ''}
                  ring-1 ring-slate-400 ring-opacity-50
                `}
                style={{
                  position: 'absolute',
                  left: `${hoveredLayer.bounds.left}px`,
                  top: `${hoveredLayer.bounds.top}px`,
                  width: `${hoveredLayer.bounds.right - hoveredLayer.bounds.left}px`,
                  height: `${hoveredLayer.bounds.bottom - hoveredLayer.bounds.top}px`
                }}
                draggable={false}
              />
            )}

            {/* Selected Layer - Full Color */}
            {selectedLayerId && selectedLayer?.fullColorImageUrl && (
              <img
                src={selectedLayer.fullColorImageUrl}
                alt={selectedLayer.name}
                className={`
                  max-w-none shadow-2xl transition-all duration-300
                  ${focusMode ? 'rounded-lg' : ''}
                  ring-2 ring-crd-green ring-opacity-70
                `}
                style={{
                  position: 'absolute',
                  left: `${selectedLayer.bounds.left}px`,
                  top: `${selectedLayer.bounds.top}px`,
                  width: `${selectedLayer.bounds.right - selectedLayer.bounds.left}px`,
                  height: `${selectedLayer.bounds.bottom - selectedLayer.bounds.top}px`
                }}
                draggable={false}
              />
            )}

            {/* Layer Bounds Visualization */}
            {!focusMode && processedPSD.layers.map(layer => {
              const isSelected = selectedLayerId === layer.id;
              const isHovered = hoveredLayerId === layer.id;
              const isHidden = hiddenLayers.has(layer.id);
              
              if (isHidden) return null;

              return (
                <div
                  key={layer.id}
                  className={`
                    absolute border pointer-events-auto cursor-pointer transition-all duration-200
                    ${isSelected 
                      ? 'border-crd-green border-2 bg-crd-green/20' 
                      : isHovered
                        ? 'border-slate-300 border-2 bg-slate-300/10'
                        : 'border-slate-500/30 border hover:border-slate-400/50 hover:bg-slate-400/10'
                    }
                  `}
                  style={{
                    left: `${layer.bounds.left}px`,
                    top: `${layer.bounds.top}px`,
                    width: `${layer.bounds.right - layer.bounds.left}px`,
                    height: `${layer.bounds.bottom - layer.bounds.top}px`
                  }}
                  onClick={() => onLayerSelect(layer.id)}
                  onMouseEnter={() => setHoveredLayerId(layer.id)}
                  onMouseLeave={() => setHoveredLayerId(null)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="absolute bottom-4 right-4 bg-[#1a1f2e] border border-slate-700 rounded-lg px-3 py-2">
        <div className="text-xs text-slate-400">
          {processedPSD.width} × {processedPSD.height}px • {processedPSD.layers.length} layers
          {selectedLayer && (
            <span className="text-crd-green ml-2">
              • {selectedLayer.name}
            </span>
          )}
          {hoveredLayer && hoveredLayerId !== selectedLayerId && (
            <span className="text-slate-300 ml-2">
              • Hover: {hoveredLayer.name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
