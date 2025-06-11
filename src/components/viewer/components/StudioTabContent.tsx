
import React, { useCallback } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { RotateCcw, Palette, Camera, Lightbulb } from 'lucide-react';
import type { EffectValues } from '../hooks/useEffectValues';

interface StudioTabContentProps {
  effectValues: EffectValues;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  onResetAllEffects: () => void;
  overallBrightness: number[];
  onBrightnessChange: (value: number[]) => void;
  interactiveLighting: boolean;
  onInteractiveLightingToggle: () => void;
  materialSettings: {
    metalness: number;
    roughness: number;
    clearcoat: number;
    transmission: number;
    reflectivity: number;
  };
  onMaterialSettingsChange: (settings: any) => void;
}

export const StudioTabContent: React.FC<StudioTabContentProps> = ({
  effectValues,
  onEffectChange,
  onResetAllEffects,
  overallBrightness,
  onBrightnessChange,
  interactiveLighting,
  onInteractiveLightingToggle,
  materialSettings,
  onMaterialSettingsChange
}) => {
  // Stable preset handler to prevent infinite renders
  const handlePresetClick = useCallback((presetId: string) => {
    console.log('Applying preset:', presetId);
    // This will be wired up to the parent component
  }, []);

  return (
    <div className="p-4 space-y-6 text-white">
      {/* Quick Presets */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4" />
          <h3 className="text-sm font-medium text-white/80">Quick Presets</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePresetClick('vintage')}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Vintage
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePresetClick('holographic')}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Holographic
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePresetClick('chrome')}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Chrome
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePresetClick('gold')}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Gold
          </Button>
        </div>
      </div>

      {/* Lighting Controls */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          <h3 className="text-sm font-medium text-white/80">Lighting</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/70">Interactive Lighting</span>
            <Switch
              checked={interactiveLighting}
              onCheckedChange={onInteractiveLightingToggle}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Overall Brightness</span>
              <span className="text-xs text-white/50">{overallBrightness[0]}%</span>
            </div>
            <Slider
              value={overallBrightness}
              onValueChange={onBrightnessChange}
              max={100}
              min={0}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Camera Controls */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4" />
          <h3 className="text-sm font-medium text-white/80">Camera</h3>
        </div>
        
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Orbit Speed</span>
              <span className="text-xs text-white/50">
                {typeof effectValues.camera?.orbitSpeed === 'number' ? effectValues.camera.orbitSpeed : 0.5}
              </span>
            </div>
            <Slider
              value={[typeof effectValues.camera?.orbitSpeed === 'number' ? effectValues.camera.orbitSpeed : 0.5]}
              onValueChange={([value]) => onEffectChange('camera', 'orbitSpeed', value)}
              max={2}
              min={0}
              step={0.1}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Distance</span>
              <span className="text-xs text-white/50">
                {typeof effectValues.camera?.distance === 'number' ? effectValues.camera.distance : 8}
              </span>
            </div>
            <Slider
              value={[typeof effectValues.camera?.distance === 'number' ? effectValues.camera.distance : 8]}
              onValueChange={([value]) => onEffectChange('camera', 'distance', value)}
              max={15}
              min={3}
              step={0.5}
              className="w-full"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/70">Auto Rotate</span>
            <Switch
              checked={typeof effectValues.camera?.autoRotate === 'boolean' ? effectValues.camera.autoRotate : false}
              onCheckedChange={(checked) => onEffectChange('camera', 'autoRotate', checked)}
            />
          </div>
        </div>
      </div>

      {/* Material Properties */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-white/80">Material Properties</h3>
        
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Metalness</span>
              <span className="text-xs text-white/50">{Math.round(materialSettings.metalness * 100)}%</span>
            </div>
            <Slider
              value={[materialSettings.metalness]}
              onValueChange={([value]) => onMaterialSettingsChange({ metalness: value })}
              max={1}
              min={0}
              step={0.01}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Roughness</span>
              <span className="text-xs text-white/50">{Math.round(materialSettings.roughness * 100)}%</span>
            </div>
            <Slider
              value={[materialSettings.roughness]}
              onValueChange={([value]) => onMaterialSettingsChange({ roughness: value })}
              max={1}
              min={0}
              step={0.01}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Clearcoat</span>
              <span className="text-xs text-white/50">{Math.round(materialSettings.clearcoat * 100)}%</span>
            </div>
            <Slider
              value={[materialSettings.clearcoat]}
              onValueChange={([value]) => onMaterialSettingsChange({ clearcoat: value })}
              max={1}
              min={0}
              step={0.01}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Effect Controls */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-white/80">Effects</h3>
        
        <div className="space-y-3">
          {Object.entries(effectValues).map(([effectId, effect]) => {
            if (effectId === 'camera') return null; // Skip camera as it's handled above
            
            return (
              <div key={effectId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70 capitalize">{effectId}</span>
                  <Switch
                    checked={typeof effect.enabled === 'boolean' ? effect.enabled : false}
                    onCheckedChange={(checked) => onEffectChange(effectId, 'enabled', checked)}
                  />
                </div>
                {effect.enabled && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/50">Intensity</span>
                      <span className="text-xs text-white/50">
                        {Math.round((typeof effect.intensity === 'number' ? effect.intensity : 0) * 100)}%
                      </span>
                    </div>
                    <Slider
                      value={[typeof effect.intensity === 'number' ? effect.intensity : 0]}
                      onValueChange={([value]) => onEffectChange(effectId, 'intensity', value)}
                      max={1}
                      min={0}
                      step={0.01}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset Button */}
      <div className="pt-4 border-t border-white/10">
        <Button
          variant="outline"
          onClick={onResetAllEffects}
          className="w-full border-white/20 text-white hover:bg-white/10"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset All Effects
        </Button>
      </div>
    </div>
  );
};
