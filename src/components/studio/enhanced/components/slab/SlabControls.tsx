
import React from 'react';
import { OrbitControls } from '@react-three/drei';

export const SlabControls: React.FC = () => {
  return (
    <OrbitControls
      enablePan={false}
      enableZoom={true}
      enableRotate={true}
      minDistance={4}
      maxDistance={10}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI - Math.PI / 6}
      autoRotate={false}
      dampingFactor={0.05}
      enableDamping
    />
  );
};
