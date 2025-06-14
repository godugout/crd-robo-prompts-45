
import { useState, useCallback, useRef, useEffect } from 'react';

interface SwipeState {
  isDragging: boolean;
  startX: number;
  currentX: number;
  deltaX: number;
  velocity: number;
  startTime: number;
}

interface SwipeNavigationProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onDragUpdate?: (deltaX: number, progress: number) => void;
  threshold?: number;
  velocityThreshold?: number;
}

export const useSwipeNavigation = ({
  onSwipeLeft,
  onSwipeRight,
  onDragUpdate,
  threshold = 50,
  velocityThreshold = 0.5
}: SwipeNavigationProps) => {
  const [swipeState, setSwipeState] = useState<SwipeState>({
    isDragging: false,
    startX: 0,
    currentX: 0,
    deltaX: 0,
    velocity: 0,
    startTime: 0
  });

  const animationRef = useRef<number>();
  const lastMoveTime = useRef<number>(0);

  const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const now = Date.now();
    
    setSwipeState({
      isDragging: true,
      startX: clientX,
      currentX: clientX,
      deltaX: 0,
      velocity: 0,
      startTime: now
    });
    
    lastMoveTime.current = now;
  }, []);

  const handleMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!swipeState.isDragging) return;
    
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const now = Date.now();
    const deltaTime = now - lastMoveTime.current;
    const deltaX = clientX - swipeState.startX;
    const velocity = deltaTime > 0 ? (clientX - swipeState.currentX) / deltaTime : 0;
    
    setSwipeState(prev => ({
      ...prev,
      currentX: clientX,
      deltaX,
      velocity
    }));
    
    // Calculate progress for visual feedback
    const progress = Math.max(-1, Math.min(1, deltaX / 200));
    onDragUpdate?.(deltaX, progress);
    
    lastMoveTime.current = now;
  }, [swipeState.isDragging, swipeState.startX, swipeState.currentX, onDragUpdate]);

  const handleEnd = useCallback(() => {
    if (!swipeState.isDragging) return;
    
    const { deltaX, velocity, startTime } = swipeState;
    const duration = Date.now() - startTime;
    const absVelocity = Math.abs(velocity);
    
    // Determine if it's a swipe based on distance or velocity
    const isSwipe = Math.abs(deltaX) > threshold || absVelocity > velocityThreshold;
    
    if (isSwipe) {
      if (deltaX > 0) {
        onSwipeRight();
      } else {
        onSwipeLeft();
      }
    }
    
    // Reset drag state
    setSwipeState(prev => ({
      ...prev,
      isDragging: false,
      deltaX: 0,
      velocity: 0
    }));
    
    // Reset visual feedback
    onDragUpdate?.(0, 0);
  }, [swipeState, threshold, velocityThreshold, onSwipeLeft, onSwipeRight, onDragUpdate]);

  // Mouse event handlers for desktop
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    handleTouchStart(e);
  }, [handleTouchStart]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    handleMove(e);
  }, [handleMove]);

  const handleMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // Touch event handlers for mobile
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    handleMove(e);
  }, [handleMove]);

  // Add global mouse event listeners when dragging
  useEffect(() => {
    if (swipeState.isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        const syntheticEvent = {
          clientX: e.clientX,
          preventDefault: () => e.preventDefault()
        } as React.MouseEvent;
        handleMove(syntheticEvent);
      };

      const handleGlobalMouseUp = () => {
        handleEnd();
      };

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [swipeState.isDragging, handleMove, handleEnd]);

  return {
    swipeState,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleEnd,
      onMouseDown: handleMouseDown,
    }
  };
};
