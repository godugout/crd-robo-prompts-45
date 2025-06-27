
import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

interface LivingCollectionsSystemProps {
  collection: any;
  onCardInteraction: (type: string, data: any) => void;
  onCollectionUpdate: (collection: any) => void;
}

interface CardInteraction {
  id: string;
  type: 'synergy' | 'rivalry' | 'evolution' | 'set_completion';
  cards: string[];
  effect: string;
  duration: number;
  intensity: number;
}

export const LivingCollectionsSystem: React.FC<LivingCollectionsSystemProps> = ({
  collection,
  onCardInteraction,
  onCollectionUpdate
}) => {
  const [activeInteractions, setActiveInteractions] = useState<CardInteraction[]>([]);
  const [cardPositions, setCardPositions] = useState<Map<string, THREE.Vector3>>(new Map());
  const groupRef = useRef<THREE.Group>(null);
  const interactionParticles = useRef<THREE.Group>(null);

  // Detect card relationships and trigger interactions
  useEffect(() => {
    detectCardInteractions();
  }, [collection]);

  const detectCardInteractions = () => {
    const interactions: CardInteraction[] = [];
    const cards = collection.cards;

    // Check for synergies (same theme/creator)
    for (let i = 0; i < cards.length; i++) {
      for (let j = i + 1; j < cards.length; j++) {
        const card1 = cards[i];
        const card2 = cards[j];

        // Synergy detection
        if (card1.tags?.some((tag: string) => card2.tags?.includes(tag))) {
          interactions.push({
            id: `synergy-${card1.id}-${card2.id}`,
            type: 'synergy',
            cards: [card1.id, card2.id],
            effect: 'harmony_glow',
            duration: 5000,
            intensity: 0.8
          });
        }

        // Rivalry detection (opposing themes)
        const opposingThemes = {
          'fire': 'water',
          'light': 'dark',
          'hero': 'villain'
        };
        
        const card1Theme = card1.tags?.find((tag: string) => Object.keys(opposingThemes).includes(tag));
        const card2Theme = card2.tags?.find((tag: string) => Object.values(opposingThemes).includes(tag));
        
        if (card1Theme && opposingThemes[card1Theme as keyof typeof opposingThemes] === card2Theme) {
          interactions.push({
            id: `rivalry-${card1.id}-${card2.id}`,
            type: 'rivalry',
            cards: [card1.id, card2.id],
            effect: 'tension_sparks',
            duration: 3000,
            intensity: 1.0
          });
        }
      }
    }

    // Check for set completion
    const setCards = cards.filter((card: any) => card.set_name);
    const setSizes = new Map<string, number>();
    
    setCards.forEach((card: any) => {
      setSizes.set(card.set_name, (setSizes.get(card.set_name) || 0) + 1);
    });

    setSizes.forEach((count, setName) => {
      if (count >= 5) { // Assume sets of 5+ trigger completion
        const setCardIds = setCards
          .filter((card: any) => card.set_name === setName)
          .map((card: any) => card.id);
        
        interactions.push({
          id: `set-completion-${setName}`,
          type: 'set_completion',
          cards: setCardIds,
          effect: 'celebration_burst',
          duration: 8000,
          intensity: 1.5
        });
      }
    });

    setActiveInteractions(interactions);
  };

  // Position cards based on their relationships
  const calculateCardPositions = () => {
    const positions = new Map<string, THREE.Vector3>();
    const cards = collection.cards;
    
    // Create clusters based on relationships
    const clusters = new Map<string, string[]>();
    
    activeInteractions.forEach(interaction => {
      if (interaction.type === 'synergy' || interaction.type === 'set_completion') {
        const clusterId = interaction.cards[0];
        if (!clusters.has(clusterId)) {
          clusters.set(clusterId, []);
        }
        clusters.get(clusterId)?.push(...interaction.cards);
      }
    });

    let clusterIndex = 0;
    clusters.forEach((cardIds, clusterId) => {
      const angle = (clusterIndex / clusters.size) * Math.PI * 2;
      const clusterCenter = new THREE.Vector3(
        Math.cos(angle) * 10,
        0,
        Math.sin(angle) * 10
      );

      cardIds.forEach((cardId, index) => {
        const localAngle = (index / cardIds.length) * Math.PI * 2;
        const localRadius = 3;
        
        positions.set(cardId, new THREE.Vector3(
          clusterCenter.x + Math.cos(localAngle) * localRadius,
          Math.sin(index * 0.5) * 2,
          clusterCenter.z + Math.sin(localAngle) * localRadius
        ));
      });
      
      clusterIndex++;
    });

    // Position remaining cards
    cards.forEach((card: any) => {
      if (!positions.has(card.id)) {
        const randomAngle = Math.random() * Math.PI * 2;
        const randomRadius = 15 + Math.random() * 10;
        
        positions.set(card.id, new THREE.Vector3(
          Math.cos(randomAngle) * randomRadius,
          (Math.random() - 0.5) * 5,
          Math.sin(randomAngle) * randomRadius
        ));
      }
    });

    setCardPositions(positions);
  };

  useEffect(() => {
    calculateCardPositions();
  }, [activeInteractions, collection]);

  // Animate interactions
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Animate interaction effects
    activeInteractions.forEach(interaction => {
      const cards = interaction.cards.map(id => 
        collection.cards.find((c: any) => c.id === id)
      ).filter(Boolean);
      
      if (interaction.type === 'synergy') {
        // Pulsing harmony effect
        cards.forEach((card: any) => {
          const position = cardPositions.get(card.id);
          if (position && groupRef.current) {
            const cardMesh = groupRef.current.getObjectByName(`card-${card.id}`);
            if (cardMesh) {
              cardMesh.scale.setScalar(1 + Math.sin(time * 3) * 0.1);
            }
          }
        });
      }
      
      if (interaction.type === 'rivalry') {
        // Tension sparks between rival cards
        if (cards.length >= 2) {
          const pos1 = cardPositions.get(cards[0].id);
          const pos2 = cardPositions.get(cards[1].id);
          
          if (pos1 && pos2 && interactionParticles.current) {
            // Create spark particles along the line between cards
            for (let i = 0; i < 5; i++) {
              const t = i / 4;
              const sparkPos = new THREE.Vector3().lerpVectors(pos1, pos2, t);
              sparkPos.add(new THREE.Vector3(
                (Math.random() - 0.5) * 0.5,
                (Math.random() - 0.5) * 0.5,
                (Math.random() - 0.5) * 0.5
              ));
            }
          }
        }
      }
    });
  });

  const getInteractionColor = (type: string) => {
    switch (type) {
      case 'synergy': return '#22c55e';
      case 'rivalry': return '#ef4444';
      case 'evolution': return '#a855f7';
      case 'set_completion': return '#ffd700';
      default: return '#6b7280';
    }
  };

  return (
    <group ref={groupRef}>
      {/* Cards with Dynamic Positioning */}
      {collection.cards.map((card: any) => {
        const position = cardPositions.get(card.id);
        if (!position) return null;

        const activeInteraction = activeInteractions.find(i => 
          i.cards.includes(card.id)
        );

        return (
          <group key={card.id} position={position.toArray()} name={`card-${card.id}`}>
            {/* Card */}
            <RoundedBox
              args={[2, 2.8, 0.1]}
              radius={0.1}
              onClick={() => onCardInteraction('living_select', { card })}
            >
              <meshPhysicalMaterial
                color={activeInteraction ? getInteractionColor(activeInteraction.type) : '#ffffff'}
                emissive={activeInteraction ? getInteractionColor(activeInteraction.type) : '#000000'}
                emissiveIntensity={activeInteraction ? 0.3 : 0}
                roughness={0.1}
                metalness={0.2}
              />
            </RoundedBox>

            {/* Interaction Aura */}
            {activeInteraction && (
              <Sphere args={[3]} transparent>
                <meshBasicMaterial
                  color={getInteractionColor(activeInteraction.type)}
                  transparent
                  opacity={0.1}
                />
              </Sphere>
            )}

            {/* Card Info */}
            <Text
              position={[0, -2, 0]}
              fontSize={0.3}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {card.title}
            </Text>
          </group>
        );
      })}

      {/* Interaction Connections */}
      {activeInteractions.map(interaction => {
        if (interaction.cards.length < 2) return null;

        const positions = interaction.cards
          .map(cardId => cardPositions.get(cardId))
          .filter(Boolean);

        if (positions.length < 2) return null;

        return (
          <group key={interaction.id}>
            {positions.slice(0, -1).map((pos, index) => (
              <Line
                key={index}
                points={[pos!.toArray(), positions[index + 1]!.toArray()]}
                color={getInteractionColor(interaction.type)}
                lineWidth={3}
                transparent
                opacity={0.6}
              />
            ))}
          </group>
        );
      })}

      {/* Particle Effects */}
      <group ref={interactionParticles}>
        {activeInteractions.map(interaction => {
          if (interaction.effect === 'celebration_burst') {
            const centerPos = interaction.cards
              .map(cardId => cardPositions.get(cardId))
              .filter(Boolean)
              .reduce((acc, pos) => acc.add(pos!), new THREE.Vector3())
              .divideScalar(interaction.cards.length);

            return (
              <group key={interaction.id} position={centerPos.toArray()}>
                {Array.from({ length: 20 }, (_, i) => (
                  <Sphere key={i} args={[0.05]} position={[
                    (Math.random() - 0.5) * 8,
                    Math.random() * 5 + 2,
                    (Math.random() - 0.5) * 8
                  ]}>
                    <meshBasicMaterial color="#ffd700" />
                  </Sphere>
                ))}
              </group>
            );
          }
          return null;
        })}
      </group>

      {/* Interaction Legend */}
      <group position={[0, 15, 0]}>
        <Text
          position={[0, 0, 0]}
          fontSize={1}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Living Collection: {activeInteractions.length} Active Interactions
        </Text>
        
        {activeInteractions.slice(0, 3).map((interaction, index) => (
          <Text
            key={interaction.id}
            position={[0, -1 - index * 0.5, 0]}
            fontSize={0.4}
            color={getInteractionColor(interaction.type)}
            anchorX="center"
            anchorY="middle"
          >
            {interaction.type.toUpperCase()}: {interaction.cards.length} cards
          </Text>
        ))}
      </group>
    </group>
  );
};
