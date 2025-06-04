
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Gem, Clock, Flame, Snowflake, Sun, Moon, Star } from 'lucide-react';
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
  },
  {
    id: 'golden-fire',
    name: 'Golden Fire',
    icon: Flame,
    description: 'Warm gold tones with chromatic shift',
    effects: {
      gold: { intensity: 75, warmth: 80, shimmer: 90 },
      chromatic: { intensity: 40, aberration: 3, dispersion: 60 }
    }
  },
  {
    id: 'ice-crystal',
    name: 'Ice Crystal',
    icon: Snowflake,
    description: 'Cool crystal with silver highlights',
    effects: {
      crystal: { intensity: 70, facets: 8, dispersion: 70 },
      chrome: { intensity: 35, sharpness: 90, highlightSize: 40 }
    }
  },
  {
    id: 'solar-flare',
    name: 'Solar Flare',
    icon: Sun,
    description: 'Bright holographic with gold warmth',
    effects: {
      holographic: { intensity: 60, shiftSpeed: 180, rainbowSpread: 200, animated: true },
      gold: { intensity: 45, warmth: 95, shimmer: 70 }
    }
  },
  {
    id: 'lunar-shimmer',
    name: 'Lunar Shimmer',
    icon: Moon,
    description: 'Subtle interference with vintage charm',
    effects: {
      interference: { intensity: 45, frequency: 12, thickness: 3 },
      vintage: { intensity: 35, aging: 40, patina: '#c0c0c0' }
    }
  },
  {
    id: 'starlight-spray',
    name: 'Starlight Spray',
    icon: Star,
    description: 'Sparkling foil spray with prismatic edge',
    effects: {
      foilspray: { intensity: 65, density: 80, direction: 135 },
      prizm: { intensity: 40, complexity: 5, colorSeparation: 60 }
    }
  }
];

interface QuickComboPresetsProps {
  onApplyCombo: (combo: ComboPreset) => void;
}

export const QuickComboPresets: React.FC<QuickComboPresetsProps> = ({ onApplyCombo }) => {
  return (
    <div className="grid grid-cols-3 gap-2">
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
