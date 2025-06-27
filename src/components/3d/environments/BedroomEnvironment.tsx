
import React from 'react';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

interface BedroomEnvironmentProps {
  intensity: number;
}

export const BedroomEnvironment: React.FC<BedroomEnvironmentProps> = ({ intensity }) => {
  return (
    <>
      <Environment preset="sunset" backgroundIntensity={intensity * 0.3} />
      
      {/* Bedroom atmosphere */}
      <ambientLight intensity={0.3 * intensity} color="#ffb366" />
      
      {/* Room walls */}
      <group>
        {/* Back wall */}
        <mesh position={[0, 2, -6]}>
          <planeGeometry args={[12, 8]} />
          <meshStandardMaterial color="#d4c4a8" />
        </mesh>
        
        {/* Floor */}
        <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[12, 12]} />
          <meshStandardMaterial color="#8b7355" />
        </mesh>
        
        {/* Ceiling */}
        <mesh position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[12, 12]} />
          <meshStandardMaterial color="#f5f5dc" />
        </mesh>
      </group>

      {/* Animated posters */}
      <group position={[-4, 3, -5.9]}>
        <mesh>
          <planeGeometry args={[1.5, 2]} />
          <meshStandardMaterial 
            color="#ff6b6b" 
            emissive="#330000" 
            emissiveIntensity={0.2} 
          />
        </mesh>
      </group>

      <group position={[4, 3, -5.9]}>
        <mesh>
          <planeGeometry args={[1.5, 2]} />
          <meshStandardMaterial 
            color="#4ecdc4" 
            emissive="#003333" 
            emissiveIntensity={0.2} 
          />
        </mesh>
      </group>

      {/* Window light */}
      <rectAreaLight
        intensity={5 * intensity}
        width={3}
        height={2}
        color="#ffcc80"
        position={[5, 3, -5]}
        rotation={[0, -Math.PI / 2, 0]}
      />
    </>
  );
};
