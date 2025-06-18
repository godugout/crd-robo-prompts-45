
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CardTexture } from './CardTexture';
import { GradingLabels } from './GradingLabels';
import { SlabGeometry } from './SlabGeometry';

interface GradedSlabMeshProps {
  cardImage?: string;
  cardName: string;
  overallGrade: number;
  centeringGrade: number;
  cornersGrade: number;
  edgesGrade: number;
  surfaceGrade: number;
}

export const GradedSlabMesh: React.FC<GradedSlabMeshProps> = ({
  cardImage,
  cardName,
  overallGrade,
  centeringGrade,
  cornersGrade,
  edgesGrade,
  surfaceGrade
}) => {
  const slabRef = useRef<THREE.Group>(null);
  const cardRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (slabRef.current && !hovered) {
      // Subtle floating animation
      slabRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
      slabRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.03;
      
      // Slight breathing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.002;
      slabRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group
      ref={slabRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.02 : 1}
    >
      <SlabGeometry />

      {/* Card Image - Properly sized and positioned */}
      {cardImage && (
        <mesh 
          ref={cardRef} 
          position={[0, 0.15, 0.145]} 
          castShadow
          receiveShadow
        >
          <planeGeometry args={[3.2, 4.8]} />
          <CardTexture imageUrl={cardImage} />
        </mesh>
      )}

      {/* Placeholder if no image */}
      {!cardImage && (
        <mesh position={[0, 0.15, 0.145]} receiveShadow>
          <planeGeometry args={[3.2, 4.8]} />
          <meshPhysicalMaterial
            color="#f3f4f6"
            roughness={0.3}
            metalness={0.1}
            clearcoat={0.2}
          />
        </mesh>
      )}

      <GradingLabels
        cardName={cardName}
        overallGrade={overallGrade}
        centeringGrade={centeringGrade}
        cornersGrade={cornersGrade}
        edgesGrade={edgesGrade}
        surfaceGrade={surfaceGrade}
      />
    </group>
  );
};
