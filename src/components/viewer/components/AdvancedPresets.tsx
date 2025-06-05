
import React from 'react';
import { Crown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AdvancedPresetsProps {
  onApplyPreset: (preset: any) => void;
}

export const AdvancedPresets: React.FC<AdvancedPresetsProps> = ({
  onApplyPreset
}) => {
  // Advanced effect presets for pro/baller users
  const advancedPresets = [
    {
      name: 'Diamond Prism',
      effects: {
        crystal: { intensity: 95, facets: 16, dispersion: 85, clarity: 90, sparkle: true },
        holographic: { intensity: 30, shiftSpeed: 80, rainbowSpread: 150, prismaticDepth: 40, animated: true }
      }
    },
    {
      name: 'Liquid Chrome',
      effects: {
        chrome: { intensity: 85, sharpness: 95, distortion: 15, highlightSize: 55, polish: 95 },
        interference: { intensity: 25, frequency: 45, amplitude: 30, phase: 0 }
      }
    },
    {
      name: 'Golden Holographic',
      effects: {
        gold: { intensity: 90, shimmerSpeed: 140, platingThickness: 8, goldTone: 'rich', reflectivity: 95, colorEnhancement: true },
        holographic: { intensity: 60, shiftSpeed: 120, rainbowSpread: 200, prismaticDepth: 55, animated: true }
      }
    }
  ];

  const handlePresetClick = (preset: any) => {
    console.log('🎯 Preset button clicked:', preset.name);
    onApplyPreset(preset);
  };

  return (
    <div>
      <h4 className="text-white font-medium mb-3 flex items-center">
        <Crown className="w-4 h-4 text-amber-400 mr-2" />
        Premium Presets
        <Badge className="ml-2 text-xs bg-amber-400 text-black px-2 py-1 rounded">
          NEW
        </Badge>
      </h4>
      <div className="space-y-2">
        {advancedPresets.map((preset, index) => (
          <Button
            key={index}
            data-preset={preset.name}
            onClick={() => handlePresetClick(preset)}
            className="w-full text-left justify-start bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 border border-purple-500/30 text-white transition-all duration-200"
          >
            <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
            {preset.name}
          </Button>
        ))}
      </div>
    </div>
  );
};
