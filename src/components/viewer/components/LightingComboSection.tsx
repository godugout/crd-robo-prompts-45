
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { LightingPreset } from '../types';
import { LIGHTING_PRESETS } from '../constants';

interface LightingComboSectionProps {
  selectedLighting: LightingPreset;
  overallBrightness: number[];
  onLightingChange: (lighting: LightingPreset) => void;
  onBrightnessChange: (value: number[]) => void;
}

export const LightingComboSection: React.FC<LightingComboSectionProps> = ({
  selectedLighting,
  overallBrightness,
  onLightingChange,
  onBrightnessChange
}) => {
  return (
    <div className="space-y-4">
      {/* Lighting Preset */}
      <div>
        <Label htmlFor="lighting-select" className="text-white text-sm mb-2 block">
          Lighting Preset
        </Label>
        <Select onValueChange={(value) => onLightingChange(JSON.parse(value))}>
          <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
            <SelectValue placeholder={selectedLighting.name} />
          </SelectTrigger>
          <SelectContent className="bg-black border-white/20">
            {LIGHTING_PRESETS.map((lighting) => (
              <SelectItem 
                key={lighting.name} 
                value={JSON.stringify(lighting)} 
                className="text-white hover:bg-white/10"
              >
                {lighting.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Brightness Control */}
      <div>
        <Label htmlFor="brightness-slider" className="text-white text-sm mb-2 block">
          Brightness: {overallBrightness[0]}%
        </Label>
        <Slider
          id="brightness-slider"
          value={overallBrightness}
          max={200}
          step={1}
          onValueChange={onBrightnessChange}
          className="w-full"
        />
      </div>

      {/* Lighting Info */}
      <div className="text-xs text-gray-400 space-y-1">
        <div>Color: {selectedLighting.color}</div>
        <div>Intensity: {selectedLighting.intensity}</div>
        <div>Angle: {selectedLighting.angle}°</div>
      </div>
    </div>
  );
};
