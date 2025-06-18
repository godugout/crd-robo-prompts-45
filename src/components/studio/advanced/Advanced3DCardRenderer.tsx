
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

// Enhanced 3D environment background
const EnvironmentBackground = () => {
  const bgRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (bgRef.current) {
      bgRef.current.rotation.z += 0.001;
    }
  });

  return (
    <>
      {/* Animated gradient sphere background */}
      <mesh ref={bgRef} position={[0, 0, -20]} scale={30}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial 
          color={new THREE.Color(0x1a1a2e)}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Dynamic lighting elements */}
      <mesh position={[-15, 10, -10]} scale={2}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial 
          color={new THREE.Color(0x4a9eff)}
          transparent
          opacity={0.1}
        />
      </mesh>
      
      <mesh position={[15, -8, -10]} scale={2.5}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial 
          color={new THREE.Color(0xff6b9d)}
          transparent
          opacity={0.08}
        />
      </mesh>
    </>
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
      ctx.fillText('CRD', 128, 140);
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);
};

// 3D Card component with realistic thickness and back
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
  
  // Fix texture orientation and aspect ratio
  useEffect(() => {
    if (texture) {
      // Correct orientation - flip Y to show image upright
      texture.flipY = true;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
    }
  }, [texture]);

  // Create card back texture
  const cardBackTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Professional card back design
      const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(0.6, '#16213e');
      gradient.addColorStop(1, '#0f1419');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);
      
      // Add subtle pattern
      ctx.strokeStyle = '#16213e';
      ctx.lineWidth = 1;
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.arc(256, 256, i * 12, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // CRD logo
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('CRD', 256, 280);
    }
    const backTexture = new THREE.CanvasTexture(canvas);
    backTexture.flipY = true;
    return backTexture;
  }, []);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      
      // Auto-rotate when not hovered
      if (!hovered) {
        meshRef.current.rotation.y += 0.003;
      }
    }
  });

  // Card dimensions in 3D space (trading card proportions: 2.5" x 3.5")
  const cardWidth = 2.5;
  const cardHeight = 3.5;
  const cardThickness = 0.05; // 12pt cardstock thickness

  return (
    <group>
      {/* Main card mesh with thickness */}
      <mesh
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        scale={hovered ? 1.02 : 1}
        castShadow
        receiveShadow
      >
        {/* Use box geometry for thickness */}
        <boxGeometry args={[cardWidth, cardHeight, cardThickness]} />
        
        {/* Materials for each face of the box */}
        {effects.holographic ? (
          <>
            <meshStandardMaterial attach="material-0" color="#2a2a3a" /> {/* Right edge */}
            <meshStandardMaterial attach="material-1" color="#2a2a3a" /> {/* Left edge */}
            <meshStandardMaterial attach="material-2" color="#2a2a3a" /> {/* Top edge */}
            <meshStandardMaterial attach="material-3" color="#2a2a3a" /> {/* Bottom edge */}
            <HolographicMaterial texture={texture} /> {/* Front face - attach will be handled by the component */}
            <meshStandardMaterial attach="material-5" map={cardBackTexture} /> {/* Back face */}
          </>
        ) : (
          <>
            <meshStandardMaterial attach="material-0" color="#2a2a3a" /> {/* Right edge */}
            <meshStandardMaterial attach="material-1" color="#2a2a3a" /> {/* Left edge */}
            <meshStandardMaterial attach="material-2" color="#2a2a3a" /> {/* Top edge */}
            <meshStandardMaterial attach="material-3" color="#2a2a3a" /> {/* Bottom edge */}
            <meshStandardMaterial 
              attach="material-4"
              map={texture}
              metalness={effects.metalness || 0.1}
              roughness={effects.roughness || 0.4}
            /> {/* Front face */}
            <meshStandardMaterial attach="material-5" map={cardBackTexture} /> {/* Back face */}
          </>
        )}
      </mesh>
      
      {/* Particle effects */}
      {effects.particles && (
        <Sparkles
          count={30}
          scale={4}
          size={3}
          speed={0.3}
          color="gold"
        />
      )}
      
      {/* Glow effect */}
      {effects.glow && (
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[cardWidth + 0.2, cardHeight + 0.2, 0.01]} />
          <meshBasicMaterial 
            color={effects.glowColor || '#00ffff'}
            transparent
            opacity={0.2}
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
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Canvas 
        shadows 
        style={{ 
          width: '100%', 
          height: '100%',
          display: 'block'
        }}
        gl={{ 
          antialias: true, 
          alpha: true,
          preserveDrawingBuffer: true,
          shadowMap: {
            enabled: true,
            type: THREE.PCFSoftShadowMap
          }
        }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6], fov: 45 }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 6]} />
        
        {/* Enhanced lighting setup for professional card showcase */}
        <ambientLight intensity={0.3} />
        <directionalLight 
          position={[5, 5, 3]} 
          intensity={1.2} 
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <directionalLight 
          position={[-5, 3, 2]} 
          intensity={0.8} 
          color="#4a9eff"
        />
        <pointLight position={[0, -3, 2]} color="#ff6b9d" intensity={0.6} />
        <spotLight 
          position={[0, 0, 5]} 
          intensity={0.5} 
          angle={0.3} 
          penumbra={0.2}
          castShadow
        />
        
        {/* Professional environment for reflections */}
        <Environment preset="studio" />
        
        {/* Enhanced 3D background */}
        <EnvironmentBackground />
        
        {/* 3D Card with thickness and back */}
        <Card3D 
          cardData={cardData}
          imageUrl={imageUrl}
          effects={effects}
        />
        
        {/* Camera controls optimized for card viewing */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={4}
          maxDistance={12}
          autoRotate={false}
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI - Math.PI / 6}
        />
      </Canvas>
      
      {/* Enhanced overlay UI for 3D controls */}
      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md p-4 rounded-xl text-white z-10 border border-white/10">
        <div className="text-sm space-y-2">
          <div className="font-semibold text-crd-green">3D Controls</div>
          <div className="text-xs opacity-80">🖱️ Drag to rotate</div>
          <div className="text-xs opacity-80">🔍 Scroll to zoom</div>
          <div className="text-xs opacity-80">✨ Hover for effects</div>
          <div className="text-xs opacity-80">🔄 Auto-rotation</div>
        </div>
      </div>
      
      {/* Card info overlay */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md p-3 rounded-xl text-white z-10 border border-white/10">
        <div className="text-sm font-medium">{cardData.title}</div>
        <div className="text-xs text-gray-300 mt-1">
          Premium 3D • {effects.holographic ? 'Holographic' : 'Standard'} • Interactive
        </div>
      </div>
    </div>
  );
};
