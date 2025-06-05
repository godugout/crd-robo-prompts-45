
import React, { useState, useCallback } from 'react';
import { useEnhancedCardEffects } from './hooks/useEnhancedCardEffects';
import { useEnhancedCardInteraction } from './hooks/useEnhancedCardInteraction';
import { EnhancedCardCanvas } from './components/EnhancedCardCanvas';
import { ComboStudioPanel } from './components/ComboStudioPanel';
import type { CardData } from '@/hooks/useCardEditor';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from './types';
import { ENVIRONMENT_SCENES, LIGHTING_PRESETS } from './constants';

interface EnhancedCardViewerProps {
  card: CardData;
  onDownload?: (card: CardData) => void;
  onShare?: (card: CardData) => void;
  onClose?: () => void;
}

export const EnhancedCardViewer: React.FC<EnhancedCardViewerProps> = ({
  card,
  onDownload,
  onShare,
  onClose
}) => {
  // Debug logging to see if this viewer is being used
  console.log('EnhancedCardViewer rendering with card:', card?.title);

  // Enhanced effects system
  const {
    effectValues,
    handleEffectChange,
    resetEffect,
    resetAllEffects,
    applyPreset
  } = useEnhancedCardEffects();

  // Interactive card behavior
  const {
    mousePosition,
    isHovering,
    rotation,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave
  } = useEnhancedCardInteraction();

  // Environment and lighting state
  const [selectedScene, setSelectedScene] = useState<EnvironmentScene>(ENVIRONMENT_SCENES[0]);
  const [selectedLighting, setSelectedLighting] = useState<LightingPreset>(LIGHTING_PRESETS[0]);
  const [overallBrightness, setOverallBrightness] = useState<number[]>([100]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Material properties - now including clearcoat
  const [materialSettings, setMaterialSettings] = useState<MaterialSettings>({
    metalness: 0.5,
    roughness: 0.5,
    reflectivity: 0.5,
    clearcoat: 0.3
  });

  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, [isFullscreen]);

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : 'w-full h-screen'} bg-black overflow-hidden`}>
      {/* Main Canvas Area */}
      <div className="absolute inset-0 flex items-center justify-center">
        <EnhancedCardCanvas
          card={card}
          effectValues={effectValues}
          mousePosition={mousePosition}
          isHovering={isHovering}
          rotation={rotation}
          selectedScene={selectedScene}
          selectedLighting={selectedLighting}
          overallBrightness={overallBrightness[0]}
          materialSettings={materialSettings}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          width={isFullscreen ? 500 : 400}
          height={isFullscreen ? 700 : 560}
        />
      </div>

      {/* Combo Studio Panel */}
      <ComboStudioPanel
        selectedScene={selectedScene}
        selectedLighting={selectedLighting}
        effectValues={effectValues}
        overallBrightness={overallBrightness}
        materialSettings={materialSettings}
        isFullscreen={isFullscreen}
        onSceneChange={setSelectedScene}
        onLightingChange={setSelectedLighting}
        onEffectChange={handleEffectChange}
        onResetEffect={resetEffect}
        onResetAllEffects={resetAllEffects}
        onBrightnessChange={setOverallBrightness}
        onMaterialSettingsChange={setMaterialSettings}
        onToggleFullscreen={handleToggleFullscreen}
        onDownload={onDownload}
        onShare={onShare}
        onClose={onClose}
        card={card}
      />
    </div>
  );
};
