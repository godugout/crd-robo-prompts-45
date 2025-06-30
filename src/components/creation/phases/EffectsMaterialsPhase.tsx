
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, Diamond, Palette, Settings } from 'lucide-react';

interface EffectsMaterialsPhaseProps {
  selectedFrame: any;
  uploadedImage: File | null;
  selectedEffects: any[];
  onEffectsUpdate: (effects: any[]) => void;
}

const EFFECT_PRESETS = [
  {
    id: 'holographic-rainbow',
    name: 'Holographic Rainbow',
    effects: ['holographic', 'rainbow', 'shimmer'],
    intensity: 75,
    icon: Diamond,
    preview: 'linear-gradient(45deg, #ff006e, #8338ec, #3a86ff)'
  },
  {
    id: 'chrome-mirror',
    name: 'Chrome Mirror',
    effects: ['chrome', 'metallic', 'reflection'],
    intensity: 60,
    icon: Sparkles,
    preview: 'linear-gradient(135deg, #6b7280, #9ca3af, #d1d5db)'
  },
  {
    id: 'gold-foil-deluxe',
    name: 'Gold Foil Deluxe',
    effects: ['foil', 'metallic', 'sparkle'],
    intensity: 50,
    icon: Zap,
    preview: 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)'
  },
  {
    id: 'neon-glow',
    name: 'Neon Glow',
    effects: ['neon', 'glow', 'pulse'],
    intensity: 80,
    icon: Palette,
    preview: 'linear-gradient(135deg, #10b981, #06d6a0, #00f5ff)'
  }
];

export const EffectsMaterialsPhase: React.FC<EffectsMaterialsPhaseProps> = ({
  selectedFrame,
  uploadedImage,
  selectedEffects,
  onEffectsUpdate
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [customEffects, setCustomEffects] = useState(selectedEffects);

  const handlePresetSelect = (preset: any) => {
    setSelectedPreset(preset.id);
    const newEffects = preset.effects.map((effectType: string) => ({
      id: `${effectType}-${Date.now()}`,
      type: effectType,
      intensity: preset.intensity,
      parameters: {}
    }));
    setCustomEffects(newEffects);
    onEffectsUpdate(newEffects);
  };

  const updateEffectIntensity = (effectId: string, intensity: number) => {
    const updated = customEffects.map(effect =>
      effect.id === effectId ? { ...effect, intensity } : effect
    );
    setCustomEffects(updated);
    onEffectsUpdate(updated);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold theme-text-primary mb-2">Effects & Materials</h2>
        <p className="theme-text-muted">
          Enhance your {selectedFrame?.name} frame with professional effects
        </p>
      </div>

      {/* Card Preview */}
      <Card className="theme-bg-accent">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div 
                className="w-20 h-28 rounded border-2"
                style={{ background: selectedFrame?.preview || '#666' }}
              >
                {uploadedImage && (
                  <img
                    src={URL.createObjectURL(uploadedImage)}
                    alt="Preview"
                    className="absolute inset-1 w-18 h-26 object-cover rounded"
                  />
                )}
              </div>
            </div>
            <div>
              <h4 className="font-medium theme-text-primary">{selectedFrame?.name}</h4>
              <p className="text-sm theme-text-muted mb-2">
                {customEffects.length} effects applied
              </p>
              <div className="flex flex-wrap gap-1">
                {customEffects.map(effect => (
                  <Badge key={effect.id} variant="secondary" className="text-xs">
                    {effect.type} {effect.intensity}%
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Effect Presets */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium theme-text-primary flex items-center gap-2">
          <Settings className="w-5 h-5 text-crd-green" />
          Quick Presets
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {EFFECT_PRESETS.map(preset => (
            <Card
              key={preset.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedPreset === preset.id
                  ? 'border-crd-green bg-crd-green/10'
                  : 'theme-border hover:border-crd-green/50'
              }`}
              onClick={() => handlePresetSelect(preset)}
            >
              <CardContent className="p-4 text-center">
                <div 
                  className="w-16 h-16 rounded-lg mx-auto mb-3 flex items-center justify-center"
                  style={{ background: preset.preview }}
                >
                  <preset.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-medium theme-text-primary text-sm mb-1">
                  {preset.name}
                </h4>
                <div className="flex flex-wrap gap-1 justify-center">
                  {preset.effects.slice(0, 2).map(effect => (
                    <Badge key={effect} variant="secondary" className="text-xs">
                      {effect}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Custom Effect Controls */}
      {customEffects.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium theme-text-primary">Fine-tune Effects</h3>
          
          <div className="grid gap-4">
            {customEffects.map(effect => (
              <Card key={effect.id} className="theme-bg-secondary">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-crd-green" />
                      <span className="font-medium theme-text-primary capitalize">
                        {effect.type}
                      </span>
                    </div>
                    <span className="text-sm theme-text-muted">
                      {effect.intensity}%
                    </span>
                  </div>
                  
                  <Slider
                    value={[effect.intensity]}
                    onValueChange={([value]) => updateEffectIntensity(effect.id, value)}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Continue Prompt */}
      {customEffects.length > 0 && (
        <Card className="theme-bg-accent border-crd-green/50">
          <CardContent className="p-4 text-center">
            <h4 className="font-medium theme-text-primary mb-2">Effects Applied!</h4>
            <p className="text-sm theme-text-muted">
              Your card is looking great. Ready to choose a 3D showcase?
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
