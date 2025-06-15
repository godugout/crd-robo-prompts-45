
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import type { EnvironmentScene } from '../../types';

interface EnvironmentTabProps {
  selectedScene: EnvironmentScene;
  overallBrightness: number[];
  onSceneChange: (scene: EnvironmentScene) => void;
  onBrightnessChange: (value: number[]) => void;
}

export const EnvironmentTab: React.FC<EnvironmentTabProps> = ({
  selectedScene,
  overallBrightness,
  onSceneChange,
  onBrightnessChange
}) => {
  return (
    <div className="p-4 space-y-6">
      <div>
        <h4 className="text-white font-medium mb-4">Spaces</h4>
        <div className="space-y-4">
          <div>
            <h5 className="text-crd-green text-sm mb-3">2D Environments</h5>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => onSceneChange('forest')}
                variant={selectedScene === 'forest' ? "default" : "outline"}
                className={`h-12 text-xs ${
                  selectedScene === 'forest'
                    ? 'bg-crd-green text-black'
                    : 'border-white/20 hover:border-crd-green text-white'
                }`}
              >
                🌲 Enchanted Forest
              </Button>
              <Button
                onClick={() => onSceneChange('mountain')}
                variant={selectedScene === 'mountain' ? "default" : "outline"}
                className={`h-12 text-xs ${
                  selectedScene === 'mountain'
                    ? 'bg-crd-green text-black'
                    : 'border-white/20 hover:border-crd-green text-white'
                }`}
              >
                🏔️ Mountain Vista
              </Button>
              <Button
                onClick={() => onSceneChange('cavern')}
                variant={selectedScene === 'cavern' ? "default" : "outline"}
                className={`h-12 text-xs ${
                  selectedScene === 'cavern'
                    ? 'bg-crd-green text-black'
                    : 'border-white/20 hover:border-crd-green text-white'
                }`}
              >
                💎 Crystal Cavern
              </Button>
              <Button
                onClick={() => onSceneChange('metropolis')}
                variant={selectedScene === 'metropolis' ? "default" : "outline"}
                className={`h-12 text-xs ${
                  selectedScene === 'metropolis'
                    ? 'bg-crd-green text-black'
                    : 'border-white/20 hover:border-crd-green text-white'
                }`}
              >
                🌃 Neon Metropolis
              </Button>
            </div>
          </div>

          <div>
            <h5 className="text-blue-400 text-sm mb-3">3D Environments</h5>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => onSceneChange('studio')}
                variant={selectedScene === 'studio' ? "default" : "outline"}
                className={`h-12 text-xs ${
                  selectedScene === 'studio'
                    ? 'bg-blue-500 text-white'
                    : 'border-white/20 hover:border-blue-500 text-white'
                }`}
              >
                🎬 Modern Studio
              </Button>
              <div className="h-12 border border-white/10 rounded flex items-center justify-center opacity-50">
                <span className="text-gray-400 text-xs">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lighting */}
      <div>
        <h4 className="text-white font-medium mb-4">Lighting</h4>
        <div className="flex items-center justify-between">
          <span className="text-white text-sm">Brightness</span>
          <div className="flex items-center space-x-3">
            <Slider
              value={overallBrightness}
              onValueChange={onBrightnessChange}
              max={200}
              min={10}
              step={5}
              className="w-24"
            />
            <span className="text-crd-green text-xs w-8 font-mono">
              {overallBrightness[0]}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
