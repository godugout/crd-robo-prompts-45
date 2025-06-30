
import React, { useRef, useCallback } from 'react';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';

interface GestureHandlerProps {
  children: React.ReactNode;
  onFlip?: () => void;
  onZoom?: (scale: number) => void;
  onRotate?: (rotation: { x: number; y: number }) => void;
  enableHaptic?: boolean;
}

export const GestureHandler: React.FC<GestureHandlerProps> = ({
  children,
  onFlip,
  onZoom,
  onRotate,
  enableHaptic = true
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const isDragging = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });
  
  const [{ rotation, scale }, api] = useSpring(() => ({
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    config: { mass: 1, tension: 170, friction: 26 }
  }));
  
  const triggerHaptic = useCallback((intensity: number = 0.5) => {
    if (enableHaptic && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, [enableHaptic]);
  
  const handlePointerDown = useCallback((event: any) => {
    isDragging.current = true;
    previousMouse.current = { x: event.clientX, y: event.clientY };
    event.stopPropagation();
  }, []);
  
  const handlePointerMove = useCallback((event: any) => {
    if (!isDragging.current) return;
    
    const deltaX = event.clientX - previousMouse.current.x;
    const deltaY = event.clientY - previousMouse.current.y;
    
    const rotationX = deltaY * 0.01;
    const rotationY = deltaX * 0.01;
    
    api.start({
      rotation: [rotationX, rotationY, 0]
    });
    
    onRotate?.({ x: rotationX, y: rotationY });
    
    previousMouse.current = { x: event.clientX, y: event.clientY };
    event.stopPropagation();
  }, [api, onRotate]);
  
  const handlePointerUp = useCallback((event: any) => {
    if (isDragging.current) {
      isDragging.current = false;
      event.stopPropagation();
    }
  }, []);
  
  const handleClick = useCallback((event: any) => {
    if (!isDragging.current) {
      onFlip?.();
      triggerHaptic(0.3);
    }
    event.stopPropagation();
  }, [onFlip, triggerHaptic]);
  
  const handleWheel = useCallback((event: any) => {
    const currentScale = scale.get()[0];
    const newScale = Math.max(0.5, Math.min(3, currentScale - event.delta * 0.001));
    
    api.start({
      scale: [newScale, newScale, newScale]
    });
    
    onZoom?.(newScale);
    event.stopPropagation();
  }, [api, onZoom, scale]);
  
  return (
    <animated.group
      ref={meshRef}
      rotation={rotation as any}
      scale={scale as any}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={handleClick}
      onWheel={handleWheel}
    >
      {children}
    </animated.group>
  );
};
