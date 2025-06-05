
import { useCallback, useRef } from 'react';

export const useMomentumHandler = (onPan: (delta: { x: number; y: number }, velocity: { x: number; y: number }) => void) => {
  const momentumTimer = useRef<number>();

  const startMomentum = useCallback((velocity: { x: number; y: number }, setGestureState: (updater: (prev: any) => any) => void) => {
    if (Math.abs(velocity.x) < 0.5 && Math.abs(velocity.y) < 0.5) return;

    const friction = 0.92;
    const minVelocity = 0.1;

    const animate = () => {
      if (Math.abs(velocity.x) < minVelocity && Math.abs(velocity.y) < minVelocity) {
        setGestureState(prev => ({ ...prev, momentum: false }));
        return;
      }

      onPan({ x: velocity.x * 0.5, y: velocity.y * 0.5 }, velocity);
      velocity.x *= friction;
      velocity.y *= friction;
      
      momentumTimer.current = requestAnimationFrame(animate);
    };

    setGestureState(prev => ({ ...prev, momentum: true }));
    momentumTimer.current = requestAnimationFrame(animate);
  }, [onPan]);

  const stopMomentum = useCallback(() => {
    if (momentumTimer.current) {
      cancelAnimationFrame(momentumTimer.current);
    }
  }, []);

  return {
    startMomentum,
    stopMomentum,
    momentumTimer
  };
};
