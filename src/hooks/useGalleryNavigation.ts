
import { useState, useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';

interface NavigationState {
  cameraPosition: THREE.Vector3;
  cameraTarget: THREE.Vector3;
  currentCardId: string | null;
  searchQuery: string;
  isNavigating: boolean;
}

export const useGalleryNavigation = () => {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    cameraPosition: new THREE.Vector3(0, 5, 10),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    currentCardId: null,
    searchQuery: '',
    isNavigating: false
  });
  
  const keyboardHandlerRef = useRef<(event: KeyboardEvent) => void>();
  
  const navigateToCard = useCallback((cardId: string) => {
    setNavigationState(prev => ({
      ...prev,
      currentCardId: cardId,
      isNavigating: true
    }));
    
    // Animation would be handled by the Three.js scene
    setTimeout(() => {
      setNavigationState(prev => ({
        ...prev,
        isNavigating: false
      }));
    }, 1000);
  }, []);
  
  const navigateToPosition = useCallback((position: THREE.Vector3, target?: THREE.Vector3) => {
    setNavigationState(prev => ({
      ...prev,
      cameraPosition: position,
      cameraTarget: target || prev.cameraTarget,
      isNavigating: true
    }));
    
    setTimeout(() => {
      setNavigationState(prev => ({
        ...prev,
        isNavigating: false
      }));
    }, 1000);
  }, []);
  
  const setSearchQuery = useCallback((query: string) => {
    setNavigationState(prev => ({
      ...prev,
      searchQuery: query
    }));
  }, []);
  
  const enableKeyboardNavigation = useCallback(() => {
    keyboardHandlerRef.current = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          // Move forward
          break;
        case 'KeyS':
        case 'ArrowDown':
          // Move backward
          break;
        case 'KeyA':
        case 'ArrowLeft':
          // Move left
          break;
        case 'KeyD':
        case 'ArrowRight':
          // Move right
          break;
        case 'Space':
          event.preventDefault();
          // Center view
          navigateToPosition(new THREE.Vector3(0, 5, 10), new THREE.Vector3(0, 0, 0));
          break;
      }
    };
    
    window.addEventListener('keydown', keyboardHandlerRef.current);
  }, [navigateToPosition]);
  
  const disableKeyboardNavigation = useCallback(() => {
    if (keyboardHandlerRef.current) {
      window.removeEventListener('keydown', keyboardHandlerRef.current);
    }
  }, []);
  
  return {
    navigationState,
    navigateToCard,
    navigateToPosition,
    setSearchQuery,
    enableKeyboardNavigation,
    disableKeyboardNavigation
  };
};
