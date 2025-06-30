
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Palette, Sun, Mountain, Building, Monitor, Lightbulb } from 'lucide-react';
import { useAdvancedStudio } from '@/contexts/AdvancedStudioContext';

const ENVIRONMENT_PRESETS = [
  { 
    id: 'studio', 
    name: 'Photo Studio', 
    icon: Building, 
    color: 'from-gray-400 to-gray-600',
    description: 'Professional studio lighting'
  },
  { 
    id: 'nature', 
    name: 'Natural Light', 
    icon: Sun, 
    color: 'from-green-400 to-blue-500',
    description: 'Outdoor natural lighting'
  },
  { 
    id: 'sunset', 
    name: 'Golden Hour', 
    icon: Mountain, 
    color: 'from-orange-400 to-red-500',
    description: 'Warm sunset atmosphere'
  },
  { 
    id: 'neon', 
    name: 'Neon City', 
    icon: Palette, 
    color: 'from-purple-400 to-pink-500',
    description: 'Cyberpunk neon vibes'
  }
];

export const EnhancedEnvironmentControls: React.FC = () => {
  const { state, updateEnvironment, applyPreset } = useAdvancedStudio();
  const { environment } = state;

  const handlePresetSelect = (presetId: string) => {
    applyPreset('environment', presetId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-blue-400">Environment</h3>
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50 capitalize">
          {environment.preset}
        </Badge>
      </div>

      {/* Environment Presets with Visual Cards */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-300">HDRI Environments</h4>
        <div className="grid grid-cols-1 gap-3">
          {ENVIRONMENT_PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isActive = environment.preset === preset.id;
            
            return (
              <Card
                key={preset.id}
                className={`p-4 cursor-pointer transition-all duration-300 ${
                  isActive 
                    ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/25' 
                    : 'border-white/10 bg-black/20 hover:border-blue-500/50 hover:bg-blue-500/5'
                }`}
                onClick={() => handlePresetSelect(preset.id)}
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
                    <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Background Controls */}
      <Card className="p-4 bg-black/20 border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Monitor className="w-4 h-4 text-blue-400" />
          <h4 className="text-sm font-medium text-white">Background Settings</h4>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Background Blur</span>
              <span className="text-xs text-blue-400">{environment.backgroundBlur}%</span>
            </div>
            <Slider
              value={[environment.backgroundBlur]}
              onValueChange={([value]) => updateEnvironment({ backgroundBlur: value })}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Background Brightness</span>
              <span className="text-xs text-blue-400">{environment.backgroundBrightness}%</span>
            </div>
            <Slider
              value={[environment.backgroundBrightness]}
              onValueChange={([value]) => updateEnvironment({ backgroundBrightness: value })}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">HDRI Intensity</span>
              <span className="text-xs text-blue-400">{environment.hdriIntensity.toFixed(1)}</span>
            </div>
            <Slider
              value={[environment.hdriIntensity * 100]}
              onValueChange={([value]) => updateEnvironment({ hdriIntensity: value / 100 })}
              min={50}
              max={300}
              step={5}
              className="w-full"
            />
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-300">Quick Actions</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10 justify-start"
            onClick={() => updateEnvironment({ backgroundBlur: 0, backgroundBrightness: 100 })}
          >
            <Lightbulb className="w-3 h-3 mr-2" />
            Clear BG
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10 justify-start"
            onClick={() => updateEnvironment({ backgroundBlur: 80, backgroundBrightness: 40 })}
          >
            <Mountain className="w-3 h-3 mr-2" />
            Dramatic
          </Button>
        </div>
      </div>
    </div>
  );
};
