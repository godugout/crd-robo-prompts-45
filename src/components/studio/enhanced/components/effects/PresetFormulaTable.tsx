
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Beaker, TrendingUp } from 'lucide-react';
import type { EffectPreset } from './ninePresets';

interface PresetFormulaTableProps {
  preset: EffectPreset;
}

export const PresetFormulaTable: React.FC<PresetFormulaTableProps> = ({ preset }) => {
  const getEffectName = (effectId: string): string => {
    const names: Record<string, string> = {
      holographic: 'Holographic',
      foilspray: 'Foil Spray',
      prizm: 'Prizm',
      chrome: 'Chrome',
      crystal: 'Crystal',
      gold: 'Gold'
    };
    return names[effectId] || effectId;
  };

  const getParameterLabel = (parameterId: string): string => {
    const labels: Record<string, string> = {
      intensity: 'Intensity',
      shiftSpeed: 'Shift Speed',
      rainbowSpread: 'Rainbow Spread',
      animated: 'Animated',
      dispersion: 'Dispersion',
      geometryType: 'Geometry',
      wavePattern: 'Wave Pattern',
      sharpness: 'Sharpness',
      reflectivity: 'Reflectivity',
      clarity: 'Clarity',
      goldTone: 'Gold Tone',
      shimmerSpeed: 'Shimmer Speed',
      colorEnhancement: 'Color Enhancement',
      pattern: 'Pattern',
      facets: 'Facets',
      sparkle: 'Sparkle',
      patina: 'Patina',
      weathering: 'Weathering',
      density: 'Density',
      direction: 'Direction'
    };
    return labels[parameterId] || parameterId;
  };

  const formatValue = (value: any): string => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (typeof value === 'number') {
      return value.toString();
    }
    return String(value);
  };

  return (
    <Card className="bg-black/30 border-white/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-sm flex items-center">
          <Beaker className="w-4 h-4 mr-2 text-crd-green" />
          Effect Formula: {preset.name}
        </CardTitle>
        <p className="text-gray-400 text-xs">
          Technical breakdown of the effect parameters and calculations
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Traits Overview */}
        <div className="bg-black/20 rounded-lg p-3">
          <h4 className="text-white text-sm font-medium mb-2 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1 text-blue-400" />
            Visual Traits
          </h4>
          <div className="grid grid-cols-4 gap-3">
            {Object.entries(preset.traits).map(([trait, value]) => (
              <div key={trait} className="text-center">
                <div className="text-white text-sm font-medium capitalize">{trait}</div>
                <div className="text-crd-green text-lg font-bold">{value}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Effect Parameters */}
        <div className="space-y-3">
          <h4 className="text-white text-sm font-medium">Active Effects</h4>
          {Object.entries(preset.formula).map(([effectId, parameters]) => (
            <div key={effectId} className="bg-black/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs border-crd-green/50 text-crd-green">
                  {getEffectName(effectId)}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(parameters).map(([parameterId, value]) => (
                  <div key={parameterId} className="flex justify-between">
                    <span className="text-gray-400">{getParameterLabel(parameterId)}:</span>
                    <span className="text-white font-medium">{formatValue(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* AI Calculation Note */}
        <div className="text-xs text-gray-500 bg-black/10 rounded p-2 border-l-2 border-crd-green/30">
          <strong className="text-crd-green">AI-Optimized:</strong> This formula was calculated for maximum visual impact 
          based on color theory, material physics, and user preference data.
        </div>
      </CardContent>
    </Card>
  );
};
