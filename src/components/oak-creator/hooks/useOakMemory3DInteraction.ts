
import { useState, useCallback } from 'react';
import { Vector3 } from 'three';

export const useOakMemory3DInteraction = () => {
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 0, 5]);
  const [cardRotation, setCardRotation] = useState<Vector3>(new Vector3(0, 0, 0));
  const [autoRotate, setAutoRotate] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  const resetView = useCallback(() => {
    try {
      setCameraPosition([0, 0, 5]);
      setCardRotation(new Vector3(0, 0, 0));
      setAutoRotate(false);
    } catch (error) {
      console.warn('Error resetting view:', error);
    }
  }, []);

  const rotateCard = useCallback((x: number, y: number, z: number) => {
    try {
      // Validate inputs
      const safeX = typeof x === 'number' && !isNaN(x) ? x : 0;
      const safeY = typeof y === 'number' && !isNaN(y) ? y : 0;
      const safeZ = typeof z === 'number' && !isNaN(z) ? z : 0;
      
      setCardRotation(new Vector3(safeX, safeY, safeZ));
    } catch (error) {
      console.warn('Error rotating card:', error);
    }
  }, []);

  const zoomToCard = useCallback(() => {
    try {
      setCameraPosition([0, 0, 3]);
    } catch (error) {
      console.warn('Error zooming to card:', error);
    }
  }, []);

  const showCardBack = useCallback(() => {
    try {
      setCardRotation(new Vector3(0, Math.PI, 0));
      setAutoRotate(false);
    } catch (error) {
      console.warn('Error showing card back:', error);
    }
  }, []);

  const showCardFront = useCallback(() => {
    try {
      setCardRotation(new Vector3(0, 0, 0));
      setAutoRotate(false);
    } catch (error) {
      console.warn('Error showing card front:', error);
    }
  }, []);

  const startAutoRotate = useCallback(() => {
    try {
      setAutoRotate(true);
    } catch (error) {
      console.warn('Error starting auto rotate:', error);
    }
  }, []);

  const stopAutoRotate = useCallback(() => {
    try {
      setAutoRotate(false);
    } catch (error) {
      console.warn('Error stopping auto rotate:', error);
    }
  }, []);

  const handleInteractionStart = useCallback(() => {
    try {
      setIsInteracting(true);
      setAutoRotate(false);
    } catch (error) {
      console.warn('Error handling interaction start:', error);
    }
  }, []);

  const handleInteractionEnd = useCallback(() => {
    try {
      setIsInteracting(false);
    } catch (error) {
      console.warn('Error handling interaction end:', error);
    }
  }, []);

  return {
    cameraPosition,
    cardRotation,
    autoRotate,
    isInteracting,
    setCameraPosition,
    setCardRotation,
    setAutoRotate,
    resetView,
    rotateCard,
    zoomToCard,
    showCardBack,
    showCardFront,
    startAutoRotate,
    stopAutoRotate,
    handleInteractionStart,
    handleInteractionEnd
  };
};
