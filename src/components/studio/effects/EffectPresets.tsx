
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { EffectLayerData } from './EffectLayer';

interface EffectPreset {
  id: string;
  name: string;
  description: string;
  type: EffectLayerData['type'];
  icon: string;
  gradient: string;
  parameters: Record<string, number>;
}

const EFFECT_PRESETS: EffectPreset[] = [
  {
    id: 'holo-classic',
    name: 'Classic Holo',
    description: 'Traditional holographic effect',
    type: 'holographic',
    icon: '✨',
    gradient: 'from-purple-500 to-pink-500',
    parameters: { intensity: 75, spread: 40, shimmer: 60, depth: 30 }
  },
  {
    id: 'metal-chrome',
    name: 'Chrome Metal',
    description: 'Reflective metallic surface',
    type: 'metallic',
    icon: '🔮',
    gradient: 'from-gray-400 to-gray-600',
    parameters: { intensity: 80, spread: 25, shimmer: 50, depth: 45 }
  },
  {
    id: 'rainbow-prism',
    name: 'Rainbow Prism',
    description: 'Multi-color prismatic effect',
    type: 'prismatic',
    icon: '🌈',
    gradient: 'from-red-500 via-yellow-500 to-blue-500',
    parameters: { intensity: 90, spread: 60, shimmer: 80, depth: 35 }
  },
  {
    id: 'vintage-sepia',
    name: 'Vintage Sepia',
    description: 'Classic aged card look',
    type: 'vintage',
    icon: '📸',
    gradient: 'from-yellow-600 to-orange-600',
    parameters: { intensity: 60, spread: 20, shimmer: 30, depth: 20 }
  },
  {
    id: 'crystal-clear',
    name: 'Crystal Clear',
    description: 'Transparent crystal effect',
    type: 'crystal',
    icon: '💎',
    gradient: 'from-cyan-400 to-blue-500',
    parameters: { intensity: 70, spread: 35, shimmer: 70, depth: 40 }
  },
  {
    id: 'gold-foil',
    name: 'Gold Foil',
    description: 'Luxurious gold foil finish',
    type: 'foil',
    icon: '⚡',
    gradient: 'from-yellow-400 to-yellow-600',
    parameters: { intensity: 85, spread: 30, shimmer: 90, depth: 50 }
  }
];

interface EffectPresetsProps {
  onApplyPreset: (preset: EffectPreset) => void;
}

export const EffectPresets: React.FC<EffectPresetsProps> = ({ onApplyPreset }) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h4 className="text-white font-medium mb-2">Professional Presets</h4>
        <p className="text-crd-lightGray text-sm">
          Carefully crafted effect combinations used by professional card creators
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {EFFECT_PRESETS.map((preset) => (
          <Card
            key={preset.id}
            className="p-4 bg-editor-tool border-editor-border hover:border-crd-green/50 transition-all cursor-pointer group"
            onClick={() => onApplyPreset(preset)}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${preset.gradient} flex items-center justify-center text-white`}>
                {preset.icon}
              </div>
              <div className="flex-1">
                <h5 className="text-white font-medium">{preset.name}</h5>
                <p className="text-crd-lightGray text-sm">{preset.description}</p>
              </div>
              <Button
                size="sm"
                className="bg-crd-green hover:bg-crd-green/90 text-black opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Apply
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-xs text-crd-lightGray p-3 bg-editor-darker rounded border border-editor-border">
        💡 <strong>Pro Tip:</strong> Layer multiple presets for unique combinations. 
        Start with a base effect like Classic Holo, then add accent effects for depth.
      </div>
    </div>
  );
};
