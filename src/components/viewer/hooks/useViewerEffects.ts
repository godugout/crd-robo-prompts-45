
import { useState } from 'react';
import { useEnhancedCardEffects } from './useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset } from '../types';

export const useViewerEffects = () => {
  const { 
    effectValues, 
    handleEffectChange, 
    resetEffect, 
    resetAllEffects, 
    presetState 
  } = useEnhancedCardEffects();

  const [selectedScene, setSelectedScene] = useState<EnvironmentScene>('studio' as any);
  const [selectedLighting, setSelectedLighting] = useState<LightingPreset>('studio' as any);
  const [overallBrightness, setOverallBrightness] = useState([80]);
  const [interactiveLighting, setInteractiveLighting] = useState(false);
  const [materialSettings, setMaterialSettings] = useState({
    metalness: 0.5,
    roughness: 0.5,
    clearcoat: 0.0,
    transmission: 0.0,
    reflectivity: 50
  });

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
    Object.entries(combo.effects || {}).forEach(([effectId, parameters]: [string, any]) => {
      Object.entries(parameters).forEach(([parameterId, value]) => {
        handleEffectChange(effectId, parameterId, value as string | number | boolean);
      });
    });
    
    if (combo.scene) setSelectedScene(combo.scene);
    if (combo.lighting) setSelectedLighting(combo.lighting);
    if (combo.materials) setMaterialSettings(combo.materials);
    if (combo.brightness) setOverallBrightness([combo.brightness]);
  };

  return {
    effectValues,
    handleEffectChange,
    resetEffect,
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
  };
};
