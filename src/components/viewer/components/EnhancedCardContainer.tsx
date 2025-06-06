
import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import { useSafeMobileControl } from '../hooks/useSafeMobileControl';
import { CardTransform } from './CardTransform';
import { CardIndicators } from './CardIndicators';
import { CardGestureHandler } from './CardGestureHandler';

interface EnhancedCardContainerProps {
  card: any;
  isFlipped: boolean;
  isHovering: boolean;
  showEffects: boolean;
  effectValues: Record<string, Record<string, number | boolean | string>>;
  mousePosition: { x: number; y: number };
  rotation: { x: number; y: number };
  zoom: number;
  isDragging: boolean;
  frameStyles: any;
  enhancedEffectStyles: any;
  SurfaceTexture: React.ComponentType<any>;
  interactiveLighting: boolean;
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
  isHovering,
  showEffects,
  effectValues,
  mousePosition,
  rotation,
  zoom,
  isDragging,
  frameStyles,
  enhancedEffectStyles,
  SurfaceTexture,
  interactiveLighting,
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
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Use mobile control state for card transformations when available, otherwise use props
  const currentRotation = cardState.rotation.x !== 0 || cardState.rotation.y !== 0 ? cardState.rotation : rotation;
  const currentZoom = cardState.zoom !== 1 ? cardState.zoom : zoom;
  const currentPosition = cardState.position;
  const currentIsFlipped = cardState.isFlipped !== isFlipped ? cardState.isFlipped : isFlipped;

  // Calculate physical effect styles from effect values for holographic/metallic effects
  const physicalEffectStyles = {
    ...enhancedEffectStyles,
    transition: 'all 0.3s ease'
  };

  // Get effectIntensity array for consistent intensity values across components
  // Fix: TypeScript type safety for effectValues
  const effectIntensity = Object.entries(effectValues).map(([id, params]) => {
    // Use type guard to safely access intensity
    return typeof params.intensity === 'number' ? params.intensity : 0;
  });

  // Double tap detection for zoom
  const lastTapTime = useRef(0);
  const handleTap = () => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapTime.current;
    
    if (timeSinceLastTap < 300) {
      // Double tap - toggle zoom
      if (currentZoom <= 1) {
        zoomCard(0.5); // Zoom to 1.5x
      } else {
        resetCardState(); // Reset to normal
      }
    }
    
    lastTapTime.current = now;
  };

  return (
    <CardGestureHandler
      panelState={panelState}
      cardState={cardState}
      flipCard={flipCard}
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
            isHovering={isHovering}
            showEffects={showEffects}
            effectIntensity={effectIntensity}
            mousePosition={mousePosition}
            frameStyles={frameStyles}
            physicalEffectStyles={physicalEffectStyles}
            SurfaceTexture={SurfaceTexture}
            interactiveLighting={interactiveLighting}
            effectValues={effectValues}
            currentIsFlipped={currentIsFlipped}
            currentZoom={currentZoom}
            currentRotation={currentRotation}
            currentPosition={currentPosition}
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
