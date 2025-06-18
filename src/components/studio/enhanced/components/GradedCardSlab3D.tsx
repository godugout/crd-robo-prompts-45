
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { GradedSlabMesh } from './slab/GradedSlabMesh';
import { SlabLighting } from './slab/SlabLighting';
import { SlabControls } from './slab/SlabControls';

interface GradedCardSlab3DProps {
  cardImage?: string;
  cardName?: string;
  overallGrade?: number;
  centeringGrade?: number;
  cornersGrade?: number;
  edgesGrade?: number;
  surfaceGrade?: number;
  width?: number;
  height?: number;
}

export const GradedCardSlab3D: React.FC<GradedCardSlab3DProps> = ({
  cardImage,
  cardName = "Card Name",
  overallGrade = 9.5,
  centeringGrade = 9,
  cornersGrade = 10,
  edgesGrade = 9,
  surfaceGrade = 10
}) => {
  return (
    <div className="w-full h-full min-h-[500px]">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <SlabLighting />
        
        <GradedSlabMesh
          cardImage={cardImage}
          cardName={cardName}
          overallGrade={overallGrade}
          centeringGrade={centeringGrade}
          cornersGrade={cornersGrade}
          edgesGrade={edgesGrade}
          surfaceGrade={surfaceGrade}
        />

        <SlabControls />
      </Canvas>
    </div>
  );
};
