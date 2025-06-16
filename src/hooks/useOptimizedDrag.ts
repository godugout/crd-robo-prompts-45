
import { useCallback, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

interface UseOptimizedDragOptions {
  onPositionChange: (position: Position) => void;
  throttleMs?: number;
}

export const useOptimizedDrag = ({ 
  onPositionChange, 
  throttleMs = 16 
}: UseOptimizedDragOptions) => {
  const rafRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const throttledUpdate = useCallback((position: Position) => {
    const now = Date.now();
    
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    if (now - lastUpdateRef.current >= throttleMs) {
      onPositionChange(position);
      lastUpdateRef.current = now;
    } else {
      rafRef.current = requestAnimationFrame(() => {
        onPositionChange(position);
        lastUpdateRef.current = Date.now();
      });
    }
  }, [onPositionChange, throttleMs]);

  return { throttledUpdate };
};
