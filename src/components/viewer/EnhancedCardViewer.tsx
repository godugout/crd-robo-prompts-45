
import React, { useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Vector3 } from 'three';
import { Interactive3DCard } from './Interactive3DCard';
import { EnhancedMobileStudioPanel } from './components/EnhancedMobileStudioPanel';
import { MobileControlProvider, useMobileControl } from './context/MobileControlContext';
import { useEnhancedCardEffects } from './hooks/useEnhancedCardEffects';
import { Button } from '@/components/ui/button';
import { Settings, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CardData } from '@/hooks/useCardData';
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
    metallic: 0.5,
    roughness: 0.5,
    clearcoat: 0.0,
    transmission: 0.0
  });

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

  // Create a properly formatted card object for Interactive3DCard
  const formattedCard = {
    ...card,
    design_metadata: card.design_metadata || {},
    visibility: card.visibility || 'public' as any,
    creator_attribution: card.creator_attribution || {
      creator_name: cardDetails?.creator_name,
      creator_id: undefined,
      collaboration_type: 'solo' as any
    },
    publishing_options: card.publishing_options || {
      marketplace_listing: false,
      crd_catalog_inclusion: true,
      print_available: false,
      pricing: { currency: 'USD' },
      distribution: { limited_edition: false }
    }
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
        
        <Interactive3DCard
          card={formattedCard}
        />
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
