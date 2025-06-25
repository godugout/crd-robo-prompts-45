
import { useState, useEffect, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface TouchGesture {
  type: 'tap' | 'longpress' | 'swipe' | 'pinch';
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  scale?: number;
  duration: number;
}

export const useMobileOptimizations = () => {
  const isMobile = useIsMobile();
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);
  const [networkSpeed, setNetworkSpeed] = useState<string>('4g');

  // Battery API monitoring
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBatteryLevel = () => {
          setBatteryLevel(battery.level * 100);
          setIsLowPowerMode(battery.level < 0.2); // Low power mode under 20%
        };
        
        updateBatteryLevel();
        battery.addEventListener('levelchange', updateBatteryLevel);
        
        return () => {
          battery.removeEventListener('levelchange', updateBatteryLevel);
        };
      });
    }
  }, []);

  // Network speed monitoring
  useEffect(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setNetworkSpeed(connection.effectiveType || '4g');
      
      const handleConnectionChange = () => {
        setNetworkSpeed(connection.effectiveType || '4g');
      };
      
      connection.addEventListener('change', handleConnectionChange);
      
      return () => {
        connection.removeEventListener('change', handleConnectionChange);
      };
    }
  }, []);

  // Touch gesture handler
  const createTouchHandler = useCallback((
    onGesture: (gesture: TouchGesture) => void
  ) => {
    let startTouch: { clientX: number; clientY: number } | null = null;
    let startTime = 0;
    let longPressTimer: NodeJS.Timeout;

    const handleTouchStart = (e: React.TouchEvent) => {
      const touch = e.touches[0];
      startTouch = { clientX: touch.clientX, clientY: touch.clientY };
      startTime = Date.now();
      
      // Long press detection
      longPressTimer = setTimeout(() => {
        if (startTouch) {
          onGesture({
            type: 'longpress',
            startX: startTouch.clientX,
            startY: startTouch.clientY,
            currentX: startTouch.clientX,
            currentY: startTouch.clientY,
            duration: Date.now() - startTime
          });
        }
      }, 500);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      if (longPressTimer) clearTimeout(longPressTimer);
      
      if (e.touches.length === 2 && startTouch) {
        // Pinch gesture
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        
        onGesture({
          type: 'pinch',
          startX: startTouch.clientX,
          startY: startTouch.clientY,
          currentX: touch1.clientX,
          currentY: touch1.clientY,
          scale: distance / 100, // Normalize scale
          duration: Date.now() - startTime
        });
      }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
      if (longPressTimer) clearTimeout(longPressTimer);
      
      if (startTouch && e.changedTouches[0]) {
        const endTouch = e.changedTouches[0];
        const deltaX = endTouch.clientX - startTouch.clientX;
        const deltaY = endTouch.clientY - startTouch.clientY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const duration = Date.now() - startTime;
        
        if (distance < 10 && duration < 300) {
          // Tap gesture
          onGesture({
            type: 'tap',
            startX: startTouch.clientX,
            startY: startTouch.clientY,
            currentX: endTouch.clientX,
            currentY: endTouch.clientY,
            duration
          });
        } else if (distance > 50) {
          // Swipe gesture
          onGesture({
            type: 'swipe',
            startX: startTouch.clientX,
            startY: startTouch.clientY,
            currentX: endTouch.clientX,
            currentY: endTouch.clientY,
            duration
          });
        }
      }
      
      startTouch = null;
    };

    return {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    };
  }, []);

  // Performance scaling based on device state
  const getOptimalSettings = useCallback(() => {
    const baseSettings = {
      renderQuality: 1.0,
      enableShadows: true,
      enableReflections: true,
      maxTextureSize: 2048,
      antialiasing: true
    };

    // Reduce quality on low battery
    if (isLowPowerMode) {
      return {
        ...baseSettings,
        renderQuality: 0.6,
        enableShadows: false,
        enableReflections: false,
        maxTextureSize: 1024,
        antialiasing: false
      };
    }

    // Reduce quality on slow network
    if (networkSpeed === '2g' || networkSpeed === 'slow-2g') {
      return {
        ...baseSettings,
        renderQuality: 0.7,
        maxTextureSize: 1024
      };
    }

    return baseSettings;
  }, [isLowPowerMode, networkSpeed]);

  // Haptic feedback
  const triggerHaptic = useCallback((pattern: number | number[] = 50) => {
    if ('vibrate' in navigator && isMobile) {
      navigator.vibrate(pattern);
    }
  }, [isMobile]);

  // Wake lock for extended sessions
  const [wakeLock, setWakeLock] = useState<any>(null);
  
  const requestWakeLock = useCallback(async () => {
    if ('wakeLock' in navigator && !wakeLock) {
      try {
        const lock = await (navigator as any).wakeLock.request('screen');
        setWakeLock(lock);
        
        lock.addEventListener('release', () => {
          setWakeLock(null);
        });
      } catch (error) {
        console.warn('Wake lock not supported:', error);
      }
    }
  }, [wakeLock]);

  const releaseWakeLock = useCallback(() => {
    if (wakeLock) {
      wakeLock.release();
      setWakeLock(null);
    }
  }, [wakeLock]);

  return {
    isMobile,
    batteryLevel,
    isLowPowerMode,
    networkSpeed,
    createTouchHandler,
    getOptimalSettings,
    triggerHaptic,
    requestWakeLock,
    releaseWakeLock
  };
};
