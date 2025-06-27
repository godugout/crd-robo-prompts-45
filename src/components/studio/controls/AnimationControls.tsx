
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCw, ArrowUp, Sparkles, Eye } from 'lucide-react';
import { useAdvancedStudio } from '@/contexts/AdvancedStudioContext';

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

export const AnimationControls: React.FC = () => {
  const { state, updateAnimation } = useAdvancedStudio();
  const { animation } = state;

  const handlePresetSelect = (presetId: string) => {
    updateAnimation({ 
      preset: presetId as any,
      isPlaying: true
    });
  };

  const togglePlayback = () => {
    updateAnimation({ isPlaying: !animation.isPlaying });
  };

  const handleSpeedChange = (value: number[]) => {
    updateAnimation({ speed: value[0] });
  };

  const handleAmplitudeChange = (value: number[]) => {
    updateAnimation({ amplitude: value[0] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-purple-400">Animation</h3>
        <Badge className={`${
          animation.isPlaying 
            ? 'bg-green-500/20 text-green-400 border-green-500/50' 
            : 'bg-purple-500/20 text-purple-400 border-purple-500/50'
        } capitalize`}>
          {animation.isPlaying ? 'Playing' : animation.preset}
        </Badge>
      </div>

      {/* Playback Controls */}
      <Card className="p-4 bg-black/20 border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-white">Playback</h4>
          <Button
            onClick={togglePlayback}
            size="sm"
            className={`${
              animation.isPlaying 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            {animation.isPlaying ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Play
              </>
            )}
          </Button>
        </div>
        
        {animation.isPlaying && (
          <div className="text-xs text-purple-400 animate-pulse">
            Currently playing: {animation.preset} animation
          </div>
        )}
      </Card>

      {/* Animation Presets */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-300">Animation Presets</h4>
        <div className="grid grid-cols-1 gap-3">
          {ANIMATION_PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isActive = animation.preset === preset.id;
            
            return (
              <Card
                key={preset.id}
                className={`p-4 cursor-pointer transition-all duration-300 ${
                  isActive 
                    ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/25' 
                    : 'border-white/10 bg-black/20 hover:border-purple-500/50 hover:bg-purple-500/5'
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
                    <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse" />
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Animation Settings */}
      <Card className="p-4 bg-black/20 border-white/10">
        <h4 className="text-sm font-medium text-white mb-4">Animation Settings</h4>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Speed</span>
              <span className="text-xs text-purple-400">{animation.speed}%</span>
            </div>
            <Slider
              value={[animation.speed]}
              onValueChange={handleSpeedChange}
              min={10}
              max={200}
              step={5}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Amplitude</span>
              <span className="text-xs text-purple-400">{animation.amplitude}%</span>
            </div>
            <Slider
              value={[animation.amplitude]}
              onValueChange={handleAmplitudeChange}
              min={10}
              max={200}
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
            onClick={() => updateAnimation({ speed: 100, amplitude: 100 })}
          >
            <Sparkles className="w-3 h-3 mr-2" />
            Reset
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10 justify-start"
            onClick={() => updateAnimation({ preset: 'none', isPlaying: false })}
          >
            <Pause className="w-3 h-3 mr-2" />
            Stop All
          </Button>
        </div>
      </div>
    </div>
  );
};
