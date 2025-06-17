
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

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

const CardTexture: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
  const texture = new THREE.TextureLoader().load(imageUrl);
  texture.flipY = false;
  return <meshStandardMaterial map={texture} />;
};

const GradedSlabMesh: React.FC<GradedCardSlab3DProps> = ({
  cardImage,
  cardName = "Card Name",
  overallGrade = 9.5,
  centeringGrade = 9,
  cornersGrade = 10,
  edgesGrade = 9,
  surfaceGrade = 10
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
      {/* Main Slab Case - Clear Plastic */}
      <RoundedBox
        args={[3.2, 4.2, 0.3]}
        radius={0.1}
        smoothness={4}
        position={[0, 0, 0]}
      >
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          transmission={0.95}
          opacity={0.1}
          thickness={0.1}
          roughness={0.05}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          envMapIntensity={1.5}
          ior={1.5}
        />
      </RoundedBox>

      {/* Card Holder Cavity */}
      <RoundedBox
        args={[2.8, 3.8, 0.25]}
        radius={0.05}
        smoothness={4}
        position={[0, 0, 0]}
      >
        <meshPhysicalMaterial
          color="#f8f9fa"
          roughness={0.1}
          metalness={0.05}
          clearcoat={0.3}
        />
      </RoundedBox>

      {/* Card Image */}
      {cardImage && (
        <mesh ref={cardRef} position={[0, 0.2, 0.13]}>
          <planeGeometry args={[2.5, 3.5]} />
          <CardTexture imageUrl={cardImage} />
        </mesh>
      )}

      {/* Grading Label - Top */}
      <group position={[0, 1.8, 0.16]}>
        <RoundedBox args={[2.6, 0.4, 0.02]} radius={0.02}>
          <meshPhysicalMaterial
            color="#1f2937"
            roughness={0.2}
            metalness={0.1}
          />
        </RoundedBox>
        
        {/* Grade Number */}
        <Text
          position={[0, 0, 0.02]}
          fontSize={0.15}
          color="#10b981"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          {overallGrade}
        </Text>
        
        {/* CRD Text */}
        <Text
          position={[-0.8, 0, 0.02]}
          fontSize={0.08}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          CRD
        </Text>
        
        {/* Authenticated Text */}
        <Text
          position={[0.8, 0, 0.02]}
          fontSize={0.06}
          color="#9ca3af"
          anchorX="center"
          anchorY="middle"
        >
          AUTH
        </Text>
      </group>

      {/* Card Name Label */}
      <group position={[0, -1.6, 0.16]}>
        <RoundedBox args={[2.6, 0.3, 0.02]} radius={0.02}>
          <meshPhysicalMaterial
            color="#374151"
            roughness={0.2}
            metalness={0.1"
          />
        </RoundedBox>
        
        <Text
          position={[0, 0, 0.02]}
          fontSize={0.08}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.4}
        >
          {cardName}
        </Text>
      </group>

      {/* Grade Breakdown - Bottom */}
      <group position={[0, -1.9, 0.16]}>
        <Text
          position={[-0.8, 0, 0.01]}
          fontSize={0.05}
          color="#9ca3af"
          anchorX="center"
          anchorY="middle"
        >
          CEN {centeringGrade}
        </Text>
        
        <Text
          position={[-0.3, 0, 0.01]}
          fontSize={0.05}
          color="#9ca3af"
          anchorX="center"
          anchorY="middle"
        >
          COR {cornersGrade}
        </Text>
        
        <Text
          position={[0.2, 0, 0.01]}
          fontSize={0.05}
          color="#9ca3af"
          anchorX="center"
          anchorY="middle"
        >
          EDG {edgesGrade}
        </Text>
        
        <Text
          position={[0.7, 0, 0.01]}
          fontSize={0.05}
          color="#9ca3af"
          anchorX="center"
          anchorY="middle"
        >
          SUR {surfaceGrade}
        </Text>
      </group>

      {/* Holographic Security Strip */}
      <mesh position={[1.3, 0, 0.16]} rotation={[0, 0, 0.2]}>
        <planeGeometry args={[0.1, 2]} />
        <meshPhysicalMaterial
          color="#10b981"
          metalness={0.8}
          roughness={0.1}
          envMapIntensity={2}
          iridescence={1}
          iridescenceIOR={1.3}
          iridescenceThicknessRange={[100, 800]}
        />
      </mesh>
    </group>
  );
};

export const GradedCardSlab3D: React.FC<GradedCardSlab3DProps> = (props) => {
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
        {/* Lighting Setup */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-5, 5, 5]} intensity={0.5} />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={0.5}
          castShadow
        />

        {/* Environment for Reflections */}
        <Environment preset="studio" />

        {/* 3D Slab */}
        <GradedSlabMesh {...props} />

        {/* Camera Controls */}
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
      </Canvas>
    </div>
  );
};
