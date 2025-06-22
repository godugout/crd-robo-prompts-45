
import React, { useMemo } from 'react';
import { SpotLight } from '@react-three/drei';
import * as THREE from 'three';
import type { Card } from '@/types/cards';

interface SearchSpotlightProps {
  cards: Card[];
  cardPositions: Map<string, THREE.Vector3>;
  searchQuery: string;
}

export const SearchSpotlight: React.FC<SearchSpotlightProps> = ({
  cards,
  cardPositions,
  searchQuery
}) => {
  const matchingCards = useMemo(() => {
    if (!searchQuery) return [];
    
    const query = searchQuery.toLowerCase();
    return cards.filter(card => 
      card.title.toLowerCase().includes(query) ||
      card.description?.toLowerCase().includes(query) ||
      card.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  }, [cards, searchQuery]);
  
  return (
    <>
      {matchingCards.map(card => {
        const position = cardPositions.get(card.id);
        if (!position) return null;
        
        return (
          <SpotLight
            key={card.id}
            position={[position.x, position.y + 5, position.z]}
            target={[position.x, position.y, position.z] as any}
            angle={0.3}
            penumbra={0.5}
            intensity={2}
            color="#00ff00"
            castShadow={false}
          />
        );
      })}
    </>
  );
};
