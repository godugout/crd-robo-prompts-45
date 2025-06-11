
import { useState, useCallback, useMemo } from 'react';
import { useEffectValues } from './useEffectValues';

export const useViewerEffects = () => {
  const { effectValues, handleEffectChange, resetEffectValues } = useEffectValues();
  
  const [presetState, setPresetState] = useState<string>('none');
  const [selectedScene, setSelectedScene] = useState<string>('studio');
  const [selectedLighting, setSelectedLighting] = useState<string>('natural');
  const [overallBrightness, setOverallBrightness] = useState<number[]>([80]);
  const [interactiveLighting, setInteractiveLighting] = useState<boolean>(true);
  
  // Memoize material settings to prevent infinite renders
  const [materialSettings, setMaterialSettings] = useState(() => ({
    metalness: 0.5,
    roughness: 0.5,
    clearcoat: 0.0,
    transmission: 0.0,
    reflectivity: 50
  }));

  // Stable callback functions - memoized to prevent infinite renders
  const handleSceneChange = useCallback((sceneId: string) => {
    setSelectedScene(sceneId);
    console.log('Scene changed to:', sceneId);
  }, []);

  const handleLightingChange = useCallback((lightingId: string) => {
    setSelectedLighting(lightingId);
    console.log('Lighting changed to:', lightingId);
  }, []);

  const handleMaterialSettingsChange = useCallback((settings: Partial<typeof materialSettings>) => {
    setMaterialSettings(prev => ({ ...prev, ...settings }));
    console.log('Material settings changed:', settings);
  }, []);

  const resetAllEffects = useCallback(() => {
    resetEffectValues();
    setMaterialSettings({
      metalness: 0.5,
      roughness: 0.5,
      clearcoat: 0.0,
      transmission: 0.0,
      reflectivity: 50
    });
    setOverallBrightness([80]);
    setPresetState('none');
  }, [resetEffectValues]);

  const handleApplyCombo = useCallback((comboId: string) => {
    console.log('Applying combo preset:', comboId);
    setPresetState(comboId);
    
    // Apply preset configurations
    switch (comboId) {
      case 'vintage':
        handleEffectChange('vintage', 'intensity', 0.8);
        setMaterialSettings({
          metalness: 0.3,
          roughness: 0.7,
          clearcoat: 0.0,
          transmission: 0.0,
          reflectivity: 30
        });
        setOverallBrightness([60]);
        break;
      case 'holographic':
        handleEffectChange('holographic', 'intensity', 0.9);
        setMaterialSettings({
          metalness: 0.8,
          roughness: 0.1,
          clearcoat: 0.8,
          transmission: 0.2,
          reflectivity: 90
        });
        setOverallBrightness([100]);
        break;
      case 'chrome':
        handleEffectChange('chrome', 'intensity', 0.9);
        setMaterialSettings({
          metalness: 1.0,
          roughness: 0.0,
          clearcoat: 1.0,
          transmission: 0.0,
          reflectivity: 100
        });
        setOverallBrightness([90]);
        break;
      case 'gold':
        handleEffectChange('gold', 'intensity', 0.8);
        setMaterialSettings({
          metalness: 0.9,
          roughness: 0.2,
          clearcoat: 0.5,
          transmission: 0.0,
          reflectivity: 80
        });
        setOverallBrightness([85]);
        break;
      default:
        resetAllEffects();
        break;
    }
  }, [handleEffectChange, resetAllEffects]);

  const handleBrightnessChange = useCallback((value: number[]) => {
    setOverallBrightness(value);
  }, []);

  const handleInteractiveLightingToggle = useCallback(() => {
    setInteractiveLighting(prev => !prev);
  }, []);

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(() => ({
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
    setOverallBrightness: handleBrightnessChange,
    setInteractiveLighting: handleInteractiveLightingToggle
  }), [
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
    handleBrightnessChange,
    handleInteractiveLightingToggle
  ]);
};
