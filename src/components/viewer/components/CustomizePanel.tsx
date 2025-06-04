
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';

interface CustomizePanelProps {
  effectValues: EffectValues;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  selectedScene: EnvironmentScene;
  onSceneChange: (scene: EnvironmentScene) => void;
  selectedLighting: LightingPreset;
  onLightingChange: (lighting: LightingPreset) => void;
  materialSettings: MaterialSettings;
  onMaterialChange: (property: keyof MaterialSettings, value: number) => void;
  overallBrightness: number[];
  onBrightnessChange: (brightness: number[]) => void;
  interactiveLighting: boolean;
  onInteractiveLightingChange: (enabled: boolean) => void;
  showEffects: boolean;
  onShowEffectsChange: (enabled: boolean) => void;
  onResetAll: () => void;
  onClose: () => void;
}

export const CustomizePanel: React.FC<CustomizePanelProps> = ({
  effectValues,
  onEffectChange,
  selectedScene,
  onSceneChange,
  selectedLighting,
  onLightingChange,
  materialSettings,
  onMaterialChange,
  overallBrightness,
  onBrightnessChange,
  interactiveLighting,
  onInteractiveLightingChange,
  showEffects,
  onShowEffectsChange,
  onResetAll,
  onClose
}) => {
  return (
    <div className="w-80 bg-black/90 border-l border-white/10 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-lg font-semibold">Customize</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="space-y-6">
        {/* Material Settings */}
        <div>
          <h3 className="text-white text-sm font-medium mb-3">Material Properties</h3>
          <div className="space-y-3">
            <div>
              <label className="text-white text-xs">Roughness</label>
              <input
                type="range"
                min="0"
                max="100"
                value={materialSettings.roughness}
                onChange={(e) => onMaterialChange('roughness', parseInt(e.target.value))}
                className="w-full mt-1"
              />
            </div>
            <div>
              <label className="text-white text-xs">Metalness</label>
              <input
                type="range"
                min="0"
                max="100"
                value={materialSettings.metalness}
                onChange={(e) => onMaterialChange('metalness', parseInt(e.target.value))}
                className="w-full mt-1"
              />
            </div>
            <div>
              <label className="text-white text-xs">Clearcoat</label>
              <input
                type="range"
                min="0"
                max="100"
                value={materialSettings.clearcoat}
                onChange={(e) => onMaterialChange('clearcoat', parseInt(e.target.value))}
                className="w-full mt-1"
              />
            </div>
            <div>
              <label className="text-white text-xs">Reflectivity</label>
              <input
                type="range"
                min="0"
                max="100"
                value={materialSettings.reflectivity}
                onChange={(e) => onMaterialChange('reflectivity', parseInt(e.target.value))}
                className="w-full mt-1"
              />
            </div>
          </div>
        </div>

        {/* Interactive Lighting */}
        <div>
          <label className="flex items-center gap-2 text-white text-sm">
            <input
              type="checkbox"
              checked={interactiveLighting}
              onChange={(e) => onInteractiveLightingChange(e.target.checked)}
            />
            Interactive Lighting
          </label>
        </div>

        {/* Reset Button */}
        <Button
          onClick={onResetAll}
          variant="outline"
          className="w-full border-white/20 text-white hover:bg-white/10"
        >
          Reset All
        </Button>
      </div>
    </div>
  );
};
