
import { useState, useCallback, useEffect } from 'react';
import * as THREE from 'three';

interface NavigationState {
  currentPosition: THREE.Vector3;
  targetPosition: THREE.Vector3;
  isAnimating: boolean;
  selectedCardId?: string;
}

export const useGalleryNavigation = () => {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    currentPosition: new THREE.Vector3(0, 5, 10),
    targetPosition: new THREE.Vector3(0, 5, 10),
    isAnimating: false
  });

  const navigateToCard = useCallback((cardId: string) => {
    setNavigationState(prev => ({
      ...prev,
      selectedCardId: cardId,
      isAnimating: true
    }));
  }, []);

  const navigateToPosition = useCallback((position: THREE.Vector3, target?: THREE.Vector3) => {
    setNavigationState(prev => ({
      ...prev,
      targetPosition: position,
      isAnimating: true
    }));
  }, []);

  const enableKeyboardNavigation = useCallback(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const moveDistance = 2;
      let newPosition = navigationState.currentPosition.clone();

      switch (event.key) {
        case 'ArrowUp':
        case 'w':
          newPosition.z -= moveDistance;
          break;
        case 'ArrowDown':
        case 's':
          newPosition.z += moveDistance;
          break;
        case 'ArrowLeft':
        case 'a':
          newPosition.x -= moveDistance;
          break;
        case 'ArrowRight':
        case 'd':
          newPosition.x += moveDistance;
          break;
        case ' ':
          newPosition.y += moveDistance;
          event.preventDefault();
          break;
        case 'Shift':
          newPosition.y -= moveDistance;
          break;
      }

      if (newPosition !== navigationState.currentPosition) {
        navigateToPosition(newPosition);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigationState.currentPosition, navigateToPosition]);

  const disableKeyboardNavigation = useCallback(() => {
    // Cleanup handled by enableKeyboardNavigation return function
  }, []);

  return {
    navigationState,
    navigateToCard,
    navigateToPosition,
    enableKeyboardNavigation,
    disableKeyboardNavigation
  };
};
