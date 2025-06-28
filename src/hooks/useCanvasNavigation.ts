
import { useCallback, useRef, useState } from 'react';

interface CanvasTransform {
  scale: number;
  translateX: number;
  translateY: number;
}

interface UseCanvasNavigationOptions {
  minZoom?: number;
  maxZoom?: number;
  zoomStep?: number;
}

export const useCanvasNavigation = ({
  minZoom = 0.1,
  maxZoom = 5,
  zoomStep = 0.1
}: UseCanvasNavigationOptions = {}) => {
  const [transform, setTransform] = useState<CanvasTransform>({
    scale: 1,
    translateX: 0,
    translateY: 0
  });

  const [isPanning, setIsPanning] = useState(false);
  const lastPanPoint = useRef<{ x: number; y: number } | null>(null);

  const zoomIn = useCallback(() => {
    setTransform(prev => ({
      ...prev,
      scale: Math.min(prev.scale + zoomStep, maxZoom)
    }));
  }, [zoomStep, maxZoom]);

  const zoomOut = useCallback(() => {
    setTransform(prev => ({
      ...prev,
      scale: Math.max(prev.scale - zoomStep, minZoom)
    }));
  }, [zoomStep, minZoom]);

  const setZoom = useCallback((scale: number) => {
    setTransform(prev => ({
      ...prev,
      scale: Math.max(minZoom, Math.min(scale, maxZoom))
    }));
  }, [minZoom, maxZoom]);

  const resetView = useCallback(() => {
    setTransform({
      scale: 1,
      translateX: 0,
      translateY: 0
    });
  }, []);

  const fitToScreen = useCallback((containerWidth: number, containerHeight: number, contentWidth: number, contentHeight: number) => {
    const scaleX = (containerWidth * 0.8) / contentWidth;
    const scaleY = (containerHeight * 0.8) / contentHeight;
    const scale = Math.min(scaleX, scaleY, 1);
    
    setTransform({
      scale,
      translateX: 0,
      translateY: 0
    });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) { // Left mouse button
      setIsPanning(true);
      lastPanPoint.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning && lastPanPoint.current) {
      const deltaX = e.clientX - lastPanPoint.current.x;
      const deltaY = e.clientY - lastPanPoint.current.y;

      setTransform(prev => ({
        ...prev,
        translateX: prev.translateX + deltaX,
        translateY: prev.translateY + deltaY
      }));

      lastPanPoint.current = { x: e.clientX, y: e.clientY };
    }
  }, [isPanning]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    lastPanPoint.current = null;
  }, []);

  const getTransformStyle = useCallback(() => {
    return {
      transform: `translate(${transform.translateX}px, ${transform.translateY}px) scale(${transform.scale})`,
      transformOrigin: 'center center'
    };
  }, [transform]);

  return {
    transform,
    isPanning,
    zoomIn,
    zoomOut,
    setZoom,
    resetView,
    fitToScreen,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    getTransformStyle
  };
};
