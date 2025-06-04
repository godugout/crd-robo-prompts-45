
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Sun, Moon, Lightbulb } from 'lucide-react';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import { ENVIRONMENT_SCENES, LIGHTING_PRESETS } from '../constants';

interface HorizontalEnvironmentControlsProps {
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  overallBrightness: number[];
  interactiveLighting: boolean;
  materialSettings: MaterialSettings;
  onSceneChange: (scene: EnvironmentScene) => void;
  onLightingChange: (lighting: LightingPreset) => void;
  onBrightnessChange: (value: number[]) => void;
  onInteractiveLightingToggle: () => void;
  onMaterialSettingsChange: (settings: MaterialSettings) => void;
}

export const HorizontalEnvironmentControls: React.FC<HorizontalEnvironmentControlsProps> = ({
  selectedScene,
  selectedLighting,
  overallBrightness,
  interactiveLighting,
  materialSettings,
  onSceneChange,
  onLightingChange,
  onBrightnessChange,
  onInteractiveLightingToggle,
  onMaterialSettingsChange
}) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-white text-xl font-semibold flex items-center">
          <Sun className="w-5 h-5 mr-2 text-blue-500" />
          Environment & Lighting
        </h3>
        <p className="text-crd-lightGray text-sm mt-1">
          Customize the scene and lighting to perfect your card's appearance
        </p>
      </div>

      {/* Environment Scenes */}
      <div className="space-y-4">
        <h4 className="text-white font-medium flex items-center">
          <Moon className="w-4 h-4 mr-2" />
          Environment Scenes
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {ENVIRONMENT_SCENES.map((scene) => (
            <button
              key={scene.id}
              onClick={() => onSceneChange(scene)}
              className={`aspect-square rounded-lg p-3 transition-all hover:scale-105 ${
                selectedScene.id === scene.id 
                  ? 'ring-2 ring-blue-500 scale-105' 
                  : ''
              }`}
              style={{
                background: `linear-gradient(135deg, ${scene.gradient.split(' ').join(', ')})`
              }}
            >
              <div className="flex flex-col items-center justify-center h-full text-white">
                <span className="text-lg mb-1">{scene.icon}</span>
                <span className="text-xs font-medium text-center">{scene.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lighting Controls in Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lighting Presets */}
        <div className="space-y-4">
          <h4 className="text-white font-medium flex items-center">
            <Lightbulb className="w-4 h-4 mr-2" />
            Lighting Presets
          </h4>
          <div className="space-y-2">
            {LIGHTING_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onLightingChange(preset)}
                className={`w-full p-3 rounded-lg text-left transition-colors ${
                  selectedLighting.id === preset.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <div className="font-medium text-sm">{preset.name}</div>
                <div className="text-xs opacity-75">{preset.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Lighting Adjustments */}
        <div className="space-y-6">
          <h4 className="text-white font-medium">Lighting Adjustments</h4>
          
          <div className="space-y-4">
            <div>
              <label className="text-white text-sm mb-2 block">
                Overall Brightness: {overallBrightness[0]}%
              </label>
              <Slider
                value={overallBrightness}
                onValueChange={onBrightnessChange}
                min={50}
                max={200}
                step={5}
                className="w-full"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-white text-sm">Interactive Lighting</span>
              <Button
                onClick={onInteractiveLightingToggle}
                variant="outline"
                size="sm"
                className={`${
                  interactiveLighting 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-transparent text-white border-editor-border'
                }`}
              >
                {interactiveLighting ? 'On' : 'Off'}
              </Button>
            </div>
          </div>

          {/* Material Properties */}
          <div className="space-y-4">
            <h5 className="text-white font-medium">Material Properties</h5>
            <div className="space-y-3">
              {Object.entries(materialSettings).map(([key, value]) => (
                <div key={key}>
                  <label className="text-white text-sm mb-2 block capitalize">
                    {key}: {value.toFixed(2)}
                  </label>
                  <Slider
                    value={[value]}
                    onValueChange={([newValue]) => 
                      onMaterialSettingsChange({ ...materialSettings, [key]: newValue })
                    }
                    min={0}
                    max={1}
                    step={0.05}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
