
import React, { useRef, useEffect } from 'react';
import { useEnhancedGestureRecognition } from '../hooks/useEnhancedGestureRecognition';

interface CardGestureHandlerProps {
  panelState: {
    rotateMode: boolean;
  };
  cardState: {
    zoom: number;
    rotation: { x: number; y: number };
  };
  flipCard: () => void;
  zoomCard: (delta: number) => void;
  rotateCard: (rotation: { x: number; y: number }) => void;
  resetCardState: () => void;
  applyRotationStep: (degrees: number) => void;
  onLongPress?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  children: (props: {
    touchHandlers: any;
    gestureState: any;
    triggerHaptic: (pattern: number | number[]) => void;
  }) => React.ReactNode;
}

export const CardGestureHandler: React.FC<CardGestureHandlerProps> = ({
  panelState,
  cardState,
  flipCard,
  zoomCard,
  rotateCard,
  resetCardState,
  applyRotationStep,
  onLongPress,
  onSwipeLeft,
  onSwipeRight,
  children
}) => {
  // Enhanced gesture callbacks
  const gestureCallbacks = {
    onTap: (position: { x: number; y: number }) => {
      // In rotate mode, don't flip the card
      if (!panelState.rotateMode) {
        // The flip functionality is now managed in EnhancedCardContainer
        // No need to call flipCard() here as it will cause double flips
      }
    },
    
    onLongPress: (position: { x: number; y: number }) => {
      if (onLongPress) {
        onLongPress();
      }
    },
    
    onPinchZoom: (scale: number, center: { x: number; y: number }) => {
      const delta = (scale - 1) * 0.1;
      zoomCard(delta);
    },
    
    onSwipe: (direction: 'left' | 'right' | 'up' | 'down', velocity: number) => {
      switch (direction) {
        case 'left':
          if (onSwipeLeft) onSwipeLeft();
          break;
        case 'right':
          if (onSwipeRight) onSwipeRight();
          break;
        case 'up':
          // Could be used for card details
          break;
        case 'down':
          // Could be used for closing panels
          break;
      }
    },
    
    onRotate: (angle: number, center: { x: number; y: number }) => {
      if (panelState.rotateMode) {
        const newRotation = {
          x: cardState.rotation.x,
          y: cardState.rotation.y + angle
        };
        rotateCard(newRotation);
      }
    },
    
    onGestureStart: (type: any) => {
      // Handle gesture start if needed
    },
    
    onGestureEnd: (type: any) => {
      // Handle gesture end if needed
    }
  };

  const { gestureState, touchHandlers, triggerHaptic } = useEnhancedGestureRecognition(gestureCallbacks);

  // Apply rotation step in rotate mode
  useEffect(() => {
    if (panelState.rotateMode && gestureState.gestureType === 'tap') {
      applyRotationStep(15); // 15-degree steps
    }
  }, [gestureState.gestureType, panelState.rotateMode, applyRotationStep]);

  return (
    <>
      {children({ touchHandlers, gestureState, triggerHaptic })}
    </>
  );
};
