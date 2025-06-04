
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Crown, Zap, Palette, Sparkles, Check, RotateCcw } from 'lucide-react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface EffectPreset {
  id: string;
  name: string;
  description: string;
  category: string;
  effects: EffectValues;
  tags: string[];
}

interface HorizontalPresetSelectionProps {
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  onResetAllEffects: () => void;
}

const PRESET_CATEGORIES = [
  {
    id: 'premium',
    name: 'Premium',
    icon: Crown,
    color: 'text-amber-500',
    presets: [
      {
        id: 'holographic-premium',
        name: 'Holographic Premium',
        description: 'Intense holographic effects with perfect rainbow shifts',
        category: 'premium',
        effects: {
          holographic: { intensity: 85, shiftSpeed: 150, rainbowSpread: 280, prismaticDepth: 70 },
          foilspray: { intensity: 30 },
          prizm: { intensity: 20 },
          chrome: { intensity: 0 },
          interference: { intensity: 0 },
          brushedmetal: { intensity: 0 },
          crystal: { intensity: 0 },
          vintage: { intensity: 0 }
        },
        tags: ['Premium', 'Holographic', 'Rainbow']
      },
      {
        id: 'gold-luxury',
        name: 'Gold Luxury',
        description: 'Elegant gold foiling with subtle metallic shine',
        category: 'premium',
        effects: {
          holographic: { intensity: 0 },
          foilspray: { intensity: 70 },
          prizm: { intensity: 0 },
          chrome: { intensity: 40 },
          interference: { intensity: 0 },
          brushedmetal: { intensity: 50 },
          crystal: { intensity: 0 },
          vintage: { intensity: 0 }
        },
        tags: ['Luxury', 'Gold', 'Metallic']
      }
    ]
  },
  {
    id: 'metallic',
    name: 'Metallic',
    icon: Zap,
    color: 'text-blue-500',
    presets: [
      {
        id: 'chrome-mirror',
        name: 'Chrome Mirror',
        description: 'Reflective chrome finish with mirror-like quality',
        category: 'metallic',
        effects: {
          holographic: { intensity: 0 },
          foilspray: { intensity: 0 },
          prizm: { intensity: 0 },
          chrome: { intensity: 90 },
          interference: { intensity: 0 },
          brushedmetal: { intensity: 30 },
          crystal: { intensity: 0 },
          vintage: { intensity: 0 }
        },
        tags: ['Chrome', 'Mirror', 'Reflective']
      }
    ]
  },
  {
    id: 'specialty',
    name: 'Specialty',
    icon: Palette,
    color: 'text-purple-500',
    presets: [
      {
        id: 'crystal-prism',
        name: 'Crystal Prism',
        description: 'Crystalline effects with light refraction',
        category: 'specialty',
        effects: {
          holographic: { intensity: 20 },
          foilspray: { intensity: 0 },
          prizm: { intensity: 70 },
          chrome: { intensity: 0 },
          interference: { intensity: 40 },
          brushedmetal: { intensity: 0 },
          crystal: { intensity: 85 },
          vintage: { intensity: 0 }
        },
        tags: ['Crystal', 'Prism', 'Refraction']
      }
    ]
  }
];

export const HorizontalPresetSelection: React.FC<HorizontalPresetSelectionProps> = ({
  onEffectChange,
  onResetAllEffects
}) => {
  const [selectedPreset, setSelectedPreset] = useState<EffectPreset | null>(null);

  const handlePresetSelect = useCallback((preset: EffectPreset) => {
    setSelectedPreset(preset);
    // Apply preset effects
    Object.entries(preset.effects).forEach(([effectId, parameters]: [string, any]) => {
      Object.entries(parameters).forEach(([parameterId, value]) => {
        onEffectChange(effectId, parameterId, value as string | number | boolean);
      });
    });
  }, [onEffectChange]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white text-xl font-semibold flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-crd-green" />
            Visual Effect Presets
          </h3>
          <p className="text-crd-lightGray text-sm mt-1">
            Choose from professionally designed effect combinations
          </p>
        </div>
        <Button
          onClick={onResetAllEffects}
          variant="outline"
          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset All
        </Button>
      </div>

      {/* Categories and Presets in Horizontal Grid */}
      <div className="space-y-8">
        {PRESET_CATEGORIES.map((category) => {
          const Icon = category.icon;
          
          return (
            <div key={category.id} className="space-y-4">
              <h4 className="text-white font-medium flex items-center">
                <Icon className={`w-4 h-4 mr-2 ${category.color}`} />
                {category.name}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.presets.map((preset) => {
                  const isSelected = selectedPreset?.id === preset.id;
                  
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handlePresetSelect(preset)}
                      className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${
                        isSelected
                          ? 'border-crd-green bg-crd-green bg-opacity-10'
                          : 'border-editor-border hover:border-gray-500 bg-editor-dark'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="text-white font-medium mb-1">{preset.name}</h5>
                          <p className="text-crd-lightGray text-sm mb-3">{preset.description}</p>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-1">
                            {preset.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-700 bg-opacity-50 text-gray-300 text-xs rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Selection Indicator */}
                        {isSelected && (
                          <div className="w-6 h-6 bg-crd-green rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-black" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
