
import { useState, useCallback, useRef, useEffect } from 'react';

interface GestureState {
  isActive: boolean;
  gestureType: 'tap' | 'longPress' | 'pinch' | 'swipe' | 'rotate' | null;
  scale: number;
  rotation: number;
  center: { x: number; y: number };
  velocity: { x: number; y: number };
}

interface GestureCallbacks {
  onTap?: (position: { x: number; y: number }) => void;
  onLongPress?: (position: { x: number; y: number }) => void;
  onPinchZoom?: (scale: number, center: { x: number; y: number }) => void;
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down', velocity: number) => void;
  onRotate?: (angle: number, center: { x: number; y: number }) => void;
  onGestureStart?: (type: string) => void;
  onGestureEnd?: (type: string) => void;
}

export const useEnhancedGestureRecognition = (callbacks: GestureCallbacks) => {
  const [gestureState, setGestureState] = useState<GestureState>({
    isActive: false,
    gestureType: null,
    scale: 1,
    rotation: 0,
    center: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 }
  });

  const touchStartTime = useRef<number>(0);
  const initialDistance = useRef<number>(0);
  const initialAngle = useRef<number>(0);
  const longPressTimer = useRef<NodeJS.Timeout>();
  const lastTouchTime = useRef<number>(0);

  const getTouchDistance = useCallback((touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  const getTouchAngle = useCallback((touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[1].clientX - touches[0].clientX;
    const dy = touches[1].clientY - touches[0].clientY;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  }, []);

  const getTouchCenter = useCallback((touches: React.TouchList) => {
    let x = 0, y = 0;
    for (let i = 0; i < touches.length; i++) {
      x += touches[i].clientX;
      y += touches[i].clientY;
    }
    return { x: x / touches.length, y: y / touches.length };
  }, []);

  const triggerHaptic = useCallback((pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const now = Date.now();
    touchStartTime.current = now;
    
    const touches = e.touches;
    const center = getTouchCenter(touches);
    
    if (touches.length === 1) {
      // Single touch - potential tap or long press
      longPressTimer.current = setTimeout(() => {
        callbacks.onLongPress?.(center);
        triggerHaptic(100);
        setGestureState(prev => ({ ...prev, gestureType: 'longPress' }));
      }, 500);
      
      // Double tap detection
      if (now - lastTouchTime.current < 300) {
        callbacks.onTap?.(center);
        triggerHaptic([50, 50, 50]);
      }
      lastTouchTime.current = now;
    } else if (touches.length === 2) {
      // Multi-touch gestures
      initialDistance.current = getTouchDistance(touches);
      initialAngle.current = getTouchAngle(touches);
      callbacks.onGestureStart?.('multitouch');
    }

    setGestureState(prev => ({
      ...prev,
      isActive: true,
      center,
      gestureType: touches.length === 1 ? 'tap' : null
    }));
  }, [callbacks, getTouchCenter, getTouchDistance, getTouchAngle, triggerHaptic]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }

    const touches = e.touches;
    const center = getTouchCenter(touches);

    if (touches.length === 2) {
      const distance = getTouchDistance(touches);
      const angle = getTouchAngle(touches);

      if (initialDistance.current > 0) {
        const scale = distance / initialDistance.current;
        callbacks.onPinchZoom?.(scale, center);
        setGestureState(prev => ({ ...prev, scale, gestureType: 'pinch' }));
      }

      if (Math.abs(angle - initialAngle.current) > 5) {
        const rotation = angle - initialAngle.current;
        callbacks.onRotate?.(rotation, center);
        setGestureState(prev => ({ ...prev, rotation, gestureType: 'rotate' }));
      }
    }

    setGestureState(prev => ({ ...prev, center }));
  }, [callbacks, getTouchCenter, getTouchDistance, getTouchAngle]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }

    const touchDuration = Date.now() - touchStartTime.current;
    const changedTouches = e.changedTouches;

    // Swipe detection for single touch
    if (changedTouches.length === 1 && touchDuration < 500) {
      const touch = changedTouches[0];
      const deltaX = touch.clientX - gestureState.center.x;
      const deltaY = touch.clientY - gestureState.center.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance > 50) {
        const velocity = distance / touchDuration;
        let direction: 'left' | 'right' | 'up' | 'down';
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          direction = deltaX > 0 ? 'right' : 'left';
        } else {
          direction = deltaY > 0 ? 'down' : 'up';
        }
        
        callbacks.onSwipe?.(direction, velocity);
        triggerHaptic(75);
        setGestureState(prev => ({ ...prev, gestureType: 'swipe' }));
      } else if (touchDuration < 200) {
        // Quick tap
        callbacks.onTap?.(gestureState.center);
        triggerHaptic(25);
      }
    }

    callbacks.onGestureEnd?.(gestureState.gestureType || 'unknown');

    setGestureState(prev => ({
      ...prev,
      isActive: false,
      gestureType: null,
      scale: 1,
      rotation: 0
    }));
  }, [callbacks, gestureState, triggerHaptic]);

  const touchHandlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };

  return {
    gestureState,
    touchHandlers,
    triggerHaptic
  };
};
