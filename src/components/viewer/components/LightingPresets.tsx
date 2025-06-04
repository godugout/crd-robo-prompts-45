
import React from 'react';
import { Palette } from 'lucide-react';
import { LIGHTING_PRESETS } from '../constants';
import type { LightingPreset } from '../types';

interface LightingPresetsProps {
  selectedLighting: LightingPreset;
  onLightingChange: (lighting: LightingPreset) => void;
}

export const LightingPresets: React.FC<LightingPresetsProps> = ({
  selectedLighting,
  onLightingChange
}) => {
  return (
    <div>
      <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
        <Palette className="w-5 h-5 mr-2 text-yellow-400" />
        Lighting
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {LIGHTING_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onLightingChange(preset)}
            className={`p-4 rounded-lg text-left transition-colors ${
              selectedLighting.id === preset.id 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <div className="font-medium text-sm">{preset.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
