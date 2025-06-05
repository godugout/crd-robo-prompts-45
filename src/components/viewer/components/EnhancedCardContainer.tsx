
import React, { useCallback } from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { CardFrontContainer } from './CardFrontContainer';
import { CardBackContainer } from './CardBackContainer';
import { Card3DTransform } from './Card3DTransform';
import { useMobileTouchControls } from '../hooks/useMobileTouchControls';
import { useIsMobile } from '@/hooks/use-mobile';

interface EnhancedCardContainerProps {
  card: CardData;
  isFlipped: boolean;
  isHovering: boolean;
  showEffects: boolean;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  rotation: { x: number; y: number };
  zoom: number;
  isDragging: boolean;
  frameStyles: React.CSSProperties;
  enhancedEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
  interactiveLighting?: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
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
  interactiveLighting = false,
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
  const isMobile = useIsMobile();

  // Mobile touch gesture callbacks
  const handleZoom = useCallback((scale: number, center: { x: number; y: number }) => {
    if (onZoom) {
      const delta = (scale - 1) * 0.5; // Smooth scaling
      onZoom(delta);
    }
  }, [onZoom]);

  const handlePan = useCallback((delta: { x: number; y: number }) => {
    // Convert pan to rotation for card effect
    if (onRotationChange) {
      const sensitivity = 0.3;
      onRotationChange({
        x: rotation.x + delta.y * sensitivity,
        y: rotation.y - delta.x * sensitivity
      });
    }
  }, [rotation, onRotationChange]);

  const handleRotate = useCallback((angle: number) => {
    if (onRotationChange) {
      onRotationChange({
        x: rotation.x,
        y: rotation.y + angle * 0.5 // Smooth rotation
      });
    }
  }, [rotation, onRotationChange]);

  const handleDoubleTap = useCallback(() => {
    if (onDoubleTap) {
      onDoubleTap();
    } else {
      // Default: toggle zoom fit/fill
      if (onZoom) {
        onZoom(zoom > 1 ? -zoom + 1 : 0.5);
      }
    }
  }, [onDoubleTap, onZoom, zoom]);

  const handleThreeFingerTap = useCallback(() => {
    if (onReset) {
      onReset();
      // Add haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 50, 50]);
      }
    }
  }, [onReset]);

  const { touchHandlers, isActive } = useMobileTouchControls({
    onZoom: handleZoom,
    onPan: handlePan,
    onRotate: handleRotate,
    onDoubleTap: handleDoubleTap,
    onLongPress: onLongPress || (() => {}),
    onSwipeLeft: onSwipeLeft || (() => {}),
    onSwipeRight: onSwipeRight || (() => {}),
    onThreeFingerTap: handleThreeFingerTap,
  });

  const containerProps = isMobile ? {
    ...touchHandlers,
    style: {
      touchAction: 'none',
      userSelect: 'none' as const,
      WebkitUserSelect: 'none' as const,
      WebkitTouchCallout: 'none' as const,
      WebkitTapHighlightColor: 'transparent'
    }
  } : {
    onMouseDown,
    onMouseMove,
    onMouseEnter,
    onMouseLeave,
  };

  return (
    <div 
      className={`relative z-20 ${
        isDragging || isActive ? 'cursor-grabbing' : 'cursor-grab'
      } ${isMobile ? 'touch-manipulation' : ''}`}
      style={{
        transform: `scale(${zoom})`,
        transition: isDragging || isActive ? 'none' : 'transform 0.3s ease',
        filter: `brightness(${interactiveLighting && isHovering ? 1.3 : 1.2}) contrast(1.1)`,
        // Add subtle glow on mobile when active
        ...(isMobile && isActive ? {
          filter: `brightness(1.3) contrast(1.1) drop-shadow(0 0 20px rgba(16, 185, 129, 0.3))`
        } : {})
      }}
      {...containerProps}
    >
      <Card3DTransform
        rotation={rotation}
        mousePosition={mousePosition}
        isDragging={isDragging || isActive}
        interactiveLighting={interactiveLighting}
        isHovering={isHovering}
        onClick={onClick}
      >
        {/* Front of Card */}
        <CardFrontContainer
          card={card}
          isFlipped={isFlipped}
          isHovering={isHovering}
          showEffects={showEffects}
          effectValues={effectValues}
          mousePosition={mousePosition}
          frameStyles={frameStyles}
          enhancedEffectStyles={enhancedEffectStyles}
          SurfaceTexture={SurfaceTexture}
          interactiveLighting={interactiveLighting}
          onClick={onClick}
        />

        {/* Back of Card */}
        <CardBackContainer
          isFlipped={isFlipped}
          isHovering={isHovering}
          showEffects={showEffects}
          effectValues={effectValues}
          mousePosition={mousePosition}
          frameStyles={frameStyles}
          enhancedEffectStyles={enhancedEffectStyles}
          SurfaceTexture={SurfaceTexture}
          interactiveLighting={interactiveLighting}
        />
      </Card3DTransform>
    </div>
  );
};
