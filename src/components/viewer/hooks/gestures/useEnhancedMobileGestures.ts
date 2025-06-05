
import { useState, useCallback, useRef, useEffect } from 'react';
import type { TouchPoint, GestureState, EnhancedGestureCallbacks } from './types';
import { useTouchUtils } from './touchUtils';
import { useMomentumHandler } from './momentumHandler';

export const useEnhancedMobileGestures = (callbacks: EnhancedGestureCallbacks) => {
  const [gestureState, setGestureState] = useState<GestureState>({
    isActive: false,
    startTime: 0,
    initialDistance: 0,
    initialScale: 1,
    initialRotation: 0,
    velocity: { x: 0, y: 0 },
    momentum: false
  });

  const touchesRef = useRef<TouchPoint[]>([]);
  const lastTapTime = useRef(0);
  const longPressTimer = useRef<NodeJS.Timeout>();
  const lastPanTime = useRef(0);

  const { getDistance, getCenter, getTouchPoints } = useTouchUtils();
  const { startMomentum, stopMomentum, momentumTimer } = useMomentumHandler(callbacks.onPan);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    
    // Stop any existing momentum
    stopMomentum();
    
    const touches = getTouchPoints(e.touches);
    touchesRef.current = touches;
    const now = Date.now();

    // Three finger tap detection
    if (touches.length === 3) {
      callbacks.onThreeFingerTap();
      return;
    }

    // Long press timer for single touch
    if (touches.length === 1) {
      longPressTimer.current = setTimeout(() => {
        callbacks.onLongPress();
        // Haptic feedback for PWA
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
      }, 500);
    }

    const initialDistance = touches.length >= 2 ? getDistance(touches[0], touches[1]) : 0;

    setGestureState({
      isActive: true,
      startTime: now,
      initialDistance,
      initialScale: 1,
      initialRotation: 0,
      velocity: { x: 0, y: 0 },
      momentum: false
    });
  }, [callbacks, getTouchPoints, getDistance, stopMomentum]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    
    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }

    const touches = getTouchPoints(e.touches);
    const prevTouches = touchesRef.current;
    
    if (!gestureState.isActive || prevTouches.length === 0) return;

    const now = Date.now();
    const deltaTime = now - lastPanTime.current || 16;
    lastPanTime.current = now;

    if (touches.length === 1 && prevTouches.length === 1) {
      // Single finger pan
      const deltaX = touches[0].x - prevTouches[0].x;
      const deltaY = touches[0].y - prevTouches[0].y;
      const velocityX = deltaX / deltaTime * 16;
      const velocityY = deltaY / deltaTime * 16;

      callbacks.onPan({ x: deltaX, y: deltaY }, { x: velocityX, y: velocityY });
      
      setGestureState(prev => ({
        ...prev,
        velocity: { x: velocityX, y: velocityY }
      }));

    } else if (touches.length === 2 && prevTouches.length === 2) {
      // Two finger gestures
      const currentDistance = getDistance(touches[0], touches[1]);
      const currentCenter = getCenter(touches);

      if (gestureState.initialDistance > 0) {
        // Pinch zoom
        const scale = currentDistance / gestureState.initialDistance;
        callbacks.onPinchZoom(scale, currentCenter);
      }

      // Two finger rotation (optional)
      const angle1 = Math.atan2(prevTouches[1].y - prevTouches[0].y, prevTouches[1].x - prevTouches[0].x);
      const angle2 = Math.atan2(touches[1].y - touches[0].y, touches[1].x - touches[0].x);
      const rotation = (angle2 - angle1) * (180 / Math.PI);
      
      if (Math.abs(rotation) > 2) {
        callbacks.onRotate(rotation);
      }
    }

    touchesRef.current = touches;
  }, [callbacks, gestureState, getTouchPoints, getDistance, getCenter]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }

    const now = Date.now();
    const touchDuration = now - gestureState.startTime;
    const remainingTouches = getTouchPoints(e.touches);

    // Handle tap gestures when all fingers are lifted
    if (remainingTouches.length === 0 && touchesRef.current.length === 1) {
      if (touchDuration < 300) {
        const timeSinceLastTap = now - lastTapTime.current;
        
        if (timeSinceLastTap < 300) {
          // Double tap
          callbacks.onDoubleTap();
          lastTapTime.current = 0;
        } else {
          // Single tap (with delay to detect double tap)
          setTimeout(() => {
            if (now === lastTapTime.current) {
              callbacks.onTap();
            }
          }, 300);
          lastTapTime.current = now;
        }
      }

      // Swipe detection
      if (touchDuration < 500 && touchesRef.current.length === 1) {
        const startTouch = touchesRef.current[0];
        const changedTouches = getTouchPoints(e.changedTouches);
        const endTouch = changedTouches.find(t => t.id === startTouch.id);
        
        if (endTouch) {
          const deltaX = endTouch.x - startTouch.x;
          const velocity = Math.abs(deltaX) / touchDuration;
          
          if (velocity > 0.5 && Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
              callbacks.onSwipeRight();
            } else {
              callbacks.onSwipeLeft();
            }
          }
        }
      }

      // Start momentum if there's sufficient velocity
      if (Math.abs(gestureState.velocity.x) > 1 || Math.abs(gestureState.velocity.y) > 1) {
        startMomentum(gestureState.velocity, setGestureState);
      }
    }

    setGestureState(prev => ({
      ...prev,
      isActive: remainingTouches.length > 0
    }));

    touchesRef.current = remainingTouches;
  }, [callbacks, gestureState, getTouchPoints, startMomentum]);

  // Prevent default browser behaviors for PWA
  useEffect(() => {
    const preventDefaultTouch = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    const preventZoom = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchstart', preventDefaultTouch, { passive: false });
    document.addEventListener('touchmove', preventDefaultTouch, { passive: false });
    document.addEventListener('wheel', preventZoom, { passive: false });

    return () => {
      document.removeEventListener('touchstart', preventDefaultTouch);
      document.removeEventListener('touchmove', preventDefaultTouch);
      document.removeEventListener('wheel', preventZoom);
      
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
      if (momentumTimer.current) {
        cancelAnimationFrame(momentumTimer.current);
      }
    };
  }, []);

  return {
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    isActive: gestureState.isActive,
    hasMomentum: gestureState.momentum
  };
};
