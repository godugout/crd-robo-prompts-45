
import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';
import type { CardData } from '@/types/card';
import * as THREE from 'three';

interface Advanced3DCardRendererProps {
  card: CardData;
  rotation: { x: number; y: number };
  zoom: number;
  materialSettings: {
    metalness: number;
    roughness: number;
    clearcoat: number;
    transmission: number;
    reflectivity: number;
  };
  effectValues?: Record<string, Record<string, any>>;
  selectedFrame?: string;
  frameConfig?: any;
}

interface EffectMaterialData {
  material: THREE.Material;
  offset: number;
}

export const Advanced3DCardRenderer: React.FC<Advanced3DCardRendererProps> = ({
  card,
  rotation,
  zoom,
  materialSettings,
  effectValues = {},
  selectedFrame,
  frameConfig
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const backMeshRef = useRef<THREE.Mesh>(null);
  const edgeRefs = useRef<THREE.Mesh[]>([]);
  const effectLayerRefs = useRef<THREE.Mesh[]>([]);
  const frameRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  
  // Calculate responsive card size
  const cardDimensions = useMemo(() => {
    const aspectRatio = 3.5 / 2.5;
    const maxWidth = viewport.width * 0.6;
    const maxHeight = viewport.height * 0.7;
    
    let width, height;
    
    if (maxWidth * aspectRatio <= maxHeight) {
      width = maxWidth;
      height = maxWidth * aspectRatio;
    } else {
      height = maxHeight;
      width = maxHeight / aspectRatio;
    }
    
    return {
      width: Math.max(2, width),
      height: Math.max(2.8, height),
      depth: 0.05
    };
  }, [viewport.width, viewport.height]);

  // Load textures
  const frontImageUrl = useMemo(() => {
    if (!card?.image_url || typeof card.image_url !== 'string') {
      return '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png';
    }
    return card.image_url;
  }, [card?.image_url]);

  const backImageUrl = '/lovable-uploads/b3f6335f-9e0a-4a64-a665-15d04f456d50.png';

  const frontTexture = useLoader(TextureLoader, frontImageUrl);
  const backTexture = useLoader(TextureLoader, backImageUrl);

  // Create effect materials with proper typing
  const effectMaterials = useMemo(() => {
    const materials: EffectMaterialData[] = [];
    let layerOffset = 0.001; // Very small offset between layers

    // Holographic effect
    if (effectValues.holographic?.intensity > 0) {
      const intensity = effectValues.holographic.intensity / 100;
      const holographicMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(1, 1, 1),
        metalness: 0.9,
        roughness: 0.05,
        transmission: 0.1,
        opacity: intensity * 0.4,
        transparent: true,
        clearcoat: 1.0,
        clearcoatRoughness: 0.0,
        reflectivity: 1.0,
        envMapIntensity: 2.0
      });
      materials.push({ material: holographicMaterial, offset: layerOffset });
      layerOffset += 0.001;
    }

    // Chrome effect
    if (effectValues.chrome?.intensity > 0) {
      const intensity = effectValues.chrome.intensity / 100;
      const chromeMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0.8, 0.8, 0.9),
        metalness: 1.0,
        roughness: 0.02,
        opacity: intensity * 0.6,
        transparent: true,
        clearcoat: 1.0,
        clearcoatRoughness: 0.0,
        reflectivity: 1.0,
        envMapIntensity: 3.0
      });
      materials.push({ material: chromeMaterial, offset: layerOffset });
      layerOffset += 0.001;
    }

    // Gold effect
    if (effectValues.gold?.intensity > 0) {
      const intensity = effectValues.gold.intensity / 100;
      const goldMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(1.0, 0.84, 0.0),
        metalness: 1.0,
        roughness: 0.1,
        opacity: intensity * 0.7,
        transparent: true,
        clearcoat: 0.8,
        clearcoatRoughness: 0.1,
        reflectivity: 0.9,
        envMapIntensity: 2.5
      });
      materials.push({ material: goldMaterial, offset: layerOffset });
      layerOffset += 0.001;
    }

    // Crystal effect
    if (effectValues.crystal?.intensity > 0) {
      const intensity = effectValues.crystal.intensity / 100;
      const crystalMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0.95, 0.95, 1.0),
        metalness: 0.0,
        roughness: 0.0,
        transmission: 0.3,
        opacity: intensity * 0.3,
        transparent: true,
        clearcoat: 1.0,
        clearcoatRoughness: 0.0,
        reflectivity: 1.0,
        envMapIntensity: 2.0
      });
      materials.push({ material: crystalMaterial, offset: layerOffset });
      layerOffset += 0.001;
    }

    return materials;
  }, [effectValues]);

  // Animation
  useFrame(() => {
    if (meshRef.current && backMeshRef.current) {
      const rotX = (rotation.x * Math.PI) / 180;
      const rotY = (rotation.y * Math.PI) / 180;
      
      // Apply rotation to main meshes
      meshRef.current.rotation.x = rotX;
      meshRef.current.rotation.y = rotY;
      backMeshRef.current.rotation.x = rotX;
      backMeshRef.current.rotation.y = rotY;
      
      // Apply rotation to edges
      edgeRefs.current.forEach(edge => {
        if (edge) {
          edge.rotation.x = rotX;
          edge.rotation.y = rotY;
        }
      });

      // Apply rotation to effect layers
      effectLayerRefs.current.forEach(layer => {
        if (layer) {
          layer.rotation.x = rotX;
          layer.rotation.y = rotY;
        }
      });

      // Apply rotation to frame
      if (frameRef.current) {
        frameRef.current.rotation.x = rotX;
        frameRef.current.rotation.y = rotY;
      }
    }
  });

  return (
    <group scale={zoom} position={[0, 0, 0]}>
      {/* Card Front */}
      <mesh
        ref={meshRef}
        position={[0, 0, cardDimensions.depth / 2]}
        castShadow
        receiveShadow
      >
        <planeGeometry args={[cardDimensions.width, cardDimensions.height]} />
        <meshStandardMaterial
          map={frontTexture}
          transparent
          opacity={0.95}
          side={THREE.FrontSide}
          metalness={materialSettings.metalness}
          roughness={materialSettings.roughness}
        />
      </mesh>

      {/* Card Back */}
      <mesh
        ref={backMeshRef}
        position={[0, 0, -cardDimensions.depth / 2]}
        rotation={[0, Math.PI, 0]}
        castShadow
        receiveShadow
      >
        <planeGeometry args={[cardDimensions.width, cardDimensions.height]} />
        <meshStandardMaterial
          map={backTexture}
          transparent
          opacity={0.95}
          side={THREE.FrontSide}
          metalness={materialSettings.metalness}
          roughness={materialSettings.roughness}
        />
      </mesh>

      {/* Effect Layers - Parallel and close to card surface */}
      {effectMaterials.map((effectData, index) => (
        <mesh
          key={index}
          ref={el => el && (effectLayerRefs.current[index] = el)}
          position={[0, 0, cardDimensions.depth / 2 + effectData.offset]}
        >
          <planeGeometry args={[cardDimensions.width, cardDimensions.height]} />
          <primitive object={effectData.material} />
        </mesh>
      ))}

      {/* Frame Layer */}
      {selectedFrame && (
        <mesh
          ref={frameRef}
          position={[0, 0, cardDimensions.depth / 2 + (effectMaterials.length + 1) * 0.001]}
        >
          <planeGeometry args={[cardDimensions.width * 1.05, cardDimensions.height * 1.05]} />
          <meshStandardMaterial
            color="#ffd700"
            transparent
            opacity={0.8}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      )}

      {/* Card Edges for thickness */}
      <mesh
        ref={el => el && (edgeRefs.current[0] = el)}
        position={[0, cardDimensions.height / 2, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[cardDimensions.width, cardDimensions.depth]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <mesh
        ref={el => el && (edgeRefs.current[1] = el)}
        position={[0, -cardDimensions.height / 2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[cardDimensions.width, cardDimensions.depth]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <mesh
        ref={el => el && (edgeRefs.current[2] = el)}
        position={[-cardDimensions.width / 2, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <planeGeometry args={[cardDimensions.depth, cardDimensions.height]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <mesh
        ref={el => el && (edgeRefs.current[3] = el)}
        position={[cardDimensions.width / 2, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <planeGeometry args={[cardDimensions.depth, cardDimensions.height]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};
