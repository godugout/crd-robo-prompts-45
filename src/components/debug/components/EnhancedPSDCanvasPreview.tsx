
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ProcessedPSD } from '@/services/psdProcessor/psdProcessingService';
import { CanvasControls } from './CanvasControls';

interface EnhancedPSDCanvasPreviewProps {
  processedPSD: ProcessedPSD;
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
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Canvas workspace dimensions
  const WORKSPACE_SIZE = { width: 2000, height: 2000 };
  
  // PSD content dimensions and positioning
  const psdDimensions = useMemo(() => ({
    width: processedPSD.width,
    height: processedPSD.height
  }), [processedPSD.width, processedPSD.height]);

  const contentScale = useMemo(() => {
    const maxDisplaySize = Math.min(600, Math.min(canvasSize.width, canvasSize.height) * 0.6);
    return Math.min(maxDisplaySize / psdDimensions.width, maxDisplaySize / psdDimensions.height, 1);
  }, [psdDimensions, canvasSize]);

  const contentPosition = useMemo(() => ({
    x: (WORKSPACE_SIZE.width - psdDimensions.width * contentScale) / 2,
    y: (WORKSPACE_SIZE.height - psdDimensions.height * contentScale) / 2
  }), [psdDimensions, contentScale]);

  // Update canvas size on mount and resize
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setCanvasSize({ width: rect.width, height: rect.height });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        onFocusModeToggle?.();
      } else if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        onToggleBackground?.();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleResetView();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onFocusModeToggle, onToggleBackground]);

  // Pan and zoom handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) { // Left click
      setIsPanning(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  }, [panOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      const newOffset = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      };
      
      // Apply pan boundaries
      const maxPanX = Math.max(0, (WORKSPACE_SIZE.width * zoom - canvasSize.width) / 2);
      const maxPanY = Math.max(0, (WORKSPACE_SIZE.height * zoom - canvasSize.height) / 2);
      
      setPanOffset({
        x: Math.max(-maxPanX, Math.min(maxPanX, newOffset.x)),
        y: Math.max(-maxPanY, Math.min(maxPanY, newOffset.y))
      });
    }
  }, [isPanning, dragStart, zoom, canvasSize]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(5, zoom * zoomFactor));
    setZoom(newZoom);
  }, [zoom]);

  // Canvas control handlers
  const handleZoomIn = () => setZoom(prev => Math.min(5, prev * 1.2));
  const handleZoomOut = () => setZoom(prev => Math.max(0.1, prev / 1.2));
  const handleFitToScreen = () => {
    const scaleX = canvasSize.width / (psdDimensions.width * contentScale + 100);
    const scaleY = canvasSize.height / (psdDimensions.height * contentScale + 100);
    const newZoom = Math.min(scaleX, scaleY, 2);
    setZoom(newZoom);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleResetView = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Layer click handler
  const handleLayerClick = useCallback((layerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onLayerSelect(layerId);
  }, [onLayerSelect]);

  // Filter layers based on view mode and focus mode
  const visibleLayers = useMemo(() => {
    return processedPSD.layers.filter(layer => {
      if (hiddenLayers.has(layer.id)) return false;
      
      if (focusMode && selectedLayerId && layer.id !== selectedLayerId) {
        return false;
      }
      
      return true;
    });
  }, [processedPSD.layers, hiddenLayers, focusMode, selectedLayerId]);

  // Render background
  const renderBackground = () => {
    if (!showBackground || !processedPSD.flattenedImage) return null;

    return (
      <div
        className="absolute pointer-events-none"
        style={{
          left: contentPosition.x,
          top: contentPosition.y,
          width: psdDimensions.width * contentScale,
          height: psdDimensions.height * contentScale,
          opacity: focusMode ? 0.3 : 1,
          transition: 'opacity 0.3s ease'
        }}
      >
        <img
          src={processedPSD.flattenedImage}
          alt="PSD Background"
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>
    );
  };

  // Render individual layer
  const renderLayer = (layer: any, index: number) => {
    if (!layer.extractedImageDataUrl) return null;

    const isSelected = layer.id === selectedLayerId;
    const layerStyle = {
      position: 'absolute' as const,
      left: contentPosition.x + (layer.bounds?.left || 0) * contentScale,
      top: contentPosition.y + (layer.bounds?.top || 0) * contentScale,
      width: (layer.bounds?.width || psdDimensions.width) * contentScale,
      height: (layer.bounds?.height || psdDimensions.height) * contentScale,
      zIndex: processedPSD.layers.length - index,
      opacity: focusMode && !isSelected ? 0.3 : (layer.opacity || 1),
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    };

    return (
      <div
        key={layer.id}
        style={layerStyle}
        onClick={(e) => handleLayerClick(layer.id, e)}
        className={`
          hover:ring-2 hover:ring-blue-400 hover:ring-opacity-60
          ${isSelected ? 'ring-2 ring-crd-green ring-opacity-80' : ''}
          ${viewMode === 'frame' ? 'hover:ring-yellow-400' : ''}
          ${viewMode === 'build' ? 'hover:ring-purple-400' : ''}
        `}
      >
        <img
          src={layer.extractedImageDataUrl}
          alt={layer.name}
          className="w-full h-full object-contain pointer-events-none"
          draggable={false}
        />
        
        {isSelected && (
          <div className="absolute inset-0 border-2 border-crd-green animate-pulse pointer-events-none" />
        )}
      </div>
    );
  };

  return (
    <div className="h-full bg-[#0a0a0b] relative overflow-hidden">
      {/* Canvas Controls */}
      <CanvasControls
        zoom={zoom}
        isPanning={isPanning}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitToScreen={handleFitToScreen}
        onResetView={handleResetView}
        focusMode={focusMode}
        showBackground={showBackground}
        onToggleFocusMode={onFocusModeToggle}
        onToggleBackground={onToggleBackground}
      />

      {/* Main Canvas */}
      <div
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
          backgroundPosition: `${panOffset.x}px ${panOffset.y}px`
        }}
      >
        {/* Workspace Container */}
        <div
          className="relative origin-center transition-transform duration-200 ease-out"
          style={{
            width: WORKSPACE_SIZE.width,
            height: WORKSPACE_SIZE.height,
            transform: `translate(${panOffset.x + (canvasSize.width - WORKSPACE_SIZE.width) / 2}px, ${panOffset.y + (canvasSize.height - WORKSPACE_SIZE.height) / 2}px) scale(${zoom})`,
            transformOrigin: 'center center'
          }}
        >
          {/* Content Area Indicator */}
          <div
            className="absolute border border-slate-600 border-dashed rounded"
            style={{
              left: contentPosition.x - 10,
              top: contentPosition.y - 10,
              width: psdDimensions.width * contentScale + 20,
              height: psdDimensions.height * contentScale + 20,
              opacity: 0.3
            }}
          />

          {/* Background Layer */}
          {renderBackground()}

          {/* Individual Layer Rendering */}
          {visibleLayers.map((layer, index) => renderLayer(layer, index))}

          {/* Center Crosshair */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: WORKSPACE_SIZE.width / 2 - 10,
              top: WORKSPACE_SIZE.height / 2 - 10,
              width: 20,
              height: 20
            }}
          >
            <div className="w-full h-0.5 bg-slate-500 opacity-30 absolute top-1/2 transform -translate-y-1/2" />
            <div className="h-full w-0.5 bg-slate-500 opacity-30 absolute left-1/2 transform -translate-x-1/2" />
          </div>
        </div>
      </div>

      {/* Mode Indicator */}
      <div className="absolute bottom-4 left-4 bg-black/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-white">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            viewMode === 'inspect' ? 'bg-blue-400' :
            viewMode === 'frame' ? 'bg-yellow-400' :
            'bg-purple-400'
          }`} />
          {viewMode === 'inspect' && 'Layer Inspection'}
          {viewMode === 'frame' && 'Frame Analysis'}
          {viewMode === 'build' && 'Frame Building'}
        </div>
      </div>

      {/* Help Overlay */}
      {focusMode && (
        <div className="absolute bottom-4 right-4 bg-blue-500/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-white">
          Focus Mode Active - Press F to exit
        </div>
      )}
    </div>
  );
};
