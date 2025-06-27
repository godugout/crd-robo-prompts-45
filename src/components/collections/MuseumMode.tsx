
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box, Plane, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface MuseumModeProps {
  collection: any;
  environment: any;
  onCardInteraction: (type: string, data: any) => void;
}

export const MuseumMode: React.FC<MuseumModeProps> = ({
  collection,
  environment,
  onCardInteraction
}) => {
  const [currentExhibit, setCurrentExhibit] = useState(0);
  const [tourMode, setTourMode] = useState(false);
  const exhibitRef = useRef<THREE.Group>(null);

  // Museum lighting setup
  const lighting = {
    ambient: 0.3,
    spotlights: [
      { position: [5, 8, 5], intensity: 1.5, angle: 0.3 },
      { position: [-5, 8, 5], intensity: 1.5, angle: 0.3 },
      { position: [0, 8, -5], intensity: 1.5, angle: 0.3 }
    ]
  };

  // Organize cards into exhibition sections
  const exhibitions = [
    {
      title: "Featured Masterpieces",
      cards: collection.cards.filter((c: any) => c.rarity === 'legendary'),
      layout: 'wall',
      lighting: 'dramatic'
    },
    {
      title: "Artist Spotlight", 
      cards: collection.cards.filter((c: any) => c.creator_verified),
      layout: 'pedestal',
      lighting: 'soft'
    },
    {
      title: "Historical Timeline",
      cards: collection.cards.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()),
      layout: 'timeline',
      lighting: 'warm'
    }
  ];

  useFrame((state) => {
    if (tourMode && exhibitRef.current) {
      const time = state.clock.getElapsedTime();
      // Gentle camera movement for guided tour
      exhibitRef.current.rotation.y = Math.sin(time * 0.1) * 0.1;
    }
  });

  const renderWallLayout = (cards: any[], startPosition: [number, number, number]) => {
    return cards.map((card, index) => {
      const x = startPosition[0] + (index % 4) * 4;
      const y = startPosition[1] + Math.floor(index / 4) * -3;
      const z = startPosition[2];

      return (
        <group key={card.id} position={[x, y, z]}>
          {/* Wall Mount */}
          <Box args={[3, 4, 0.2]} position={[0, 0, -0.2]}>
            <meshStandardMaterial color="#8b7355" />
          </Box>
          
          {/* Card Frame */}
          <RoundedBox args={[2.8, 3.8, 0.1]} radius={0.1}>
            <meshPhysicalMaterial
              color="#ffffff"
              roughness={0.1}
              metalness={0.2}
            />
          </RoundedBox>

          {/* Spotlight for this piece */}
          <spotLight
            position={[0, 3, 2]}
            target-position={[0, 0, 0]}
            intensity={2}
            angle={0.3}
            penumbra={0.5}
            castShadow
          />

          {/* Placard */}
          <group position={[0, -2.5, 0.1]}>
            <Box args={[2.5, 0.5, 0.05]}>
              <meshStandardMaterial color="#2a2a2a" />
            </Box>
            <Text
              position={[0, 0, 0.03]}
              fontSize={0.15}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {card.title}
            </Text>
          </group>

          {/* Interactive highlight */}
          <Box
            args={[3.2, 4.2, 0.05]}
            position={[0, 0, 0.1]}
            onClick={() => onCardInteraction('museum_select', { card, exhibition: 'wall' })}
          >
            <meshBasicMaterial
              color="#4a90e2"
              transparent
              opacity={0}
            />
          </Box>
        </group>
      );
    });
  };

  const renderPedestalLayout = (cards: any[], startPosition: [number, number, number]) => {
    return cards.map((card, index) => {
      const angle = (index / cards.length) * Math.PI * 2;
      const radius = 8;
      const x = startPosition[0] + Math.cos(angle) * radius;
      const z = startPosition[2] + Math.sin(angle) * radius;

      return (
        <group key={card.id} position={[x, startPosition[1], z]}>
          {/* Pedestal */}
          <Box args={[1.5, 3, 1.5]} position={[0, -1.5, 0]}>
            <meshStandardMaterial color="#f5f5f5" />
          </Box>
          
          {/* Pedestal Top */}
          <Box args={[2, 0.2, 2]} position={[0, 0.1, 0]}>
            <meshStandardMaterial color="#ffffff" />
          </Box>

          {/* Card Display */}
          <RoundedBox
            args={[1.5, 2.1, 0.1]}
            position={[0, 1.5, 0]}
            radius={0.1}
          >
            <meshPhysicalMaterial
              color={card.rarity === 'legendary' ? '#ffd700' : '#ffffff'}
              roughness={0.05}
              metalness={0.3}
              emissive={card.rarity === 'legendary' ? '#ffd700' : '#000000'}
              emissiveIntensity={0.2}
            />
          </RoundedBox>

          {/* Rotating display */}
          <group position={[0, 1.5, 0]}>
            {/* This would rotate slowly */}
          </group>

          {/* Information Panel */}
          <group position={[0, -0.5, 1.2]}>
            <Plane args={[2, 1]}>
              <meshStandardMaterial color="#1a1a1a" />
            </Plane>
            <Text
              position={[0, 0.2, 0.01]}
              fontSize={0.2}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {card.title}
            </Text>
            <Text
              position={[0, -0.1, 0.01]}
              fontSize={0.12}
              color="#a0a0a0"
              anchorX="center"
              anchorY="middle"
            >
              {card.creator_name}
            </Text>
            <Text
              position={[0, -0.3, 0.01]}
              fontSize={0.1}
              color="#808080"
              anchorX="center"
              anchorY="middle"
            >
              {card.rarity} • {new Date(card.created_at).getFullYear()}
            </Text>
          </group>
        </group>
      );
    });
  };

  const renderTimelineLayout = (cards: any[], startPosition: [number, number, number]) => {
    return cards.map((card, index) => {
      const x = startPosition[0] + index * 5;
      const y = startPosition[1];
      const z = startPosition[2];

      return (
        <group key={card.id} position={[x, y, z]}>
          {/* Timeline Post */}
          <Box args={[0.2, 6, 0.2]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#666666" />
          </Box>

          {/* Card Mount */}
          <group position={[0, 2, 1]}>
            <RoundedBox args={[2, 2.8, 0.1]} radius={0.1}>
              <meshPhysicalMaterial color="#ffffff" roughness={0.1} />
            </RoundedBox>
          </group>

          {/* Date Marker */}
          <group position={[0, -2, 1]}>
            <Box args={[1.5, 0.4, 0.1]}>
              <meshStandardMaterial color="#2a2a2a" />
            </Box>
            <Text
              position={[0, 0, 0.06]}
              fontSize={0.15}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {new Date(card.created_at).getFullYear()}
            </Text>
          </group>

          {/* Connection Line */}
          {index < cards.length - 1 && (
            <Box
              args={[4.8, 0.05, 0.05]}
              position={[2.5, -2, 0]}
            >
              <meshStandardMaterial color="#444444" />
            </Box>
          )}
        </group>
      );
    });
  };

  return (
    <group ref={exhibitRef}>
      {/* Museum Lighting */}
      <ambientLight intensity={lighting.ambient} />
      {lighting.spotlights.map((light, index) => (
        <spotLight
          key={index}
          position={light.position as [number, number, number]}
          intensity={light.intensity}
          angle={light.angle}
          penumbra={0.5}
          castShadow
        />
      ))}

      {/* Museum Floor */}
      <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
        <meshStandardMaterial color="#f8f8f8" />
      </Plane>

      {/* Museum Walls */}
      <Plane args={[100, 20]} position={[0, 5, -15]}>
        <meshStandardMaterial color="#e8e8e8" />
      </Plane>

      {/* Exhibition Areas */}
      {exhibitions.map((exhibition, exhibitionIndex) => (
        <group key={exhibitionIndex} position={[exhibitionIndex * 20 - 20, 0, 0]}>
          {/* Exhibition Title */}
          <Text
            position={[0, 8, 0]}
            fontSize={1}
            color="#2a2a2a"
            anchorX="center"
            anchorY="middle"
            font="/fonts/Inter-Bold.woff"
          >
            {exhibition.title}
          </Text>

          {/* Render based on layout type */}
          {exhibition.layout === 'wall' && renderWallLayout(exhibition.cards, [0, 3, -10])}
          {exhibition.layout === 'pedestal' && renderPedestalLayout(exhibition.cards, [0, 0, 0])}
          {exhibition.layout === 'timeline' && renderTimelineLayout(exhibition.cards, [-10, 0, 5])}
        </group>
      ))}

      {/* Tour Guide System */}
      {tourMode && (
        <group position={[0, 1, 5]}>
          <Text
            position={[0, 0, 0]}
            fontSize={0.5}
            color="#4a90e2"
            anchorX="center"
            anchorY="middle"
          >
            🎧 Audio Guide Active
          </Text>
        </group>
      )}

      {/* Navigation Waypoints */}
      {exhibitions.map((_, index) => (
        <group key={index} position={[index * 20 - 20, -3, 8]}>
          <Box
            args={[1, 0.2, 1]}
            onClick={() => {
              setCurrentExhibit(index);
              onCardInteraction('navigate_exhibition', { exhibition: index });
            }}
          >
            <meshStandardMaterial
              color={currentExhibit === index ? "#4a90e2" : "#cccccc"}
            />
          </Box>
          <Text
            position={[0, 0.3, 0]}
            fontSize={0.2}
            color="black"
            anchorX="center"
            anchorY="middle"
          >
            {index + 1}
          </Text>
        </group>
      ))}
    </group>
  );
};
