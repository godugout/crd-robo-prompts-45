
import { useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import type { Card } from '@/types/collections';

export type LayoutType = 'grid' | 'circle' | 'spiral' | 'wall' | 'scatter';

export const useGalleryLayout = (cards: Card[], initialLayout: LayoutType = 'grid') => {
  const [layoutType, setLayoutType] = useState<LayoutType>(initialLayout);
  
  const cardPositions = useMemo(() => {
    const positions = new Map<string, THREE.Vector3>();
    
    switch (layoutType) {
      case 'grid':
        return calculateGridLayout(cards, positions);
      case 'circle':
        return calculateCircleLayout(cards, positions);
      case 'spiral':
        return calculateSpiralLayout(cards, positions);
      case 'wall':
        return calculateWallLayout(cards, positions);
      case 'scatter':
        return calculateScatterLayout(cards, positions);
      default:
        return calculateGridLayout(cards, positions);
    }
  }, [cards, layoutType]);
  
  const recalculateLayout = useCallback(() => {
    // Force recalculation by updating layout type
    setLayoutType(prev => prev);
  }, []);
  
  return {
    layoutType,
    setLayoutType,
    cardPositions,
    recalculateLayout
  };
};

function calculateGridLayout(cards: Card[], positions: Map<string, THREE.Vector3>) {
  const cols = Math.ceil(Math.sqrt(cards.length));
  const spacing = 4;
  
  cards.forEach((card, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    
    const x = (col - (cols - 1) / 2) * spacing;
    const y = 0;
    const z = (row - Math.floor(cards.length / cols) / 2) * spacing;
    
    positions.set(card.id, new THREE.Vector3(x, y, z));
  });
  
  return positions;
}

function calculateCircleLayout(cards: Card[], positions: Map<string, THREE.Vector3>) {
  const radius = Math.max(5, cards.length * 0.3);
  
  cards.forEach((card, index) => {
    const angle = (index / cards.length) * Math.PI * 2;
    const x = radius * Math.cos(angle);
    const y = 0;
    const z = radius * Math.sin(angle);
    
    positions.set(card.id, new THREE.Vector3(x, y, z));
  });
  
  return positions;
}

function calculateSpiralLayout(cards: Card[], positions: Map<string, THREE.Vector3>) {
  const spiralRadius = 10;
  const spiralHeight = cards.length * 0.5;
  
  cards.forEach((card, index) => {
    const progress = index / (cards.length - 1);
    const angle = progress * Math.PI * 4;
    const height = progress * spiralHeight - spiralHeight / 2;
    
    const x = spiralRadius * Math.cos(angle);
    const y = height;
    const z = spiralRadius * Math.sin(angle);
    
    positions.set(card.id, new THREE.Vector3(x, y, z));
  });
  
  return positions;
}

function calculateWallLayout(cards: Card[], positions: Map<string, THREE.Vector3>) {
  const cols = Math.ceil(Math.sqrt(cards.length * 1.5));
  const rows = Math.ceil(cards.length / cols);
  const spacing = 3;
  
  cards.forEach((card, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    
    const x = (col - (cols - 1) / 2) * spacing;
    const y = (row - (rows - 1) / 2) * spacing;
    const z = 0;
    
    positions.set(card.id, new THREE.Vector3(x, y, z));
  });
  
  return positions;
}

function calculateScatterLayout(cards: Card[], positions: Map<string, THREE.Vector3>) {
  const bounds = 15;
  const minDistance = 3;
  
  cards.forEach((card, index) => {
    let position: THREE.Vector3;
    let attempts = 0;
    
    do {
      position = new THREE.Vector3(
        (Math.random() - 0.5) * bounds * 2,
        (Math.random() - 0.5) * bounds,
        (Math.random() - 0.5) * bounds * 2
      );
      attempts++;
    } while (attempts < 50 && isPositionTooClose(position, positions, minDistance));
    
    positions.set(card.id, position);
  });
  
  return positions;
}

function isPositionTooClose(position: THREE.Vector3, existingPositions: Map<string, THREE.Vector3>, minDistance: number): boolean {
  for (const existingPosition of existingPositions.values()) {
    if (position.distanceTo(existingPosition) < minDistance) {
      return true;
    }
  }
  return false;
}
