
import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useSafeMobileControl } from '../hooks/useSafeMobileControl';
import { CardTransform } from './CardTransform';
import { CardIndicators } from './CardIndicators';
import { CardGestureHandler } from './CardGestureHandler';
import { useEffectContext } from '../contexts/EffectContext';

interface EnhancedCardContainerProps {
  card: any;
  isFlipped: boolean;
  rotation: { x: number; y: number };
  zoom: number;
  isDragging: boolean;
  frameStyles: any;
  enhancedEffectStyles: any;
  SurfaceTexture: React.ComponentType<any>;
  onMouseDown?: (e: React.MouseEvent) => void;
  onMouseMove?: (e: React.MouseEvent) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
  onZoom?: (delta: number) => void;
  onRotationChange?: (rotation: { x: number; y: number }) => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onReset?: () => void;
}

export const EnhancedCardContainer: React.FC<EnhancedCardContainerProps> = ({
  card,
  isFlipped,
  rotation,
  zoom,
  isDragging,
  frameStyles,
  enhancedEffectStyles,
  SurfaceTexture,
  onMouseDown,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onZoom,
  onRotationChange,
  onDoubleTap,
  onLongPress,
  onSwipeLeft,
  onSwipeRight,
  onReset
}) => {
  const { 
    cardState, 
    flipCard, 
    zoomCard, 
    rotateCard, 
    panCard, 
    resetCardState,
    panelState,
    applyRotationStep
  } = useSafeMobileControl();
  
  // Get effect data from context
  const { effectIntensity } = useEffectContext();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [preventTap, setPreventTap] = useState(false);

  console.log('EnhancedCardContainer: Current flip states - isFlipped:', isFlipped, 'cardState.isFlipped:', cardState.isFlipped);

  // Use mobile control state when available, otherwise use props
  const currentRotation = cardState.rotation.x !== 0 || cardState.rotation.y !== 0 ? cardState.rotation : rotation;
  const currentZoom = cardState.zoom !== 1 ? cardState.zoom : zoom;
  const currentPosition = cardState.position;
  
  // Determine final flip state - prioritize mobile control state if it's been changed
  const currentIsFlipped = cardState.isFlipped !== false ? cardState.isFlipped : isFlipped;

  // Calculate physical effect styles from effect values
  const physicalEffectStyles = {
    ...enhancedEffectStyles,
    transition: 'all 0.3s ease'
  };

  // Unified flip handler that works for both mobile and desktop
  const handleCardFlip = () => {
    if (preventTap || panelState.rotateMode) return;
    
    console.log('handleCardFlip called - before flip:', currentIsFlipped);
    
    // Always use mobile control's flipCard function for consistency
    flipCard();
    
    // Also call the original onClick handler if provided
    if (onClick) {
      onClick();
    }
  };

  // Double tap detection for zoom
  const lastTapTime = useRef(0);
  const handleDoubleTap = () => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapTime.current;
    
    if (timeSinceLastTap < 300) {
      if (currentZoom <= 1) {
        zoomCard(0.5); // Zoom to 1.5x
      } else {
        resetCardState(); // Reset to normal
      }
      setPreventTap(true);
      setTimeout(() => setPreventTap(false), 300);
    }
    
    lastTapTime.current = now;
  };

  return (
    <CardGestureHandler
      panelState={panelState}
      cardState={cardState}
      flipCard={handleCardFlip}
      zoomCard={zoomCard}
      rotateCard={rotateCard}
      resetCardState={resetCardState}
      applyRotationStep={applyRotationStep}
      onLongPress={onLongPress}
      onSwipeLeft={onSwipeLeft}
      onSwipeRight={onSwipeRight}
    >
      {({ touchHandlers, gestureState, triggerHaptic }) => (
        <div
          ref={containerRef}
          className={cn(
            "relative w-full h-full flex items-center justify-center",
            "transition-transform duration-300 ease-out",
            panelState.rotateMode && "cursor-crosshair",
            gestureState.isActive && "select-none"
          )}
          {...touchHandlers}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <CardTransform
            card={card}
            isFlipped={isFlipped}
            frameStyles={frameStyles}
            physicalEffectStyles={physicalEffectStyles}
            SurfaceTexture={SurfaceTexture}
            currentIsFlipped={currentIsFlipped}
            currentZoom={currentZoom}
            currentRotation={currentRotation}
            currentPosition={currentPosition}
            handleCardFlip={handleCardFlip}
          />

          <CardIndicators
            rotateMode={panelState.rotateMode}
            currentRotationY={currentRotation.y}
            currentZoom={currentZoom}
            gestureState={gestureState}
          />
        </div>
      )}
    </CardGestureHandler>
  );
};
