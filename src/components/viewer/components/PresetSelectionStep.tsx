
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Sparkles, Crown, Palette, Zap, Check } from 'lucide-react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface PresetCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  presets: EffectPreset[];
}

interface EffectPreset {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail?: string;
  effects: EffectValues;
  tags: string[];
}

interface PresetSelectionStepProps {
  selectedPreset?: EffectPreset;
  onPresetSelect: (preset: EffectPreset) => void;
  onPresetPreview: (preset: EffectPreset | null) => void;
  isPreviewMode: boolean;
  onTogglePreviewMode: () => void;
  onNext: () => void;
}

const PRESET_CATEGORIES: PresetCategory[] = [
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
      },
      {
        id: 'brushed-steel',
        name: 'Brushed Steel',
        description: 'Industrial brushed metal texture with subtle shine',
        category: 'metallic',
        effects: {
          holographic: { intensity: 0 },
          foilspray: { intensity: 0 },
          prizm: { intensity: 0 },
          chrome: { intensity: 20 },
          interference: { intensity: 0 },
          brushedmetal: { intensity: 80 },
          crystal: { intensity: 0 },
          vintage: { intensity: 0 }
        },
        tags: ['Steel', 'Industrial', 'Brushed']
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
      },
      {
        id: 'vintage-classic',
        name: 'Vintage Classic',
        description: 'Aged look with subtle weathering effects',
        category: 'specialty',
        effects: {
          holographic: { intensity: 0 },
          foilspray: { intensity: 0 },
          prizm: { intensity: 0 },
          chrome: { intensity: 0 },
          interference: { intensity: 0 },
          brushedmetal: { intensity: 0 },
          crystal: { intensity: 0 },
          vintage: { intensity: 75 }
        },
        tags: ['Vintage', 'Classic', 'Aged']
      }
    ]
  }
];

export const PresetSelectionStep: React.FC<PresetSelectionStepProps> = ({
  selectedPreset,
  onPresetSelect,
  onPresetPreview,
  isPreviewMode,
  onTogglePreviewMode,
  onNext
}) => {
  const [hoveredPreset, setHoveredPreset] = useState<EffectPreset | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('premium');

  const handlePresetHover = useCallback((preset: EffectPreset | null) => {
    if (isPreviewMode) {
      setHoveredPreset(preset);
      onPresetPreview(preset);
    }
  }, [isPreviewMode, onPresetPreview]);

  const handlePresetClick = useCallback((preset: EffectPreset) => {
    onPresetSelect(preset);
    if (!isPreviewMode) {
      onPresetPreview(preset);
    }
  }, [onPresetSelect, onPresetPreview, isPreviewMode]);

  const currentCategory = PRESET_CATEGORIES.find(cat => cat.id === selectedCategory);
  const canProceed = selectedPreset !== undefined;

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-white text-xl font-semibold flex items-center justify-center">
          <Sparkles className="w-5 h-5 mr-2 text-crd-green" />
          Choose Your Style
        </h3>
        <p className="text-crd-lightGray text-sm">
          Select a visual effect preset to enhance your card
        </p>
      </div>

      {/* Preview Mode Toggle */}
      <div className="flex items-center justify-center">
        <Button
          onClick={onTogglePreviewMode}
          variant="outline"
          size="sm"
          className={`${
            isPreviewMode 
              ? 'bg-crd-green text-black border-crd-green' 
              : 'bg-transparent text-white border-editor-border'
          }`}
        >
          {isPreviewMode ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
          {isPreviewMode ? 'Preview Mode On' : 'Preview Mode Off'}
        </Button>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-2">
        {PRESET_CATEGORIES.map((category) => {
          const Icon = category.icon;
          const isActive = selectedCategory === category.id;
          
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                isActive
                  ? 'bg-white bg-opacity-20 text-white'
                  : 'bg-transparent text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <Icon className={`w-4 h-4 mr-2 ${category.color}`} />
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          );
        })}
      </div>

      {/* Preset Grid */}
      {currentCategory && (
        <div className="grid grid-cols-1 gap-4">
          {currentCategory.presets.map((preset) => {
            const isSelected = selectedPreset?.id === preset.id;
            const isHovered = hoveredPreset?.id === preset.id;
            
            return (
              <div
                key={preset.id}
                onClick={() => handlePresetClick(preset)}
                onMouseEnter={() => handlePresetHover(preset)}
                onMouseLeave={() => handlePresetHover(null)}
                className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-crd-green bg-crd-green bg-opacity-10'
                    : isHovered && isPreviewMode
                    ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                    : 'border-editor-border hover:border-gray-500 bg-editor-dark'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-lg mb-1">{preset.name}</h4>
                    <p className="text-crd-lightGray text-sm mb-3">{preset.description}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-2">
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
                
                {/* Preview Indicator */}
                {isHovered && isPreviewMode && !isSelected && (
                  <div className="absolute top-2 right-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Continue Button */}
      <div className="pt-4 border-t border-editor-border">
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="w-full bg-crd-green text-black hover:bg-crd-green/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Environment
        </Button>
        
        {selectedPreset && (
          <p className="text-center text-crd-lightGray text-xs mt-2">
            Selected: {selectedPreset.name}
          </p>
        )}
      </div>
    </div>
  );
};
