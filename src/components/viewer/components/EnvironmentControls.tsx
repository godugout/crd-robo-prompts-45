
import React from 'react';
import { Slider } from '@/components/ui/slider';
import type { EnvironmentScene, LightingPreset } from '../types';
import { ENVIRONMENT_SCENES, LIGHTING_PRESETS } from '../constants';

interface EnvironmentControlsProps {
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  overallBrightness: number[];
  onSceneChange: (scene: EnvironmentScene) => void;
  onLightingChange: (lighting: LightingPreset) => void;
  onBrightnessChange: (value: number[]) => void;
}

export const EnvironmentControls: React.FC<EnvironmentControlsProps> = ({
  selectedScene,
  selectedLighting,
  overallBrightness,
  onSceneChange,
  onLightingChange,
  onBrightnessChange
}) => {
  return (
    <div className="space-y-6">
      {/* Environment Scenes */}
      <div>
        <h4 className="text-white font-medium mb-4">Environment Scenes</h4>
        <div className="grid grid-cols-2 gap-3">
          {ENVIRONMENT_SCENES.map((scene) => (
            <button
              key={scene.id}
              onClick={() => onSceneChange(scene)}
              className={`aspect-square rounded-lg p-3 transition-all ${
                selectedScene.id === scene.id 
                  ? 'ring-2 ring-blue-500 scale-105' 
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

      {/* Lighting Controls */}
      <div>
        <h4 className="text-white font-medium mb-3">Lighting</h4>
        <div className="space-y-2 mb-4">
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
      </div>
    </div>
  );
};
