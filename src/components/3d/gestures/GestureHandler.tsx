
import React, { useRef, useCallback } from 'react';
import { useGesture } from '@use-gesture/react';
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
  
  const bind = useGesture({
    onDrag: ({ offset: [x, y], tap }) => {
      if (tap) {
        onFlip?.();
        triggerHaptic(0.3);
        return;
      }
      
      const rotationX = y * 0.01;
      const rotationY = x * 0.01;
      
      api.start({
        rotation: [rotationX, rotationY, 0]
      });
      
      onRotate?.({ x: rotationX, y: rotationY });
    },
    
    onPinch: ({ offset: [scale] }) => {
      const normalizedScale = Math.max(0.5, Math.min(2, scale));
      
      api.start({
        scale: [normalizedScale, normalizedScale, normalizedScale]
      });
      
      onZoom?.(normalizedScale);
    },
    
    onWheel: ({ delta: [, dy] }) => {
      const currentScale = scale.get()[0];
      const newScale = Math.max(0.5, Math.min(3, currentScale - dy * 0.001));
      
      api.start({
        scale: [newScale, newScale, newScale]
      });
      
      onZoom?.(newScale);
    }
  });
  
  return (
    <animated.group
      ref={meshRef}
      {...bind()}
      rotation={rotation as any}
      scale={scale as any}
    >
      {children}
    </animated.group>
  );
};
