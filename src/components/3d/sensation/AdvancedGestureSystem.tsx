
import React, { useCallback, useRef, useState, useEffect } from 'react';

interface GestureData {
  type: 'tap' | 'pinch' | 'swipe' | 'shake' | 'draw' | 'long_press';
  position?: { x: number; y: number };
  scale?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  intensity?: number;
  pattern?: number[];
}

interface AdvancedGestureSystemProps {
  onGesture: (gesture: GestureData) => void;
  onSparkleAdd: (position: { x: number; y: number }) => void;
  onColorRandomize: () => void;
  onSecretAnimation: (symbol: string) => void;
  children: React.ReactNode;
}

export const AdvancedGestureSystem: React.FC<AdvancedGestureSystemProps> = ({
  onGesture,
  onSparkleAdd,
  onColorRandomize,
  onSecretAnimation,
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [touches, setTouches] = useState<React.TouchList | null>(null);
  const [lastTouchTime, setLastTouchTime] = useState(0);
  const [shakeThreshold] = useState(15);
  const [drawPath, setDrawPath] = useState<{x: number, y: number}[]>([]);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastAcceleration = useRef({ x: 0, y: 0, z: 0 });

  // Device motion for shake detection
  useEffect(() => {
    const handleDeviceMotion = (event: DeviceMotionEvent) => {
      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;

      const deltaX = Math.abs((acceleration.x || 0) - lastAcceleration.current.x);
      const deltaY = Math.abs((acceleration.y || 0) - lastAcceleration.current.y);
      const deltaZ = Math.abs((acceleration.z || 0) - lastAcceleration.current.z);

      if (deltaX + deltaY + deltaZ > shakeThreshold) {
        onGesture({ type: 'shake', intensity: deltaX + deltaY + deltaZ });
        onColorRandomize();
      }

      lastAcceleration.current = {
        x: acceleration.x || 0,
        y: acceleration.y || 0,
        z: acceleration.z || 0
      };
    };

    // Request permission for iOS devices
    if (typeof DeviceMotionEvent !== 'undefined' && 'requestPermission' in DeviceMotionEvent) {
      (DeviceMotionEvent as any).requestPermission().then((response: string) => {
        if (response === 'granted') {
          window.addEventListener('devicemotion', handleDeviceMotion);
        }
      });
    } else {
      window.addEventListener('devicemotion', handleDeviceMotion);
    }

    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion);
    };
  }, [onGesture, onColorRandomize, shakeThreshold]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const currentTime = Date.now();
    setTouches(e.touches);
    setLastTouchTime(currentTime);
    setDrawPath([]);

    // Start long press timer
    if (e.touches.length === 1) {
      longPressTimerRef.current = setTimeout(() => {
        onGesture({ 
          type: 'long_press', 
          position: { x: e.touches[0].clientX, y: e.touches[0].clientY }
        });
      }, 800);
    }

    // Pinch detection
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const centerX = (touch1.clientX + touch2.clientX) / 2;
      const centerY = (touch1.clientY + touch2.clientY) / 2;
      
      onSparkleAdd({ x: centerX, y: centerY });
      onGesture({ 
        type: 'pinch', 
        position: { x: centerX, y: centerY },
        scale: 1
      });
    }
  }, [onGesture, onSparkleAdd]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (e.touches.length === 1) {
      // Drawing gesture detection
      const touch = e.touches[0];
      const newPoint = { x: touch.clientX, y: touch.clientY };
      setDrawPath(prev => [...prev, newPoint]);
    }

    if (e.touches.length === 2 && touches && touches.length === 2) {
      // Pinch scale calculation
      const currentDistance = Math.sqrt(
        Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) +
        Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2)
      );
      
      const initialDistance = Math.sqrt(
        Math.pow(touches[0].clientX - touches[1].clientX, 2) +
        Math.pow(touches[0].clientY - touches[1].clientY, 2)
      );

      if (initialDistance > 0) {
        const scale = currentDistance / initialDistance;
        onGesture({ type: 'pinch', scale });
      }
    }
  }, [touches, onGesture]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    const currentTime = Date.now();
    const touchDuration = currentTime - lastTouchTime;

    // Quick tap detection
    if (touchDuration < 200 && e.changedTouches.length === 1) {
      const touch = e.changedTouches[0];
      onGesture({
        type: 'tap',
        position: { x: touch.clientX, y: touch.clientY }
      });
    }

    // Analyze draw path for symbols
    if (drawPath.length > 5) {
      const symbol = analyzeDrawPattern(drawPath);
      if (symbol) {
        onSecretAnimation(symbol);
        onGesture({ type: 'draw', pattern: drawPath.map(p => p.x + p.y) });
      }
    }

    setTouches(null);
    setDrawPath([]);
  }, [lastTouchTime, drawPath, onGesture, onSecretAnimation]);

  const analyzeDrawPattern = (path: {x: number, y: number}[]): string | null => {
    if (path.length < 5) return null;

    // Simple pattern recognition
    const startPoint = path[0];
    const endPoint = path[path.length - 1];
    const midPoint = path[Math.floor(path.length / 2)];

    // Circle detection (rough)
    const distanceFromStart = Math.sqrt(
      Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2)
    );
    
    if (distanceFromStart < 50 && path.length > 10) {
      return 'circle';
    }

    // Zigzag detection
    let directionChanges = 0;
    let lastDirection = path[1].x > path[0].x ? 'right' : 'left';
    
    for (let i = 2; i < path.length; i++) {
      const currentDirection = path[i].x > path[i-1].x ? 'right' : 'left';
      if (currentDirection !== lastDirection) {
        directionChanges++;
        lastDirection = currentDirection;
      }
    }

    if (directionChanges > 3) {
      return 'lightning';
    }

    // Heart shape (very rough detection)
    if (path.length > 15 && midPoint.y < startPoint.y && endPoint.y > midPoint.y) {
      return 'heart';
    }

    return null;
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full touch-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'none' }}
    >
      {children}
    </div>
  );
};
