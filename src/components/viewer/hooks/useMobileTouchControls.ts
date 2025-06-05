
import { useState, useCallback, useRef, useEffect } from 'react';

interface TouchState {
  isActive: boolean;
  startTime: number;
  startDistance: number;
  startAngle: number;
  lastDistance: number;
  lastAngle: number;
  velocity: { x: number; y: number };
  lastPosition: { x: number; y: number };
}

interface GestureCallbacks {
  onZoom: (scale: number, center: { x: number; y: number }) => void;
  onPan: (delta: { x: number; y: number }) => void;
  onRotate: (angle: number) => void;
  onDoubleTap: () => void;
  onLongPress: () => void;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onThreeFingerTap: () => void;
}

export const useMobileTouchControls = (callbacks: GestureCallbacks) => {
  const [touchState, setTouchState] = useState<TouchState>({
    isActive: false,
    startTime: 0,
    startDistance: 0,
    startAngle: 0,
    lastDistance: 0,
    lastAngle: 0,
    velocity: { x: 0, y: 0 },
    lastPosition: { x: 0, y: 0 }
  });

  const longPressTimer = useRef<NodeJS.Timeout>();
  const lastTapTime = useRef(0);
  const momentumAnimation = useRef<number>();

  // Calculate distance between two touch points
  const getDistance = useCallback((touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  // Calculate angle between two touch points
  const getAngle = useCallback((touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[1].clientX - touches[0].clientX;
    const dy = touches[1].clientY - touches[0].clientY;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  }, []);

  // Get center point of touches
  const getCenter = useCallback((touches: React.TouchList) => {
    let x = 0, y = 0;
    for (let i = 0; i < touches.length; i++) {
      x += touches[i].clientX;
      y += touches[i].clientY;
    }
    return { x: x / touches.length, y: y / touches.length };
  }, []);

  // Check if touch target is an interactive element
  const isInteractiveElement = useCallback((target: EventTarget | null) => {
    if (!target || !(target instanceof Element)) return false;
    
    const interactiveSelectors = [
      'button',
      'input',
      'select',
      'textarea',
      'a',
      '[role="button"]',
      '[tabindex]',
      '.drawer-content',
      '.drawer-overlay'
    ];
    
    return interactiveSelectors.some(selector => 
      target.matches(selector) || target.closest(selector)
    );
  }, []);

  // Momentum scrolling
  const startMomentum = useCallback((velocity: { x: number; y: number }) => {
    const friction = 0.95;
    const minVelocity = 0.1;

    const animate = () => {
      if (Math.abs(velocity.x) < minVelocity && Math.abs(velocity.y) < minVelocity) {
        return;
      }

      callbacks.onPan({ x: velocity.x, y: velocity.y });
      velocity.x *= friction;
      velocity.y *= friction;
      
      momentumAnimation.current = requestAnimationFrame(animate);
    };

    momentumAnimation.current = requestAnimationFrame(animate);
  }, [callbacks]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Don't prevent default on interactive elements
    if (isInteractiveElement(e.target)) {
      return;
    }
    
    e.preventDefault();
    
    if (momentumAnimation.current) {
      cancelAnimationFrame(momentumAnimation.current);
    }

    const touches = e.touches;
    const now = Date.now();

    // Three finger tap
    if (touches.length === 3) {
      callbacks.onThreeFingerTap();
      return;
    }

    // Long press detection
    if (touches.length === 1) {
      longPressTimer.current = setTimeout(() => {
        callbacks.onLongPress();
        // Add haptic feedback if available
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
      }, 500);
    }

    const center = getCenter(touches);
    const distance = getDistance(touches);
    const angle = getAngle(touches);

    setTouchState({
      isActive: true,
      startTime: now,
      startDistance: distance,
      startAngle: angle,
      lastDistance: distance,
      lastAngle: angle,
      velocity: { x: 0, y: 0 },
      lastPosition: center
    });
  }, [callbacks, getCenter, getDistance, getAngle, isInteractiveElement]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    // Don't prevent default on interactive elements
    if (isInteractiveElement(e.target)) {
      return;
    }
    
    e.preventDefault();
    
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }

    const touches = e.touches;
    if (!touchState.isActive) return;

    const center = getCenter(touches);
    const distance = getDistance(touches);
    const angle = getAngle(touches);

    // Calculate velocity for momentum
    const deltaX = center.x - touchState.lastPosition.x;
    const deltaY = center.y - touchState.lastPosition.y;

    if (touches.length === 1) {
      // Single finger pan
      callbacks.onPan({ x: deltaX, y: deltaY });
    } else if (touches.length === 2) {
      // Two finger gestures
      if (touchState.startDistance > 0) {
        // Pinch to zoom
        const scale = distance / touchState.lastDistance;
        callbacks.onZoom(scale, center);
      }

      // Two finger rotate
      if (Math.abs(angle - touchState.lastAngle) > 1) {
        const deltaAngle = angle - touchState.lastAngle;
        callbacks.onRotate(deltaAngle);
      }
    }

    setTouchState(prev => ({
      ...prev,
      lastDistance: distance,
      lastAngle: angle,
      velocity: { x: deltaX, y: deltaY },
      lastPosition: center
    }));
  }, [touchState, callbacks, getCenter, getDistance, getAngle, isInteractiveElement]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }

    const now = Date.now();
    const touchDuration = now - touchState.startTime;
    const touches = e.changedTouches;

    // Single tap or double tap detection
    if (touches.length === 1 && touchDuration < 300) {
      const timeSinceLastTap = now - lastTapTime.current;
      
      if (timeSinceLastTap < 300) {
        // Double tap
        callbacks.onDoubleTap();
        lastTapTime.current = 0;
      } else {
        lastTapTime.current = now;
      }
    }

    // Swipe detection
    if (touches.length === 1 && touchDuration < 500) {
      const deltaX = touches[0].clientX - touchState.lastPosition.x;
      const velocity = Math.abs(deltaX) / touchDuration;
      
      if (velocity > 0.5 && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          callbacks.onSwipeRight();
        } else {
          callbacks.onSwipeLeft();
        }
      }
    }

    // Start momentum if there's velocity
    if (Math.abs(touchState.velocity.x) > 1 || Math.abs(touchState.velocity.y) > 1) {
      startMomentum(touchState.velocity);
    }

    setTouchState(prev => ({
      ...prev,
      isActive: false
    }));
  }, [touchState, callbacks, startMomentum]);

  // Only prevent browser zoom on card container, not globally
  useEffect(() => {
    const preventZoom = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    document.addEventListener('wheel', preventZoom, { passive: false });

    return () => {
      document.removeEventListener('wheel', preventZoom);
    };
  }, []);

  return {
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    isActive: touchState.isActive
  };
};
