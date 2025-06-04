
import { useCallback, useEffect } from 'react';

interface UseViewerInteractionsProps {
  containerRef: React.RefObject<HTMLDivElement>;
  rotation: { x: number; y: number };
  isDragging: boolean;
  dragStart: { x: number; y: number };
  allowRotation: boolean;
  autoRotate: boolean;
  animationRef: React.MutableRefObject<number | undefined>;
  setRotation: (rotation: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => void;
  setIsDragging: (isDragging: boolean) => void;
  setDragStart: (dragStart: { x: number; y: number }) => void;
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  setMousePosition: (position: { x: number; y: number }) => void;
  setAutoRotate: (autoRotate: boolean) => void;
}

export const useViewerInteractions = ({
  containerRef,
  rotation,
  isDragging,
  dragStart,
  allowRotation,
  autoRotate,
  animationRef,
  setRotation,
  setIsDragging,
  setDragStart,
  setZoom,
  setMousePosition,
  setAutoRotate
}: UseViewerInteractionsProps) => {
  
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
  }, [autoRotate, isDragging, animationRef, setRotation]);

  // Wheel zoom handler
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
  }, [containerRef, setZoom]);

  // Mouse interaction handlers
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
      
      if (allowRotation && !autoRotate) {
        setRotation({
          x: (y - 0.5) * 20,
          y: (x - 0.5) * -20
        });
      }
    }
  }, [isDragging, allowRotation, autoRotate, containerRef, setMousePosition, setRotation]);

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

  return {
    handleMouseMove,
    handleDragStart,
    handleDrag,
    handleDragEnd
  };
};
