
import React, { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Card3D } from '../core/Card3D';
import { GalleryEffects } from './GalleryEffects';
import { GalleryControls } from './GalleryControls';
import type { Card } from '@/types/cards';
import type { Collection } from '@/types/collections';
import * as THREE from 'three';

interface GallerySceneProps {
  cards: Card[];
  collection: Collection;
  layoutType: string;
  environmentSettings: any;
  cardPositions?: Map<string, THREE.Vector3>;
  selectedCard?: Card | null;
  navigationState?: any;
  onCardSelect?: (card: Card) => void;
  onCardInteraction?: (type: string, card: Card, data?: any) => void;
  quality: 'low' | 'medium' | 'high' | 'ultra';
}

export const GalleryScene: React.FC<GallerySceneProps> = ({
  cards,
  collection,
  layoutType,
  environmentSettings,
  cardPositions,
  selectedCard,
  navigationState,
  onCardSelect,
  onCardInteraction,
  quality
}) => {
  const { camera } = useThree();

  // Calculate positions based on layout type or use provided positions
  const calculatedPositions = useMemo(() => {
    if (cardPositions) {
      return Array.from(cardPositions.entries()).map(([id, pos]) => {
        if (pos instanceof THREE.Vector3) {
          return [pos.x, pos.y, pos.z] as [number, number, number];
        }
        return pos as [number, number, number];
      });
    }
    
    const positions: Array<[number, number, number]> = [];
    const radius = Math.max(cards.length * 0.5, 5);
    
    switch (layoutType) {
      case 'circle':
        cards.forEach((_, index) => {
          const angle = (index / cards.length) * Math.PI * 2;
          positions.push([
            Math.cos(angle) * radius,
            0,
            Math.sin(angle) * radius
          ]);
        });
        break;
      case 'spiral':
        cards.forEach((_, index) => {
          const angle = index * 0.5;
          const spiralRadius = index * 0.3 + 2;
          positions.push([
            Math.cos(angle) * spiralRadius,
            index * 0.2,
            Math.sin(angle) * spiralRadius
          ]);
        });
        break;
      case 'grid':
      default:
        const cols = Math.ceil(Math.sqrt(cards.length));
        cards.forEach((_, index) => {
          const row = Math.floor(index / cols);
          const col = index % cols;
          positions.push([
            (col - cols / 2) * 3,
            0,
            (row - Math.ceil(cards.length / cols) / 2) * 4
          ]);
        });
        break;
    }
    
    return positions;
  }, [cards.length, layoutType, cardPositions]);

  // Animate camera for dynamic views
  useFrame((state) => {
    if (layoutType === 'spiral') {
      camera.position.x = Math.cos(state.clock.elapsedTime * 0.1) * 10;
      camera.position.z = Math.sin(state.clock.elapsedTime * 0.1) * 10;
      camera.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      <GalleryEffects
        layoutType={layoutType}
        environmentSettings={environmentSettings}
        cardCount={cards.length}
        quality={quality}
      />
      
      {cards.map((card, index) => {
        const position = calculatedPositions[index] || [0, 0, 0];
        
        return (
          <Card3D
            key={card.id}
            card={card}
            position={position}
            onClick={() => {
              onCardSelect?.(card);
              onCardInteraction?.('select', card);
            }}
            onHover={(hovered) => {
              onCardInteraction?.('hover', card, { hovered });
            }}
            quality={quality}
          />
        );
      })}
      
      <GalleryControls
        onNavigateToPosition={() => {}}
        navigationState={navigationState}
        enableVR={false}
        enableMultiUser={false}
      />
    </>
  );
};
