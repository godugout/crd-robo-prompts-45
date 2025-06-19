
import React from 'react';
import type { EffectMaterialData } from '../hooks/useEffectMaterials';

interface EffectLayersProps {
  effectMaterials: EffectMaterialData[];
  dimensions: { width: number; height: number; depth: number };
}

export const EffectLayers: React.FC<EffectLayersProps> = ({
  effectMaterials,
  dimensions
}) => {
  return (
    <>
      {effectMaterials.map((effectData, index) => (
        <mesh
          key={index}
          position={[0, 0, dimensions.depth / 2 + effectData.offset]}
        >
          <planeGeometry args={[dimensions.width, dimensions.height]} />
          <primitive object={effectData.material} />
        </mesh>
      ))}
    </>
  );
};
