
import React, { useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Vector3 } from 'three';
import { CardContainer } from './components/CardContainer';
import { EnhancedMobileStudioPanel } from './components/EnhancedMobileStudioPanel';
import { MobileControlProvider, useMobileControl } from './context/MobileControlContext';
import { EffectProvider } from './contexts/EffectContext';
import { useEnhancedCardEffects } from './hooks/useEnhancedCardEffects';
import { Button } from '@/components/ui/button';
import { Settings, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CardData } from '@/types/card';
import type { EnvironmentScene, LightingPreset } from './types';

interface EnhancedCardViewerProps {
  card: CardData;
  onDownload?: () => void;
  onShare?: () => void;
  cardDetails?: {
    id: string;
    title: string;
    description?: string;
    rarity: string;
    creator_name?: string;
    creator_verified?: boolean;
    price?: string;
    created_at: string;
    tags?: string[];
    view_count?: number;
    like_count?: number;
  };
  onLike?: () => void;
  onBookmark?: () => void;
}

const EnhancedCardViewerContent: React.FC<EnhancedCardViewerProps> = ({
  card,
  onDownload,
  onShare,
  cardDetails,
  onLike,
  onBookmark
}) => {
  const { openPanel, panelState } = useMobileControl();
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Effect hooks - using the correct hook properties
  const { 
    effectValues, 
    handleEffectChange, 
    resetEffect, 
    resetAllEffects, 
    presetState 
  } = useEnhancedCardEffects();

  // Simple state for environment, lighting, and materials since the specific hooks don't exist
  const [selectedScene, setSelectedScene] = useState<EnvironmentScene>('studio' as any);
  const [selectedLighting, setSelectedLighting] = useState<LightingPreset>('studio' as any);
  const [overallBrightness, setOverallBrightness] = useState([80]);
  const [interactiveLighting, setInteractiveLighting] = useState(false);
  const [materialSettings, setMaterialSettings] = useState({
    metalness: 0.5,  // Fixed: was 'metallic', should be 'metalness'
    roughness: 0.5,
    clearcoat: 0.0,
    transmission: 0.0,
    reflectivity: 50
  });

  // Card interaction state for CardContainer
  const [isFlipped, setIsFlipped] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState(false);

  const cameraPosition: Vector3 = useMemo(() => new Vector3(0, 0, 5), []);

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleSceneChange = (scene: EnvironmentScene) => {
    setSelectedScene(scene);
  };

  const handleLightingChange = (lighting: LightingPreset) => {
    setSelectedLighting(lighting);
  };

  const handleMaterialSettingsChange = (settings: any) => {
    setMaterialSettings(prevSettings => ({ ...prevSettings, ...settings }));
  };

  const handleApplyCombo = (combo: any) => {
    // Apply effect combo using the correct method
    Object.entries(combo.effects || {}).forEach(([effectId, parameters]: [string, any]) => {
      Object.entries(parameters).forEach(([parameterId, value]) => {
        handleEffectChange(effectId, parameterId, value as string | number | boolean);
      });
    });
    
    // Apply scene and lighting if provided
    if (combo.scene) setSelectedScene(combo.scene);
    if (combo.lighting) setSelectedLighting(combo.lighting);
    if (combo.materials) setMaterialSettings(combo.materials);
    if (combo.brightness) setOverallBrightness([combo.brightness]);
  };

  // Ensure card data is available before rendering
  if (!card) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-white">
        <p>Loading card...</p>
      </div>
    );
  }

  // Simple card interaction handlers for CardContainer
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      // Simple rotation based on mouse movement
      setRotation(prev => ({
        x: prev.x + e.movementY * 0.5,
        y: prev.y + e.movementX * 0.5
      }));
    }
    
    // Update mouse position for effects
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsHovering(false);
  };

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  // Prepare context values for EffectProvider
  const effectContextValue = {
    effectValues,
    mousePosition,
    isHovering,
    showEffects: true,
    materialSettings,
    interactiveLighting,
    effectIntensity: [80],
    handleEffectChange,
    resetEffect,
    resetAllEffects
  };

  return (
    <div className={cn(
      "relative w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-800",
      isFullscreen && "fixed inset-0 z-50"
    )}>
      {/* Studio Controls Button */}
      <div className="absolute top-4 right-4 z-30">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => openPanel('studio')}
          className="bg-black/20 backdrop-blur-sm hover:bg-black/30 text-white border border-white/10"
        >
          <Settings className="w-4 h-4 mr-2" />
          Studio
        </Button>
      </div>

      {/* Fullscreen Toggle */}
      <div className="absolute top-4 left-4 z-30">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleFullscreen}
          className="bg-black/20 backdrop-blur-sm hover:bg-black/30 text-white border border-white/10"
        >
          {isFullscreen ? (
            <Minimize className="w-4 h-4" />
          ) : (
            <Maximize className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: cameraPosition, fov: 50 }}
        className="w-full h-full"
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={10}
          autoRotate={false}
          autoRotateSpeed={0.5}
        />
        
        {/* Basic lighting for the 3D scene */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        <EffectProvider value={effectContextValue}>
          {/* Simple Three.js mesh instead of HTML-based CardContainer */}
          <mesh 
            position={[0, 0, 0]}
            rotation={[rotation.x * Math.PI / 180, rotation.y * Math.PI / 180, 0]}
            scale={zoom}
          >
            <planeGeometry args={[4, 5.6]} />
            <meshStandardMaterial 
              map={card.image_url ? undefined : undefined}
              color="#ffffff"
              transparent
              opacity={0.9}
            />
          </mesh>
        </EffectProvider>
      </Canvas>

      {/* Enhanced Mobile Studio Panel */}
      <EnhancedMobileStudioPanel
        selectedScene={selectedScene as any}
        selectedLighting={selectedLighting as any}
        effectValues={effectValues}
        overallBrightness={overallBrightness}
        interactiveLighting={interactiveLighting}
        materialSettings={materialSettings as any}
        isFullscreen={isFullscreen}
        onSceneChange={handleSceneChange}
        onLightingChange={handleLightingChange}
        onEffectChange={handleEffectChange}
        onResetAllEffects={resetAllEffects}
        onBrightnessChange={setOverallBrightness}
        onInteractiveLightingToggle={() => setInteractiveLighting(!interactiveLighting)}
        onMaterialSettingsChange={handleMaterialSettingsChange}
        onToggleFullscreen={handleToggleFullscreen}
        onDownload={onDownload || (() => {})}
        onShare={onShare}
        card={card}
        selectedPresetId={presetState.currentPresetId}
        onPresetSelect={() => {}} // Simple placeholder
        onApplyCombo={handleApplyCombo}
        cardDetails={cardDetails}
        onLike={onLike}
        onBookmark={onBookmark}
      />
    </div>
  );
};

export const EnhancedCardViewer: React.FC<EnhancedCardViewerProps> = (props) => {
  return (
    <MobileControlProvider>
      <EnhancedCardViewerContent {...props} />
    </MobileControlProvider>
  );
};
