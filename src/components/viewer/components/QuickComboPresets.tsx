
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Sun, Palette, Diamond, Flame } from 'lucide-react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset } from '../types';
import { ENVIRONMENT_SCENES, LIGHTING_PRESETS } from '../constants';

interface ComboPreset {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  effects: EffectValues;
  scene?: EnvironmentScene;
  lighting?: LightingPreset;
}

interface QuickComboPresetsProps {
  onApplyCombo: (combo: ComboPreset) => void;
}

export const QuickComboPresets: React.FC<QuickComboPresetsProps> = ({ onApplyCombo }) => {
  const presets: ComboPreset[] = [
    {
      id: 'holographic',
      name: 'Holographic',
      icon: Sparkles,
      color: 'from-purple-500 to-blue-500',
      effects: {
        holographic: { intensity: 85, shiftSpeed: 150, rainbowSpread: 280, prismaticDepth: 70 },
        foilspray: { intensity: 20 },
        prizm: { intensity: 0 },
        chrome: { intensity: 0 },
        interference: { intensity: 0 },
        brushedmetal: { intensity: 0 },
        crystal: { intensity: 0 },
        vintage: { intensity: 0 }
      },
      scene: ENVIRONMENT_SCENES.find(s => s.name === 'Cosmic Void'),
      lighting: LIGHTING_PRESETS.find(l => l.name === 'Dramatic')
    },
    {
      id: 'golden',
      name: 'Golden Premium',
      icon: Flame,
      color: 'from-amber-500 to-yellow-500',
      effects: {
        holographic: { intensity: 0 },
        foilspray: { intensity: 60, density: 80 },
        prizm: { intensity: 0 },
        chrome: { intensity: 40 },
        interference: { intensity: 0 },
        brushedmetal: { intensity: 70, grainSize: 25 },
        crystal: { intensity: 0 },
        vintage: { intensity: 0 }
      },
      scene: ENVIRONMENT_SCENES.find(s => s.name === 'Studio'),
      lighting: LIGHTING_PRESETS.find(l => l.name === 'Golden Hour')
    },
    {
      id: 'prizm',
      name: 'Prizm Rainbow',
      icon: Palette,
      color: 'from-red-500 to-purple-500',
      effects: {
        holographic: { intensity: 30 },
        foilspray: { intensity: 0 },
        prizm: { intensity: 90, speed: 200, complexity: 75 },
        chrome: { intensity: 0 },
        interference: { intensity: 60 },
        brushedmetal: { intensity: 0 },
        crystal: { intensity: 0 },
        vintage: { intensity: 0 }
      },
      scene: ENVIRONMENT_SCENES.find(s => s.name === 'Rainbow Gradient'),
      lighting: LIGHTING_PRESETS.find(l => l.name === 'Vibrant')
    },
    {
      id: 'crystal',
      name: 'Crystal Clear',
      icon: Diamond,
      color: 'from-blue-400 to-cyan-400',
      effects: {
        holographic: { intensity: 0 },
        foilspray: { intensity: 0 },
        prizm: { intensity: 0 },
        chrome: { intensity: 30 },
        interference: { intensity: 0 },
        brushedmetal: { intensity: 0 },
        crystal: { intensity: 85, clarity: 90, refraction: 70 },
        vintage: { intensity: 0 }
      },
      scene: ENVIRONMENT_SCENES.find(s => s.name === 'Arctic'),
      lighting: LIGHTING_PRESETS.find(l => l.name === 'Cool Blue')
    },
    {
      id: 'vintage',
      name: 'Vintage Film',
      icon: Sun,
      color: 'from-orange-600 to-amber-600',
      effects: {
        holographic: { intensity: 0 },
        foilspray: { intensity: 0 },
        prizm: { intensity: 0 },
        chrome: { intensity: 0 },
        interference: { intensity: 0 },
        brushedmetal: { intensity: 0 },
        crystal: { intensity: 0 },
        vintage: { intensity: 80, grainIntensity: 60, warmth: 75 }
      },
      scene: ENVIRONMENT_SCENES.find(s => s.name === 'Sunset'),
      lighting: LIGHTING_PRESETS.find(l => l.name === 'Warm')
    },
    {
      id: 'electric',
      name: 'Electric',
      icon: Zap,
      color: 'from-cyan-500 to-blue-500',
      effects: {
        holographic: { intensity: 60 },
        foilspray: { intensity: 0 },
        prizm: { intensity: 40 },
        chrome: { intensity: 50 },
        interference: { intensity: 80 },
        brushedmetal: { intensity: 0 },
        crystal: { intensity: 0 },
        vintage: { intensity: 0 }
      },
      scene: ENVIRONMENT_SCENES.find(s => s.name === 'Neon City'),
      lighting: LIGHTING_PRESETS.find(l => l.name === 'Electric Blue')
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {presets.map((preset) => {
        const Icon = preset.icon;
        return (
          <Button
            key={preset.id}
            onClick={() => onApplyCombo(preset)}
            variant="outline"
            size="sm"
            className="border-editor-border text-white hover:bg-editor-border p-3 h-auto flex flex-col items-center space-y-1"
          >
            <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${preset.color} flex items-center justify-center`}>
              <Icon className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs">{preset.name}</span>
          </Button>
        );
      })}
    </div>
  );
};
