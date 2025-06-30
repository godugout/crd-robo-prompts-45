
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Palette, Sun, Mountain, Building } from 'lucide-react';

const ENVIRONMENT_PRESETS = [
  { id: 'studio', name: 'Photo Studio', icon: Building, color: 'from-gray-400 to-gray-600' },
  { id: 'nature', name: 'Natural Light', icon: Sun, color: 'from-green-400 to-blue-500' },
  { id: 'sunset', name: 'Golden Hour', icon: Mountain, color: 'from-orange-400 to-red-500' },
  { id: 'neon', name: 'Neon City', icon: Palette, color: 'from-purple-400 to-pink-500' }
];

export const EnvironmentControls: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-blue-400">Environment</h3>
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
          Studio
        </Badge>
      </div>

      {/* Environment Presets */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-300">Environments</h4>
        <div className="grid grid-cols-2 gap-2">
          {ENVIRONMENT_PRESETS.map((preset) => (
            <Button
              key={preset.id}
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

      {/* Background Controls */}
      <Card className="p-4 bg-black/20 border-white/10">
        <h4 className="text-sm font-medium text-white mb-3">Background</h4>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Blur</span>
              <span className="text-xs text-blue-400">50%</span>
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
              <span className="text-xs text-gray-400">Brightness</span>
              <span className="text-xs text-blue-400">75%</span>
            </div>
            <Slider
              defaultValue={[75]}
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
