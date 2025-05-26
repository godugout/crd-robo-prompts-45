
import React from 'react';
import { Sparkles, Palette, Zap, Sun, Moon, Droplet, Flame, Diamond } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { useCardEditor } from '@/hooks/useCardEditor';

interface AdvancedEffectsSectionProps {
  cardEditor: ReturnType<typeof useCardEditor>;
}

export const AdvancedEffectsSection = ({ cardEditor }: AdvancedEffectsSectionProps) => {
  const { cardData, updateDesignMetadata } = cardEditor;

  const effects = [
    { type: 'holographic', icon: Zap, label: 'Holographic', color: 'text-purple-500' },
    { type: 'refractor', icon: Sun, label: 'Refractor', color: 'text-yellow-500' },
    { type: 'foil', icon: Diamond, label: 'Foil', color: 'text-blue-500' },
    { type: 'prizm', icon: Palette, label: 'Prizm', color: 'text-pink-500' },
    { type: 'rainbow', icon: Droplet, label: 'Rainbow', color: 'text-red-500' },
    { type: 'chrome', icon: Moon, label: 'Chrome', color: 'text-gray-500' },
    { type: 'gold', icon: Flame, label: 'Gold', color: 'text-amber-500' },
    { type: 'black', icon: Moon, label: 'Black', color: 'text-black' }
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

  return (
    <Card className="bg-editor-dark border-editor-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-sm flex items-center">
          <Sparkles className="w-4 h-4 mr-2 text-crd-green" />
          Advanced Effects
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {effects.map(({ type, icon: Icon, label, color }) => {
          const intensity = getEffectIntensity(type);
          
          return (
            <div key={type} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span className="text-white text-sm">{label}</span>
                </div>
                <span className="text-crd-lightGray text-xs">
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
            Move your mouse over the card preview to see interactive effects in action
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
