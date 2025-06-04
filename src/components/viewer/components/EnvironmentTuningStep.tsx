
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

      {/* Environment Scenes - Enhanced with visual previews */}
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
                  : 'hover:scale-[1.02]'
              }`}
              style={{
                background: scene.backgroundImage
              }}
            >
              <div className="flex flex-col items-center justify-center h-full text-white bg-black/40 p-2 rounded-lg backdrop-blur-sm">
                <span className="text-lg mb-1">{scene.icon}</span>
                <span className="text-xs font-medium text-center">{scene.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lighting Presets - With visual indicators */}
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
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{preset.name}</div>
                  <div className="text-xs opacity-75">{preset.description}</div>
                </div>
                
                {/* Visual representation of lighting settings */}
                <div className="flex items-center space-x-2">
                  {/* Brightness indicator */}
                  <div className="w-3 h-6 bg-gray-800 rounded overflow-hidden">
                    <div 
                      className="bg-white w-full" 
                      style={{ 
                        height: `${preset.brightness}%`,
                        opacity: preset.brightness / 150 
                      }}
                    ></div>
                  </div>
                  
                  {/* Contrast indicator */}
                  <div className="w-3 h-6 bg-gray-800 rounded overflow-hidden">
                    <div 
                      className="bg-gradient-to-t from-black to-white w-full h-full" 
                      style={{ opacity: preset.contrast / 150 }}
                    ></div>
                  </div>
                  
                  {/* Color temperature indicator */}
                  <div 
                    className="w-3 h-6 rounded"
                    style={{ 
                      background: `linear-gradient(to bottom, 
                        ${preset.temperature > 5000 ? '#b3ccff' : '#ffcc80'}, 
                        ${preset.temperature > 5000 ? '#80aaff' : '#ff9955'})` 
                    }}
                  ></div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lighting Controls - Enhanced with visual feedback */}
      <div className="space-y-4">
        <h4 className="text-white font-medium flex items-center">
          <Settings className="w-4 h-4 mr-2" />
          Lighting Controls
        </h4>
        
        <div className="space-y-3">
          <div>
            <label className="flex items-center justify-between text-white text-sm mb-2">
              <span>Overall Brightness</span>
              <span className={`px-2 py-0.5 rounded ${
                overallBrightness[0] > 150 
                  ? 'bg-yellow-500/50' 
                  : overallBrightness[0] < 80 
                    ? 'bg-gray-700/80' 
                    : 'bg-blue-600/50'
              }`}>
                {overallBrightness[0]}%
              </span>
            </label>
            <div className="flex items-center space-x-2">
              <Sun className="w-4 h-4 text-gray-500" />
              <Slider
                value={overallBrightness}
                onValueChange={onBrightnessChange}
                min={50}
                max={200}
                step={5}
                className="flex-1"
              />
              <Sun className="w-5 h-5 text-white" />
            </div>
          </div>
          
          <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
            <div className="space-y-1">
              <span className="text-white text-sm">Interactive Lighting</span>
              <span className="block text-gray-400 text-xs max-w-[200px]">
                Lights follow mouse movement for dynamic effects
              </span>
            </div>
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

      {/* Material Properties - Enhanced with visual indicators */}
      <div className="space-y-4">
        <h4 className="text-white font-medium">Material Properties</h4>
        <div className="space-y-3 text-sm">
          {/* Roughness control */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-white capitalize">Roughness</label>
              <div className="flex items-center space-x-1 bg-gray-800 rounded px-2 py-0.5">
                <span className={`rounded-full h-2 w-2 ${
                  materialSettings.roughness < 0.3 ? 'bg-blue-500' :
                  materialSettings.roughness < 0.7 ? 'bg-green-500' : 'bg-yellow-500'
                }`}></span>
                <span className="text-xs text-gray-300">{materialSettings.roughness.toFixed(2)}</span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute w-full h-3 -top-4 flex justify-between px-1 text-[10px] text-gray-500">
                <span>Polished</span>
                <span>Textured</span>
              </div>
              <Slider
                value={[materialSettings.roughness]}
                onValueChange={([newValue]) => 
                  onMaterialSettingsChange({ ...materialSettings, roughness: newValue })
                }
                min={0}
                max={1}
                step={0.05}
                className="w-full"
              />
            </div>
          </div>
          
          {/* Metalness control */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-white capitalize">Metalness</label>
              <div className="flex items-center space-x-1 bg-gray-800 rounded px-2 py-0.5">
                <span className={`rounded-full h-2 w-2 ${
                  materialSettings.metalness > 0.7 ? 'bg-yellow-500' :
                  materialSettings.metalness > 0.3 ? 'bg-blue-500' : 'bg-gray-500'
                }`}></span>
                <span className="text-xs text-gray-300">{materialSettings.metalness.toFixed(2)}</span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute w-full h-3 -top-4 flex justify-between px-1 text-[10px] text-gray-500">
                <span>Matte</span>
                <span>Metallic</span>
              </div>
              <Slider
                value={[materialSettings.metalness]}
                onValueChange={([newValue]) => 
                  onMaterialSettingsChange({ ...materialSettings, metalness: newValue })
                }
                min={0}
                max={1}
                step={0.05}
                className="w-full"
              />
            </div>
          </div>
          
          {/* Clearcoat control */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-white capitalize">Clearcoat</label>
              <div className="flex items-center space-x-1 bg-gray-800 rounded px-2 py-0.5">
                <span className={`rounded-full h-2 w-2 ${
                  materialSettings.clearcoat > 0.7 ? 'bg-blue-400' :
                  materialSettings.clearcoat > 0.3 ? 'bg-blue-600' : 'bg-gray-600'
                }`}></span>
                <span className="text-xs text-gray-300">{materialSettings.clearcoat.toFixed(2)}</span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute w-full h-3 -top-4 flex justify-between px-1 text-[10px] text-gray-500">
                <span>None</span>
                <span>High Gloss</span>
              </div>
              <Slider
                value={[materialSettings.clearcoat]}
                onValueChange={([newValue]) => 
                  onMaterialSettingsChange({ ...materialSettings, clearcoat: newValue })
                }
                min={0}
                max={1}
                step={0.05}
                className="w-full"
              />
            </div>
          </div>
          
          {/* Reflectivity control */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-white capitalize">Reflectivity</label>
              <div className="flex items-center space-x-1 bg-gray-800 rounded px-2 py-0.5">
                <span className={`rounded-full h-2 w-2 ${
                  materialSettings.reflectivity > 0.7 ? 'bg-cyan-400' :
                  materialSettings.reflectivity > 0.3 ? 'bg-cyan-600' : 'bg-gray-600'
                }`}></span>
                <span className="text-xs text-gray-300">{materialSettings.reflectivity.toFixed(2)}</span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute w-full h-3 -top-4 flex justify-between px-1 text-[10px] text-gray-500">
                <span>Subtle</span>
                <span>Mirror</span>
              </div>
              <Slider
                value={[materialSettings.reflectivity]}
                onValueChange={([newValue]) => 
                  onMaterialSettingsChange({ ...materialSettings, reflectivity: newValue })
                }
                min={0}
                max={1}
                step={0.05}
                className="w-full"
              />
            </div>
          </div>
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
