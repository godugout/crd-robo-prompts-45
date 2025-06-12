
import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  PerspectiveCamera,
  useTexture,
  Sparkles
} from '@react-three/drei';
import * as THREE from 'three';
import type { CardData } from '@/hooks/useCardEditor';

// Advanced holographic shader material
const HolographicMaterial = ({ texture }: { texture: THREE.Texture | null }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform float uHolographicIntensity;
    uniform float uRainbowIntensity;
    uniform float uShimmerSpeed;
    uniform sampler2D uTexture;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    
    vec3 hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }
    
    void main() {
      vec4 texColor = texture2D(uTexture, vUv);
      
      // Holographic rainbow effect
      float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
      float rainbow = sin(angle * 6.0 + uTime * uShimmerSpeed) * 0.5 + 0.5;
      vec3 rainbowColor = hsv2rgb(vec3(rainbow, 0.8, 1.0));
      
      // Fresnel effect for edge glow
      vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
      float fresnel = 1.0 - max(0.0, dot(viewDirection, vNormal));
      fresnel = pow(fresnel, 2.0);
      
      // Shimmer effect
      float shimmer = sin(vUv.x * 20.0 + uTime * 2.0) * sin(vUv.y * 20.0 + uTime * 1.5) * 0.1 + 0.9;
      
      // Combine effects
      vec3 holographicEffect = rainbowColor * uRainbowIntensity * fresnel;
      vec3 finalColor = mix(texColor.rgb, texColor.rgb + holographicEffect, uHolographicIntensity);
      finalColor *= shimmer;
      
      gl_FragColor = vec4(finalColor, texColor.a);
    }
  `;

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uHolographicIntensity: { value: 0.5 },
    uRainbowIntensity: { value: 0.7 },
    uShimmerSpeed: { value: 2.0 },
    uTexture: { value: texture }
  }), [texture]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  useEffect(() => {
    if (materialRef.current && texture) {
      materialRef.current.uniforms.uTexture.value = texture;
    }
  }, [texture]);

  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={uniforms}
      transparent={true}
    />
  );
};

// Simple fallback texture component
const SimpleFallbackTexture = () => {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0f4c3a';
      ctx.fillRect(0, 0, 256, 256);
      ctx.fillStyle = '#ffd700';
      ctx.font = '32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('A', 128, 140);
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);
};

// 3D Card component with advanced effects
const Card3D = ({ 
  cardData, 
  imageUrl, 
  effects 
}: { 
  cardData: CardData;
  imageUrl?: string;
  effects: any;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Always create fallback texture
  const fallbackTexture = SimpleFallbackTexture();
  
  // Always call useTexture hook with fallback
  const loadedTexture = useTexture(imageUrl || '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png');
  
  // Use loaded texture if we have a valid imageUrl, otherwise use fallback
  const texture = imageUrl ? loadedTexture : fallbackTexture;
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      
      // Auto-rotate when not hovered
      if (!hovered) {
        meshRef.current.rotation.y += 0.005;
      }
    }
  });

  return (
    <group>
      {/* Main card mesh */}
      <mesh
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        scale={hovered ? 1.05 : 1}
      >
        <planeGeometry args={[2.5, 3.5, 32, 32]} />
        {effects.holographic ? (
          <HolographicMaterial texture={texture} />
        ) : (
          <meshStandardMaterial 
            map={texture}
            metalness={effects.metalness || 0.1}
            roughness={effects.roughness || 0.4}
          />
        )}
      </mesh>
      
      {/* Particle effects */}
      {effects.particles && (
        <Sparkles
          count={50}
          scale={3}
          size={2}
          speed={0.5}
          color="gold"
        />
      )}
      
      {/* Glow effect */}
      {effects.glow && (
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[3, 4]} />
          <meshBasicMaterial 
            color={effects.glowColor || '#00ffff'}
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
    </group>
  );
};

interface Advanced3DCardRendererProps {
  cardData: CardData;
  imageUrl?: string;
  effects?: {
    holographic?: boolean;
    metalness?: number;
    roughness?: number;
    particles?: boolean;
    glow?: boolean;
    glowColor?: string;
  };
  onInteraction?: (type: string, data: any) => void;
}

export const Advanced3DCardRenderer: React.FC<Advanced3DCardRendererProps> = ({
  cardData,
  imageUrl,
  effects = {},
  onInteraction
}) => {
  return (
    <div className="w-full h-full relative">
      <Canvas 
        shadows 
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        
        {/* Advanced lighting setup */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -5]} color="#ff00ff" intensity={0.5} />
        <pointLight position={[10, -10, -5]} color="#00ffff" intensity={0.5} />
        
        {/* Environment for reflections */}
        <Environment preset="studio" />
        
        {/* 3D Card */}
        <Card3D 
          cardData={cardData}
          imageUrl={imageUrl}
          effects={effects}
        />
        
        {/* Camera controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={8}
          autoRotate={false}
        />
      </Canvas>
      
      {/* Overlay UI for 3D controls */}
      <div className="absolute top-4 right-4 bg-black/80 p-3 rounded-lg text-white">
        <div className="text-xs space-y-1">
          <div>Drag to rotate</div>
          <div>Scroll to zoom</div>
          <div>Hover for effects</div>
        </div>
      </div>
    </div>
  );
};
