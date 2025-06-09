
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Sun, Moon, Zap, Palette } from 'lucide-react';
import { toast } from 'sonner';
import type { LightingState } from '@/hooks/useStudioState';

interface LightingPreset {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  ambient: number;
  directional: number;
  temperature: number;
  shadows: number;
}

const LIGHTING_PRESETS: LightingPreset[] = [
  { id: 'studio', name: 'Studio', icon: Lightbulb, ambient: 70, directional: 80, temperature: 5500, shadows: 40 },
  { id: 'dramatic', name: 'Dramatic', icon: Moon, ambient: 20, directional: 90, temperature: 3200, shadows: 80 },
  { id: 'soft', name: 'Soft', icon: Sun, ambient: 85, directional: 60, temperature: 6500, shadows: 20 },
  { id: 'neon', name: 'Neon', icon: Zap, ambient: 50, directional: 70, temperature: 8000, shadows: 60 },
];

interface LightingControlsProps {
  lightingState: LightingState;
  onUpdateLighting: (updates: Partial<LightingState>) => void;
  onApplyPreset: (preset: string) => void;
}

export const LightingControls: React.FC<LightingControlsProps> = ({
  lightingState,
  onUpdateLighting,
  onApplyPreset
}) => {
  const applyPreset = (preset: LightingPreset) => {
    onApplyPreset(preset.id);
  };

  const handleColorFilter = (filter: 'warm' | 'cool' | 'neutral') => {
    onUpdateLighting({ colorFilter: filter });
    toast.success(`${filter} filter applied`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-white font-semibold text-lg mb-2">Lighting Studio</h3>
        <p className="text-crd-lightGray text-sm mb-6">
          Professional lighting controls for dramatic card effects
        </p>
      </div>

      {/* Lighting Presets */}
      <div className="space-y-3">
        <h4 className="text-white font-medium text-sm uppercase tracking-wide">Quick Presets</h4>
        <div className="grid grid-cols-2 gap-2">
          {LIGHTING_PRESETS.map((preset) => (
            <Button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              variant={lightingState.preset === preset.id ? "default" : "outline"}
              className={`p-3 h-auto flex flex-col items-center gap-2 ${
                lightingState.preset === preset.id 
                  ? 'bg-crd-green text-black' 
                  : 'border-editor-border text-white hover:bg-editor-border'
              }`}
            >
              <preset.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{preset.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Manual Controls */}
      <div className="space-y-4">
        <h4 className="text-white font-medium text-sm uppercase tracking-wide">Manual Controls</h4>
        
        <Card className="bg-editor-dark border-editor-border p-4">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-crd-lightGray text-sm">Ambient Light</label>
                <Badge variant="outline" className="text-xs">
                  {lightingState.ambientIntensity}%
                </Badge>
              </div>
              <Slider
                value={[lightingState.ambientIntensity]}
                onValueChange={(value) => onUpdateLighting({ ambientIntensity: value[0] })}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-crd-lightGray text-sm">Directional Light</label>
                <Badge variant="outline" className="text-xs">
                  {lightingState.directionalIntensity}%
                </Badge>
              </div>
              <Slider
                value={[lightingState.directionalIntensity]}
                onValueChange={(value) => onUpdateLighting({ directionalIntensity: value[0] })}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-crd-lightGray text-sm">Color Temperature</label>
                <Badge variant="outline" className="text-xs">
                  {lightingState.colorTemperature}K
                </Badge>
              </div>
              <Slider
                value={[lightingState.colorTemperature]}
                onValueChange={(value) => onUpdateLighting({ colorTemperature: value[0] })}
                min={2700}
                max={9000}
                step={100}
                className="w-full"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-crd-lightGray text-sm">Shadow Intensity</label>
                <Badge variant="outline" className="text-xs">
                  {lightingState.shadowIntensity}%
                </Badge>
              </div>
              <Slider
                value={[lightingState.shadowIntensity]}
                onValueChange={(value) => onUpdateLighting({ shadowIntensity: value[0] })}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Color Controls */}
      <div className="space-y-3">
        <h4 className="text-white font-medium text-sm uppercase tracking-wide">Color Effects</h4>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={lightingState.colorFilter === 'warm' ? 'default' : 'outline'}
            size="sm"
            className={`${lightingState.colorFilter === 'warm' ? 'bg-crd-green text-black' : 'border-editor-border text-white hover:bg-editor-border'}`}
            onClick={() => handleColorFilter('warm')}
          >
            <Palette className="w-4 h-4 mr-1" />
            Warm
          </Button>
          <Button
            variant={lightingState.colorFilter === 'cool' ? 'default' : 'outline'}
            size="sm"
            className={`${lightingState.colorFilter === 'cool' ? 'bg-crd-green text-black' : 'border-editor-border text-white hover:bg-editor-border'}`}
            onClick={() => handleColorFilter('cool')}
          >
            <Palette className="w-4 h-4 mr-1" />
            Cool
          </Button>
          <Button
            variant={lightingState.colorFilter === 'neutral' ? 'default' : 'outline'}
            size="sm"
            className={`${lightingState.colorFilter === 'neutral' ? 'bg-crd-green text-black' : 'border-editor-border text-white hover:bg-editor-border'}`}
            onClick={() => handleColorFilter('neutral')}
          >
            <Palette className="w-4 h-4 mr-1" />
            Neutral
          </Button>
        </div>
      </div>
    </div>
  );
};
