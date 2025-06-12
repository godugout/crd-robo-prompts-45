
import { useState, useCallback } from 'react';
import { Vector3 } from 'three';

export const useOakMemory3DInteraction = () => {
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 0, 5]);
  const [cardRotation, setCardRotation] = useState<Vector3>(new Vector3(0, 0, 0));
  const [autoRotate, setAutoRotate] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  const resetView = useCallback(() => {
    setCameraPosition([0, 0, 5]);
    setCardRotation(new Vector3(0, 0, 0));
    setAutoRotate(false);
  }, []);

  const rotateCard = useCallback((x: number, y: number, z: number) => {
    setCardRotation(new Vector3(x, y, z));
  }, []);

  const zoomToCard = useCallback(() => {
    setCameraPosition([0, 0, 3]);
  }, []);

  const showCardBack = useCallback(() => {
    setCardRotation(new Vector3(0, Math.PI, 0));
    setAutoRotate(false);
  }, []);

  const showCardFront = useCallback(() => {
    setCardRotation(new Vector3(0, 0, 0));
    setAutoRotate(false);
  }, []);

  const startAutoRotate = useCallback(() => {
    setAutoRotate(true);
  }, []);

  const stopAutoRotate = useCallback(() => {
    setAutoRotate(false);
  }, []);

  const handleInteractionStart = useCallback(() => {
    setIsInteracting(true);
    setAutoRotate(false);
  }, []);

  const handleInteractionEnd = useCallback(() => {
    setIsInteracting(false);
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
