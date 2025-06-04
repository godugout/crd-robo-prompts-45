
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Sun } from 'lucide-react';
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
      <div className="space-y-2">
        <h4 className="text-white text-sm font-medium flex items-center">
          <Sun className="w-4 h-4 mr-2" />
          Presets
        </h4>
        <div className="space-y-1">
          {LIGHTING_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onLightingChange(preset)}
              className={`w-full p-2 rounded text-left transition-colors text-sm ${
                selectedLighting.id === preset.id 
                  ? 'bg-crd-green text-black font-medium' 
                  : 'bg-editor-border text-gray-300 hover:bg-editor-border/80'
              }`}
            >
              <div className="font-medium">{preset.name}</div>
              <div className="text-xs opacity-75">{preset.description}</div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Brightness Control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-white text-sm">Brightness</label>
          <span className="text-crd-lightGray text-xs">{overallBrightness[0]}%</span>
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
        <span className="text-white text-sm">Interactive</span>
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
