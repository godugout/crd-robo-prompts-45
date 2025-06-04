
import { useState } from 'react';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import { ENVIRONMENT_SCENES, LIGHTING_PRESETS } from '../constants';

export const useViewerSettings = () => {
  const [selectedScene, setSelectedScene] = useState<EnvironmentScene>(ENVIRONMENT_SCENES[3]); // Twilight
  const [selectedLighting, setSelectedLighting] = useState<LightingPreset>(LIGHTING_PRESETS[0]);
  const [overallBrightness, setOverallBrightness] = useState([120]);
  const [interactiveLighting, setInteractiveLighting] = useState(true);
  const [materialSettings, setMaterialSettings] = useState<MaterialSettings>({
    roughness: 0.30,
    metalness: 0.60,
    clearcoat: 0.75,
    reflectivity: 0.50
  });

  return {
    selectedScene,
    selectedLighting,
    overallBrightness,
    interactiveLighting,
    materialSettings,
    setSelectedScene,
    setSelectedLighting,
    setOverallBrightness,
    setInteractiveLighting,
    setMaterialSettings
  };
};
