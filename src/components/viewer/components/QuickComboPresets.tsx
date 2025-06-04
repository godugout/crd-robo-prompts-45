
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
    name: 'Holographic',
    icon: Sparkles,
    description: 'Rainbow holographic with chrome accents',
    effects: {
      holographic: { intensity: 85, shiftSpeed: 150, rainbowSpread: 270, animated: true },
      chrome: { intensity: 45, sharpness: 80, highlightSize: 60 }
    }
  },
  {
    id: 'metallic-prizm',
    name: 'Prizm',
    icon: Gem,
    description: 'Prismatic colors with brushed metal',
    effects: {
      prizm: { intensity: 70, complexity: 7, colorSeparation: 80 },
      brushedmetal: { intensity: 55, direction: 45, grainDensity: 12 }
    }
  },
  {
    id: 'crystal-interference',
    name: 'Crystal',
    icon: Zap,
    description: 'Crystal facets with soap bubble effects',
    effects: {
      crystal: { intensity: 80, facets: 12, dispersion: 85 },
      interference: { intensity: 60, frequency: 15, thickness: 4 }
    }
  },
  {
    id: 'vintage-foil',
    name: 'Vintage',
    icon: Clock,
    description: 'Aged patina with metallic foil spray',
    effects: {
      vintage: { intensity: 65, aging: 70, patina: '#8b6914' },
      foilspray: { intensity: 50, density: 60, direction: 90 }
    }
  },
  {
    id: 'golden-fire',
    name: 'Golden',
    icon: Flame,
    description: 'Warm gold tones with chromatic shift',
    effects: {
      gold: { intensity: 75, warmth: 80, shimmer: 90 },
      chromatic: { intensity: 40, aberration: 3, dispersion: 60 }
    }
  },
  {
    id: 'ice-crystal',
    name: 'Ice',
    icon: Snowflake,
    description: 'Cool crystal with silver highlights',
    effects: {
      crystal: { intensity: 70, facets: 8, dispersion: 70 },
      chrome: { intensity: 35, sharpness: 90, highlightSize: 40 }
    }
  },
  {
    id: 'solar-flare',
    name: 'Solar',
    icon: Sun,
    description: 'Bright holographic with gold warmth',
    effects: {
      holographic: { intensity: 60, shiftSpeed: 180, rainbowSpread: 200, animated: true },
      gold: { intensity: 45, warmth: 95, shimmer: 70 }
    }
  },
  {
    id: 'lunar-shimmer',
    name: 'Lunar',
    icon: Moon,
    description: 'Subtle interference with vintage charm',
    effects: {
      interference: { intensity: 45, frequency: 12, thickness: 3 },
      vintage: { intensity: 35, aging: 40, patina: '#c0c0c0' }
    }
  },
  {
    id: 'starlight-spray',
    name: 'Starlight',
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
    <TooltipProvider>
      <div className="space-y-1">
        {COMBO_PRESETS.map((preset) => {
          const IconComponent = preset.icon;
          return (
            <Tooltip key={preset.id}>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => onApplyCombo(preset)}
                  variant="outline"
                  className="w-full h-8 px-2 flex items-center justify-start space-x-2 border-editor-border hover:border-crd-green hover:bg-crd-green/10 text-xs"
                >
                  <IconComponent className="w-3 h-3 text-crd-green flex-shrink-0" />
                  <span className="text-white font-medium truncate">
                    {preset.name}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="bg-black border-gray-700 text-white">
                <div className="text-center">
                  <div className="font-medium">{preset.name}</div>
                  <div className="text-xs text-gray-300">{preset.description}</div>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
};
