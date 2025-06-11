
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import type { LightingPreset } from '../types';
import { LIGHTING_PRESETS } from '../constants';

interface LightingComboSectionProps {
  selectedLighting: LightingPreset;
  overallBrightness: number[];
  interactiveLighting: boolean;
  onLightingChange: (lighting: LightingPreset) => void;
  onBrightnessChange: (value: number[]) => void;
  onInteractiveLightingToggle: () => void;
}

export const LightingComboSection: React.FC<LightingComboSectionProps> = ({
  selectedLighting,
  overallBrightness,
  interactiveLighting,
  onLightingChange,
  onBrightnessChange,
  onInteractiveLightingToggle
}) => {
  return (
    <div className="space-y-4">
      {/* Lighting Presets */}
      <div className="grid grid-cols-2 gap-2">
        {LIGHTING_PRESETS.map((preset) => (
          <Button
            key={preset.id}
            onClick={() => onLightingChange(preset.id)}
            variant={selectedLighting === preset.id ? "default" : "outline"}
            className={`h-auto p-2 flex flex-col items-center space-y-1 text-xs ${
              selectedLighting === preset.id
                ? 'bg-crd-green text-black border-crd-green'
                : 'border-editor-border hover:border-crd-green hover:bg-crd-green/10 text-white'
            }`}
          >
            <span className="font-medium">{preset.name}</span>
            <span className="text-center leading-tight opacity-70">
              {preset.description}
            </span>
          </Button>
        ))}
      </div>

      {/* Overall Brightness */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-white text-sm font-medium">Overall Brightness</label>
          <span className="text-crd-lightGray text-xs">
            {overallBrightness[0]}%
          </span>
        </div>
        <Slider
          value={overallBrightness}
          onValueChange={onBrightnessChange}
          min={50}
          max={200}
          step={5}
          className="w-full"
        />
      </div>

      {/* Interactive Lighting Toggle */}
      <div className="flex items-center justify-between">
        <label className="text-white text-sm font-medium">Interactive Lighting</label>
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
  );
};
