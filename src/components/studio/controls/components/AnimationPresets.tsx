
import React from 'react';
import { Card } from '@/components/ui/card';
import { RotateCw, ArrowUp, Sparkles, Eye } from 'lucide-react';

const ANIMATION_PRESETS = [
  { 
    id: 'rotate', 
    name: 'Rotate', 
    icon: RotateCw, 
    color: 'from-blue-400 to-cyan-500',
    description: 'Smooth rotation animation'
  },
  { 
    id: 'float', 
    name: 'Float', 
    icon: ArrowUp, 
    color: 'from-green-400 to-teal-500',
    description: 'Gentle floating motion'
  },
  { 
    id: 'pulse', 
    name: 'Pulse', 
    icon: Sparkles, 
    color: 'from-purple-400 to-pink-500',
    description: 'Pulsing scale effect'
  },
  { 
    id: 'reveal', 
    name: 'Reveal', 
    icon: Eye, 
    color: 'from-orange-400 to-red-500',
    description: 'Card reveal animation'
  }
];

interface AnimationPresetsProps {
  currentPreset: string;
  onPresetSelect: (presetId: string) => void;
}

export const AnimationPresets: React.FC<AnimationPresetsProps> = ({
  currentPreset,
  onPresetSelect
}) => {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-300">Animation Presets</h4>
      <div className="grid grid-cols-1 gap-3">
        {ANIMATION_PRESETS.map((preset) => {
          const Icon = preset.icon;
          const isActive = currentPreset === preset.id;
          
          return (
            <Card
              key={preset.id}
              className={`p-4 cursor-pointer transition-all duration-300 ${
                isActive 
                  ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/25' 
                  : 'border-white/10 bg-black/20 hover:border-purple-500/50 hover:bg-purple-500/5'
              }`}
              onClick={() => onPresetSelect(preset.id)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${preset.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">{preset.name}</div>
                  <div className="text-gray-400 text-xs">{preset.description}</div>
                </div>
                {isActive && (
                  <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse" />
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
