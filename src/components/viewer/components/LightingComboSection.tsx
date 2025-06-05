
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import type { LightingPreset } from '../types';

export interface LightingComboSectionProps {
  selectedLighting?: LightingPreset;
  overallBrightness?: number[];
  interactiveLighting?: boolean;
  onLightingChange?: (lighting: LightingPreset) => void;
  onBrightnessChange?: (brightness: number[]) => void;
  onInteractiveLightingToggle?: (enabled: boolean) => void;
}

export const LightingComboSection: React.FC<LightingComboSectionProps> = ({
  selectedLighting,
  overallBrightness,
  interactiveLighting,
  onLightingChange,
  onBrightnessChange,
  onInteractiveLightingToggle
}) => {
  return (
    <Card className="bg-black/40 border-white/10 backdrop-blur-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-sm flex items-center">
          <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
          Lighting Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-crd-lightGray text-xs">
          Lighting controls will be available in a future update.
        </p>
      </CardContent>
    </Card>
  );
};
