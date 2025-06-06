
import { useState, useCallback, useRef, useEffect } from 'react';

export interface GestureState {
  isActive: boolean;
  gestureType: 'none' | 'tap' | 'long-press' | 'pinch' | 'swipe' | 'rotate';
  startTime: number;
  startPosition: { x: number; y: number };
  currentPosition: { x: number; y: number };
  scale: number;
  rotation: number;
  velocity: { x: number; y: number };
}

export interface GestureCallbacks {
  onTap: (position: { x: number; y: number }) => void;
  onLongPress: (position: { x: number; y: number }) => void;
  onPinchZoom: (scale: number, center: { x: number; y: number }) => void;
  onSwipe: (direction: 'left' | 'right' | 'up' | 'down', velocity: number) => void;
  onRotate: (angle: number, center: { x: number; y: number }) => void;
  onGestureStart: (type: GestureState['gestureType']) => void;
  onGestureEnd: (type: GestureState['gestureType']) => void;
}

export const useEnhancedGestureRecognition = (callbacks: GestureCallbacks) => {
  const [gestureState, setGestureState] = useState<GestureState>({
    isActive: false,
    gestureType: 'none',
    startTime: 0,
    startPosition: { x: 0, y: 0 },
    currentPosition: { x: 0, y: 0 },
    scale: 1,
    rotation: 0,
    velocity: { x: 0, y: 0 }
  });

  const longPressTimer = useRef<NodeJS.Timeout>();
  const lastTouchTime = useRef(0);
  const touchStartRef = useRef<{ x: number; y: number; time: number }>();

  // Enhanced distance calculation for pinch gestures
  const getDistance = useCallback((touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  // Enhanced angle calculation for rotation gestures
  const getAngle = useCallback((touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[1].clientX - touches[0].clientX;
    const dy = touches[1].clientY - touches[0].clientY;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  }, []);

  // Get center point for multi-touch gestures
  const getCenter = useCallback((touches: React.TouchList) => {
    let x = 0, y = 0;
    for (let i = 0; i < touches.length; i++) {
      x += touches[i].clientX;
      y += touches[i].clientY;
    }
    return { x: x / touches.length, y: y / touches.length };
  }, []);

  // Haptic feedback helper
  const triggerHaptic = useCallback((pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    
    const touches = e.touches;
    const now = Date.now();
    const center = getCenter(touches);

    // Clear any existing long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }

    // Store touch start info
    touchStartRef.current = { x: center.x, y: center.y, time: now };

    // Set up long press detection for single touch
    if (touches.length === 1) {
      longPressTimer.current = setTimeout(() => {
        setGestureState(prev => ({ ...prev, gestureType: 'long-press' }));
        callbacks.onLongPress(center);
        callbacks.onGestureStart('long-press');
        triggerHaptic(100); // Short haptic feedback
      }, 500);
    }

    const distance = getDistance(touches);
    const angle = getAngle(touches);

    setGestureState({
      isActive: true,
      gestureType: touches.length === 1 ? 'tap' : touches.length === 2 ? 'pinch' : 'none',
      startTime: now,
      startPosition: center,
      currentPosition: center,
      scale: 1,
      rotation: angle,
      velocity: { x: 0, y: 0 }
    });

    if (touches.length === 2) {
      callbacks.onGestureStart('pinch');
    } else if (touches.length === 1) {
      callbacks.onGestureStart('tap');
    }
  }, [callbacks, getCenter, getDistance, getAngle, triggerHaptic]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    
    if (!gestureState.isActive || !touchStartRef.current) return;

    const touches = e.touches;
    const center = getCenter(touches);
    const now = Date.now();

    // Clear long press timer if moving
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }

    // Calculate velocity
    const deltaTime = now - gestureState.startTime;
    const deltaX = center.x - gestureState.startPosition.x;
    const deltaY = center.y - gestureState.startPosition.y;
    const velocity = {
      x: deltaTime > 0 ? deltaX / deltaTime : 0,
      y: deltaTime > 0 ? deltaY / deltaTime : 0
    };

    if (touches.length === 2) {
      // Pinch zoom gesture
      const distance = getDistance(touches);
      const angle = getAngle(touches);
      const scale = distance / getDistance(e.touches);
      
      setGestureState(prev => ({
        ...prev,
        gestureType: 'pinch',
        currentPosition: center,
        scale,
        rotation: angle - prev.rotation,
        velocity
      }));

      callbacks.onPinchZoom(scale, center);
      
      // Rotation detection (if angle change is significant)
      if (Math.abs(angle - gestureState.rotation) > 5) {
        callbacks.onRotate(angle - gestureState.rotation, center);
      }
    } else if (touches.length === 1) {
      // Single touch gesture (potential swipe)
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (distance > 50) { // Minimum swipe distance
        setGestureState(prev => ({
          ...prev,
          gestureType: 'swipe',
          currentPosition: center,
          velocity
        }));
      }
    }
  }, [gestureState, callbacks, getCenter, getDistance, getAngle]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }

    if (!gestureState.isActive || !touchStartRef.current) return;

    const now = Date.now();
    const touchDuration = now - touchStartRef.current.time;
    const deltaX = gestureState.currentPosition.x - gestureState.startPosition.x;
    const deltaY = gestureState.currentPosition.y - gestureState.startPosition.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Handle tap gesture (short duration, minimal movement)
    if (gestureState.gestureType === 'tap' && touchDuration < 300 && distance < 10) {
      callbacks.onTap(gestureState.currentPosition);
      triggerHaptic(50); // Light tap feedback
    }

    // Handle swipe gesture
    if (gestureState.gestureType === 'swipe' && distance > 50) {
      const velocity = Math.sqrt(gestureState.velocity.x ** 2 + gestureState.velocity.y ** 2);
      
      if (velocity > 0.3) { // Minimum swipe velocity
        let direction: 'left' | 'right' | 'up' | 'down';
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          direction = deltaX > 0 ? 'right' : 'left';
        } else {
          direction = deltaY > 0 ? 'down' : 'up';
        }
        
        callbacks.onSwipe(direction, velocity);
        triggerHaptic([50, 50, 50]); // Swipe feedback pattern
      }
    }

    callbacks.onGestureEnd(gestureState.gestureType);

    setGestureState({
      isActive: false,
      gestureType: 'none',
      startTime: 0,
      startPosition: { x: 0, y: 0 },
      currentPosition: { x: 0, y: 0 },
      scale: 1,
      rotation: 0,
      velocity: { x: 0, y: 0 }
    });

    touchStartRef.current = undefined;
  }, [gestureState, callbacks, triggerHaptic]);

  return {
    gestureState,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    triggerHaptic
  };
};
