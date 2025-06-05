
import { useCallback } from 'react';
import type { TouchPoint } from './types';

export const useTouchUtils = () => {
  // Calculate distance between two points
  const getDistance = useCallback((p1: TouchPoint, p2: TouchPoint) => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  // Calculate center point of touches
  const getCenter = useCallback((touches: TouchPoint[]) => {
    let x = 0, y = 0;
    touches.forEach(touch => {
      x += touch.x;
      y += touch.y;
    });
    return { x: x / touches.length, y: y / touches.length };
  }, []);

  // Convert React TouchList to TouchPoint array - Fixed for React.TouchList compatibility
  const getTouchPoints = useCallback((touchList: React.TouchList): TouchPoint[] => {
    const points: TouchPoint[] = [];
    for (let i = 0; i < touchList.length; i++) {
      const touch = touchList[i];
      points.push({
        x: touch.clientX,
        y: touch.clientY,
        id: touch.identifier
      });
    }
    return points;
  }, []);

  return {
    getDistance,
    getCenter,
    getTouchPoints
  };
};
