
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
      slabRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      slabRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  return (
    <group
      ref={slabRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <SlabGeometry />

      {/* Card Image */}
      {cardImage && (
        <mesh ref={cardRef} position={[0, 0.2, 0.13]}>
          <planeGeometry args={[2.5, 3.5]} />
          <CardTexture imageUrl={cardImage} />
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
