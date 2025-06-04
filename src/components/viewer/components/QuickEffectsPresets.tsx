
import React, { useCallback } from 'react';
import { Sparkles, Zap, Crown, X } from 'lucide-react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

// Quick preset definitions
const QUICK_PRESETS = [
  {
    id: 'holographic',
    name: 'Holographic',
    icon: <Sparkles className="w-4 h-4" />,
    color: 'bg-purple-600',
    effects: {
      holographic: { intensity: 85, shiftSpeed: 150, rainbowSpread: 280, prismaticDepth: 70 },
      foilspray: { intensity: 0 },
      prizm: { intensity: 0 },
      chrome: { intensity: 0 },
      interference: { intensity: 0 },
      brushedmetal: { intensity: 0 },
      crystal: { intensity: 0 },
      vintage: { intensity: 0 }
    }
  },
  {
    id: 'chrome',
    name: 'Chrome',
    icon: <Zap className="w-4 h-4" />,
    color: 'bg-blue-600',
    effects: {
      holographic: { intensity: 0 },
      foilspray: { intensity: 0 },
      prizm: { intensity: 0 },
      chrome: { intensity: 90 },
      interference: { intensity: 0 },
      brushedmetal: { intensity: 30 },
      crystal: { intensity: 0 },
      vintage: { intensity: 0 }
    }
  },
  {
    id: 'gold',
    name: 'Gold',
    icon: <Crown className="w-4 h-4" />,
    color: 'bg-yellow-600',
    effects: {
      holographic: { intensity: 0 },
      foilspray: { intensity: 70 },
      prizm: { intensity: 0 },
      chrome: { intensity: 40 },
      interference: { intensity: 0 },
      brushedmetal: { intensity: 50 },
      crystal: { intensity: 0 },
      vintage: { intensity: 0 }
    }
  },
  {
    id: 'none',
    name: 'None',
    icon: <X className="w-4 h-4" />,
    color: 'bg-gray-600',
    effects: {
      holographic: { intensity: 0 },
      foilspray: { intensity: 0 },
      prizm: { intensity: 0 },
      chrome: { intensity: 0 },
      interference: { intensity: 0 },
      brushedmetal: { intensity: 0 },
      crystal: { intensity: 0 },
      vintage: { intensity: 0 }
    }
  }
];

interface QuickEffectsPresetsProps {
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
}

export const QuickEffectsPresets: React.FC<QuickEffectsPresetsProps> = ({
  onEffectChange
}) => {
  const handlePresetApply = useCallback((preset: typeof QUICK_PRESETS[0]) => {
    Object.entries(preset.effects).forEach(([effectId, parameters]) => {
      Object.entries(parameters).forEach(([parameterId, value]) => {
        onEffectChange(effectId, parameterId, value);
      });
    });
  }, [onEffectChange]);

  return (
    <div>
      <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
        <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
        Quick Effects
      </h3>
      <div className="grid grid-cols-4 gap-4">
        {QUICK_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handlePresetApply(preset)}
            className={`p-4 rounded-xl border-2 border-transparent hover:border-white/30 transition-all ${preset.color} bg-opacity-20 hover:bg-opacity-30 hover:scale-105`}
          >
            <div className="flex flex-col items-center space-y-2 text-white">
              {preset.icon}
              <span className="text-sm font-medium">{preset.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
