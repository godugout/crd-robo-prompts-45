
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const useCardRotation = (rotation: { x: number; y: number }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      const rotX = (rotation.x * Math.PI) / 180;
      const rotY = (rotation.y * Math.PI) / 180;
      
      groupRef.current.rotation.x = rotX;
      groupRef.current.rotation.y = rotY;
    }
  });

  return groupRef;
};
