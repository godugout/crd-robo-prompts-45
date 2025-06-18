
import React from 'react';
import { OrbitControls } from '@react-three/drei';

export const SlabControls: React.FC = () => {
  return (
    <OrbitControls
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={5}
      maxDistance={15}
      minPolarAngle={Math.PI / 8}
      maxPolarAngle={Math.PI - Math.PI / 8}
      minAzimuthAngle={-Math.PI / 3}
      maxAzimuthAngle={Math.PI / 3}
      autoRotate={false}
      autoRotateSpeed={0.5}
      dampingFactor={0.08}
      enableDamping
      rotateSpeed={0.8}
      zoomSpeed={0.6}
      panSpeed={0.8}
      target={[0, 0, 0]}
    />
  );
};
