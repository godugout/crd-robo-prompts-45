import React, { useState } from 'react';
import { Play, ArrowRight, RotateCcw, Crown, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { usePremiumFeatures } from '@/hooks/usePremiumFeatures';

interface DemoFeatureProps {
  onApplyPreset: (preset: EffectValues) => void;
  onStartTour: () => void;
}

// Updated presets to match the new premium structure
const FEATURED_PRESETS = [
  {
    id: 'basic-holographic',
    name: 'Holographic',
    description: 'Classic rainbow holographic shimmer',
    thumbnail: '🌈',
    tier: 'free' as const,
    effects: {
      holographic: { intensity: 60, shiftSpeed: 120, rainbowSpread: 200, animated: true }
    }
  },
  {
    id: 'chrome-shine',
    name: 'Chrome',
    description: 'Clean metallic chrome finish',
    thumbnail: '🪞',
    tier: 'free' as const,
    effects: {
      chrome: { intensity: 70, sharpness: 75, highlightSize: 50 }
    }
  },
  {
    id: 'rainbow-prizm',
    name: 'Rainbow Prizm',
    description: 'Intense prismatic colors with holographic depth',
    thumbnail: '💎',
    tier: 'premium' as const,
    effects: {
      prizm: { intensity: 75, complexity: 8, colorSeparation: 85 },
      holographic: { intensity: 45, shiftSpeed: 140, rainbowSpread: 260, animated: true },
      crystal: { intensity: 25, facets: 6, dispersion: 60 }
    }
  },
  {
    id: 'gold-dynasty',
    name: 'Gold Dynasty',
    description: 'Luxurious gold with vintage character',
    thumbnail: '🏆',
    tier: 'premium' as const,
    effects: {
      gold: { intensity: 85, shimmerSpeed: 90, platingThickness: 6, goldTone: 'rich', reflectivity: 85 },
      vintage: { intensity: 30, aging: 40, patina: '#b8860b' },
      chrome: { intensity: 25, sharpness: 70, highlightSize: 35 }
    }
  },
  {
    id: 'diamond-clarity',
    name: 'Diamond Clarity',
    description: 'Flawless crystal with chrome precision',
    thumbnail: '💍',
    tier: 'premium' as const,
    effects: {
      crystal: { intensity: 90, facets: 12, dispersion: 95 },
      chrome: { intensity: 60, sharpness: 95, highlightSize: 25 },
      prizm: { intensity: 20, complexity: 4, colorSeparation: 40 }
    }
  },
  {
    id: 'cosmic-storm',
    name: 'Cosmic Storm',
    description: 'Complex multi-effect interaction for ultimate visual impact',
    thumbnail: '⚡',
    tier: 'premium' as const,
    effects: {
      holographic: { intensity: 35, shiftSpeed: 180, rainbowSpread: 300, animated: true },
      prizm: { intensity: 30, complexity: 5, colorSeparation: 50 },
      crystal: { intensity: 25, facets: 8, dispersion: 60 },
      chrome: { intensity: 30, sharpness: 70, highlightSize: 40 },
      interference: { intensity: 20, frequency: 8, thickness: 2 }
    }
  }
];

export const DemoFeature: React.FC<DemoFeatureProps> = ({
  onApplyPreset,
  onStartTour
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  
  // Use premium features hook - defaults to premium enabled
  const { isPremiumUser } = usePremiumFeatures();

  const handleApplyPreset = (preset: typeof FEATURED_PRESETS[0]) => {
    setSelectedPreset(preset.id);
    onApplyPreset(preset.effects);
  };

  // Split presets by tier
  const freePresets = FEATURED_PRESETS.filter(p => p.tier === 'free');
  const premiumPresets = FEATURED_PRESETS.filter(p => p.tier === 'premium');

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

      {/* Free Presets */}
      <div className="space-y-3">
        <h4 className="text-white font-medium text-sm">Free Presets</h4>
        <div className="grid grid-cols-2 gap-3">
          {freePresets.map((preset) => (
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

      {/* Premium Presets - Always show as unlocked for testing */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-amber-400 font-medium text-sm flex items-center">
            <Crown className="w-4 h-4 mr-1" />
            Premium Collection {isPremiumUser && <span className="ml-2 text-xs bg-amber-500 text-black px-2 py-0.5 rounded">UNLOCKED</span>}
          </h4>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {premiumPresets.map((preset) => (
            <Card 
              key={preset.id}
              className={`cursor-pointer transition-all hover:scale-105 ${
                selectedPreset === preset.id 
                  ? 'ring-2 ring-amber-500 bg-editor-dark border-amber-500' 
                  : 'bg-editor-dark border-amber-600/30 hover:border-amber-500'
              }`}
              onClick={() => handleApplyPreset(preset)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="text-2xl">{preset.thumbnail}</div>
                  <div className="flex items-center space-x-1">
                    <Crown className="w-3 h-3 text-amber-400" />
                    {selectedPreset === preset.id && (
                      <div className="w-2 h-2 bg-amber-400 rounded-full" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardTitle className="text-white text-sm mb-1 flex items-center">
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

      {/* Premium Status Banner */}
      {isPremiumUser && (
        <div className="p-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-lg">
          <div className="text-center space-y-2">
            <Crown className="w-6 h-6 text-amber-400 mx-auto" />
            <div>
              <h4 className="text-white font-semibold mb-1">Premium Studio Active</h4>
              <p className="text-amber-200 text-sm">All premium effects and studio features unlocked</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-amber-200">
              <div>• 20+ Premium Effects</div>
              <div>• Advanced Materials</div>
              <div>• 8K Export</div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="space-y-2">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-editor-border text-white hover:bg-gray-700"
            onClick={() => {
              setSelectedPreset(null);
              onApplyPreset({});
            }}
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Clear All
          </Button>
        </div>
        
        {selectedPreset && (
          <div className="text-center">
            <p className="text-crd-green text-xs">
              ✓ Preset applied! Switch to {isPremiumUser ? 'Premium Studio' : 'Effects'} tab to customize further
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
