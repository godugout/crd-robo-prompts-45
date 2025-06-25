
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, MeshDistortMaterial, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import type { CardData } from '@/types/card';
import type { Layer, Effect, Material } from '../hooks/useAdvancedCardStudio';

interface Advanced3DCardProps {
  cardData: CardData;
  layers: Layer[];
  effects: Effect[];
  materials: Material[];
  isPlaying: boolean;
  previewMode: 'design' | 'preview' | 'vr';
}

export const Advanced3DCard: React.FC<Advanced3DCardProps> = ({
  cardData,
  layers,
  effects,
  materials,
  isPlaying,
  previewMode
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Advanced shader material
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        holographic: { value: effects.some(e => e.type === 'holographic' && e.enabled) ? 1.0 : 0.0 },
        chrome: { value: effects.some(e => e.type === 'chrome' && e.enabled) ? 1.0 : 0.0 },
        glow: { value: effects.some(e => e.type === 'glow' && e.enabled) ? 1.0 : 0.0 },
        mouse: { value: new THREE.Vector2() },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          vUv = uv;
          vPosition = position;
          vNormal = normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float holographic;
        uniform float chrome;
        uniform float glow;
        uniform vec2 mouse;
        uniform vec2 resolution;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        vec3 hsv2rgb(vec3 c) {
          vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
          vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
          return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }
        
        void main() {
          vec3 color = vec3(0.1, 0.1, 0.2);
          
          // Holographic effect
          if (holographic > 0.0) {
            float hue = vUv.x + vUv.y + time * 0.1;
            vec3 rainbow = hsv2rgb(vec3(hue, 0.8, 1.0));
            color = mix(color, rainbow, holographic * 0.6);
          }
          
          // Chrome effect
          if (chrome > 0.0) {
            vec3 chromeColor = vec3(0.8, 0.85, 0.9);
            float fresnel = dot(normalize(vNormal), vec3(0, 0, 1));
            color = mix(color, chromeColor, chrome * fresnel);
          }
          
          // Glow effect
          if (glow > 0.0) {
            float glowIntensity = 1.0 - length(vUv - 0.5);
            vec3 glowColor = vec3(0.0, 1.0, 1.0);
            color += glowColor * glow * glowIntensity * 0.3;
          }
          
          // Add subtle animation
          color += sin(time + vPosition.x * 10.0) * 0.02;
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      transparent: true
    });
  }, [effects]);

  // Animation loop
  useFrame((state) => {
    if (meshRef.current && isPlaying) {
      meshRef.current.rotation.y += 0.005;
      shaderMaterial.uniforms.time.value = state.clock.elapsedTime;
      
      // Mouse interaction
      shaderMaterial.uniforms.mouse.value.set(
        state.mouse.x,
        state.mouse.y
      );
    }
    
    if (groupRef.current && previewMode === 'preview') {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <Float
        speed={previewMode === 'preview' ? 2 : 0}
        rotationIntensity={previewMode === 'preview' ? 0.5 : 0}
        floatIntensity={previewMode === 'preview' ? 0.5 : 0}
        enabled={previewMode === 'preview'}
      >
        {/* Main Card Mesh */}
        <mesh ref={meshRef} castShadow receiveShadow>
          <boxGeometry args={[3, 4.2, 0.1]} />
          <primitive object={shaderMaterial} />
        </mesh>
        
        {/* Card Content Layers */}
        {layers.filter(layer => layer.visible).map((layer, index) => (
          <mesh
            key={layer.id}
            position={[
              layer.transform.x,
              layer.transform.y,
              layer.transform.z + 0.051 + index * 0.001
            ]}
            rotation={[
              layer.transform.rotation.x,
              layer.transform.rotation.y,
              layer.transform.rotation.z
            ]}
            scale={[
              layer.transform.scale.x,
              layer.transform.scale.y,
              layer.transform.scale.z
            ]}
          >
            <planeGeometry args={[2.8, 4]} />
            <meshStandardMaterial
              transparent
              opacity={layer.opacity}
              color={layer.data.color || '#ffffff'}
            />
          </mesh>
        ))}
        
        {/* Particle Effects */}
        {effects.filter(e => e.type === 'particle' && e.enabled).map(effect => (
          <Sparkles
            key={effect.id}
            count={50}
            scale={[4, 5, 0.5]}
            size={2}
            speed={0.4}
            opacity={effect.intensity}
            color="#00ffff"
          />
        ))}
        
        {/* Glow Effect */}
        {effects.some(e => e.type === 'glow' && e.enabled) && (
          <mesh position={[0, 0, -0.1]}>
            <boxGeometry args={[3.2, 4.4, 0.05]} />
            <meshStandardMaterial
              emissive="#00ffff"
              emissiveIntensity={0.2}
              transparent
              opacity={0.3}
            />
          </mesh>
        )}
      </Float>
    </group>
  );
};
