
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RotateCcw, Sparkles } from 'lucide-react';
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
            onValueChange={(value) => onEffectChange('holographic', 'intensity', value[0])}
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
            onValueChange={(value) => onEffectChange('foilspray', 'intensity', value[0])}
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
            onValueChange={(value) => onEffectChange('prizm', 'intensity', value[0])}
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
            onValueChange={(value) => onEffectChange('chrome', 'intensity', value[0])}
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
            onValueChange={(value) => onEffectChange('crystal', 'intensity', value[0])}
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
            onValueChange={(value) => onEffectChange('gold', 'intensity', value[0])}
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

      {/* Camera Controls */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-white/80">Camera Controls</h4>
        
        <div className="space-y-2">
          <Label className="text-xs text-white/70">Orbit Speed</Label>
          <Slider
            value={[50]}
            onValueChange={(value) => {}}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-white/70">Camera Distance</Label>
          <Slider
            value={[80]}
            onValueChange={(value) => {}}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* Card Physics */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-white/80">Card Physics</h4>
        
        <div className="space-y-2">
          <Label className="text-xs text-white/70">Float Intensity</Label>
          <Slider
            value={[30]}
            onValueChange={(value) => {}}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-white/70">Gravity Effect</Label>
          <Slider
            value={[20]}
            onValueChange={(value) => {}}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-xs text-white/70">Auto Rotate Card</Label>
          <Switch checked={false} onCheckedChange={() => {}} />
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
            onValueChange={(value) => onMaterialSettingsChange({ metalness: value[0] / 100 })}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-white/70">Roughness</Label>
          <Slider
            value={[materialSettings.roughness * 100]}
            onValueChange={(value) => onMaterialSettingsChange({ roughness: value[0] / 100 })}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-white/70">Reflectivity</Label>
          <Slider
            value={[materialSettings.reflectivity]}
            onValueChange={(value) => onMaterialSettingsChange({ reflectivity: value[0] })}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-white/70">Clearcoat</Label>
          <Slider
            value={[materialSettings.clearcoat * 100]}
            onValueChange={(value) => onMaterialSettingsChange({ clearcoat: value[0] / 100 })}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};
