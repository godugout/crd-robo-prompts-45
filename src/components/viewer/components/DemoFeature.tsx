
import React, { useState } from 'react';
import { Play, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface DemoFeatureProps {
  onApplyPreset: (preset: EffectValues) => void;
  onStartTour: () => void;
}

// Predefined effect presets with visual examples
const EFFECT_PRESETS = [
  {
    id: 'holographic-premium',
    name: 'Holographic Premium',
    description: 'Classic holographic trading card with rainbow shimmer',
    thumbnail: '🌈',
    effects: {
      holographic: { intensity: 85, shiftSpeed: 150, rainbowSpread: 280, prismaticDepth: 70 },
      foilspray: { intensity: 0 },
      prizm: { intensity: 0 },
      chrome: { intensity: 0 },
      interference: { intensity: 0 },
      brushedmetal: { intensity: 0 },
      crystal: { intensity: 0 },
      vintage: { intensity: 0 }
    }
  },
  {
    id: 'chrome-mirror',
    name: 'Chrome Mirror',
    description: 'Ultra-reflective chrome finish with sharp highlights',
    thumbnail: '🪞',
    effects: {
      holographic: { intensity: 0 },
      foilspray: { intensity: 0 },
      prizm: { intensity: 0 },
      chrome: { intensity: 90, reflectionSharpness: 85, distortion: 15, highlightSize: 60 },
      interference: { intensity: 0 },
      brushedmetal: { intensity: 0 },
      crystal: { intensity: 0 },
      vintage: { intensity: 0 }
    }
  },
  {
    id: 'crystal-prizm',
    name: 'Crystal Prizm',
    description: 'Multi-faceted crystal with geometric light patterns',
    thumbnail: '💎',
    effects: {
      holographic: { intensity: 0 },
      foilspray: { intensity: 0 },
      prizm: { intensity: 80, patternComplexity: 7, colorSeparation: 90, geometricScale: 150 },
      chrome: { intensity: 0 },
      interference: { intensity: 0 },
      brushedmetal: { intensity: 0 },
      crystal: { intensity: 70, facetCount: 8, lightDispersion: 85, crystallineClarity: 75 },
      vintage: { intensity: 0 }
    }
  },
  {
    id: 'vintage-gold',
    name: 'Vintage Gold',
    description: 'Aged gold finish with patina and wear patterns',
    thumbnail: '🏆',
    effects: {
      holographic: { intensity: 0 },
      foilspray: { intensity: 0 },
      prizm: { intensity: 0 },
      chrome: { intensity: 0 },
      interference: { intensity: 0 },
      brushedmetal: { intensity: 45, brushDirection: 45, grainDensity: 60, metallicPolish: 80 },
      crystal: { intensity: 0 },
      vintage: { intensity: 85, agingLevel: 70, patinaColor: '#DAA520', wearPatterns: 60 }
    }
  },
  {
    id: 'interference-wave',
    name: 'Interference Wave',
    description: 'Soap bubble effect with shifting color waves',
    thumbnail: '🫧',
    effects: {
      holographic: { intensity: 0 },
      foilspray: { intensity: 0 },
      prizm: { intensity: 0 },
      chrome: { intensity: 0 },
      interference: { intensity: 80, waveFrequency: 120, bubbleThickness: 70, colorShiftingSpeed: 160 },
      brushedmetal: { intensity: 0 },
      crystal: { intensity: 0 },
      vintage: { intensity: 0 }
    }
  },
  {
    id: 'foil-spray',
    name: 'Foil Spray',
    description: 'Metallic spray pattern with directional flow',
    thumbnail: '✨',
    effects: {
      holographic: { intensity: 0 },
      foilspray: { intensity: 75, metallicDensity: 80, sprayPattern: 'radial', directionalFlow: 135 },
      prizm: { intensity: 0 },
      chrome: { intensity: 0 },
      interference: { intensity: 0 },
      brushedmetal: { intensity: 0 },
      crystal: { intensity: 0 },
      vintage: { intensity: 0 }
    }
  }
];

export const DemoFeature: React.FC<DemoFeatureProps> = ({
  onApplyPreset,
  onStartTour
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const handleApplyPreset = (preset: typeof EFFECT_PRESETS[0]) => {
    setSelectedPreset(preset.id);
    onApplyPreset(preset.effects);
  };

  return (
    <div className="space-y-6">
      {/* Quick Start Header */}
      <div className="text-center space-y-2">
        <h3 className="text-white text-lg font-semibold">Quick Start</h3>
        <p className="text-crd-lightGray text-sm">
          Choose a preset to get started, then customize further
        </p>
        <Button
          onClick={onStartTour}
          variant="outline"
          size="sm"
          className="border-crd-green text-crd-green hover:bg-crd-green hover:text-black"
        >
          <Play className="w-4 h-4 mr-2" />
          Take a Tour
        </Button>
      </div>

      {/* Preset Gallery */}
      <div className="space-y-3">
        <h4 className="text-white font-medium text-sm">Effect Presets</h4>
        <div className="grid grid-cols-2 gap-3">
          {EFFECT_PRESETS.map((preset) => (
            <Card 
              key={preset.id}
              className={`cursor-pointer transition-all hover:scale-105 ${
                selectedPreset === preset.id 
                  ? 'ring-2 ring-crd-green bg-editor-dark border-crd-green' 
                  : 'bg-editor-dark border-editor-border hover:border-crd-lightGray'
              }`}
              onClick={() => handleApplyPreset(preset)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="text-2xl">{preset.thumbnail}</div>
                  {selectedPreset === preset.id && (
                    <div className="w-2 h-2 bg-crd-green rounded-full" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardTitle className="text-white text-sm mb-1">
                  {preset.name}
                </CardTitle>
                <p className="text-crd-lightGray text-xs leading-tight">
                  {preset.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-editor-border text-white hover:bg-gray-700"
            onClick={() => {
              setSelectedPreset(null);
              onApplyPreset({
                holographic: { intensity: 0 },
                foilspray: { intensity: 0 },
                prizm: { intensity: 0 },
                chrome: { intensity: 0 },
                interference: { intensity: 0 },
                brushedmetal: { intensity: 0 },
                crystal: { intensity: 0 },
                vintage: { intensity: 0 }
              });
            }}
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Clear All
          </Button>
        </div>
        
        {selectedPreset && (
          <div className="text-center">
            <p className="text-crd-green text-xs">
              ✓ Preset applied! Switch to Effects tab to customize further
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
