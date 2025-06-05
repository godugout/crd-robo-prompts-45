
import { useCallback, useRef, useEffect } from 'react';

interface UseViewerGesturesProps {
  zoom: number;
  rotation: { x: number; y: number };
  isFlipped: boolean;
  autoRotate: boolean;
  allowRotation: boolean;
  isDragging: boolean;
  dragStart: { x: number; y: number };
  setZoom: (zoom: number) => void;
  setRotation: (rotation: { x: number; y: number }) => void;
  setIsFlipped: (flipped: boolean) => void;
  setAutoRotate: (autoRotate: boolean) => void;
  setIsDragging: (dragging: boolean) => void;
  setDragStart: (start: { x: number; y: number }) => void;
  setMousePosition: (pos: { x: number; y: number }) => void;
  setIsHoveringControls: (hovering: boolean) => void;
  handleNextCard: () => void;
  handlePreviousCard: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
  isMobile: boolean;
}

export const useViewerGestures = ({
  zoom, rotation, isFlipped, autoRotate, allowRotation, isDragging, dragStart,
  setZoom, setRotation, setIsFlipped, setAutoRotate, setIsDragging, setDragStart,
  setMousePosition, setIsHoveringControls, handleNextCard, handlePreviousCard,
  containerRef, isMobile
}: UseViewerGesturesProps) => {
  const animationRef = useRef<number>();

  // Enhanced mobile gesture handlers
  const handleMobileZoom = useCallback((delta: number) => {
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  }, [setZoom]);

  const handleRotationChange = useCallback((newRotation: { x: number; y: number }) => {
    setRotation(newRotation);
  }, [setRotation]);

  const handleMobileDoubleTap = useCallback(() => {
    if (zoom <= 1) {
      setZoom(1.5);
    } else {
      setZoom(1);
    }
    setRotation({ x: 0, y: 0 });
  }, [zoom, setZoom, setRotation]);

  const handleMobileLongPress = useCallback(() => {
    setIsFlipped(!isFlipped);
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, [isFlipped, setIsFlipped]);

  const handleMobileReset = useCallback(() => {
    setRotation({ x: 0, y: 0 });
    setZoom(1);
    setIsFlipped(false);
    setAutoRotate(false);
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  }, [setRotation, setZoom, setIsFlipped, setAutoRotate]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isMobile && !isDragging && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
      
      const isInControlsArea = e.clientX - rect.left < 300 && e.clientY - rect.top > rect.height - 100;
      setIsHoveringControls(isInControlsArea);
      
      if (allowRotation && !autoRotate) {
        setRotation({
          x: (y - 0.5) * 20,
          y: (x - 0.5) * -20
        });
      }
    }
  }, [isDragging, allowRotation, autoRotate, isMobile, containerRef, setMousePosition, setIsHoveringControls, setRotation]);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (allowRotation) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - rotation.y, y: e.clientY - rotation.x });
      setAutoRotate(false);
    }
  }, [rotation, allowRotation, setIsDragging, setDragStart, setAutoRotate]);

  const handleDrag = useCallback((e: React.MouseEvent) => {
    if (isDragging && allowRotation) {
      setRotation({
        x: e.clientY - dragStart.y,
        y: e.clientX - dragStart.x
      });
    }
  }, [isDragging, dragStart, allowRotation, setRotation]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, [setIsDragging]);

  const handleReset = useCallback(() => {
    setRotation({ x: 0, y: 0 });
    setZoom(1);
    setIsFlipped(false);
    setAutoRotate(false);
  }, [setRotation, setZoom, setIsFlipped, setAutoRotate]);

  const handleZoom = useCallback((delta: number) => {
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  }, [setZoom]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, [containerRef]);

  // Auto-rotation effect
  useEffect(() => {
    if (autoRotate && !isDragging) {
      const animate = () => {
        setRotation(prev => ({
          x: Math.sin(Date.now() * 0.0005) * 10,
          y: prev.y + 0.5
        }));
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [autoRotate, isDragging, setRotation]);

  // Wheel zoom effect
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomDelta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom(prev => Math.max(0.5, Math.min(3, prev + zoomDelta)));
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [setZoom, containerRef]);

  return {
    handleMobileZoom,
    handleRotationChange,
    handleMobileDoubleTap,
    handleMobileLongPress,
    handleMobileReset,
    handleMouseMove,
    handleDragStart,
    handleDrag,
    handleDragEnd,
    handleReset,
    handleZoom,
    toggleFullscreen,
    handleMobileSwipeLeft: handleNextCard,
    handleMobileSwipeRight: handlePreviousCard
  };
};
