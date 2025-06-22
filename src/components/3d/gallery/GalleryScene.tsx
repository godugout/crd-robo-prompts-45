
import React, { useMemo } from 'react';
import { Card3D } from '../core/Card3D';
import { GalleryEffects } from './GalleryEffects';
import { FloatingInfoPanel } from './FloatingInfoPanel';
import { SearchSpotlight } from './SearchSpotlight';
import { NavigationCompass } from './NavigationCompass';
import * as THREE from 'three';
import type { Card } from '@/types/cards';

interface GallerySceneProps {
  cards: Card[];
  cardPositions: Map<string, THREE.Vector3>;
  selectedCard: Card | null;
  layoutType: string;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  navigationState: any;
  onCardSelect: (card: Card) => void;
  onCardInteraction: (type: string, card: Card, data?: any) => void;
  environmentSettings: any;
}

export const GalleryScene: React.FC<GallerySceneProps> = ({
  cards,
  cardPositions,
  selectedCard,
  layoutType,
  quality,
  navigationState,
  onCardSelect,
  onCardInteraction,
  environmentSettings
}) => {
  // Calculate visible cards based on camera position for performance
  const visibleCards = useMemo(() => {
    // Implement occlusion culling here
    return cards.filter((card, index) => {
      // For now, show all cards - implement distance culling in production
      return true;
    });
  }, [cards, navigationState.cameraPosition]);

  // Generate card meshes with positions
  const cardMeshes = useMemo(() => {
    return visibleCards.map((card) => {
      const position = cardPositions.get(card.id);
      if (!position) return null;

      return (
        <group key={card.id} position={[position.x, position.y, position.z]}>
          <Card3D
            card={card}
            quality={quality}
            interactive={true}
            onClick={() => onCardSelect(card)}
            onHover={(hovered) => {
              if (hovered) {
                onCardInteraction('hover', card);
              }
            }}
            scale={selectedCard?.id === card.id ? 1.2 : 1}
          />
          
          {/* Floating info panel for selected card */}
          {selectedCard?.id === card.id && (
            <FloatingInfoPanel
              card={card}
              position={[0, 2, 0]}
              visible={true}
            />
          )}
        </group>
      );
    }).filter(Boolean);
  }, [visibleCards, cardPositions, selectedCard, quality, onCardSelect, onCardInteraction]);

  return (
    <group>
      {/* Card meshes */}
      {cardMeshes}
      
      {/* Gallery effects */}
      <GalleryEffects
        layoutType={layoutType}
        environmentSettings={environmentSettings}
        cardCount={cards.length}
        quality={quality}
      />
      
      {/* Search spotlight */}
      {navigationState.searchQuery && (
        <SearchSpotlight
          cards={cards}
          cardPositions={cardPositions}
          searchQuery={navigationState.searchQuery}
        />
      )}
      
      {/* Navigation compass */}
      <NavigationCompass
        position={[8, 8, 8]}
        selectedCard={selectedCard}
        cards={cards}
        cardPositions={cardPositions}
      />
    </group>
  );
};
