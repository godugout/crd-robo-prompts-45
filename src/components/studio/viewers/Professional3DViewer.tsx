
import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  PerspectiveCamera,
  useTexture,
  Text,
  RoundedBox,
  Float,
  Sparkles
} from '@react-three/drei';
import * as THREE from 'three';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, RotateCw, Maximize2, Camera, Settings } from 'lucide-react';
import { useAdvancedStudio } from '@/contexts/AdvancedStudioContext';

interface Card3DProps {
  card: any;
  materialState: any;
  lightingState: any;
  animationState: any;
  effectLayers: any[];
}

const Card3D: React.FC<Card3DProps> = ({ 
  card, 
  materialState, 
  lightingState, 
  animationState, 
  effectLayers 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  // Load card texture
  const texture = card?.image ? useTexture(card.image) : null;
  
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Apply animation based on preset
    switch (animationState.preset) {
      case 'rotate':
        if (animationState.isPlaying) {
          groupRef.current.rotation.y += delta * (animationState.speed / 100);
        }
        break;
      case 'float':
        if (animationState.isPlaying) {
          groupRef.current.position.y = Math.sin(state.clock.elapsedTime * (animationState.speed / 50)) * (animationState.amplitude / 100);
        }
        break;
      case 'pulse':
        if (animationState.isPlaying) {
          const scale = 1 + Math.sin(state.clock.elapsedTime * (animationState.speed / 25)) * (animationState.amplitude / 500);
          groupRef.current.scale.setScalar(scale);
        }
        break;
    }
  });

  // Create material based on state
  const createMaterial = () => {
    const materialProps: any = {
      metalness: materialState.metalness / 100,
      roughness: materialState.roughness / 100,
      transparent: materialState.transparency > 0,
      opacity: 1 - (materialState.transparency / 100),
    };

    if (texture) {
      materialProps.map = texture;
    }

    // Apply effect layers
    effectLayers.forEach(layer => {
      if (!layer.enabled) return;
      
      switch (layer.type) {
        case 'holographic':
          materialProps.iridescence = layer.intensity / 100;
          materialProps.iridescenceIOR = 1.3;
          break;
        case 'metallic':
          materialProps.metalness = Math.max(materialProps.metalness, layer.intensity / 100);
          break;
        case 'chrome':
          materialProps.metalness = 1;
          materialProps.roughness = 0.1;
          materialProps.envMapIntensity = layer.intensity / 50;
          break;
      }
    });

    return materialProps;
  };

  const materialProps = createMaterial();

  return (
    <group ref={groupRef}>
      <RoundedBox
        ref={meshRef}
        args={[2.5, 3.5, 0.05]}
        radius={0.1}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial {...materialProps} />
      </RoundedBox>

      {/* Card content overlay */}
      {card?.title && (
        <Text
          position={[0, 1.4, 0.026]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {card.title}
        </Text>
      )}

      {/* Effect particles for certain layers */}
      {effectLayers.some(l => l.enabled && l.type === 'particle') && (
        <Sparkles
          count={20}
          scale={4}
          size={2}
          speed={0.4}
          opacity={0.6}
          color="#ffd700"
        />
      )}

      {/* Glow effect */}
      {effectLayers.some(l => l.enabled && l.type === 'glow') && (
        <pointLight
          position={[0, 0, 1]}
          intensity={2}
          color="#4ade80"
          distance={8}
          decay={2}
        />
      )}
    </group>
  );
};

const SceneLighting: React.FC<{ lightingState: any }> = ({ lightingState }) => {
  return (
    <>
      <ambientLight intensity={lightingState.ambientLight / 100} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={lightingState.intensity / 100}
        color={new THREE.Color().setColorTemperature(lightingState.colorTemperature)}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={20}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight
        position={[-3, 2, 1]}
        intensity={(lightingState.intensity / 100) * 0.5}
        color="#4a9eff"
      />
      <pointLight
        position={[0, -3, 2]}
        intensity={(lightingState.intensity / 100) * 0.3}
        color="#ff6b9d"
      />
    </>
  );
};

const CameraController: React.FC = () => {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 0, 6);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return null;
};

interface Professional3DViewerProps {
  className?: string;
}

export const Professional3DViewer: React.FC<Professional3DViewerProps> = ({ className }) => {
  const { state, setViewMode, setRenderQuality } = useAdvancedStudio();
  const { selectedCard, viewMode, renderQuality, material, lighting, animation, effectLayers, environment } = state;

  if (viewMode === '2d') {
    return (
      <div className={`h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center ${className}`}>
        <Card className="p-6 bg-black/20 border-white/10 max-w-md">
          {selectedCard?.image && (
            <img
              src={selectedCard.image}
              alt={selectedCard.name}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          )}
          <div className="mt-4 text-center">
            <h3 className="text-white font-semibold">{selectedCard?.name}</h3>
            <p className="text-gray-400 text-sm">{selectedCard?.type}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={`h-full relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 ${className}`}>
      {/* Viewer Controls */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Badge className="bg-black/70 text-white border-white/20 backdrop-blur-sm">
          {renderQuality.toUpperCase()} Quality
        </Badge>
        <Badge className="bg-black/70 text-white border-white/20 backdrop-blur-sm">
          {selectedCard?.type || 'No Card'}
        </Badge>
        {effectLayers.length > 0 && (
          <Badge className="bg-crd-green/20 text-crd-green border-crd-green/50 backdrop-blur-sm">
            {effectLayers.filter(l => l.enabled).length} Effects
          </Badge>
        )}
      </div>

      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button size="sm" variant="ghost" className="bg-black/70 text-white hover:bg-white/20 backdrop-blur-sm">
          <Eye className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost" className="bg-black/70 text-white hover:bg-white/20 backdrop-blur-sm">
          <Camera className="w-4 h-4" />
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          className="bg-black/70 text-white hover:bg-white/20 backdrop-blur-sm"
          onClick={() => setRenderQuality(renderQuality === 'high' ? 'ultra' : 'high')}
        >
          <Settings className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost" className="bg-black/70 text-white hover:bg-white/20 backdrop-blur-sm">
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>

      {/* 3D Canvas */}
      <Canvas
        shadows
        gl={{ 
          antialias: renderQuality !== 'low', 
          alpha: false,
          powerPreference: "high-performance"
        }}
        dpr={renderQuality === 'ultra' ? 2 : 1}
        camera={{ position: [0, 0, 6], fov: 45 }}
      >
        <CameraController />
        
        <Suspense fallback={null}>
          <SceneLighting lightingState={lighting} />
          
          <Environment 
            preset={environment.preset === 'studio' ? 'studio' : 'sunset'}
            background={false}
            blur={environment.backgroundBlur / 100}
          />
          
          {selectedCard && (
            <Float
              speed={animation.preset === 'float' && animation.isPlaying ? animation.speed / 50 : 0}
              rotationIntensity={animation.preset === 'float' ? animation.amplitude / 200 : 0}
              floatIntensity={animation.preset === 'float' ? animation.amplitude / 100 : 0}
            >
              <Card3D
                card={selectedCard}
                materialState={material}
                lightingState={lighting}
                animationState={animation}
                effectLayers={effectLayers}
              />
            </Float>
          )}
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={10}
          autoRotate={animation.preset === 'rotate' && animation.isPlaying}
          autoRotateSpeed={animation.speed / 10}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI - Math.PI / 6}
        />
      </Canvas>

      {/* Performance & Info Overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <Card className="p-3 bg-black/70 border-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-between text-sm">
            <div className="text-white">
              <span className="font-medium">{selectedCard?.name || 'Select a card'}</span>
              {selectedCard?.type && <span className="text-gray-400 ml-2">• {selectedCard.type}</span>}
            </div>
            <div className="text-gray-400 flex items-center gap-4">
              <span>Quality: {renderQuality}</span>
              <span>Effects: {effectLayers.filter(l => l.enabled).length}</span>
              <span className="text-crd-green">Real-time 3D</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
