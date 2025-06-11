
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RotateCcw, Sparkles } from 'lucide-react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

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

const STYLE_PRESETS = [
  'Ocean Waves', 'Custom', 'Holographic', 'Crystal', 'Chrome', 'Golden',
  'Ocean', 'Aurora', 'Prizm', 'Vintage', 'Ice', 'Starlight', 'Lunar'
];

const ENVIRONMENT_2D = [
  'Enchanted Forest', 'Mountain Vista', 'Crystal Cavern', 'Neon Metropolis'
];

const LIGHTING_PRESETS = ['Natural', 'Dramatic', 'Soft', 'Vibrant'];

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
  // Stabilize callbacks to prevent re-renders
  const handleHolographicChange = useCallback((value: number[]) => {
    onEffectChange('holographic', 'intensity', value[0]);
  }, [onEffectChange]);

  const handleFoilSprayChange = useCallback((value: number[]) => {
    onEffectChange('foilspray', 'intensity', value[0]);
  }, [onEffectChange]);

  const handlePrizmChange = useCallback((value: number[]) => {
    onEffectChange('prizm', 'intensity', value[0]);
  }, [onEffectChange]);

  const handleChromeChange = useCallback((value: number[]) => {
    onEffectChange('chrome', 'intensity', value[0]);
  }, [onEffectChange]);

  const handleCrystalChange = useCallback((value: number[]) => {
    onEffectChange('crystal', 'intensity', value[0]);
  }, [onEffectChange]);

  const handleGoldChange = useCallback((value: number[]) => {
    onEffectChange('gold', 'intensity', value[0]);
  }, [onEffectChange]);

  const handleMetalnessChange = useCallback((value: number[]) => {
    onMaterialSettingsChange({ metalness: value[0] / 100 });
  }, [onMaterialSettingsChange]);

  const handleRoughnessChange = useCallback((value: number[]) => {
    onMaterialSettingsChange({ roughness: value[0] / 100 });
  }, [onMaterialSettingsChange]);

  const handleReflectivityChange = useCallback((value: number[]) => {
    onMaterialSettingsChange({ reflectivity: value[0] });
  }, [onMaterialSettingsChange]);

  const handleClearcoatChange = useCallback((value: number[]) => {
    onMaterialSettingsChange({ clearcoat: value[0] / 100 });
  }, [onMaterialSettingsChange]);

  return (
    <div className="p-4 space-y-6 text-white overflow-y-auto">
      {/* Header with Reset */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-crd-green" />
          Studio Controls
        </h3>
        <Button
          onClick={onResetAllEffects}
          variant="outline"
          size="sm"
          className="border-white/20 text-white hover:bg-white/10"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Styles Section */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-white/80">Styles</h4>
        <div className="grid grid-cols-2 gap-2">
          {STYLE_PRESETS.slice(0, 8).map((preset) => (
            <Button
              key={preset}
              variant="outline"
              size="sm"
              className="h-8 text-xs border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
            >
              {preset}
            </Button>
          ))}
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* Effects Controls */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-white/80">Effects</h4>
        
        {/* Holographic */}
        <div className="space-y-2">
          <Label className="text-xs text-white/70">Holographic</Label>
          <Slider
            value={[effectValues.holographic?.intensity || 0]}
            onValueChange={handleHolographicChange}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        {/* Foil Spray */}
        <div className="space-y-2">
          <Label className="text-xs text-white/70">Foil Spray</Label>
          <Slider
            value={[effectValues.foilspray?.intensity || 0]}
            onValueChange={handleFoilSprayChange}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        {/* Prizm */}
        <div className="space-y-2">
          <Label className="text-xs text-white/70">Prizm</Label>
          <Slider
            value={[effectValues.prizm?.intensity || 0]}
            onValueChange={handlePrizmChange}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        {/* Chrome */}
        <div className="space-y-2">
          <Label className="text-xs text-white/70">Chrome</Label>
          <Slider
            value={[effectValues.chrome?.intensity || 0]}
            onValueChange={handleChromeChange}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        {/* Crystal */}
        <div className="space-y-2">
          <Label className="text-xs text-white/70">Crystal</Label>
          <Slider
            value={[effectValues.crystal?.intensity || 0]}
            onValueChange={handleCrystalChange}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        {/* Gold */}
        <div className="space-y-2">
          <Label className="text-xs text-white/70">Gold</Label>
          <Slider
            value={[effectValues.gold?.intensity || 0]}
            onValueChange={handleGoldChange}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* 2D Environments */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-white/80">2D Environments</h4>
        <div className="grid grid-cols-1 gap-2">
          {ENVIRONMENT_2D.map((env) => (
            <Button
              key={env}
              variant="outline"
              size="sm"
              className="h-8 text-xs border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
            >
              {env}
            </Button>
          ))}
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* Lighting */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-white/80">Lighting</h4>
        
        <div className="grid grid-cols-2 gap-2">
          {LIGHTING_PRESETS.map((preset) => (
            <Button
              key={preset}
              variant="outline"
              size="sm"
              className="h-8 text-xs border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
            >
              {preset}
            </Button>
          ))}
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-white/70">Overall Brightness</Label>
          <Slider
            value={overallBrightness}
            onValueChange={onBrightnessChange}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-xs text-white/70">Interactive Lighting</Label>
          <Switch checked={interactiveLighting} onCheckedChange={onInteractiveLightingToggle} />
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* Surface/Material Properties */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-white/80">Surface/Material Properties</h4>
        
        <div className="space-y-2">
          <Label className="text-xs text-white/70">Metalness</Label>
          <Slider
            value={[materialSettings.metalness * 100]}
            onValueChange={handleMetalnessChange}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-white/70">Roughness</Label>
          <Slider
            value={[materialSettings.roughness * 100]}
            onValueChange={handleRoughnessChange}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-white/70">Reflectivity</Label>
          <Slider
            value={[materialSettings.reflectivity]}
            onValueChange={handleReflectivityChange}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-white/70">Clearcoat</Label>
          <Slider
            value={[materialSettings.clearcoat * 100]}
            onValueChange={handleClearcoatChange}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};
