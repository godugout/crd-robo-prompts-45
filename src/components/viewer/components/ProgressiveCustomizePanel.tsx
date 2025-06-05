
import React, { useState, useCallback, useEffect } from 'react';
import { Sparkles, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuickComboPresets } from './QuickComboPresets';
import { CompactEffectControls } from './CompactEffectControls';
import { ENVIRONMENT_SCENES, LIGHTING_PRESETS } from '../constants';
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
  const [showEnvironment, setShowEnvironment] = useState(false);
  const [showMaterial, setShowMaterial] = useState(false);
  const [lastChangeTime, setLastChangeTime] = useState(Date.now());
  const [showForceRefresh, setShowForceRefresh] = useState(false);

  // Detect stuck states and show force refresh option
  useEffect(() => {
    if (isApplyingPreset) {
      setLastChangeTime(Date.now());
      setShowForceRefresh(false);
      
      // Show force refresh if stuck for more than 3 seconds
      const stuckTimer = setTimeout(() => {
        if (isApplyingPreset) {
          console.log('🚨 Detected stuck preset application');
          setShowForceRefresh(true);
        }
      }, 3000);
      
      return () => clearTimeout(stuckTimer);
    }
  }, [isApplyingPreset]);

  const handleBrightnessChange = useCallback(
    (value: number[]) => {
      onBrightnessChange(value);
      setLastChangeTime(Date.now());
    },
    [onBrightnessChange],
  );

  const handleMaterialSettingChange = useCallback(
    (key: keyof MaterialSettings, value: number) => {
      onMaterialSettingsChange({
        ...materialSettings,
        [key]: value,
      });
      setLastChangeTime(Date.now());
    },
    [materialSettings, onMaterialSettingsChange],
  );

  // Helper to reset individual effects
  const handleResetEffect = useCallback((effectId: string) => {
    onEffectChange(effectId, 'intensity', 0);
    setLastChangeTime(Date.now());
  }, [onEffectChange]);

  // Enhanced reset all with force refresh
  const handleForceResetAll = useCallback(() => {
    console.log('🚨 Force resetting all effects and materials');
    onResetAllEffects();
    setShowForceRefresh(false);
    setLastChangeTime(Date.now());
    
    // Force a complete refresh by triggering preset selection clearing
    setTimeout(() => {
      onPresetSelect('');
    }, 100);
  }, [onResetAllEffects, onPresetSelect]);

  return (
    <div className={`fixed top-0 right-0 h-full w-80 bg-black bg-opacity-95 backdrop-blur-lg border-l border-white/10 overflow-hidden ${
      isFullscreen ? 'z-60' : 'z-50'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-white">Enhanced Studio</h2>
          {isApplyingPreset && (
            <div className="w-2 h-2 bg-crd-green rounded-full animate-pulse" />
          )}
        </div>
        <div className="flex items-center space-x-2">
          {/* Force Refresh Button */}
          {showForceRefresh && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleForceResetAll}
              className="text-yellow-500 hover:text-yellow-400"
              title="Force refresh stuck effects"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5 text-white" />
          </Button>
        </div>
      </div>

      {/* Content with enhanced combo section */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Status indicator for stuck detection */}
          {isApplyingPreset && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
              <div className="flex items-center text-yellow-500 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse mr-2" />
                Applying effects...
                {showForceRefresh && (
                  <span className="ml-2 text-xs">(Taking longer than expected)</span>
                )}
              </div>
            </div>
          )}

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

          {/* Compact Enhanced Effect Controls Section */}
          <div>
            <CompactEffectControls
              effectValues={effectValues}
              onEffectChange={onEffectChange}
              onResetEffect={handleResetEffect}
              onResetAll={onResetAllEffects}
              showOnlyActive={true}
            />
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
            {/* Emergency Force Refresh Button */}
            <Button 
              variant="outline" 
              onClick={handleForceResetAll} 
              className="w-full border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Force Refresh All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
