
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Palette, 
  Sparkles, 
  Chrome, 
  Gem, 
  Waves, 
  Brush, 
  Diamond, 
  Clock,
  RotateCcw 
} from 'lucide-react';
import { 
  ENHANCED_VISUAL_EFFECTS, 
  type EffectValues, 
  type VisualEffectConfig 
} from '../hooks/useEnhancedCardEffects';

interface EnhancedEffectControlsProps {
  effectValues: EffectValues;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  onResetEffect: (effectId: string) => void;
  onResetAll: () => void;
}

const getEffectIcon = (effectId: string) => {
  const icons: Record<string, React.ComponentType<any>> = {
    holographic: Sparkles,
    foilspray: Chrome,
    prizm: Palette,
    chrome: Chrome,
    interference: Waves,
    brushedmetal: Brush,
    crystal: Diamond,
    vintage: Clock
  };
  return icons[effectId] || Sparkles;
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    metallic: 'text-amber-500',
    prismatic: 'text-purple-500',
    surface: 'text-blue-500',
    vintage: 'text-orange-500'
  };
  return colors[category] || 'text-gray-500';
};

export const EnhancedEffectControls: React.FC<EnhancedEffectControlsProps> = ({
  effectValues,
  onEffectChange,
  onResetEffect,
  onResetAll
}) => {
  const groupedEffects = ENHANCED_VISUAL_EFFECTS.reduce((acc, effect) => {
    if (!acc[effect.category]) {
      acc[effect.category] = [];
    }
    acc[effect.category].push(effect);
    return acc;
  }, {} as Record<string, VisualEffectConfig[]>);

  const renderParameterControl = (effect: VisualEffectConfig, parameter: any) => {
    const currentValue = effectValues[effect.id]?.[parameter.id] ?? parameter.defaultValue;

    switch (parameter.type) {
      case 'slider':
        return (
          <div key={parameter.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-white text-sm font-medium">{parameter.name}</label>
              <span className="text-crd-lightGray text-xs min-w-[3rem] text-right">
                {typeof currentValue === 'number' ? Math.round(currentValue) : currentValue}
                {parameter.id.includes('direction') || parameter.id.includes('rotation') ? '°' : 
                 parameter.id === 'intensity' || parameter.id.includes('percentage') ? '%' : ''}
              </span>
            </div>
            <Slider
              value={[currentValue as number]}
              onValueChange={([value]) => onEffectChange(effect.id, parameter.id, value)}
              min={parameter.min}
              max={parameter.max}
              step={parameter.step}
              className="w-full"
            />
          </div>
        );

      case 'toggle':
        return (
          <div key={parameter.id} className="flex items-center justify-between">
            <label className="text-white text-sm font-medium">{parameter.name}</label>
            <Button
              onClick={() => onEffectChange(effect.id, parameter.id, !currentValue)}
              variant="outline"
              size="sm"
              className={`${
                currentValue 
                  ? 'bg-crd-green text-black border-crd-green' 
                  : 'bg-transparent text-white border-editor-border'
              }`}
            >
              {currentValue ? 'On' : 'Off'}
            </Button>
          </div>
        );

      case 'color':
        return (
          <div key={parameter.id} className="space-y-2">
            <label className="text-white text-sm font-medium">{parameter.name}</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={currentValue as string}
                onChange={(e) => onEffectChange(effect.id, parameter.id, e.target.value)}
                className="w-8 h-8 rounded border border-editor-border bg-transparent"
              />
              <span className="text-crd-lightGray text-xs">{currentValue}</span>
            </div>
          </div>
        );

      case 'select':
        return (
          <div key={parameter.id} className="space-y-2">
            <label className="text-white text-sm font-medium">{parameter.name}</label>
            <select
              value={currentValue as string}
              onChange={(e) => onEffectChange(effect.id, parameter.id, e.target.value)}
              className="w-full p-2 rounded bg-editor-dark border border-editor-border text-white text-sm"
            >
              {parameter.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      default:
        return null;
    }
  };

  const renderEffectCard = (effect: VisualEffectConfig) => {
    const Icon = getEffectIcon(effect.id);
    const isActive = effectValues[effect.id]?.intensity && (effectValues[effect.id].intensity as number) > 0;
    const categoryColor = getCategoryColor(effect.category);

    return (
      <Card key={effect.id} className="bg-editor-dark border-editor-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-sm flex items-center">
              <Icon className={`w-4 h-4 mr-2 ${categoryColor}`} />
              {effect.name}
              {isActive && (
                <div className="w-2 h-2 bg-crd-green rounded-full ml-2" />
              )}
            </CardTitle>
            <Button
              onClick={() => onResetEffect(effect.id)}
              variant="ghost"
              size="sm"
              className="text-crd-lightGray hover:text-white p-1"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          </div>
          <p className="text-crd-lightGray text-xs">{effect.description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {effect.parameters.map(parameter => renderParameterControl(effect, parameter))}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium text-lg">Enhanced Visual Effects</h3>
        <Button
          onClick={onResetAll}
          variant="outline"
          size="sm"
          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset All
        </Button>
      </div>

      <Tabs defaultValue="metallic" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900">
          <TabsTrigger value="metallic" className="text-white data-[state=active]:bg-amber-600">
            Metallic
          </TabsTrigger>
          <TabsTrigger value="prismatic" className="text-white data-[state=active]:bg-purple-600">
            Prismatic
          </TabsTrigger>
          <TabsTrigger value="surface" className="text-white data-[state=active]:bg-blue-600">
            Surface
          </TabsTrigger>
          <TabsTrigger value="vintage" className="text-white data-[state=active]:bg-orange-600">
            Vintage
          </TabsTrigger>
        </TabsList>

        {Object.entries(groupedEffects).map(([category, effects]) => (
          <TabsContent key={category} value={category} className="space-y-4 mt-4">
            {effects.map(renderEffectCard)}
          </TabsContent>
        ))}
      </Tabs>

      <div className="pt-4 border-t border-editor-border">
        <p className="text-crd-lightGray text-xs">
          Each effect has unique parameters that control its appearance and behavior. 
          Combine multiple effects for complex visual treatments. Effects are applied in real-time 
          and interact with mouse movement for dynamic lighting.
        </p>
      </div>
    </div>
  );
};
