
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Zap, Star, Chrome, Palette, RotateCcw } from 'lucide-react';
import { ENHANCED_VISUAL_EFFECTS } from '@/components/viewer/hooks/useEnhancedCardEffects';
import { toast } from 'sonner';

interface EffectsPhaseProps {
  selectedFrame?: string;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  effectValues?: Record<string, Record<string, any>>;
}

const EFFECT_CATEGORIES = [
  {
    id: 'prismatic',
    name: 'Prismatic',
    icon: Sparkles,
    color: 'bg-gradient-to-r from-pink-500 to-purple-500',
    description: 'Rainbow and holographic effects'
  },
  {
    id: 'metallic',
    name: 'Metallic',
    icon: Chrome,
    color: 'bg-gradient-to-r from-gray-400 to-gray-600',
    description: 'Chrome and metallic finishes'
  },
  {
    id: 'surface',
    name: 'Surface',
    icon: Star,
    color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    description: 'Surface textures and patterns'
  },
  {
    id: 'vintage',
    name: 'Vintage',
    icon: Zap,
    color: 'bg-gradient-to-r from-amber-500 to-orange-600',
    description: 'Aged and weathered effects'
  }
];

const EFFECT_PRESETS = [
  {
    id: 'holographic_premium',
    name: 'Holographic Premium',
    description: 'Classic holographic card effect',
    effects: { holographic: { intensity: 80, shiftSpeed: 120, rainbowSpread: 180, animated: true } }
  },
  {
    id: 'chrome_luxury',
    name: 'Chrome Luxury',
    description: 'Mirror-like metallic finish',
    effects: { chrome: { intensity: 70, sharpness: 85, highlightSize: 35 } }
  },
  {
    id: 'crystal_rare',
    name: 'Crystal Rare',
    description: 'Crystalline faceted surface',
    effects: { crystal: { intensity: 65, facets: 12, dispersion: 75, clarity: 80, sparkle: true } }
  },
  {
    id: 'gold_legendary',
    name: 'Gold Legendary',
    description: 'Luxurious gold plating',
    effects: { gold: { intensity: 85, shimmerSpeed: 100, platingThickness: 7, goldTone: 'rich', reflectivity: 90, colorEnhancement: true } }
  }
];

export const EffectsPhase: React.FC<EffectsPhaseProps> = ({
  selectedFrame,
  onEffectChange,
  effectValues = {}
}) => {
  const [selectedCategory, setSelectedCategory] = useState('prismatic');
  const [selectedEffect, setSelectedEffect] = useState<string>('');

  // Get effects for the selected category
  const categoryEffects = ENHANCED_VISUAL_EFFECTS.filter(effect => effect.category === selectedCategory);

  const handleEffectChange = (effectId: string, parameterId: string, value: number | boolean | string) => {
    onEffectChange(effectId, parameterId, value);
  };

  const applyPreset = (preset: typeof EFFECT_PRESETS[0]) => {
    Object.entries(preset.effects).forEach(([effectId, parameters]) => {
      Object.entries(parameters).forEach(([parameterId, value]) => {
        handleEffectChange(effectId, parameterId, value);
      });
    });
    toast.success(`Applied ${preset.name} preset`);
  };

  const resetAllEffects = () => {
    ENHANCED_VISUAL_EFFECTS.forEach(effect => {
      effect.parameters.forEach(param => {
        handleEffectChange(effect.id, param.id, param.defaultValue);
      });
    });
    toast.success('All effects reset');
  };

  const getEffectValue = (effectId: string, parameterId: string) => {
    return effectValues[effectId]?.[parameterId] ?? 
           ENHANCED_VISUAL_EFFECTS.find(e => e.id === effectId)?.parameters.find(p => p.id === parameterId)?.defaultValue ?? 0;
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-300 mb-4">
        Apply premium visual effects and materials to enhance your card.
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-black/30 p-1">
          {EFFECT_CATEGORIES.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="data-[state=active]:bg-crd-green data-[state=active]:text-black text-white text-xs"
            >
              <div className="flex items-center gap-1">
                <category.icon className="w-3 h-3" />
                <span className="hidden sm:inline">{category.name}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {EFFECT_CATEGORIES.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-4 space-y-4">
            {/* Effect Presets */}
            <Card className="bg-black/20 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-medium text-sm">Quick Presets</h3>
                  <Button
                    onClick={resetAllEffects}
                    variant="outline"
                    size="sm"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10 text-xs"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Reset All
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {EFFECT_PRESETS.map((preset) => (
                    <Button
                      key={preset.id}
                      onClick={() => applyPreset(preset)}
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10 text-xs h-auto p-2 flex flex-col items-start"
                    >
                      <span className="font-medium">{preset.name}</span>
                      <span className="text-gray-400 text-xs">{preset.description}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Individual Effects */}
            <div className="space-y-3">
              {categoryEffects.map((effect) => (
                <Card key={effect.id} className="bg-black/20 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-white font-medium text-sm">{effect.name}</h4>
                        <p className="text-gray-400 text-xs">{effect.description}</p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className="border-crd-green/50 text-crd-green text-xs"
                      >
                        {Math.round((getEffectValue(effect.id, 'intensity') as number) || 0)}%
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      {effect.parameters.map((param) => {
                        const currentValue = getEffectValue(effect.id, param.id);
                        
                        if (param.type === 'slider') {
                          return (
                            <div key={param.id}>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-sm text-gray-300">{param.name}</label>
                                <span className="text-xs text-crd-green">
                                  {typeof currentValue === 'number' ? Math.round(currentValue) : currentValue}
                                  {param.id === 'intensity' ? '%' : ''}
                                </span>
                              </div>
                              <Slider
                                value={[typeof currentValue === 'number' ? currentValue : param.defaultValue as number]}
                                onValueChange={([value]) => handleEffectChange(effect.id, param.id, value)}
                                min={param.min || 0}
                                max={param.max || 100}
                                step={param.step || 1}
                                className="w-full"
                              />
                            </div>
                          );
                        }

                        if (param.type === 'toggle') {
                          return (
                            <div key={param.id} className="flex items-center justify-between">
                              <label className="text-sm text-gray-300">{param.name}</label>
                              <Button
                                onClick={() => handleEffectChange(effect.id, param.id, !currentValue)}
                                variant={currentValue ? "default" : "outline"}
                                size="sm"
                                className={currentValue ? "bg-crd-green text-black" : "border-white/20 text-white"}
                              >
                                {currentValue ? 'ON' : 'OFF'}
                              </Button>
                            </div>
                          );
                        }

                        if (param.type === 'select' && param.options) {
                          return (
                            <div key={param.id}>
                              <label className="text-sm text-gray-300 mb-2 block">{param.name}</label>
                              <div className="grid grid-cols-2 gap-1">
                                {param.options.map((option) => (
                                  <Button
                                    key={option.value}
                                    onClick={() => handleEffectChange(effect.id, param.id, option.value)}
                                    variant={currentValue === option.value ? "default" : "outline"}
                                    size="sm"
                                    className={
                                      currentValue === option.value 
                                        ? "bg-crd-green text-black text-xs" 
                                        : "border-white/20 text-white hover:bg-white/10 text-xs"
                                    }
                                  >
                                    {option.label}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          );
                        }

                        return null;
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
