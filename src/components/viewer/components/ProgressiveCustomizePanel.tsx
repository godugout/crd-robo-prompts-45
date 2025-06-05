import React, { useState, useCallback } from 'react';
import { Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuickComboPresets } from './QuickComboPresets';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';

interface ProgressiveCustomizePanelProps {
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  effectValues: EffectValues;
  overallBrightness: number[];
  interactiveLighting: boolean;
  materialSettings: MaterialSettings;
  isFullscreen: boolean;
  onSceneChange: (scene: EnvironmentScene) => void;
  onLightingChange: (lighting: LightingPreset) => void;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  onResetAllEffects: () => void;
  onBrightnessChange: (value: number[]) => void;
  onInteractiveLightingToggle: () => void;
  onMaterialSettingsChange: (settings: MaterialSettings) => void;
  onToggleFullscreen: () => void;
  onDownload: () => void;
  onShare?: () => void;
  onClose: () => void;
  card: any;
  selectedPresetId?: string;
  onPresetSelect: (presetId: string) => void;
  onApplyCombo: (combo: any) => void;
  isApplyingPreset?: boolean;
}

export const ProgressiveCustomizePanel: React.FC<ProgressiveCustomizePanelProps> = ({
  selectedScene,
  selectedLighting,
  effectValues,
  overallBrightness,
  interactiveLighting,
  materialSettings,
  isFullscreen,
  onSceneChange,
  onLightingChange,
  onEffectChange,
  onResetAllEffects,
  onBrightnessChange,
  onInteractiveLightingToggle,
  onMaterialSettingsChange,
  onToggleFullscreen,
  onDownload,
  onShare,
  onClose,
  card,
  selectedPresetId,
  onPresetSelect,
  onApplyCombo,
  isApplyingPreset = false
}) => {
  const [showEffects, setShowEffects] = useState(true);
  const [showEnvironment, setShowEnvironment] = useState(false);
  const [showMaterial, setShowMaterial] = useState(false);

  const handleBrightnessChange = useCallback(
    (value: number[]) => {
      onBrightnessChange(value);
    },
    [onBrightnessChange],
  );

  const handleMaterialSettingChange = useCallback(
    (key: keyof MaterialSettings, value: number) => {
      onMaterialSettingsChange({
        ...materialSettings,
        [key]: value,
      });
    },
    [materialSettings, onMaterialSettingsChange],
  );

  return (
    <div className={`fixed top-0 right-0 h-full w-80 bg-black bg-opacity-95 backdrop-blur-lg border-l border-white/10 overflow-hidden ${
      isFullscreen ? 'z-60' : 'z-50'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold text-white">Enhanced Studio</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5 text-white" />
        </Button>
      </div>

      {/* Content with enhanced combo section */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Quick Style Combos Section */}
          <div>
            <h3 className="text-white font-medium mb-3 flex items-center">
              <Sparkles className="w-4 h-4 text-crd-green mr-2" />
              Quick Style Combos
              {isApplyingPreset && (
                <div className="ml-2 w-2 h-2 bg-crd-green rounded-full animate-pulse" />
              )}
            </h3>
            <QuickComboPresets
              onApplyCombo={onApplyCombo}
              currentEffects={effectValues}
              selectedPresetId={selectedPresetId}
              onPresetSelect={onPresetSelect}
              isApplyingPreset={isApplyingPreset}
            />
          </div>

          {/* Separator */}
          <div className="border-b border-white/20" />

          {/* Enhanced Effect Controls Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-medium flex items-center">
                <Sparkles className="w-4 h-4 text-crd-green mr-2" />
                Enhanced Effects
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setShowEffects(!showEffects)}>
                {showEffects ? 'Hide' : 'Show'}
              </Button>
            </div>
            {showEffects && (
              <div className="space-y-4">
                {Object.entries(effectValues).map(([effectId, params]) => (
                  <div key={effectId} className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-400">{effectId}</h4>
                    {Object.entries(params).map(([paramId, value]) => (
                      <div key={paramId} className="space-y-1">
                        <Label htmlFor={`${effectId}-${paramId}`} className="text-white text-sm">
                          {paramId}
                        </Label>
                        {typeof value === 'number' ? (
                          <Slider
                            id={`${effectId}-${paramId}`}
                            defaultValue={[value]}
                            max={100}
                            step={1}
                            onValueChange={(newValue) => {
                              const numberValue = newValue[0];
                              onEffectChange(effectId, paramId, numberValue);
                            }}
                            className="text-white"
                          />
                        ) : typeof value === 'boolean' ? (
                          <Switch
                            id={`${effectId}-${paramId}`}
                            checked={value}
                            onCheckedChange={(checked) => onEffectChange(effectId, paramId, checked)}
                          />
                        ) : (
                          <Input
                            type="text"
                            id={`${effectId}-${paramId}`}
                            value={value as string}
                            onChange={(e) => onEffectChange(effectId, paramId, e.target.value)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ))}
                <Button variant="secondary" size="sm" onClick={onResetAllEffects}>
                  Reset All Effects
                </Button>
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="border-b border-white/20" />

          {/* Environment Settings Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-medium flex items-center">
                <Sparkles className="w-4 h-4 text-crd-green mr-2" />
                Environment
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setShowEnvironment(!showEnvironment)}>
                {showEnvironment ? 'Hide' : 'Show'}
              </Button>
            </div>
            {showEnvironment && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="scene-select" className="text-white text-sm">
                    Scene
                  </Label>
                  <Select onValueChange={(value) => onSceneChange(JSON.parse(value))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={selectedScene.name} />
                    </SelectTrigger>
                    <SelectContent>
                      {/* @ts-expect-error */}
                      {ENVIRONMENT_SCENES.map((scene) => (
                        <SelectItem key={scene.name} value={JSON.stringify(scene)}>
                          {scene.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="lighting-select" className="text-white text-sm">
                    Lighting
                  </Label>
                  <Select onValueChange={(value) => onLightingChange(JSON.parse(value))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={selectedLighting.name} />
                    </SelectTrigger>
                    <SelectContent>
                      {/* @ts-expect-error */}
                      {LIGHTING_PRESETS.map((lighting) => (
                        <SelectItem key={lighting.name} value={JSON.stringify(lighting)}>
                          {lighting.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="brightness-slider" className="text-white text-sm">
                    Brightness
                  </Label>
                  <Slider
                    id="brightness-slider"
                    defaultValue={overallBrightness}
                    max={200}
                    step={1}
                    onValueChange={handleBrightnessChange}
                    className="text-white"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="interactive-lighting" className="text-white text-sm">
                    Interactive Lighting
                  </Label>
                  <Switch
                    id="interactive-lighting"
                    checked={interactiveLighting}
                    onCheckedChange={onInteractiveLightingToggle}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="border-b border-white/20" />

          {/* Material Properties Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-medium flex items-center">
                <Sparkles className="w-4 h-4 text-crd-green mr-2" />
                Material Properties
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setShowMaterial(!showMaterial)}>
                {showMaterial ? 'Hide' : 'Show'}
              </Button>
            </div>
            {showMaterial && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="roughness-slider" className="text-white text-sm">
                    Roughness
                  </Label>
                  <Slider
                    id="roughness-slider"
                    defaultValue={[materialSettings.roughness * 100]}
                    max={100}
                    step={1}
                    onValueChange={(value) => handleMaterialSettingChange('roughness', value[0] / 100)}
                    className="text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="metalness-slider" className="text-white text-sm">
                    Metalness
                  </Label>
                  <Slider
                    id="metalness-slider"
                    defaultValue={[materialSettings.metalness * 100]}
                    max={100}
                    step={1}
                    onValueChange={(value) => handleMaterialSettingChange('metalness', value[0] / 100)}
                    className="text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="clearcoat-slider" className="text-white text-sm">
                    Clearcoat
                  </Label>
                  <Slider
                    id="clearcoat-slider"
                    defaultValue={[materialSettings.clearcoat * 100]}
                    max={100}
                    step={1}
                    onValueChange={(value) => handleMaterialSettingChange('clearcoat', value[0] / 100)}
                    className="text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="reflectivity-slider" className="text-white text-sm">
                    Reflectivity
                  </Label>
                  <Slider
                    id="reflectivity-slider"
                    defaultValue={[materialSettings.reflectivity * 100]}
                    max={100}
                    step={1}
                    onValueChange={(value) => handleMaterialSettingChange('reflectivity', value[0] / 100)}
                    className="text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="border-b border-white/20" />

          {/* Export Options Section */}
          <div className="space-y-4">
            <h3 className="text-white font-medium flex items-center">
              <Sparkles className="w-4 h-4 text-crd-green mr-2" />
              Export Options
            </h3>
            <Button variant="secondary" onClick={onToggleFullscreen} className="w-full">
              {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            </Button>
            <Button variant="secondary" onClick={onDownload} className="w-full">
              Download
            </Button>
            {onShare && (
              <Button variant="secondary" onClick={onShare} className="w-full">
                Share
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
