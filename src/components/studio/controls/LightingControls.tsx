
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Sun, Moon, Zap } from 'lucide-react';

const LIGHTING_PRESETS = [
  { name: 'Studio', icon: Lightbulb, color: 'from-white to-gray-300' },
  { name: 'Dramatic', icon: Moon, color: 'from-gray-800 to-black' },
  { name: 'Soft', icon: Sun, color: 'from-yellow-200 to-orange-300' },
  { name: 'Neon', icon: Zap, color: 'from-purple-400 to-blue-500' }
];

export const LightingControls: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-yellow-400">Lighting</h3>
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
          Studio
        </Badge>
      </div>

      {/* Lighting Presets */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-300">Presets</h4>
        <div className="grid grid-cols-2 gap-2">
          {LIGHTING_PRESETS.map((preset, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="border-white/20 hover:border-white/40 text-white hover:bg-white/10 flex-col h-auto p-3"
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${preset.color} flex items-center justify-center mb-2`}>
                <preset.icon className="w-4 h-4 text-gray-800" />
              </div>
              <span className="text-xs">{preset.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Lighting Controls */}
      <Card className="p-4 bg-black/20 border-white/10">
        <h4 className="text-sm font-medium text-white mb-3">Manual Controls</h4>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Intensity</span>
              <span className="text-xs text-yellow-400">80%</span>
            </div>
            <Slider
              defaultValue={[80]}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Color Temperature</span>
              <span className="text-xs text-yellow-400">5500K</span>
            </div>
            <Slider
              defaultValue={[5500]}
              min={2700}
              max={9000}
              step={100}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Shadow Intensity</span>
              <span className="text-xs text-yellow-400">40%</span>
            </div>
            <Slider
              defaultValue={[40]}
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
