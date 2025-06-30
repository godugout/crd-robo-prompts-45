
import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

interface ConstellationNode {
  id: string;
  position: [number, number, number];
  rarity: string;
  connections: string[];
}

interface ConstellationGalleryProps {
  collection: {
    id: string;
    title: string;
    theme: string;
    cards: Array<{
      id: string;
      title: string;
      rarity: string;
    }>;
  };
  pattern: ConstellationNode[];
  environment: { type: string };
  viewMode: string;
  onCardInteraction: (type: string, data: any) => void;
}

export const ConstellationGallery: React.FC<ConstellationGalleryProps> = ({
  collection,
  pattern,
  environment,
  viewMode,
  onCardInteraction
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  const getRarityColor = (rarity: string) => {
    const colorMap: { [key: string]: string } = {
      common: '#6b7280',
      rare: '#3b82f6',
      epic: '#8b5cf6',
      legendary: '#f59e0b'
    };
    return colorMap[rarity] || '#6b7280';
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    onCardInteraction('node_selected', { nodeId, collectionId: collection.id });
  };

  return (
    <group ref={groupRef}>
      {/* Collection Title */}
      <Text
        position={[0, 8, 0]}
        fontSize={1.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {collection.title}
      </Text>

      {/* Constellation Nodes */}
      {pattern.map((node, index) => (
        <group key={node.id} position={node.position}>
          <Sphere
            args={[0.3]}
            onClick={() => handleNodeClick(node.id)}
          >
            <meshStandardMaterial
              color={new THREE.Color(getRarityColor(node.rarity))}
              emissive={new THREE.Color(getRarityColor(node.rarity))}
              emissiveIntensity={selectedNode === node.id ? 0.3 : 0.1}
            />
          </Sphere>
          
          {/* Node Label */}
          <Text
            position={[0, -0.8, 0]}
            fontSize={0.3}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            Card {index + 1}
          </Text>
        </group>
      ))}

      {/* Connection Lines */}
      {pattern.map((node, index) => 
        pattern.slice(index + 1).map((otherNode, otherIndex) => (
          <Line
            key={`${node.id}-${otherNode.id}`}
            points={[node.position, otherNode.position]}
            color="#4a5568"
            lineWidth={1}
            transparent
            opacity={0.3}
          />
        ))
      )}

      {/* Environment Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffffff" />
    </group>
  );
};
