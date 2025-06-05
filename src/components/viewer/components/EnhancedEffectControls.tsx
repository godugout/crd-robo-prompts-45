
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap } from 'lucide-react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

export interface EnhancedEffectControlsProps {
  effectValues: EffectValues;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  onResetEffect: (effectId: string) => void;
  onResetAll: () => void;
}

export const EnhancedEffectControls: React.FC<EnhancedEffectControlsProps> = ({
  effectValues,
  onEffectChange,
  onResetEffect,
  onResetAll
}) => {
  return (
    <Card className="bg-black/40 border-white/10 backdrop-blur-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-sm flex items-center">
          <Zap className="w-4 h-4 mr-2 text-yellow-400" />
          Effect Controls
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-crd-lightGray text-xs">
          Enhanced effect controls will be available in a future update.
        </p>
      </CardContent>
    </Card>
  );
};
