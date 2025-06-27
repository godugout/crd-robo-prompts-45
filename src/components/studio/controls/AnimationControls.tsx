
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Play, RotateCw, ArrowUp, Sparkles } from 'lucide-react';

const ANIMATION_PRESETS = [
  { name: 'Rotate', icon: RotateCw, color: 'from-blue-400 to-cyan-500' },
  { name: 'Float', icon: ArrowUp, color: 'from-green-400 to-teal-500' },
  { name: 'Pulse', icon: Sparkles, color: 'from-purple-400 to-pink-500' },
  { name: 'Reveal', icon: Play, color: 'from-orange-400 to-red-500' }
];

export const AnimationControls: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-purple-400">Animation</h3>
        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
          None
        </Badge>
      </div>

      {/* Animation Presets */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-300">Animation Presets</h4>
        <div className="grid grid-cols-2 gap-2">
          {ANIMATION_PRESETS.map((preset, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="border-white/20 hover:border-white/40 text-white hover:bg-white/10 flex-col h-auto p-3"
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${preset.color} flex items-center justify-center mb-2`}>
                <preset.icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs">{preset.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Animation Settings */}
      <Card className="p-4 bg-black/20 border-white/10">
        <h4 className="text-sm font-medium text-white mb-3">Settings</h4>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Speed</span>
              <span className="text-xs text-purple-400">50%</span>
            </div>
            <Slider
              defaultValue={[50]}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Amplitude</span>
              <span className="text-xs text-purple-400">75%</span>
            </div>
            <Slider
              defaultValue={[75]}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
          
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1 text-white border-white/20">
              <Play className="w-3 h-3 mr-1" />
              Preview
            </Button>
            <Button size="sm" variant="default" className="flex-1 bg-purple-500 hover:bg-purple-600 text-white">
              Apply
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
