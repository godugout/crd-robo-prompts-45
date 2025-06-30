
import React, { useState, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { DimensionalCard3D } from '../core/DimensionalCard3D';

interface CardFusionSystemProps {
  card1: any;
  card2: any;
  fusionProgress: number;
  onFusionComplete?: (fusedCard: any) => void;
}

export const CardFusionSystem: React.FC<CardFusionSystemProps> = ({
  card1,
  card2,
  fusionProgress,
  onFusionComplete
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [fusedCard, setFusedCard] = useState<any>(null);
  const { viewport } = useThree();

  // Animation springs
  const { card1Position, card2Position, fusionScale, energyIntensity } = useSpring({
    card1Position: fusionProgress > 0 ? [-1, 0, 0] : [-3, 0, 0],
    card2Position: fusionProgress > 0 ? [1, 0, 0] : [3, 0, 0],
    fusionScale: fusionProgress > 0.8 ? 1.2 : 1,
    energyIntensity: fusionProgress,
    config: { tension: 80, friction: 20 }
  });

  // Create fused card when fusion is complete
  React.useEffect(() => {
    if (fusionProgress >= 1 && !fusedCard) {
      const newFusedCard = {
        id: `fused_${card1.id}_${card2.id}`,
        title: `${card1.title} × ${card2.title}`,
        description: `Fusion of ${card1.title} and ${card2.title}`,
        image_url: card1.image_url, // Primary image
        rarity: 'legendary',
        fusionData: {
          card1: card1,
          card2: card2,
          fusionType: 'hybrid'
        }
      };
      
      setFusedCard(newFusedCard);
      onFusionComplete?.(newFusedCard);
    }
  }, [fusionProgress, card1, card2, fusedCard, onFusionComplete]);

  // Fusion energy particles
  const particleCount = 100;
  const particleGeometry = React.useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;

      const color = new THREE.Color().setHSL(0.1 + Math.random() * 0.8, 1, 0.5);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = Math.random() * 3 + 1;
    }

    return { positions, colors, sizes };
  }, []);

  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    if (particlesRef.current && fusionProgress > 0) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        // Swirl particles towards center
        const centerX = 0;
        const centerY = 0;
        const centerZ = 0;
        
        const currentX = positions[i * 3];
        const currentY = positions[i * 3 + 1];
        const currentZ = positions[i * 3 + 2];
        
        const towardsCenter = new THREE.Vector3(
          centerX - currentX,
          centerY - currentY,
          centerZ - currentZ
        ).normalize().multiplyScalar(delta * fusionProgress * 2);
        
        positions[i * 3] += towardsCenter.x;
        positions[i * 3 + 1] += towardsCenter.y;
        positions[i * 3 + 2] += towardsCenter.z;
        
        // Add swirling motion
        const angle = state.clock.elapsedTime * 3 + i * 0.1;
        positions[i * 3] += Math.cos(angle) * 0.1 * fusionProgress;
        positions[i * 3 + 1] += Math.sin(angle) * 0.1 * fusionProgress;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Card 1 */}
      {fusionProgress < 1 && (
        <animated.group 
          position={card1Position as any}
          scale={fusionScale}
        >
          <DimensionalCard3D
            card={card1}
            environment="cosmic"
            breatheIntensity={0.03}
          />
        </animated.group>
      )}

      {/* Card 2 */}
      {fusionProgress < 1 && (
        <animated.group 
          position={card2Position as any}
          scale={fusionScale}
        >
          <DimensionalCard3D
            card={card2}
            environment="cosmic"
            breatheIntensity={0.03}
          />
        </animated.group>
      )}

      {/* Fusion energy particles */}
      {fusionProgress > 0 && fusionProgress < 1 && (
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particleCount}
              array={particleGeometry.positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={particleCount}
              array={particleGeometry.colors}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-size"
              count={particleCount}
              array={particleGeometry.sizes}
              itemSize={1}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.2}
            vertexColors
            transparent
            opacity={energyIntensity.get()}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}

      {/* Energy beam between cards */}
      {fusionProgress > 0 && fusionProgress < 1 && (
        <mesh>
          <cylinderGeometry args={[0.05, 0.05, 6, 8]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={fusionProgress * 0.8}
            emissive="#ffff00"
            emissiveIntensity={fusionProgress}
          />
        </mesh>
      )}

      {/* Fused result card */}
      {fusionProgress >= 1 && fusedCard && (
        <DimensionalCard3D
          card={fusedCard}
          environment="cosmic"
          isAssembling={true}
          breatheIntensity={0.05}
        />
      )}
    </group>
  );
};
