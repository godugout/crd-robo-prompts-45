
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Sparkles, ChevronDown, ChevronRight } from 'lucide-react';
import { ColoredSlider } from './ColoredSlider';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface EffectsSectionProps {
  effectValues: EffectValues;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  onResetAllEffects: () => void;
}

// Enhanced effect configurations with better organization
const ENHANCED_EFFECTS_CONFIG = {
  holographic: {
    name: 'Holographic',
    color: 'text-purple-400',
    sliderColor: 'purple',
    parameters: {
      intensity: { label: 'Intensity', min: 0, max: 100, step: 1 },
      shiftSpeed: { label: 'Shift Speed', min: 0, max: 300, step: 10 },
      rainbowSpread: { label: 'Rainbow Spread', min: 0, max: 360, step: 10 },
      prismaticDepth: { label: 'Prismatic Depth', min: 0, max: 100, step: 5 }
    }
  },
  foilspray: {
    name: 'Foil Spray',
    color: 'text-yellow-400',
    sliderColor: 'yellow',
    parameters: {
      intensity: { label: 'Intensity', min: 0, max: 100, step: 1 },
      density: { label: 'Density', min: 0, max: 100, step: 5 },
      size: { label: 'Size', min: 0, max: 100, step: 5 }
    }
  },
  prizm: {
    name: 'Prizm',
    color: 'text-blue-400',
    sliderColor: 'blue',
    parameters: {
      intensity: { label: 'Intensity', min: 0, max: 100, step: 1 },
      refraction: { label: 'Refraction', min: 0, max: 100, step: 5 },
      dispersion: { label: 'Dispersion', min: 0, max: 100, step: 5 }
    }
  },
  chrome: {
    name: 'Chrome',
    color: 'text-gray-300',
    sliderColor: 'gray',
    parameters: {
      intensity: { label: 'Intensity', min: 0, max: 100, step: 1 },
      sharpness: { label: 'Sharpness', min: 0, max: 100, step: 5 },
      reflectivity: { label: 'Reflectivity', min: 0, max: 100, step: 5 }
    }
  },
  interference: {
    name: 'Interference',
    color: 'text-green-400',
    sliderColor: 'green',
    parameters: {
      intensity: { label: 'Intensity', min: 0, max: 100, step: 1 },
      frequency: { label: 'Frequency', min: 0, max: 100, step: 5 },
      amplitude: { label: 'Amplitude', min: 0, max: 100, step: 5 }
    }
  },
  brushedmetal: {
    name: 'Brushed Metal',
    color: 'text-orange-400',
    sliderColor: 'orange',
    parameters: {
      intensity: { label: 'Intensity', min: 0, max: 100, step: 1 },
      direction: { label: 'Direction', min: 0, max: 360, step: 15 },
      roughness: { label: 'Roughness', min: 0, max: 100, step: 5 }
    }
  },
  crystal: {
    name: 'Crystal',
    color: 'text-cyan-400',
    sliderColor: 'cyan',
    parameters: {
      intensity: { label: 'Intensity', min: 0, max: 100, step: 1 },
      facets: { label: 'Facets', min: 3, max: 20, step: 1 },
      clarity: { label: 'Clarity', min: 0, max: 100, step: 5 }
    }
  },
  vintage: {
    name: 'Vintage',
    color: 'text-amber-400',
    sliderColor: 'amber',
    parameters: {
      intensity: { label: 'Intensity', min: 0, max: 100, step: 1 },
      aging: { label: 'Aging', min: 0, max: 100, step: 5 },
      wear: { label: 'Wear', min: 0, max: 100, step: 5 }
    }
  }
};

export const EffectsSection: React.FC<EffectsSectionProps> = ({
  effectValues,
  onEffectChange,
  onResetAllEffects
}) => {
  const [expandedEffects, setExpandedEffects] = useState<Set<string>>(new Set());

  const toggleEffectExpanded = useCallback((effectId: string) => {
    setExpandedEffects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(effectId)) {
        newSet.delete(effectId);
      } else {
        newSet.add(effectId);
      }
      return newSet;
    });
  }, []);

  const getActiveEffectsCount = () => {
    return Object.values(effectValues).filter(effect => {
      const intensity = effect.intensity;
      return typeof intensity === 'number' && intensity > 0;
    }).length;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-medium flex items-center">
          <Sparkles className="w-4 h-4 text-crd-green mr-2" />
          Enhanced Effects ({getActiveEffectsCount()})
        </h3>
        <Button variant="ghost" size="sm" onClick={onResetAllEffects} className="text-red-400 hover:text-red-300">
          Reset All
        </Button>
      </div>
      
      <div className="space-y-2">
        {Object.entries(ENHANCED_EFFECTS_CONFIG).map(([effectId, config]) => {
          const effectData = effectValues[effectId] || { intensity: 0 };
          const intensity = typeof effectData.intensity === 'number' ? effectData.intensity : 0;
          const isExpanded = expandedEffects.has(effectId);
          const isActive = intensity > 0;
          const hasSecondaryParams = Object.keys(config.parameters).length > 1;
          
          return (
            <div key={effectId} className={`border border-white/10 rounded-lg p-3 ${isActive ? 'bg-white/5' : 'bg-transparent'}`}>
              {/* Title and Intensity Slider on one line */}
              <div className="flex items-center space-x-3 mb-2">
                <div className="flex items-center space-x-2 flex-1">
                  <span className={`text-sm font-medium ${config.color} min-w-[90px]`}>
                    {config.name}
                  </span>
                  <div className="flex-1">
                    <ColoredSlider
                      value={[intensity]}
                      onValueChange={(value) => onEffectChange(effectId, 'intensity', value[0])}
                      min={0}
                      max={100}
                      step={1}
                      color={config.sliderColor}
                      variant="primary"
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-8 text-right">{intensity}</span>
                </div>
                
                {/* Expand/Collapse button - only show if effect has parameters beyond intensity */}
                {hasSecondaryParams && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleEffectExpanded(effectId)}
                    className="p-1 h-6 w-6 text-gray-400 hover:text-white"
                  >
                    {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </Button>
                )}
              </div>

              {/* Collapsible additional parameters */}
              {isExpanded && hasSecondaryParams && (
                <div className="space-y-2 pl-2 border-l border-white/10">
                  {Object.entries(config.parameters).map(([paramId, paramConfig]) => {
                    if (paramId === 'intensity') return null; // Skip intensity as it's already shown above
                    
                    const value = typeof effectData[paramId] === 'number' ? effectData[paramId] : paramConfig.min;
                    
                    return (
                      <div key={paramId} className="flex items-center space-x-2">
                        <Label className={`text-xs w-20 text-right text-${config.sliderColor}-400/70`}>
                          {paramConfig.label}
                        </Label>
                        <div className="flex-1">
                          <ColoredSlider
                            value={[value]}
                            onValueChange={(newValue) => onEffectChange(effectId, paramId, newValue[0])}
                            min={paramConfig.min}
                            max={paramConfig.max}
                            step={paramConfig.step}
                            color={config.sliderColor}
                            variant="secondary"
                          />
                        </div>
                        <span className="text-xs text-gray-400 w-8 text-right">{value}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
