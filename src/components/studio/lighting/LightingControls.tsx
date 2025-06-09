
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Sun, Moon, Zap, Palette } from 'lucide-react';
import { toast } from 'sonner';

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

export const LightingControls: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<string>('studio');
  const [ambientIntensity, setAmbientIntensity] = useState([70]);
  const [directionalIntensity, setDirectionalIntensity] = useState([80]);
  const [colorTemperature, setColorTemperature] = useState([5500]);
  const [shadowIntensity, setShadowIntensity] = useState([40]);

  const applyPreset = (preset: LightingPreset) => {
    setSelectedPreset(preset.id);
    setAmbientIntensity([preset.ambient]);
    setDirectionalIntensity([preset.directional]);
    setColorTemperature([preset.temperature]);
    setShadowIntensity([preset.shadows]);
    toast.success(`Applied ${preset.name} lighting`);
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
              variant={selectedPreset === preset.id ? "default" : "outline"}
              className={`p-3 h-auto flex flex-col items-center gap-2 ${
                selectedPreset === preset.id 
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
                  {ambientIntensity[0]}%
                </Badge>
              </div>
              <Slider
                value={ambientIntensity}
                onValueChange={setAmbientIntensity}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-crd-lightGray text-sm">Directional Light</label>
                <Badge variant="outline" className="text-xs">
                  {directionalIntensity[0]}%
                </Badge>
              </div>
              <Slider
                value={directionalIntensity}
                onValueChange={setDirectionalIntensity}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-crd-lightGray text-sm">Color Temperature</label>
                <Badge variant="outline" className="text-xs">
                  {colorTemperature[0]}K
                </Badge>
              </div>
              <Slider
                value={colorTemperature}
                onValueChange={setColorTemperature}
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
                  {shadowIntensity[0]}%
                </Badge>
              </div>
              <Slider
                value={shadowIntensity}
                onValueChange={setShadowIntensity}
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
            variant="outline"
            size="sm"
            className="border-editor-border text-white hover:bg-editor-border"
            onClick={() => toast.success('Warm filter applied')}
          >
            <Palette className="w-4 h-4 mr-1" />
            Warm
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-editor-border text-white hover:bg-editor-border"
            onClick={() => toast.success('Cool filter applied')}
          >
            <Palette className="w-4 h-4 mr-1" />
            Cool
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-editor-border text-white hover:bg-editor-border"
            onClick={() => toast.success('Neutral filter applied')}
          >
            <Palette className="w-4 h-4 mr-1" />
            Neutral
          </Button>
        </div>
      </div>
    </div>
  );
};
