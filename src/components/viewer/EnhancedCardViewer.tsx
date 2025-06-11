
import React, { useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Vector3 } from 'three';
import { EnhancedCard3D } from './components/EnhancedCard3D';
import { EnhancedMobileStudioPanel } from './components/EnhancedMobileStudioPanel';
import { MobileControlProvider, useMobileControl } from './context/MobileControlContext';
import { useEnhancedCardEffects } from './hooks/useEnhancedCardEffects';
import { useEnvironmentEffects } from './hooks/useEnvironmentEffects';
import { useLightingEffects } from './hooks/useLightingEffects';
import { useMaterialEffects } from './hooks/useMaterialEffects';
import { Button } from '@/components/ui/button';
import { Settings, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CardData } from '@/hooks/useCardData';

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
  
  // Effect hooks
  const { effectValues, updateEffect, resetEffect, resetAllEffects, selectedPresetId, setSelectedPresetId } = useEnhancedCardEffects();
  const { selectedScene, selectScene } = useEnvironmentEffects();
  const { selectedLighting, selectLighting, overallBrightness, updateBrightness, interactiveLighting, toggleInteractiveLighting } = useLightingEffects();
  const { materialSettings, updateMaterialSettings } = useMaterialEffects();

  const cameraPosition: Vector3 = useMemo(() => new Vector3(0, 0, 5), []);

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleApplyCombo = (combo: any) => {
    // Apply effect combo
    Object.entries(combo.effects || {}).forEach(([effectId, parameters]: [string, any]) => {
      Object.entries(parameters).forEach(([parameterId, value]) => {
        updateEffect(effectId, parameterId, value);
      });
    });
    
    // Apply scene and lighting if provided
    if (combo.scene) selectScene(combo.scene);
    if (combo.lighting) selectLighting(combo.lighting);
    if (combo.materials) updateMaterialSettings(combo.materials);
    if (combo.brightness) updateBrightness([combo.brightness]);
    
    setSelectedPresetId(combo.id);
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
        
        <EnhancedCard3D
          imageUrl={card.image_url || '/placeholder.png'}
          title={card.title}
          effectValues={effectValues}
          selectedScene={selectedScene}
          selectedLighting={selectedLighting}
          overallBrightness={overallBrightness[0]}
          interactiveLighting={interactiveLighting}
          materialSettings={materialSettings}
        />
      </Canvas>

      {/* Enhanced Mobile Studio Panel */}
      <EnhancedMobileStudioPanel
        selectedScene={selectedScene}
        selectedLighting={selectedLighting}
        effectValues={effectValues}
        overallBrightness={overallBrightness}
        interactiveLighting={interactiveLighting}
        materialSettings={materialSettings}
        isFullscreen={isFullscreen}
        onSceneChange={selectScene}
        onLightingChange={selectLighting}
        onEffectChange={updateEffect}
        onResetAllEffects={resetAllEffects}
        onBrightnessChange={updateBrightness}
        onInteractiveLightingToggle={toggleInteractiveLighting}
        onMaterialSettingsChange={updateMaterialSettings}
        onToggleFullscreen={handleToggleFullscreen}
        onDownload={onDownload || (() => {})}
        onShare={onShare}
        card={card}
        selectedPresetId={selectedPresetId}
        onPresetSelect={setSelectedPresetId}
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
