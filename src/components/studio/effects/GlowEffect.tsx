
import React from 'react';
import * as THREE from 'three';

interface GlowEffectProps {
  intensity: number;
  color: string;
  enabled: boolean;
  children: React.ReactNode;
}

export const GlowEffect: React.FC<GlowEffectProps> = ({ intensity, color, enabled, children }) => {
  if (!enabled) return <>{children}</>;
  
  return (
    <group>
      {children}
      {/* Outer glow */}
      <mesh scale={[1.1, 1.1, 1.1]}>
        <boxGeometry args={[2.5, 3.5, 0.1]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={intensity / 200}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Inner glow */}
      <mesh scale={[1.05, 1.05, 1.05]}>
        <boxGeometry args={[2.5, 3.5, 0.1]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={intensity / 300}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};
