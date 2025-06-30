
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Chrome, Gem, Star, Zap, RotateCcw } from 'lucide-react';

interface EffectControlsPhaseProps {
  effectValues: Record<string, any>;
  onEffectChange: (effectId: string, value: any) => void;
  uploadedImage?: string;
  selectedFrame?: string;
}

const EFFECT_PRESETS = [
  {
    id: 'prism-burst',
    name: 'Prism Burst',
    icon: Gem,
    effects: {
      prizm: { intensity: 90, geometryType: 'sharp', dispersion: 95 },
      holographic: { intensity: 30, animated: false }
    }
  },
  {
    id: 'spectral-wave',
    name: 'Spectral Wave',
    icon: Zap,
    effects: {
      holographic: { intensity: 65, shiftSpeed: 80, wavePattern: 'smooth' },
      foilspray: { intensity: 25, pattern: 'wave' }
    }
  },
  {
    id: 'chrome-elite',
    name: 'Chrome Elite',
    icon: Chrome,
    effects: {
      chrome: { intensity: 85, reflection: 90 },
      crystal: { intensity: 20, facets: 'fine' }
    }
  },
  {
    id: 'golden-legend',
    name: 'Golden Legend',
    icon: Star,
    effects: {
      gold: { intensity: 80, shimmer: 70 },
      foilspray: { intensity: 40, pattern: 'radial' }
    }
  }
];

const INDIVIDUAL_EFFECTS = [
  {
    id: 'holographic',
    name: 'Holographic',
    description: 'Dynamic rainbow shifting with prismatic effects',
    icon: Sparkles,
    color: 'from-pink-500 to-cyan-500'
  },
  {
    id: 'chrome',
    name: 'Chrome',
    description: 'Metallic chrome finish with mirror-like reflections',
    icon: Chrome,
    color: 'from-gray-400 to-gray-600'
  },
  {
    id: 'crystal',
    name: 'Crystal',
    description: 'Crystalline faceted surface with light dispersion',
    icon: Gem,
    color: 'from-blue-400 to-purple-600'
  },
  {
    id: 'gold',
    name: 'Gold',
    description: 'Luxurious gold plating with authentic shimmer',
    icon: Star,
    color: 'from-yellow-400 to-yellow-600'
  },
  {
    id: 'foilspray',
    name: 'Foil Spray',
    description: 'Metallic spray pattern with directional flow',
    icon: Zap,
    color: 'from-purple-400 to-pink-500'
  },
  {
    id: 'prizm',
    name: 'Prizm',
    description: 'Geometric prismatic patterns with color separation',
    icon: Gem,
    color: 'from-rainbow-start to-rainbow-end'
  }
];

export const EffectControlsPhase: React.FC<EffectControlsPhaseProps> = ({
  effectValues,
  onEffectChange,
  uploadedImage,
  selectedFrame
}) => {
  const applyPreset = (preset: typeof EFFECT_PRESETS[0]) => {
    console.log('Applying preset:', preset.name, preset.effects);
    
    // Reset all effects first
    INDIVIDUAL_EFFECTS.forEach(effect => {
      onEffectChange(effect.id, { intensity: 0 });
    });
    
    // Apply preset effects
    Object.entries(preset.effects).forEach(([effectId, effectData]) => {
      Object.entries(effectData).forEach(([paramId, value]) => {
        onEffectChange(effectId, { ...effectValues[effectId], [paramId]: value });
      });
    });
  };

  const resetAllEffects = () => {
    INDIVIDUAL_EFFECTS.forEach(effect => {
      onEffectChange(effect.id, { intensity: 0 });
    });
  };

  const getEffectIntensity = (effectId: string): number => {
    return effectValues[effectId]?.intensity || 0;
  };

  const updateEffectIntensity = (effectId: string, intensity: number) => {
    onEffectChange(effectId, { ...effectValues[effectId], intensity });
  };

  const activeEffectsCount = INDIVIDUAL_EFFECTS.filter(effect => getEffectIntensity(effect.id) > 0).length;

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-white text-xl font-bold mb-2">Visual Effects</h2>
        <p className="text-crd-lightGray text-sm">
          Add stunning visual effects to your card
        </p>
        {activeEffectsCount > 0 && (
          <Badge variant="secondary" className="mt-2 bg-crd-green/20 text-crd-green">
            {activeEffectsCount} effects active
          </Badge>
        )}
      </div>

      {/* Quick Reset */}
      {activeEffectsCount > 0 && (
        <Button
          variant="outline"
          onClick={resetAllEffects}
          className="w-full border-editor-border text-white hover:bg-white/10"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset All Effects
        </Button>
      )}

      {/* Preset Effects */}
      <Card className="bg-editor-tool border-editor-border">
        <CardHeader>
          <CardTitle className="text-white text-lg">Effect Presets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {EFFECT_PRESETS.map((preset) => {
            const Icon = preset.icon;
            return (
              <Button
                key={preset.id}
                variant="outline"
                onClick={() => applyPreset(preset)}
                className="w-full justify-start border-editor-border text-white hover:bg-crd-green/10 hover:border-crd-green/50"
              >
                <Icon className="w-5 h-5 mr-3 text-crd-green" />
                <div className="text-left">
                  <div className="font-medium">{preset.name}</div>
                  <div className="text-xs text-crd-lightGray">
                    Premium effect combination
                  </div>
                </div>
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* Individual Effects */}
      <Card className="bg-editor-tool border-editor-border">
        <CardHeader>
          <CardTitle className="text-white text-lg">Individual Effects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {INDIVIDUAL_EFFECTS.map((effect) => {
            const Icon = effect.icon;
            const intensity = getEffectIntensity(effect.id);
            const isActive = intensity > 0;

            return (
              <div key={effect.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-crd-green' : 'text-crd-lightGray'}`} />
                    <div>
                      <h4 className="text-white font-medium">{effect.name}</h4>
                      <p className="text-crd-lightGray text-xs">{effect.description}</p>
                    </div>
                  </div>
                  <div className="text-white text-sm font-medium">
                    {intensity}%
                  </div>
                </div>
                
                <Slider
                  value={[intensity]}
                  onValueChange={(value) => updateEffectIntensity(effect.id, value[0])}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Requirements Check */}
      {(!uploadedImage || !selectedFrame) && (
        <Card className="bg-yellow-900/20 border-yellow-500/50">
          <CardContent className="p-4">
            <div className="text-yellow-400 text-sm">
              <div className="font-semibold mb-2">Complete previous steps first:</div>
              <div className="space-y-1">
                {!uploadedImage && <div>• Upload an image</div>}
                {!selectedFrame && <div>• Select a frame</div>}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
