
import React from 'react';
import { Sparkles, Palette, Zap, Sun, Moon, Droplet, Flame, Diamond, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import type { useCardEditor } from '@/hooks/useCardEditor';

interface AdvancedEffectsControlsProps {
  cardEditor: ReturnType<typeof useCardEditor>;
}

export const AdvancedEffectsControls = ({ cardEditor }: AdvancedEffectsControlsProps) => {
  const { cardData, updateDesignMetadata } = cardEditor;

  const effects = [
    { type: 'holographic', icon: Zap, label: 'Holographic', color: 'text-purple-500', description: 'Dynamic hue rotation and brightness' },
    { type: 'refractor', icon: Sun, label: 'Refractor', color: 'text-yellow-500', description: 'Color saturation and prismatic effects' },
    { type: 'foil', icon: Diamond, label: 'Foil', color: 'text-blue-500', description: 'Glowing box shadows and metallic sheen' },
    { type: 'prizm', icon: Palette, label: 'Prizm', color: 'text-pink-500', description: 'Animated gradient overlays' },
    { type: 'rainbow', icon: Droplet, label: 'Rainbow', color: 'text-red-500', description: 'Canvas-based spectrum gradients' },
    { type: 'chrome', icon: Moon, label: 'Chrome', color: 'text-gray-500', description: 'Metallic radial gradients' },
    { type: 'gold', icon: Flame, label: 'Gold', color: 'text-amber-500', description: 'Luxurious golden overlay' },
    { type: 'black', icon: Moon, label: 'Black', color: 'text-black', description: 'Vignette darkness effect' }
  ];

  const getEffectIntensity = (effectType: string): number => {
    return cardData.design_metadata?.effects?.[effectType] || 0;
  };

  const updateEffect = (effectType: string, intensity: number) => {
    const currentEffects = cardData.design_metadata?.effects || {};
    updateDesignMetadata('effects', {
      ...currentEffects,
      [effectType]: intensity
    });
  };

  const resetAllEffects = () => {
    const resetEffects = effects.reduce((acc, effect) => {
      acc[effect.type] = 0;
      return acc;
    }, {} as Record<string, number>);
    
    updateDesignMetadata('effects', resetEffects);
    toast.success('All effects reset');
  };

  const applyPreset = (presetName: string) => {
    let preset: Record<string, number> = {};
    
    switch (presetName) {
      case 'holographic':
        preset = { holographic: 0.7, refractor: 0.3, foil: 0.2 };
        break;
      case 'premium':
        preset = { gold: 0.5, foil: 0.6, chrome: 0.3 };
        break;
      case 'rainbow':
        preset = { rainbow: 0.8, prizm: 0.4, refractor: 0.5 };
        break;
      case 'dark':
        preset = { black: 0.6, chrome: 0.4, foil: 0.3 };
        break;
      default:
        return;
    }
    
    // Reset all effects first
    const resetEffects = effects.reduce((acc, effect) => {
      acc[effect.type] = 0;
      return acc;
    }, {} as Record<string, number>);
    
    // Apply preset
    updateDesignMetadata('effects', { ...resetEffects, ...preset });
    toast.success(`${presetName} preset applied`);
  };

  return (
    <div className="space-y-6">
      {/* Effect Presets */}
      <Card className="bg-editor-dark border-editor-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm flex items-center">
            <Palette className="w-4 h-4 mr-2 text-crd-green" />
            Effect Presets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: 'holographic', label: 'Holographic', color: 'from-purple-500 to-blue-500' },
              { name: 'premium', label: 'Premium', color: 'from-amber-500 to-yellow-500' },
              { name: 'rainbow', label: 'Rainbow', color: 'from-red-500 to-purple-500' },
              { name: 'dark', label: 'Dark', color: 'from-gray-700 to-black' }
            ].map((preset) => (
              <Button
                key={preset.name}
                onClick={() => applyPreset(preset.name)}
                variant="outline"
                size="sm"
                className="border-editor-border text-white hover:bg-editor-border"
              >
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${preset.color} mr-2`} />
                {preset.label}
              </Button>
            ))}
          </div>
          <Button
            onClick={resetAllEffects}
            variant="outline"
            size="sm"
            className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset All
          </Button>
        </CardContent>
      </Card>

      {/* Individual Effect Controls */}
      <Card className="bg-editor-dark border-editor-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-crd-green" />
            Advanced Effects
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {effects.map(({ type, icon: Icon, label, color, description }) => {
            const intensity = getEffectIntensity(type);
            
            return (
              <div key={type} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <div>
                      <span className="text-white text-sm font-medium">{label}</span>
                      <p className="text-crd-lightGray text-xs">{description}</p>
                    </div>
                  </div>
                  <span className="text-crd-lightGray text-xs min-w-[3rem] text-right">
                    {Math.round(intensity * 100)}%
                  </span>
                </div>
                <Slider
                  value={[intensity]}
                  onValueChange={([value]) => updateEffect(type, value)}
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </div>
            );
          })}
          
          <div className="pt-2 border-t border-editor-border">
            <p className="text-crd-lightGray text-xs">
              Move your mouse over the card preview to see interactive effects in action. Effects are applied in real-time using hybrid CSS/Canvas rendering.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
