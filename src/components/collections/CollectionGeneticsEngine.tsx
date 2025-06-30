import React, { useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Line, Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';

interface Collection {
  id: string;
  title: string;
  theme: 'sports' | 'fantasy' | 'nature' | 'tech' | 'art';
  cards: Array<{
    id: string;
    title: string;
    rarity: string;
    tags: string[];
    created_at: string;
  }>;
  dna: {
    creativity: number;
    rarity: number;
    theme_coherence: number;
    artistic_style: string[];
    color_palette: string[];
    interaction_patterns: string[];
    evolution_potential: number;
    genetic_stability: number;
  };
}

interface CollectionGeneticsEngineProps {
  collections: Collection[];
  onGeneticAnalysis: (data: any) => void;
  onEvolutionTrigger: (collection: Collection) => void;
}

export const CollectionGeneticsEngine: React.FC<CollectionGeneticsEngineProps> = ({
  collections,
  onGeneticAnalysis,
  onEvolutionTrigger
}) => {
  const [activeAnalysis, setActiveAnalysis] = useState<string | null>(null);

  const geneticConnections = useMemo(() => {
    const connections = [];
    
    for (let i = 0; i < collections.length; i++) {
      for (let j = i + 1; j < collections.length; j++) {
        const collection1 = collections[i];
        const collection2 = collections[j];
        
        // Calculate genetic similarity
        const similarity = calculateGeneticSimilarity(collection1.dna, collection2.dna);
        
        if (similarity > 0.5) {
          connections.push({
            from: i,
            to: j,
            strength: similarity,
            type: 'genetic_link'
          });
        }
      }
    }
    
    return connections;
  }, [collections]);

  const handleGeneticAnalysis = (collection: Collection) => {
    setActiveAnalysis(collection.id);
    
    const analysis = {
      collectionId: collection.id,
      geneticProfile: collection.dna,
      mutations: generateMutations(collection.dna),
      evolutionPathways: generateEvolutionPathways(collection.dna),
      compatibility: calculateCompatibilityMatrix(collection, collections)
    };
    
    onGeneticAnalysis(analysis);
    
    // Clear analysis after 3 seconds
    setTimeout(() => setActiveAnalysis(null), 3000);
  };

  return (
    <group>
      {/* DNA Helix Visualization */}
      {collections.map((collection, index) => {
        const angle = (index / collections.length) * Math.PI * 2;
        const radius = 20;
        const position: [number, number, number] = [
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        ];

        return (
          <group key={collection.id} position={position}>
            {/* DNA Core */}
            <Sphere
              args={[2]}
              onClick={() => handleGeneticAnalysis(collection)}
            >
              <meshPhysicalMaterial
                color={new THREE.Color(getDNAColor(collection.dna))}
                transparent
                opacity={0.8}
                emissive={new THREE.Color(getDNAColor(collection.dna))}
                emissiveIntensity={0.3}
              />
            </Sphere>

            {/* Genetic Traits Visualization */}
            {collection.dna.artistic_style.slice(0, 5).map((style, styleIndex) => (
              <Sphere
                key={styleIndex}
                args={[0.3]}
                position={[
                  Math.cos(styleIndex * 0.5) * 3,
                  styleIndex * 0.5 - 1,
                  Math.sin(styleIndex * 0.5) * 3
                ]}
              >
                <meshBasicMaterial color={new THREE.Color(getStyleColor(style))} />
              </Sphere>
            ))}

            {/* Collection Info */}
            <Text
              position={[0, -3, 0]}
              fontSize={0.5}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {collection.title}
            </Text>

            {/* DNA Stats */}
            <Text
              position={[0, -4, 0]}
              fontSize={0.3}
              color="#a0a0a0"
              anchorX="center"
              anchorY="middle"
            >
              Stability: {Math.round(collection.dna.genetic_stability * 100)}%
            </Text>

            {/* Evolution Button */}
            <Box
              args={[3, 1, 0.2]}
              position={[0, -5.5, 0]}
              onClick={() => onEvolutionTrigger(collection)}
            >
              <meshStandardMaterial color={new THREE.Color('#22c55e')} />
            </Box>

            <Text
              position={[0, -5.5, 0.15]}
              fontSize={0.3}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              Evolve
            </Text>
          </group>
        );
      })}

      {/* Genetic Connections */}
      {geneticConnections.map((connection, index) => {
        const angle1 = (connection.from / collections.length) * Math.PI * 2;
        const angle2 = (connection.to / collections.length) * Math.PI * 2;
        const radius = 20;
        
        const start: [number, number, number] = [
          Math.cos(angle1) * radius,
          0,
          Math.sin(angle1) * radius
        ];
        
        const end: [number, number, number] = [
          Math.cos(angle2) * radius,
          0,
          Math.sin(angle2) * radius
        ];

        return (
          <Line
            key={index}
            points={[start, end]}
            color={new THREE.Color('#a855f7')}
            lineWidth={connection.strength * 5}
            transparent
            opacity={connection.strength * 0.8}
          />
        );
      })}

      {/* Central Analysis Display */}
      {activeAnalysis && (
        <group position={[0, 10, 0]}>
          <Text
            fontSize={1.5}
            color="#22c55e"
            anchorX="center"
            anchorY="middle"
          >
            GENETIC ANALYSIS ACTIVE
          </Text>
        </group>
      )}
    </group>
  );
};

const calculateGeneticSimilarity = (dna1: any, dna2: any): number => {
  const creativityDiff = Math.abs(dna1.creativity - dna2.creativity);
  const rarityDiff = Math.abs(dna1.rarity - dna2.rarity);
  const coherenceDiff = Math.abs(dna1.theme_coherence - dna2.theme_coherence);
  
  return 1 - ((creativityDiff + rarityDiff + coherenceDiff) / 3);
};

const generateMutations = (dna: any) => {
  return {
    creativity: Math.min(1, dna.creativity + (Math.random() - 0.5) * 0.2),
    rarity: Math.min(1, dna.rarity + (Math.random() - 0.5) * 0.2),
    theme_coherence: Math.min(1, dna.theme_coherence + (Math.random() - 0.5) * 0.2)
  };
};

const generateEvolutionPathways = (dna: any) => {
  return [
    { path: 'enhanced_creativity', probability: dna.creativity * 0.8 },
    { path: 'rarity_boost', probability: dna.rarity * 0.7 },
    { path: 'theme_diversification', probability: (1 - dna.theme_coherence) * 0.6 }
  ];
};

const calculateCompatibilityMatrix = (collection: any, allCollections: any[]) => {
  return allCollections.map(other => ({
    id: other.id,
    compatibility: calculateGeneticSimilarity(collection.dna, other.dna)
  }));
};

const getDNAColor = (dna: any): string => {
  const hue = (dna.creativity * 120 + dna.rarity * 240 + dna.theme_coherence * 60) % 360;
  return `hsl(${hue}, 70%, 60%)`;
};

const getStyleColor = (style: string): string => {
  const colors: { [key: string]: string } = {
    'modern': '#3b82f6',
    'vintage': '#eab308',
    'minimalist': '#6b7280',
    'bold': '#ef4444',
    'artistic': '#a855f7'
  };
  return colors[style] || '#6b7280';
};
