
import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { ParticleAssembly } from '../effects/ParticleAssembly';
import { DynamicLighting } from '../lighting/DynamicLighting';
import { CardMaterialSystem } from '../materials/CardMaterialSystem';

interface DimensionalCard3DProps {
  card: any;
  environment: 'cosmic' | 'studio' | 'bedroom' | 'mathematical';
  isAssembling?: boolean;
  breatheIntensity?: number;
  onAssemblyComplete?: () => void;
}

export const DimensionalCard3D: React.FC<DimensionalCard3DProps> = ({
  card,
  environment,
  isAssembling = false,
  breatheIntensity = 0.02,
  onAssemblyComplete
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [assembled, setAssembled] = useState(!isAssembling);
  const [deviceOrientation, setDeviceOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const { viewport } = useThree();

  // Device orientation for dynamic lighting
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      setDeviceOrientation({
        alpha: event.alpha || 0,
        beta: event.beta || 0,
        gamma: event.gamma || 0
      });
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  // Breathing animation
  const { breatheScale } = useSpring({
    breatheScale: assembled ? 1 : 0,
    config: { tension: 20, friction: 10 },
    loop: assembled,
    reset: true
  });

  // Card assembly animation
  const { assemblyProgress } = useSpring({
    assemblyProgress: isAssembling ? 1 : 0,
    config: { duration: 3000 },
    onRest: () => {
      if (isAssembling) {
        setAssembled(true);
        onAssemblyComplete?.();
      }
    }
  });

  // Breathing effect
  useFrame((state, delta) => {
    if (meshRef.current && assembled) {
      const breathe = Math.sin(state.clock.elapsedTime * 1.5) * breatheIntensity;
      const scale = 1 + breathe;
      meshRef.current.scale.setScalar(scale);
    }
  });

  // Card dimensions based on viewport
  const cardDimensions = {
    width: Math.min(2.5, viewport.width * 0.4),
    height: Math.min(3.5, viewport.height * 0.5),
    depth: 0.05
  };

  return (
    <group ref={groupRef}>
      {/* Particle assembly effect */}
      {isAssembling && (
        <ParticleAssembly
          targetPosition={[0, 0, 0]}
          targetDimensions={cardDimensions}
          progress={assemblyProgress.get()}
          particleCount={200}
        />
      )}

      {/* Dynamic lighting system */}
      <DynamicLighting
        environment={environment}
        deviceOrientation={deviceOrientation}
        cardPosition={[0, 0, 0]}
      />

      {/* Main card mesh */}
      <animated.mesh
        ref={meshRef}
        scale={breatheScale}
        visible={assembled}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[cardDimensions.width, cardDimensions.height, cardDimensions.depth]} />
        <CardMaterialSystem
          card={card}
          environment={environment}
          deviceOrientation={deviceOrientation}
        />
      </animated.mesh>

      {/* Card edges for thickness */}
      {assembled && (
        <group>
          {/* Top edge */}
          <mesh position={[0, cardDimensions.height / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[cardDimensions.width, cardDimensions.depth]} />
            <meshStandardMaterial color="#f0f0f0" />
          </mesh>
          
          {/* Bottom edge */}
          <mesh position={[0, -cardDimensions.height / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[cardDimensions.width, cardDimensions.depth]} />
            <meshStandardMaterial color="#f0f0f0" />
          </mesh>
          
          {/* Left edge */}
          <mesh position={[-cardDimensions.width / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[cardDimensions.depth, cardDimensions.height]} />
            <meshStandardMaterial color="#f0f0f0" />
          </mesh>
          
          {/* Right edge */}
          <mesh position={[cardDimensions.width / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[cardDimensions.depth, cardDimensions.height]} />
            <meshStandardMaterial color="#f0f0f0" />
          </mesh>
        </group>
      )}
    </group>
  );
};
