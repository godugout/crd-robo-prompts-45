
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Sun, Moon, Zap, Flame, Settings } from 'lucide-react';
import { useAdvancedStudio } from '@/contexts/AdvancedStudioContext';

const LIGHTING_PRESETS = [
  { 
    id: 'studio', 
    name: 'Studio', 
    icon: Lightbulb, 
    color: 'from-white to-gray-300',
    description: 'Professional studio setup'
  },
  { 
    id: 'dramatic', 
    name: 'Dramatic', 
    icon: Moon, 
    color: 'from-gray-800 to-black',
    description: 'High contrast shadows'
  },
  { 
    id: 'soft', 
    name: 'Soft', 
    icon: Sun, 
    color: 'from-yellow-200 to-orange-300',
    description: 'Gentle even lighting'
  },
  { 
    id: 'neon', 
    name: 'Neon', 
    icon: Zap, 
    color: 'from-purple-400 to-blue-500',
    description: 'Colorful accent lights'
  }
];

export const EnhancedLightingControls: React.FC = () => {
  const { state, updateLighting, applyPreset } = useAdvancedStudio();
  const { lighting } = state;

  const handlePresetSelect = (presetId: string) => {
    applyPreset('lighting', presetId);
  };

  const getColorTempLabel = (temp: number) => {
    if (temp < 3500) return 'Warm';
    if (temp < 5000) return 'Neutral';
    if (temp < 6500) return 'Cool';
    return 'Daylight';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-yellow-400">Lighting</h3>
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50 capitalize">
          {lighting.preset}
        </Badge>
      </div>

      {/* Lighting Presets */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-300">Professional Lighting</h4>
        <div className="grid grid-cols-1 gap-3">
          {LIGHTING_PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isActive = lighting.preset === preset.id;
            
            return (
              <Card
                key={preset.id}
                className={`p-4 cursor-pointer transition-all duration-300 ${
                  isActive 
                    ? 'border-yellow-500 bg-yellow-500/10 shadow-lg shadow-yellow-500/25' 
                    : 'border-white/10 bg-black/20 hover:border-yellow-500/50 hover:bg-yellow-500/5'
                }`}
                onClick={() => handlePresetSelect(preset.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${preset.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-gray-800" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{preset.name}</div>
                    <div className="text-gray-400 text-xs">{preset.description}</div>
                  </div>
                  {isActive && (
                    <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Lighting Controls */}
      <Card className="p-4 bg-black/20 border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-4 h-4 text-yellow-400" />
          <h4 className="text-sm font-medium text-white">Manual Controls</h4>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Main Light Intensity</span>
              <span className="text-xs text-yellow-400">{lighting.intensity}%</span>
            </div>
            <Slider
              value={[lighting.intensity]}
              onValueChange={([value]) => updateLighting({ intensity: value })}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Color Temperature</span>
              <span className="text-xs text-yellow-400">{lighting.colorTemperature}K ({getColorTempLabel(lighting.colorTemperature)})</span>
            </div>
            <Slider
              value={[lighting.colorTemperature]}
              onValueChange={([value]) => updateLighting({ colorTemperature: value })}
              min={2700}
              max={9000}
              step={100}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Shadow Intensity</span>
              <span className="text-xs text-yellow-400">{lighting.shadowIntensity}%</span>
            </div>
            <Slider
              value={[lighting.shadowIntensity]}
              onValueChange={([value]) => updateLighting({ shadowIntensity: value })}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Ambient Light</span>
              <span className="text-xs text-yellow-400">{lighting.ambientLight}%</span>
            </div>
            <Slider
              value={[lighting.ambientLight]}
              onValueChange={([value]) => updateLighting({ ambientLight: value })}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </Card>

      {/* Quick Lighting Actions */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-300">Quick Settings</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10 justify-start"
            onClick={() => updateLighting({ colorTemperature: 6500, intensity: 90 })}
          >
            <Sun className="w-3 h-3 mr-2" />
            Daylight
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10 justify-start"
            onClick={() => updateLighting({ colorTemperature: 3200, intensity: 70 })}
          >
            <Flame className="w-3 h-3 mr-2" />
            Warm
          </Button>
        </div>
      </div>
    </div>
  );
};
