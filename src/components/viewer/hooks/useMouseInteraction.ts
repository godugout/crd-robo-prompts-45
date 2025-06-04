
import { useCallback, useEffect, useRef } from 'react';

interface UseMouseInteractionProps {
  containerRef: React.RefObject<HTMLDivElement>;
  isDragging: boolean;
  rotation: { x: number; y: number };
  allowRotation: boolean;
  autoRotate: boolean;
  setMousePosition: (pos: { x: number; y: number }) => void;
  setIsHoveringControls: (hovering: boolean) => void;
  setRotation: (rotation: { x: number; y: number }) => void;
  setIsDragging: (dragging: boolean) => void;
  setDragStart: (start: { x: number; y: number }) => void;
  setZoom: (updateFn: (prev: number) => number) => void;
}

export const useMouseInteraction = ({
  containerRef,
  isDragging,
  rotation,
  allowRotation,
  autoRotate,
  setMousePosition,
  setIsHoveringControls,
  setRotation,
  setIsDragging,
  setDragStart,
  setZoom
}: UseMouseInteractionProps) => {
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging && containerRef.current) {
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
  }, [isDragging, allowRotation, autoRotate, containerRef, setMousePosition, setIsHoveringControls, setRotation]);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (allowRotation) {
      setIsDragging(true);
      const dragStart = { x: e.clientX - rotation.y, y: e.clientY - rotation.x };
      dragStartRef.current = dragStart;
      setDragStart(dragStart);
    }
  }, [rotation, allowRotation, setIsDragging, setDragStart]);

  const handleDrag = useCallback((e: React.MouseEvent) => {
    if (isDragging && allowRotation) {
      setRotation({
        x: e.clientY - dragStartRef.current.y,
        y: e.clientX - dragStartRef.current.x
      });
    }
  }, [isDragging, allowRotation, setRotation]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, [setIsDragging]);

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

  return {
    handleMouseMove,
    handleDragStart,
    handleDrag,
    handleDragEnd
  };
};
