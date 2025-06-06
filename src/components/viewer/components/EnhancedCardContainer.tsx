import React, { useRef, useEffect } from 'react';
import { useEnhancedGestureRecognition } from '../hooks/useEnhancedGestureRecognition';
import { useMobileControl } from '../context/MobileControlContext';
import { cn } from '@/lib/utils';

interface EnhancedCardContainerProps {
  card: any;
  isFlipped: boolean;
  isHovering: boolean;
  showEffects: boolean;
  effectValues: any;
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

// Helper hook to safely use MobileControlContext
const useSafeMobileControl = () => {
  try {
    return useMobileControl();
  } catch (error) {
    // Return fallback values when provider is not available (desktop mode)
    return {
      cardState: {
        zoom: 1,
        rotation: { x: 0, y: 0 },
        isFlipped: false,
        position: { x: 0, y: 0 }
      },
      flipCard: () => {},
      zoomCard: () => {},
      rotateCard: () => {},
      panCard: () => {},
      resetCardState: () => {},
      panelState: {
        studio: false,
        createCard: false,
        frames: false,
        showcase: false,
        rotateMode: false
      },
      applyRotationStep: () => {}
    };
  }
};

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

  // Enhanced gesture callbacks
  const gestureCallbacks = {
    onTap: (position: { x: number; y: number }) => {
      if (!panelState.rotateMode) {
        flipCard();
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

  // Use mobile control state for card transformations when available, otherwise use props
  const currentRotation = cardState.rotation.x !== 0 || cardState.rotation.y !== 0 ? cardState.rotation : rotation;
  const currentZoom = cardState.zoom !== 1 ? cardState.zoom : zoom;
  const currentPosition = cardState.position;
  const currentIsFlipped = cardState.isFlipped !== isFlipped ? cardState.isFlipped : isFlipped;

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
      triggerHaptic([50, 50, 50]);
    }
    
    lastTapTime.current = now;
  };

  // Apply rotation step in rotate mode
  useEffect(() => {
    if (panelState.rotateMode && gestureState.gestureType === 'tap') {
      applyRotationStep(15); // 15-degree steps
    }
  }, [gestureState.gestureType, panelState.rotateMode, applyRotationStep]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-full flex items-center justify-center",
        "transition-transform duration-300 ease-out",
        panelState.rotateMode && "cursor-crosshair",
        gestureState.isActive && "select-none"
      )}
      style={{
        transform: `
          scale(${currentZoom})
          rotateX(${currentRotation.x}deg)
          rotateY(${currentRotation.y}deg)
          translate3d(${currentPosition.x}px, ${currentPosition.y}px, 0)
        `,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        minHeight: '400px'
      }}
      {...touchHandlers}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Card Content - Fixed dimensions */}
      <div
        className={cn(
          "relative w-80 h-[28rem] transition-transform duration-500",
          "shadow-2xl rounded-xl overflow-hidden",
          "bg-gradient-to-br from-blue-500 to-purple-600",
          currentIsFlipped && "rotateY-180"
        )}
        style={{
          transformStyle: 'preserve-3d',
          ...frameStyles,
          ...enhancedEffectStyles
        }}
      >
        {/* Card Front */}
        <div 
          className={cn(
            "absolute inset-0 backface-hidden",
            "flex flex-col items-center justify-center text-white"
          )}
          style={{
            backfaceVisibility: 'hidden'
          }}
        >
          {/* Surface Texture Effect */}
          {showEffects && SurfaceTexture && (
            <SurfaceTexture
              effectValues={effectValues}
              mousePosition={mousePosition}
              isHovering={isHovering}
              interactiveLighting={interactiveLighting}
            />
          )}
          
          {/* Card Image - Full Coverage */}
          {card?.image_url ? (
            <div className="absolute inset-0 z-10 w-full h-full">
              <img 
                src={card.image_url}
                alt={card.title || 'Card image'}
                className="w-full h-full object-cover"
                style={{
                  filter: showEffects ? 'contrast(1.05) saturate(1.1)' : 'none'
                }}
                onLoad={() => console.log('Card image loaded successfully')}
                onError={() => console.log('Error loading card image')}
              />
            </div>
          ) : (
            /* If no image, display a title and description */
            <div className="relative z-10 text-center p-6">
              <h2 className="text-2xl font-bold mb-2 drop-shadow-lg">
                {card?.title || 'Sample Card'}
              </h2>
              <p className="text-sm opacity-90 drop-shadow">
                {card?.description || 'Enhanced card viewer with gesture support'}
              </p>
              <div className="mt-4 text-xs opacity-75">
                Tap to flip • Pinch to zoom • Swipe to navigate
              </div>
            </div>
          )}
        </div>

        {/* Card Back */}
        <div 
          className={cn(
            "absolute inset-0 backface-hidden rotateY-180",
            "bg-gradient-to-br from-gray-800 to-gray-900",
            "flex items-center justify-center text-white"
          )}
          style={{
            backfaceVisibility: 'hidden'
          }}
        >
          {/* Dark Pattern Background Base */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)
              `,
              backgroundColor: '#0a0a0a'
            }}
          />
          
          {/* Centered CRD Logo */}
          <div className="relative z-30 flex items-center justify-center">
            <img 
              src="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png" 
              alt="CRD Logo" 
              className="w-48 h-auto opacity-90"
              style={{
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
              }}
              onLoad={() => console.log('CRD logo loaded successfully')}
              onError={() => console.log('Error loading CRD logo')}
            />
          </div>
          
          {/* Additional back text if provided */}
          {card?.backText && (
            <div className="absolute bottom-8 left-0 right-0 text-center">
              <p className="text-sm opacity-75 drop-shadow px-6">
                {card.backText}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Rotation Mode Indicator */}
      {panelState.rotateMode && (
        <div className="absolute top-4 left-4 bg-orange-500/90 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur z-50">
          Rotation Mode • {Math.round(currentRotation.y)}°
        </div>
      )}

      {/* Zoom Indicator */}
      {currentZoom !== 1 && (
        <div className="absolute top-4 right-4 bg-blue-500/90 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur z-50">
          {Math.round(currentZoom * 100)}%
        </div>
      )}

      {/* Gesture Feedback */}
      {gestureState.isActive && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur z-50">
          {gestureState.gestureType}
        </div>
      )}
    </div>
  );
};
