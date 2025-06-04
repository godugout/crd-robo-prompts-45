
import { useState, useCallback, useRef } from 'react';

export const useViewerState = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showEffects, setShowEffects] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showCustomizePanel, setShowCustomizePanel] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [isHoveringControls, setIsHoveringControls] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  const handleRotationChange = useCallback((newRotation: { x: number; y: number }) => {
    setRotation(newRotation);
  }, []);

  const handleReset = useCallback(() => {
    setRotation({ x: 0, y: 0 });
    setZoom(1);
    setIsFlipped(false);
    setAutoRotate(false);
  }, []);

  const handleZoom = useCallback((delta: number) => {
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  return {
    // State
    isFullscreen,
    rotation,
    isDragging,
    dragStart,
    zoom,
    isFlipped,
    autoRotate,
    showEffects,
    mousePosition,
    showCustomizePanel,
    isHovering,
    isHoveringControls,
    showExportDialog,
    containerRef,
    cardContainerRef,
    // Setters
    setRotation,
    setIsDragging,
    setDragStart,
    setZoom,
    setIsFlipped,
    setAutoRotate,
    setShowEffects,
    setMousePosition,
    setShowCustomizePanel,
    setIsHovering,
    setIsHoveringControls,
    setShowExportDialog,
    // Handlers
    handleRotationChange,
    handleReset,
    handleZoom,
    toggleFullscreen
  };
};
