
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Sun, Moon, Lightbulb, Settings } from 'lucide-react';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import { ENVIRONMENT_SCENES, LIGHTING_PRESETS } from '../constants';

interface EnvironmentTuningStepProps {
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
  onNext: () => void;
  onBack: () => void;
}

export const EnvironmentTuningStep: React.FC<EnvironmentTuningStepProps> = ({
  selectedScene,
  selectedLighting,
  overallBrightness,
  interactiveLighting,
  materialSettings,
  onSceneChange,
  onLightingChange,
  onBrightnessChange,
  onInteractiveLightingToggle,
  onMaterialSettingsChange,
  onNext,
  onBack
}) => {
  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-white text-xl font-semibold flex items-center justify-center">
          <Sun className="w-5 h-5 mr-2 text-crd-green" />
          Fine-tune Environment
        </h3>
        <p className="text-crd-lightGray text-sm">
          Adjust lighting and environment to perfect your card's appearance
        </p>
      </div>

      {/* Environment Scenes */}
      <div className="space-y-3">
        <h4 className="text-white font-medium flex items-center">
          <Moon className="w-4 h-4 mr-2" />
          Environment Scene
        </h4>
        <div className="grid grid-cols-3 gap-3">
          {ENVIRONMENT_SCENES.map((scene) => (
            <button
              key={scene.id}
              onClick={() => onSceneChange(scene)}
              className={`aspect-square rounded-lg p-3 transition-all ${
                selectedScene.id === scene.id 
                  ? 'ring-2 ring-crd-green scale-105' 
                  : 'hover:scale-102'
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

      {/* Lighting Presets */}
      <div className="space-y-3">
        <h4 className="text-white font-medium flex items-center">
          <Lightbulb className="w-4 h-4 mr-2" />
          Lighting Style
        </h4>
        <div className="space-y-2">
          {LIGHTING_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onLightingChange(preset)}
              className={`w-full p-3 rounded-lg text-left transition-colors ${
                selectedLighting.id === preset.id 
                  ? 'bg-crd-green text-black' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <div className="font-medium text-sm">{preset.name}</div>
              <div className="text-xs opacity-75">{preset.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Lighting Controls */}
      <div className="space-y-4">
        <h4 className="text-white font-medium flex items-center">
          <Settings className="w-4 h-4 mr-2" />
          Lighting Controls
        </h4>
        
        <div className="space-y-3">
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
                  ? 'bg-crd-green text-black border-crd-green' 
                  : 'bg-transparent text-white border-editor-border'
              }`}
            >
              {interactiveLighting ? 'On' : 'Off'}
            </Button>
          </div>
        </div>
      </div>

      {/* Material Properties */}
      <div className="space-y-4">
        <h4 className="text-white font-medium">Material Properties</h4>
        <div className="space-y-3 text-sm">
          {Object.entries(materialSettings).map(([key, value]) => (
            <div key={key}>
              <label className="text-white mb-2 block capitalize">
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

      {/* Navigation */}
      <div className="flex space-x-3 pt-4 border-t border-editor-border">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 border-editor-border text-white hover:bg-gray-700"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          className="flex-1 bg-crd-green text-black hover:bg-crd-green/90"
        >
          Continue to Save
        </Button>
      </div>
    </div>
  );
};
