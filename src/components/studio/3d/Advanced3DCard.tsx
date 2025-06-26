
import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import { TextureLoader } from 'three';
import { Mesh } from 'three';
import * as THREE from 'three';

interface Layer {
  id: string;
  name: string;
  type: 'image' | 'text' | 'shape' | 'effect' | 'frame';
  visible: boolean;
  locked: boolean;
  opacity: number;
  transform: {
    x: number;
    y: number;
    z: number;
    rotation: { x: number; y: number; z: number };
    scale: { x: number; y: number; z: number };
  };
  data: any;
}

interface Effect {
  id: string;
  type: 'holographic' | 'chrome' | 'glow' | 'particle' | 'distortion';
  enabled: boolean;
  intensity: number;
  parameters: Record<string, any>;
}

interface Advanced3DCardProps {
  cardData: {
    title: string;
    description: string;
    image_url: string;
    rarity: string;
    design_metadata?: any;
  };
  layers: Layer[];
  effects: Effect[];
  materials: any[];
  isPlaying: boolean;
  previewMode: string;
}

export const Advanced3DCard: React.FC<Advanced3DCardProps> = ({
  cardData,
  layers,
  effects,
  materials,
  isPlaying,
  previewMode
}) => {
  const meshRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);

  // Load card image texture if available
  let texture;
  try {
    if (cardData.image_url) {
      texture = useLoader(TextureLoader, cardData.image_url);
    }
  } catch (error) {
    console.warn('Failed to load card texture:', error);
  }

  // Determine card color based on rarity
  const rarityColors = {
    common: '#6b7280',
    uncommon: '#10b981',
    rare: '#3b82f6',
    epic: '#8b5cf6',
    legendary: '#f59e0b',
  };

  const cardColor = rarityColors[cardData.rarity as keyof typeof rarityColors] || '#6b7280';

  // Calculate material properties based on effects
  const materialProps = useMemo(() => {
    const holographicEffect = effects.find(e => e.type === 'holographic' && e.enabled);
    const chromeEffect = effects.find(e => e.type === 'chrome' && e.enabled);
    const glowEffect = effects.find(e => e.type === 'glow' && e.enabled);

    let props = {
      roughness: 0.1,
      metalness: 0.2,
      reflectivity: 0.8,
      envMapIntensity: 1,
      emissive: new THREE.Color(0x000000),
      emissiveIntensity: 0
    };

    if (holographicEffect) {
      props.roughness = 0.0;
      props.metalness = 0.9;
      props.reflectivity = 1.0;
      props.envMapIntensity = 2.0 * (holographicEffect.intensity / 100);
    }

    if (chromeEffect) {
      props.roughness = 0.05;
      props.metalness = 1.0;
      props.reflectivity = 1.0;
      props.envMapIntensity = 1.5 * (chromeEffect.intensity / 100);
    }

    if (glowEffect) {
      props.emissive = new THREE.Color(glowEffect.parameters?.color || cardColor);
      props.emissiveIntensity = (glowEffect.intensity / 100) * 0.5;
    }

    return props;
  }, [effects, cardColor]);

  // Animation
  useFrame((state) => {
    if (meshRef.current && isPlaying) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }

    // Animate glow effect
    const glowEffect = effects.find(e => e.type === 'glow' && e.enabled);
    if (glowRef.current && glowEffect) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.5 + 0.5;
      glowRef.current.scale.setScalar(1 + pulse * 0.1 * (glowEffect.intensity / 100));
    }
  });

  // Filter visible layers
  const visibleLayers = layers.filter(layer => layer.visible);
  const imageLayer = visibleLayers.find(layer => layer.type === 'image');
  const textLayers = visibleLayers.filter(layer => layer.type === 'text');

  return (
    <group>
      {/* Main Card Body */}
      <RoundedBox
        ref={meshRef}
        args={[2.5, 3.5, 0.05]}
        radius={0.1}
        smoothness={4}
        castShadow
        receiveShadow
        position={[0, 0, 0]}
      >
        <meshPhysicalMaterial
          color={cardColor}
          map={texture}
          transparent
          opacity={imageLayer ? imageLayer.opacity : 0.95}
          {...materialProps}
        />
      </RoundedBox>

      {/* Image Layer with positioning */}
      {imageLayer && texture && (
        <RoundedBox
          args={[2.4, 3.4, 0.001]}
          radius={0.1}
          position={[
            imageLayer.transform.x,
            imageLayer.transform.y,
            0.026 + imageLayer.transform.z
          ]}
          scale={[
            imageLayer.transform.scale.x,
            imageLayer.transform.scale.y,
            1
          ]}
          rotation={[
            imageLayer.transform.rotation.x,
            imageLayer.transform.rotation.y,
            imageLayer.transform.rotation.z
          ]}
        >
          <meshBasicMaterial
            map={texture}
            transparent
            opacity={imageLayer.opacity}
          />
        </RoundedBox>
      )}

      {/* Text Layers */}
      {textLayers.map((textLayer) => (
        <Text
          key={textLayer.id}
          position={[
            textLayer.transform.x,
            textLayer.transform.y,
            0.05 + textLayer.transform.z
          ]}
          rotation={[
            textLayer.transform.rotation.x,
            textLayer.transform.rotation.y,
            textLayer.transform.rotation.z
          ]}
          scale={[
            textLayer.transform.scale.x,
            textLayer.transform.scale.y,
            textLayer.transform.scale.z
          ]}
          fontSize={textLayer.data?.fontSize || 0.2}
          color={textLayer.data?.color || "white"}
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
          textAlign="center"
          font="/fonts/inter-bold.woff"
          fillOpacity={textLayer.opacity}
        >
          {textLayer.data?.text || cardData.title || 'Card Title'}
        </Text>
      ))}

      {/* Card Back */}
      <RoundedBox
        args={[2.5, 3.5, 0.05]}
        radius={0.1}
        smoothness={4}
        castShadow
        receiveShadow
        position={[0, 0, -0.05]}
        rotation={[0, Math.PI, 0]}
      >
        <meshPhysicalMaterial
          color="#1a1a2e"
          roughness={0.8}
          metalness={0.1}
        />
      </RoundedBox>

      {/* Glow Effect Layer */}
      {effects.find(e => e.type === 'glow' && e.enabled) && (
        <RoundedBox
          ref={glowRef}
          args={[2.55, 3.55, 0.001]}
          radius={0.1}
          position={[0, 0, 0.052]}
        >
          <meshBasicMaterial
            color={effects.find(e => e.type === 'glow')?.parameters?.color || cardColor}
            transparent
            opacity={0.3 * (effects.find(e => e.type === 'glow')?.intensity || 50) / 100}
          />
        </RoundedBox>
      )}

      {/* Holographic Effect for Epic+ rarities or when holographic effect is active */}
      {((cardData.rarity === 'epic' || cardData.rarity === 'legendary') || 
        effects.find(e => e.type === 'holographic' && e.enabled)) && (
        <RoundedBox
          args={[2.52, 3.52, 0.001]}
          radius={0.1}
          position={[0, 0, 0.051]}
        >
          <meshPhysicalMaterial
            color="#ffd700"
            transparent
            opacity={0.2}
            roughness={0}
            metalness={1}
            envMapIntensity={2}
          />
        </RoundedBox>
      )}

      {/* Particle Effects */}
      {effects.find(e => e.type === 'particle' && e.enabled) && (
        <group>
          {Array.from({ length: 20 }).map((_, i) => (
            <mesh
              key={i}
              position={[
                (Math.random() - 0.5) * 3,
                (Math.random() - 0.5) * 4,
                Math.random() * 0.5 + 0.1
              ]}
            >
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial
                color="#ffd700"
                transparent
                opacity={0.6}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};
