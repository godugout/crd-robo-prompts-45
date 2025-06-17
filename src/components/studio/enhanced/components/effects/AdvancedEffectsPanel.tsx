
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Eye, EyeOff, Trash2, Sparkles, Zap } from 'lucide-react';
import type { EffectLayerData } from '@/components/studio/hooks/useStudioEffects';

interface AdvancedEffectsPanelProps {
  advanced3DEffects: {
    holographic: boolean;
    metalness: number;
    roughness: number;
    particles: boolean;
    glow: boolean;
    glowColor: string;
    bloom: boolean;
    bloomStrength: number;
    bloomRadius: number;
    bloomThreshold: number;
  };
  onAdvanced3DChange: (key: string, value: any) => void;
  effectLayers: EffectLayerData[];
  selectedLayerId: string;
  onAddEffectLayer: (type: EffectLayerData['type']) => void;
  onUpdateEffectLayer: (layer: EffectLayerData) => void;
  onRemoveEffectLayer: (layerId: string) => void;
  onToggleLayerVisibility: (layerId: string) => void;
}

export const AdvancedEffectsPanel: React.FC<AdvancedEffectsPanelProps> = ({
  advanced3DEffects,
  onAdvanced3DChange,
  effectLayers,
  selectedLayerId,
  onAddEffectLayer,
  onUpdateEffectLayer,
  onRemoveEffectLayer,
  onToggleLayerVisibility
}) => {
  return (
    <Card className="bg-black/20 border-white/10">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-medium text-sm">Advanced 3D Effects</h3>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
            PRO
          </Badge>
        </div>

        {/* Material Properties */}
        <div className="space-y-3">
          <h4 className="text-gray-300 text-xs font-medium">Material Properties</h4>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm text-gray-300">Metalness</label>
              <span className="text-xs text-crd-green">{Math.round(advanced3DEffects.metalness * 100)}%</span>
            </div>
            <Slider
              value={[advanced3DEffects.metalness]}
              onValueChange={([value]) => onAdvanced3DChange('metalness', value)}
              min={0}
              max={1}
              step={0.01}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm text-gray-300">Roughness</label>
              <span className="text-xs text-crd-green">{Math.round(advanced3DEffects.roughness * 100)}%</span>
            </div>
            <Slider
              value={[advanced3DEffects.roughness]}
              onValueChange={([value]) => onAdvanced3DChange('roughness', value)}
              min={0}
              max={1}
              step={0.01}
              className="w-full"
            />
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* Post-Processing Effects */}
        <div className="space-y-3">
          <h4 className="text-gray-300 text-xs font-medium">Post-Processing</h4>
          
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-300">Holographic</label>
            <Button
              onClick={() => onAdvanced3DChange('holographic', !advanced3DEffects.holographic)}
              variant={advanced3DEffects.holographic ? "default" : "outline"}
              size="sm"
              className={advanced3DEffects.holographic ? "bg-crd-green text-black" : "border-white/20 text-white"}
            >
              {advanced3DEffects.holographic ? 'ON' : 'OFF'}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-300">Particles</label>
            <Button
              onClick={() => onAdvanced3DChange('particles', !advanced3DEffects.particles)}
              variant={advanced3DEffects.particles ? "default" : "outline"}
              size="sm"
              className={advanced3DEffects.particles ? "bg-crd-green text-black" : "border-white/20 text-white"}
            >
              <Sparkles className="w-3 h-3 mr-1" />
              {advanced3DEffects.particles ? 'ON' : 'OFF'}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-300">Glow Effect</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={advanced3DEffects.glowColor}
                onChange={(e) => onAdvanced3DChange('glowColor', e.target.value)}
                className="w-6 h-6 rounded border border-white/20 bg-transparent cursor-pointer"
              />
              <Button
                onClick={() => onAdvanced3DChange('glow', !advanced3DEffects.glow)}
                variant={advanced3DEffects.glow ? "default" : "outline"}
                size="sm"
                className={advanced3DEffects.glow ? "bg-crd-green text-black" : "border-white/20 text-white"}
              >
                <Zap className="w-3 h-3 mr-1" />
                {advanced3DEffects.glow ? 'ON' : 'OFF'}
              </Button>
            </div>
          </div>

          {advanced3DEffects.bloom && (
            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm text-gray-300">Bloom Strength</label>
                  <span className="text-xs text-crd-green">{advanced3DEffects.bloomStrength.toFixed(1)}</span>
                </div>
                <Slider
                  value={[advanced3DEffects.bloomStrength]}
                  onValueChange={([value]) => onAdvanced3DChange('bloomStrength', value)}
                  min={0}
                  max={3}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>

        <Separator className="bg-white/10" />

        {/* Effect Layers */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-gray-300 text-xs font-medium">Effect Layers</h4>
            <Button
              onClick={() => onAddEffectLayer('holographic')}
              variant="outline"
              size="sm"
              className="border-crd-green/50 text-crd-green hover:bg-crd-green/10"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Layer
            </Button>
          </div>

          <div className="space-y-2 max-h-32 overflow-y-auto">
            {effectLayers.map((layer) => (
              <div
                key={layer.id}
                className={`flex items-center justify-between p-2 rounded border ${
                  selectedLayerId === layer.id 
                    ? 'border-crd-green/50 bg-crd-green/10' 
                    : 'border-white/10 bg-black/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => onToggleLayerVisibility(layer.id)}
                    variant="ghost"
                    size="sm"
                    className="p-1 text-white hover:bg-white/10"
                  >
                    {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </Button>
                  <span className="text-xs text-white">{layer.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="text-xs border-white/20 text-gray-400">
                    {layer.opacity}%
                  </Badge>
                  <Button
                    onClick={() => onRemoveEffectLayer(layer.id)}
                    variant="ghost"
                    size="sm"
                    className="p-1 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
