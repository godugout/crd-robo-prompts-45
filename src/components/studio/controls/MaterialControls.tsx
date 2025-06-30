
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Sparkles, 
  Zap, 
  Diamond,
  Paintbrush,
  Droplets
} from 'lucide-react';

const MATERIAL_PRESETS = [
  { name: 'Metallic Gold', icon: Diamond, color: 'from-yellow-400 to-yellow-600' },
  { name: 'Chrome', icon: Sparkles, color: 'from-gray-300 to-gray-500' },
  { name: 'Crystal Glass', icon: Droplets, color: 'from-cyan-300 to-blue-400' },
  { name: 'Holographic', icon: Paintbrush, color: 'from-purple-400 to-pink-500' }
];

export const MaterialControls: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-orange-400">Materials</h3>
        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50">
          Standard
        </Badge>
      </div>

      {/* Material Presets */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-300">Quick Presets</h4>
        <div className="grid grid-cols-2 gap-2">
          {MATERIAL_PRESETS.map((preset, index) => (
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

      {/* Material Properties */}
      <Card className="p-4 bg-black/20 border-white/10">
        <h4 className="text-sm font-medium text-white mb-3">Properties</h4>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Metalness</span>
              <span className="text-xs text-orange-400">30%</span>
            </div>
            <Slider
              defaultValue={[30]}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Roughness</span>
              <span className="text-xs text-orange-400">60%</span>
            </div>
            <Slider
              defaultValue={[60]}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Transparency</span>
              <span className="text-xs text-orange-400">0%</span>
            </div>
            <Slider
              defaultValue={[0]}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
