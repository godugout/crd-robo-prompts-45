import React, { useState, useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Line, Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';

interface CardData {
  id: string;
  title: string;
  rarity: string;
  position: [number, number, number];
  connections: Array<{
    target: string;
    type: 'synergy' | 'rivalry' | 'complement' | 'evolution';
    strength: number;
  }>;
}

interface CollectionData {
  id: string;
  title: string;
  cards: Array<{ id: string; title: string; rarity: string }>;
  dna: {
    creativity: number;
    rarity: number;
    theme_coherence: number;
  };
}

interface CardInteraction {
  cardId: string;
  type: 'tap' | 'drag' | 'proximity' | 'fusion';
  position: [number, number, number];
}

interface LivingCollectionsSystemProps {
  collections: CollectionData[];
  onCardInteraction: (type: string, data: any) => void;
  onCollectionEvolution: (collectionId: string, newState: any) => void;
}

export const LivingCollectionsSystem: React.FC<LivingCollectionsSystemProps> = ({
  collections,
  onCardInteraction,
  onCollectionEvolution
}) => {
  const { scene } = useThree();
  const interactionGroupRef = useRef<THREE.Group>(null);
  const [activeInteractions, setActiveInteractions] = useState<CardInteraction[]>([]);
  const [evolutionStates, setEvolutionStates] = useState<Map<string, number>>(new Map());

  // Generate initial card positions and connections
  const cardPatterns = useMemo(() => {
    const patterns: CardData[] = [];
    
    collections.forEach((collection) => {
      collection.cards.forEach((card, index) => {
        const angle = (index / collection.cards.length) * Math.PI * 2;
        const radius = 8 + collection.dna.creativity * 5;
        
        patterns.push({
          id: card.id,
          title: card.title,
          rarity: card.rarity,
          position: [
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            0
          ],
          connections: [] // Will be populated later
        });
      });
    });
    
    // Establish connections based on collection DNA
    collections.forEach((collection) => {
      collection.cards.forEach((card) => {
        const cardPattern = patterns.find(p => p.id === card.id);
        if (!cardPattern) return;
        
        // Connect to other cards in the same collection
        collection.cards.forEach((otherCard) => {
          if (card.id === otherCard.id) return;
          
          const otherCardPattern = patterns.find(p => p.id === otherCard.id);
          if (!otherCardPattern) return;
          
          cardPattern.connections.push({
            target: otherCard.id,
            type: 'synergy',
            strength: collection.dna.theme_coherence
          });
        });
      });
    });
    
    return patterns;
  }, [collections]);

  // Handle card interactions
  const handleCardTap = (cardId: string, position: [number, number, number]) => {
    setActiveInteractions(prev => [
      ...prev,
      {
        cardId,
        type: 'tap',
        position
      }
    ]);
    
    onCardInteraction('card_tapped', { cardId, position });
    
    // Remove interaction after a delay
    setTimeout(() => {
      setActiveInteractions(prev => prev.filter(i => i.cardId !== cardId));
    }, 2000);
  };

  // Handle collection evolution
  const handleCollectionEvolution = (collectionId: string) => {
    const collection = collections.find(c => c.id === collectionId);
    if (!collection) return;
    
    const newState = {
      creativity: Math.random(),
      rarity: Math.random(),
      theme_coherence: Math.random()
    };
    
    setEvolutionStates(prev => new Map(prev).set(collectionId, Math.random()));
    onCollectionEvolution(collectionId, newState);
  };

  // Animate interactions and evolutions
  useFrame(() => {
    if (interactionGroupRef.current) {
      interactionGroupRef.current.rotation.y += 0.005;
    }
  });

  const getConnectionColor = (type: string) => {
    switch (type) {
      case 'synergy': return '#22c55e';
      case 'rivalry': return '#ef4444';
      case 'complement': return '#3b82f6';
      case 'evolution': return '#a855f7';
      default: return '#6b7280';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '#ffd700';
      case 'epic': return '#a855f7';
      case 'rare': return '#3b82f6';
      case 'uncommon': return '#22c55e';
      default: return '#6b7280';
    }
  };

  return (
    <group ref={interactionGroupRef}>
      {/* Card Representations */}
      {cardPatterns.map((cardPattern) => (
        <group key={cardPattern.id} position={cardPattern.position}>
          {/* Card Body */}
          <Box
            args={[2, 2.8, 0.1]}
            onClick={() => handleCardTap(cardPattern.id, cardPattern.position)}
          >
            <meshPhysicalMaterial
              color={getRarityColor(cardPattern.rarity)}
              transparent
              opacity={0.8}
              roughness={0.1}
              metalness={0.3}
              emissive={getRarityColor(cardPattern.rarity)}
              emissiveIntensity={0.2}
            />
          </Box>
          
          {/* Card Title */}
          <Text
            position={[0, -2, 0]}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {cardPattern.title}
          </Text>
          
          {/* Rarity Indicator */}
          <Text
            position={[0, -2.5, 0]}
            fontSize={0.2}
            color={getRarityColor(cardPattern.rarity)}
            anchorX="center"
            anchorY="middle"
          >
            {cardPattern.rarity.toUpperCase()}
          </Text>
        </group>
      ))}

      {/* Interaction Effects */}
      {activeInteractions.map((interaction, index) => (
        <group key={index} position={interaction.position}>
          {/* Fixed: Move transparent prop to material */}
          <Sphere args={[0.5]}>
            <meshBasicMaterial 
              color={getInteractionColor(interaction.type)}
              transparent
              opacity={0.6}
            />
          </Sphere>
          
          {/* Interaction particles */}
          {Array.from({ length: 10 }, (_, i) => (
            <Sphere key={i} args={[0.02]} position={[
              (Math.random() - 0.5) * 2,
              (Math.random() - 0.5) * 2,
              (Math.random() - 0.5) * 2
            ]}>
              <meshBasicMaterial 
                color={getInteractionColor(interaction.type)}
                transparent
                opacity={0.8}
              />
            </Sphere>
          ))}
        </group>
      ))}

      {/* Collection Evolution Buttons */}
      {collections.map((collection, index) => (
        <group key={collection.id} position={[
          -20 + index * 10,
          10,
          0
        ]}>
          <Box
            args={[4, 2, 0.2]}
            onClick={() => handleCollectionEvolution(collection.id)}
          >
            <meshPhysicalMaterial color="#a855f7" />
          </Box>
          
          <Text
            position={[0, 0, 1.1]}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            Evolve {collection.title}
          </Text>
        </group>
      ))}
    </group>
  );
};

const getInteractionColor = (type: string) => {
  switch (type) {
    case 'tap': return '#ffd700';
    case 'drag': return '#ef4444';
    case 'proximity': return '#3b82f6';
    case 'fusion': return '#a855f7';
    default: return '#6b7280';
  }
};
