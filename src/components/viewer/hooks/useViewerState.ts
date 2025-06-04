
import { useState, useCallback, useRef, useEffect } from 'react';
import type { EffectValues } from './useEnhancedCardEffects';
import { ENHANCED_VISUAL_EFFECTS } from './useEnhancedCardEffects';

export const useViewerState = () => {
  // State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showEffects, setShowEffects] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  // Enhanced effects state
  const [effectValues, setEffectValues] = useState<EffectValues>(() => {
    const initialValues: EffectValues = {};
    ENHANCED_VISUAL_EFFECTS.forEach(effect => {
      initialValues[effect.id] = {};
      effect.parameters.forEach(param => {
        initialValues[effect.id][param.id] = param.defaultValue;
      });
    });
    return initialValues;
  });

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  // Handlers
  const handleEffectChange = useCallback((effectId: string, parameterId: string, value: number | boolean | string) => {
    setEffectValues(prev => ({
      ...prev,
      [effectId]: {
        ...prev[effectId],
        [parameterId]: value
      }
    }));
  }, []);

  const handleResetAllEffects = useCallback(() => {
    const resetValues: EffectValues = {};
    ENHANCED_VISUAL_EFFECTS.forEach(effect => {
      resetValues[effect.id] = {};
      effect.parameters.forEach(param => {
        resetValues[effect.id][param.id] = param.defaultValue;
      });
    });
    setEffectValues(resetValues);
  }, []);

  const handleReset = useCallback(() => {
    setRotation({ x: 0, y: 0 });
    setZoom(1);
    setIsFlipped(false);
    setAutoRotate(false);
  }, []);

  const handleZoom = useCallback((delta: number) => {
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  return {
    // State
    isFullscreen,
    rotation,
    isDragging,
    dragStart,
    zoom,
    isFlipped,
    autoRotate,
    showEffects,
    mousePosition,
    isHovering,
    showExportDialog,
    effectValues,
    
    // Refs
    containerRef,
    cardContainerRef,
    animationRef,
    
    // Setters
    setRotation,
    setIsDragging,
    setDragStart,
    setZoom,
    setIsFlipped,
    setAutoRotate,
    setShowEffects,
    setMousePosition,
    setIsHovering,
    setShowExportDialog,
    setEffectValues,
    
    // Handlers
    handleEffectChange,
    handleResetAllEffects,
    handleReset,
    handleZoom,
    toggleFullscreen
  };
};
