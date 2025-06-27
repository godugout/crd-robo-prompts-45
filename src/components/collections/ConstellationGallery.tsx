
import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Line, Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';

interface ConstellationPattern {
  id: string;
  position: [number, number, number];
  rarity: string;
  connections: Array<{
    target: string;
    type: 'synergy' | 'rivalry' | 'complement' | 'evolution';
    strength: number;
  }>;
}

interface ConstellationGalleryProps {
  collection: any;
  pattern: ConstellationPattern[];
  environment: any;
  viewMode: 'infinite' | 'focused';
  onCardInteraction: (type: string, data: any) => void;
}

export const ConstellationGallery: React.FC<ConstellationGalleryProps> = ({
  collection,
  pattern,
  environment,
  viewMode,
  onCardInteraction
}) => {
  const { camera, scene } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const connectionLinesRef = useRef<THREE.Group>(null);

  // Infinite scrolling logic
  useFrame((state) => {
    if (viewMode === 'infinite' && groupRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Gentle rotation for infinite feel
      groupRef.current.rotation.y = time * 0.1;
      
      // Floating motion
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.5;
      
      // Dynamic camera movement for infinite exploration
      camera.position.x = Math.cos(time * 0.05) * 25;
      camera.position.z = Math.sin(time * 0.05) * 25;
      camera.lookAt(0, 0, 0);
    }
  });

  // Generate connection lines between related cards
  const connectionLines = useMemo(() => {
    const lines = [];
    
    pattern.forEach((card) => {
      card.connections.forEach((connection) => {
        const targetCard = pattern.find(p => p.id === connection.target);
        if (targetCard) {
          const color = getConnectionColor(connection.type);
          const opacity = connection.strength;
          
          lines.push({
            start: card.position,
            end: targetCard.position,
            color,
            opacity,
            type: connection.type
          });
        }
      });
    });
    
    return lines;
  }, [pattern]);

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

  const getRaritySize = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 1.5;
      case 'epic': return 1.2;
      case 'rare': return 1.0;
      case 'uncommon': return 0.8;
      default: return 0.6;
    }
  };

  return (
    <group ref={groupRef}>
      {/* Environment-specific effects */}
      {environment?.type === 'stadium' && (
        <group>
          {/* Stadium lights */}
          <pointLight position={[20, 30, 0]} intensity={2} color="#ffffff" />
          <pointLight position={[-20, 30, 0]} intensity={2} color="#ffffff" />
          <pointLight position={[0, 30, 20]} intensity={2} color="#ffffff" />
          <pointLight position={[0, 30, -20]} intensity={2} color="#ffffff" />
        </group>
      )}
      
      {environment?.type === 'magical_realm' && (
        <group>
          {/* Magical particles */}
          {Array.from({ length: 50 }, (_, i) => (
            <Sphere
              key={i}
              args={[0.02]}
              position={[
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 40
              ]}
            >
              <meshBasicMaterial color="#a855f7" transparent opacity={0.6} />
            </Sphere>
          ))}
        </group>
      )}

      {/* Connection Lines */}
      <group ref={connectionLinesRef}>
        {connectionLines.map((line, index) => (
          <Line
            key={index}
            points={[line.start, line.end]}
            color={line.color}
            lineWidth={2}
            transparent
            opacity={line.opacity * 0.7}
          />
        ))}
      </group>

      {/* Card Constellations */}
      {pattern.map((cardPattern) => {
        const card = collection.cards.find((c: any) => c.id === cardPattern.id);
        if (!card) return null;

        return (
          <group key={cardPattern.id} position={cardPattern.position}>
            {/* Card Representation */}
            <Box
              args={[2, 2.8, 0.1]}
              scale={getRaritySize(cardPattern.rarity)}
              onClick={() => onCardInteraction('card_select', { card, pattern: cardPattern })}
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

            {/* Card Aura Effect */}
            <Sphere args={[3]} scale={getRaritySize(cardPattern.rarity)}>
              <meshBasicMaterial
                color={getRarityColor(cardPattern.rarity)}
                transparent
                opacity={0.1}
                side={THREE.BackSide}
              />
            </Sphere>

            {/* Card Title */}
            <Text
              position={[0, -2, 0]}
              fontSize={0.3}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {card.title}
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

            {/* Connection Count Indicator */}
            {cardPattern.connections.length > 0 && (
              <Sphere args={[0.3]} position={[2, 2, 0]}>
                <meshBasicMaterial color="#ffd700" />
              </Sphere>
            )}
          </group>
        );
      })}

      {/* Collection Title */}
      <Text
        position={[0, 25, 0]}
        fontSize={2}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        {collection.title}
      </Text>

      {/* Collection Stats */}
      <Text
        position={[0, 22, 0]}
        fontSize={0.8}
        color="#a0a0a0"
        anchorX="center"
        anchorY="middle"
      >
        {collection.cards.length} Cards • {connectionLines.length} Connections
      </Text>
    </group>
  );
};
