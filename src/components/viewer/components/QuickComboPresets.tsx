
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Gem, Clock } from 'lucide-react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset } from '../types';

interface ComboPreset {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  effects: EffectValues;
  scene?: EnvironmentScene;
  lighting?: LightingPreset;
}

const COMBO_PRESETS: ComboPreset[] = [
  {
    id: 'holographic-burst',
    name: 'Holographic Burst',
    icon: Sparkles,
    description: 'Rainbow holographic with chrome accents',
    effects: {
      holographic: { intensity: 85, shiftSpeed: 150, rainbowSpread: 270, animated: true },
      chrome: { intensity: 45, sharpness: 80, highlightSize: 60 }
    }
  },
  {
    id: 'metallic-prizm',
    name: 'Metallic Prizm',
    icon: Gem,
    description: 'Prismatic colors with brushed metal',
    effects: {
      prizm: { intensity: 70, complexity: 7, colorSeparation: 80 },
      brushedmetal: { intensity: 55, direction: 45, grainDensity: 12 }
    }
  },
  {
    id: 'crystal-interference',
    name: 'Crystal Interference',
    icon: Zap,
    description: 'Crystal facets with soap bubble effects',
    effects: {
      crystal: { intensity: 80, facets: 12, dispersion: 85 },
      interference: { intensity: 60, frequency: 15, thickness: 4 }
    }
  },
  {
    id: 'vintage-foil',
    name: 'Vintage Foil',
    icon: Clock,
    description: 'Aged patina with metallic foil spray',
    effects: {
      vintage: { intensity: 65, aging: 70, patina: '#8b6914' },
      foilspray: { intensity: 50, density: 60, direction: 90 }
    }
  }
];

interface QuickComboPresetsProps {
  onApplyCombo: (combo: ComboPreset) => void;
}

export const QuickComboPresets: React.FC<QuickComboPresetsProps> = ({ onApplyCombo }) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {COMBO_PRESETS.map((preset) => {
        const IconComponent = preset.icon;
        return (
          <Button
            key={preset.id}
            onClick={() => onApplyCombo(preset)}
            variant="outline"
            className="h-auto p-3 flex flex-col items-center space-y-1 border-editor-border hover:border-crd-green hover:bg-crd-green/10"
          >
            <IconComponent className="w-5 h-5 text-crd-green" />
            <span className="text-white text-xs font-medium">{preset.name}</span>
            <span className="text-crd-lightGray text-xs text-center leading-tight">
              {preset.description}
            </span>
          </Button>
        );
      })}
    </div>
  );
};
