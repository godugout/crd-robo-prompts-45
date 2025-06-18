
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
    <div className="w-full h-full min-h-[700px] bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden">
      <Canvas
        camera={{ 
          position: [0, 0, 8], 
          fov: 35,
          near: 0.1,
          far: 1000
        }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        shadows
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
