
import React, { useState, useEffect } from 'react';
import { Text, RoundedBox, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

interface DNAStrand {
  gene: string;
  strength: number;
  expression: string;
  mutations: string[];
}

interface CollectionDNA {
  creativity: number;
  rarity: number;
  theme_coherence: number;
  artistic_style: string[];
  color_palette: string[];
  interaction_patterns: string[];
  evolution_potential: number;
  genetic_stability: number;
}

interface CollectionGeneticsEngineProps {
  collection: any;
  onCollectionUpdate: (collection: any) => void;
  onCardInteraction: (type: string, data: any) => void;
}

export const CollectionGeneticsEngine: React.FC<CollectionGeneticsEngineProps> = ({
  collection,
  onCollectionUpdate,
  onCardInteraction
}) => {
  const [collectionDNA, setCollectionDNA] = useState<CollectionDNA>(
    collection.dna || generateInitialDNA(collection)
  );
  const [dnaVisualization, setDnaVisualization] = useState<DNAStrand[]>([]);
  const [evolutionProgress, setEvolutionProgress] = useState(0);
  const [mutations, setMutations] = useState<string[]>([]);

  // Generate initial DNA based on collection characteristics
  function generateInitialDNA(collection: any): CollectionDNA {
    const cards = collection.cards || [];
    
    // Calculate creativity from diversity of rarities and themes
    const rarityTypes = new Set(cards.map((c: any) => c.rarity)).size;
    const themeTypes = new Set(cards.flatMap((c: any) => c.tags || [])).size;
    const creativity = Math.min((rarityTypes + themeTypes) / 10, 1);

    // Calculate rarity from average card rarity
    const rarityValues = { common: 0.1, uncommon: 0.3, rare: 0.6, epic: 0.8, legendary: 1.0 };
    const avgRarity = cards.reduce((sum: number, card: any) => 
      sum + (rarityValues[card.rarity as keyof typeof rarityValues] || 0.1), 0) / cards.length;

    // Extract themes and styles
    const allTags = cards.flatMap((c: any) => c.tags || []);
    const themeFreq = allTags.reduce((freq: any, tag: string) => {
      freq[tag] = (freq[tag] || 0) + 1;
      return freq;
    }, {});
    
    const dominantThemes = Object.entries(themeFreq)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([theme]) => theme);

    return {
      creativity,
      rarity: avgRarity,
      theme_coherence: dominantThemes.length > 0 ? 0.8 : 0.3,
      artistic_style: dominantThemes,
      color_palette: extractColorPalette(cards),
      interaction_patterns: ['synergy', 'evolution'],
      evolution_potential: Math.random() * 0.5 + 0.5,
      genetic_stability: Math.random() * 0.3 + 0.7
    };
  }

  function extractColorPalette(cards: any[]): string[] {
    // Simplified color extraction - in real implementation would analyze card images
    const themeColors: Record<string, string[]> = {
      fire: ['#ff4444', '#ff8800', '#ffaa00'],
      water: ['#4488ff', '#0066cc', '#88ccff'],
      nature: ['#44aa44', '#66cc66', '#88dd88'],
      dark: ['#333333', '#666666', '#444444'],
      light: ['#ffffff', '#ffffcc', '#ffcccc']
    };

    const palette = new Set<string>();
    cards.forEach(card => {
      const tags = card.tags || [];
      tags.forEach((tag: string) => {
        if (themeColors[tag]) {
          themeColors[tag].forEach(color => palette.add(color));
        }
      });
    });

    return Array.from(palette).slice(0, 5);
  }

  // Generate DNA strands for visualization
  useEffect(() => {
    const strands: DNAStrand[] = [
      {
        gene: 'creativity',
        strength: collectionDNA.creativity,
        expression: collectionDNA.creativity > 0.7 ? 'dominant' : 'recessive',
        mutations: []
      },
      {
        gene: 'rarity',
        strength: collectionDNA.rarity,
        expression: collectionDNA.rarity > 0.6 ? 'dominant' : 'recessive',
        mutations: []
      },
      {
        gene: 'theme_coherence',
        strength: collectionDNA.theme_coherence,
        expression: collectionDNA.theme_coherence > 0.5 ? 'dominant' : 'recessive',
        mutations: []
      },
      {
        gene: 'evolution_potential',
        strength: collectionDNA.evolution_potential,
        expression: collectionDNA.evolution_potential > 0.7 ? 'dominant' : 'recessive',
        mutations: []
      }
    ];

    setDnaVisualization(strands);
  }, [collectionDNA]);

  // DNA Helix visualization
  const renderDNAHelix = () => {
    const helixRadius = 3;
    const helixHeight = 15;
    const turns = 4;
    const pointsPerTurn = 20;
    const totalPoints = turns * pointsPerTurn;

    const strand1Points = [];
    const strand2Points = [];
    const basePairs = [];

    for (let i = 0; i < totalPoints; i++) {
      const t = i / totalPoints;
      const angle1 = t * turns * Math.PI * 2;
      const angle2 = angle1 + Math.PI;
      const y = (t - 0.5) * helixHeight;

      const point1 = new THREE.Vector3(
        Math.cos(angle1) * helixRadius,
        y,
        Math.sin(angle1) * helixRadius
      );
      
      const point2 = new THREE.Vector3(
        Math.cos(angle2) * helixRadius,
        y,
        Math.sin(angle2) * helixRadius
      );

      strand1Points.push(point1);
      strand2Points.push(point2);

      if (i % 5 === 0) {
        basePairs.push([point1, point2]);
      }
    }

    return (
      <group>
        {/* DNA Strands */}
        <Line
          points={strand1Points}
          color="#4a90e2"
          lineWidth={3}
        />
        <Line
          points={strand2Points}
          color="#e24a90" 
          lineWidth={3}
        />

        {/* Base Pairs */}
        {basePairs.map((pair, index) => (
          <Line
            key={index}
            points={pair}
            color="#ffffff"
            lineWidth={1}
            transparent
            opacity={0.6}
          />
        ))}

        {/* Gene Markers */}
        {dnaVisualization.map((strand, index) => {
          const markerY = (index / dnaVisualization.length - 0.5) * helixHeight;
          const color = strand.expression === 'dominant' ? '#22c55e' : '#fbbf24';
          
          return (
            <group key={strand.gene} position={[helixRadius + 2, markerY, 0]}>
              <Sphere args={[0.3]}>
                <meshBasicMaterial color={color} />
              </Sphere>
              
              <Text
                position={[1, 0, 0]}
                fontSize={0.4}
                color="white"
                anchorX="center"
                anchorY="middle"
              >
                {strand.gene.toUpperCase()}
              </Text>
              
              <Text
                position={[1, -0.5, 0]}
                fontSize={0.25}
                color={color}
                anchorX="center"
                anchorY="middle"
              >
                {Math.round(strand.strength * 100)}% {strand.expression}
              </Text>
            </group>
          );
        })}
      </group>
    );
  };

  // Genetic influence on new cards
  const influenceNewCard = (baseCard: any) => {
    const influenced = { ...baseCard };
    
    // Apply genetic influences
    if (collectionDNA.creativity > 0.7) {
      influenced.effects = [...(influenced.effects || []), 'creative_boost'];
    }
    
    if (collectionDNA.rarity > 0.6) {
      const rarityBoost = ['uncommon', 'rare', 'epic'];
      if (rarityBoost.includes(influenced.rarity)) {
        const currentIndex = rarityBoost.indexOf(influenced.rarity);
        if (currentIndex < rarityBoost.length - 1) {
          influenced.rarity = rarityBoost[currentIndex + 1];
        }
      }
    }
    
    // Add genetic tags
    if (collectionDNA.artistic_style.length > 0) {
      influenced.tags = [
        ...(influenced.tags || []),
        ...collectionDNA.artistic_style.slice(0, 2)
      ];
    }

    return influenced;
  };

  // Trigger mutations based on collection events
  const triggerMutation = (event: string) => {
    const newMutations = [...mutations];
    
    switch (event) {
      case 'rare_card_added':
        newMutations.push('rarity_amplification');
        setCollectionDNA(prev => ({
          ...prev,
          rarity: Math.min(prev.rarity * 1.1, 1.0)
        }));
        break;
        
      case 'theme_diversification':
        newMutations.push('creative_explosion'); 
        setCollectionDNA(prev => ({
          ...prev,
          creativity: Math.min(prev.creativity * 1.2, 1.0),
          theme_coherence: Math.max(prev.theme_coherence * 0.9, 0.1)
        }));
        break;
        
      case 'set_completion':
        newMutations.push('coherence_boost');
        setCollectionDNA(prev => ({
          ...prev,
          theme_coherence: Math.min(prev.theme_coherence * 1.3, 1.0)
        }));
        break;
    }
    
    setMutations(newMutations);
    onCardInteraction('genetic_mutation', { mutations: newMutations, dna: collectionDNA });
  };

  return (
    <group>
      {/* Main DNA Helix */}
      <group position={[0, 0, 0]}>
        {renderDNAHelix()}
      </group>

      {/* Collection Stats Panel */}
      <group position={[-15, 8, 0]}>
        <RoundedBox args={[8, 6, 0.2]} radius={0.2}>
          <meshStandardMaterial color="#1a1a2e" transparent opacity={0.9} />
        </RoundedBox>
        
        <Text
          position={[0, 2, 0.2]}
          fontSize={0.6}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          COLLECTION DNA
        </Text>

        <Text
          position={[0, 1, 0.2]}
          fontSize={0.3}
          color="#4a90e2"
          anchorX="center"
          anchorY="middle"
        >
          Creativity: {Math.round(collectionDNA.creativity * 100)}%
        </Text>

        <Text
          position={[0, 0.5, 0.2]}
          fontSize={0.3}
          color="#e24a90"
          anchorX="center"
          anchorY="middle"
        >
          Rarity: {Math.round(collectionDNA.rarity * 100)}%
        </Text>

        <Text
          position={[0, 0, 0.2]}
          fontSize={0.3}
          color="#22c55e"
          anchorX="center"
          anchorY="middle"
        >
          Coherence: {Math.round(collectionDNA.theme_coherence * 100)}%
        </Text>

        <Text
          position={[0, -0.5, 0.2]}
          fontSize={0.3}
          color="#fbbf24"
          anchorX="center"
          anchorY="middle"
        >
          Evolution: {Math.round(collectionDNA.evolution_potential * 100)}%
        </Text>

        <Text
          position={[0, -1.5, 0.2]}
          fontSize={0.25}
          color="#a0a0a0"
          anchorX="center"
          anchorY="middle"
        >
          Mutations: {mutations.length}
        </Text>
      </group>

      {/* Genetic Influence Visualization */}
      <group position={[15, 0, 0]}>
        <Text
          position={[0, 8, 0]}
          fontSize={0.8}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          GENETIC INFLUENCE
        </Text>

        {collectionDNA.artistic_style.map((style, index) => (
          <group key={style} position={[0, 6 - index * 2, 0]}>
            <RoundedBox args={[6, 1, 0.2]} radius={0.1}>
              <meshStandardMaterial 
                color="#2a2a4e" 
                emissive="#4a4a8e" 
                emissiveIntensity={0.2} 
              />
            </RoundedBox>
            
            <Text
              position={[0, 0, 0.2]}
              fontSize={0.4}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {style.toUpperCase()}
            </Text>
          </group>
        ))}

        {/* Evolution Preview */}
        <group position={[0, -2, 0]}>
          <Text
            position={[0, 0, 0]}
            fontSize={0.4}
            color="#a855f7"
            anchorX="center"
            anchorY="middle"
          >
            Next Evolution in {Math.round((1 - evolutionProgress) * 100)} cards
          </Text>
        </group>
      </group>

      {/* Mutation Effects */}
      {mutations.slice(-3).map((mutation, index) => (
        <group key={mutation} position={[0, -10 - index * 2, 0]}>
          <Sphere args={[1]}>
            <meshBasicMaterial color="#ff6b6b" transparent opacity={0.6} />
          </Sphere>
          
          <Text
            position={[0, 0, 0]}
            fontSize={0.3}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {mutation.replace('_', ' ').toUpperCase()}
          </Text>
        </group>
      ))}
    </group>
  );
};
