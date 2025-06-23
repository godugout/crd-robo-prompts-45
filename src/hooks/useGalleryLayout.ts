
import { useState, useMemo } from 'react';
import * as THREE from 'three';
import type { Card } from '@/types/cards';

export type LayoutType = 'grid' | 'circle' | 'spiral';

export const useGalleryLayout = (cards: Card[], initialLayout: LayoutType = 'grid') => {
  const [layoutType, setLayoutType] = useState<LayoutType>(initialLayout);
  
  const cardPositions = useMemo(() => {
    const positions = new Map<string, THREE.Vector3>();
    const radius = Math.max(cards.length * 0.5, 5);
    
    cards.forEach((card, index) => {
      let position: THREE.Vector3;
      
      switch (layoutType) {
        case 'circle':
          const angle = (index / cards.length) * Math.PI * 2;
          position = new THREE.Vector3(
            Math.cos(angle) * radius,
            0,
            Math.sin(angle) * radius
          );
          break;
        case 'spiral':
          const spiralAngle = index * 0.5;
          const spiralRadius = index * 0.3 + 2;
          position = new THREE.Vector3(
            Math.cos(spiralAngle) * spiralRadius,
            index * 0.2,
            Math.sin(spiralAngle) * spiralRadius
          );
          break;
        case 'grid':
        default:
          const cols = Math.ceil(Math.sqrt(cards.length));
          const row = Math.floor(index / cols);
          const col = index % cols;
          position = new THREE.Vector3(
            (col - cols / 2) * 3,
            0,
            (row - Math.ceil(cards.length / cols) / 2) * 4
          );
          break;
      }
      
      positions.set(card.id, position);
    });
    
    return positions;
  }, [cards, layoutType]);
  
  const recalculateLayout = () => {
    // Force recalculation by updating the layout type
    setLayoutType(prev => prev);
  };
  
  return {
    layoutType,
    setLayoutType,
    cardPositions,
    recalculateLayout
  };
};
