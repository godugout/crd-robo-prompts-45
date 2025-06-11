
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EnhancedMobileStudioPanel } from './components/EnhancedMobileStudioPanel';
import { MobileControlProvider, useMobileControl } from './context/MobileControlContext';
import { EffectProvider } from './contexts/EffectContext';
import { ViewerControlButtons } from './components/ViewerControlButtons';
import { Simple3DCardMesh } from './components/Simple3DCardMesh';
import { useCardInteraction } from './hooks/useCardInteraction';
import { useViewerEffects } from './hooks/useViewerEffects';
import { cn } from '@/lib/utils';
import type { CardData } from '@/types/card';

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const {
    isFlipped,
    rotation,
    zoom,
    isDragging,
    mousePosition,
    isHovering,
    cameraPosition,
    handleMouseDown,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    handleClick
  } = useCardInteraction();

  const {
    effectValues,
    handleEffectChange,
    resetAllEffects,
    presetState,
    selectedScene,
    selectedLighting,
    overallBrightness,
    interactiveLighting,
    materialSettings,
    handleSceneChange,
    handleLightingChange,
    handleMaterialSettingsChange,
    handleApplyCombo,
    setOverallBrightness,
    setInteractiveLighting
  } = useViewerEffects();

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!card) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-white">
        <p>Loading card...</p>
      </div>
    );
  }

  console.log('EnhancedCardViewer: Rendering card:', card.id, 'Image URL:', card.image_url);

  const effectContextValue = {
    effectValues,
    mousePosition,
    isHovering,
    showEffects: true,
    materialSettings,
    interactiveLighting,
    effectIntensity: [80],
    handleEffectChange,
    resetEffect: () => {},
    resetAllEffects
  };

  return (
    <div className={cn(
      "relative w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-800",
      isFullscreen && "fixed inset-0 z-50"
    )}>
      <ViewerControlButtons 
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        className="w-full h-full"
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        onCreated={({ gl, scene, camera }) => {
          gl.setClearColor('#000000', 0);
          console.log('Canvas created successfully');
        }}
      >
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={15}
          autoRotate={false}
          autoRotateSpeed={0.5}
        />
        
        {/* Enhanced lighting setup for better card visibility */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <directionalLight position={[-10, -10, -5]} intensity={0.4} />
        <pointLight position={[0, 0, 10]} intensity={0.8} />
        
        <EffectProvider value={effectContextValue}>
          <Simple3DCardMesh 
            card={card}
            rotation={rotation}
            zoom={zoom}
          />
        </EffectProvider>
      </Canvas>

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
        onPresetSelect={() => {}}
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
