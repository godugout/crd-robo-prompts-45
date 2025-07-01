
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, Crown, Star } from 'lucide-react';

interface EffectsMaterialsStudioProps {
  effects: any;
  onEffectsChange: (effects: any) => void;
  previewImage: string;
  selectedFrame: string;
}

const EFFECT_PRESETS = [
  {
    id: 'holographic-rainbow',
    name: 'Holographic Rainbow',
    category: 'premium',
    effects: { holographic: 1, rainbow: 0.8, intensity: 0.9 },
    icon: Crown,
    description: 'Full spectrum holographic effect'
  },
  {
    id: 'chrome-mirror',
    name: 'Chrome Mirror',
    category: 'metallic',
    effects: { chrome: 1, metallic: 0.9, reflectivity: 0.8 },
    icon: Zap,
    description: 'High-gloss chrome finish'
  },
  {
    id: 'gold-foil-deluxe',
    name: 'Gold Foil Deluxe',
    category: 'luxury',
    effects: { gold: 1, foil: 0.8, shimmer: 0.7 },
    icon: Star,
    description: 'Premium gold foil treatment'
  },
  {
    id: 'crystal-prism',
    name: 'Crystal Prism',
    category: 'prismatic',
    effects: { crystal: 1, prism: 0.9, dispersion: 0.6 },
    icon: Sparkles,
    description: 'Multi-faceted crystal effect'
  }
];

export const EffectsMaterialsStudio: React.FC<EffectsMaterialsStudioProps> = ({
  effects,
  onEffectsChange,
  previewImage,
  selectedFrame
}) => {
  const handlePresetSelect = (preset: any) => {
    onEffectsChange(preset.effects);
  };

  const handleEffectChange = (effectName: string, value: number) => {
    onEffectsChange({
      ...effects,
      [effectName]: value
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Effects Studio */}
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-black text-[#FCFCFD] mb-2">Effects & Materials Studio</h2>
            <p className="text-[#777E90]">Add professional effects to bring your card to life</p>
          </div>

          {/* Effect Presets */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#FCFCFD]">Professional Presets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {EFFECT_PRESETS.map((preset) => {
                const IconComponent = preset.icon;
                return (
                  <Card
                    key={preset.id}
                    className="p-4 bg-[#23262F] border-[#353945] cursor-pointer hover:border-[#3772FF]/50 transition-all duration-300"
                    onClick={() => handlePresetSelect(preset)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <IconComponent className="w-5 h-5 text-[#3772FF]" />
                      <h4 className="font-bold text-[#FCFCFD]">{preset.name}</h4>
                    </div>
                    <p className="text-sm text-[#777E90] mb-3">{preset.description}</p>
                    <Badge className="bg-[#3772FF]/20 text-[#3772FF] text-xs">
                      {preset.category}
                    </Badge>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Fine-Tuning Controls */}
          {Object.keys(effects).length > 0 && (
            <Card className="p-6 bg-[#23262F] border-[#353945]">
              <h3 className="text-lg font-bold text-[#FCFCFD] mb-4">Fine-Tune Effects</h3>
              <div className="space-y-4">
                {Object.entries(effects).map(([effectName, value]) => (
                  <div key={effectName}>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-semibold text-[#777E90] capitalize">
                        {effectName.replace(/([A-Z])/g, ' $1')}
                      </label>
                      <span className="text-sm text-[#FCFCFD]">{Math.round((value as number) * 100)}%</span>
                    </div>
                    <Slider
                      value={[value as number]}
                      onValueChange={(newValue) => handleEffectChange(effectName, newValue[0])}
                      max={1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Live Preview */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-[#FCFCFD] mb-2">Live Preview</h3>
            <p className="text-[#777E90]">See your effects applied in real-time</p>
          </div>

          {/* 3D Preview Area */}
          <Card className="aspect-[5/7] bg-gradient-to-br from-[#353945] to-[#23262F] border-[#353945] overflow-hidden relative">
            {previewImage && selectedFrame ? (
              <div className="w-full h-full flex items-center justify-center p-8">
                <div className="relative w-full h-full bg-[#141416] rounded-lg overflow-hidden">
                  <img
                    src={previewImage}
                    alt="Card Preview"
                    className="w-full h-full object-cover"
                    style={{
                      filter: Object.keys(effects).length > 0 ? 'brightness(1.1) saturate(1.2)' : 'none'
                    }}
                  />
                  {/* Effect Overlay */}
                  {Object.keys(effects).length > 0 && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#3772FF]/10 to-[#F97316]/10 rounded-lg" />
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#777E90]">
                <div className="text-center">
                  <Sparkles className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Select frame and upload image to see preview</p>
                </div>
              </div>
            )}
          </Card>

          {/* Effect Stats */}
          {Object.keys(effects).length > 0 && (
            <Card className="p-4 bg-[#23262F] border-[#353945]">
              <h4 className="text-sm font-bold text-[#FCFCFD] mb-2">Applied Effects</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(effects).map(([name, value]) => (
                  <Badge key={name} className="bg-[#3772FF]/20 text-[#3772FF] text-xs">
                    {name}: {Math.round((value as number) * 100)}%
                  </Badge>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
