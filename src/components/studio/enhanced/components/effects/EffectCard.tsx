
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EffectParameterControl } from './EffectParameterControl';

interface EffectParameter {
  id: string;
  name: string;
  type: 'slider' | 'toggle' | 'select' | 'color';
  min?: number;
  max?: number;
  step?: number;
  defaultValue: number | boolean | string;
  options?: { value: string; label: string }[];
}

interface VisualEffect {
  id: string;
  name: string;
  description: string;
  category: string;
  parameters: EffectParameter[];
}

interface EffectCardProps {
  effect: VisualEffect;
  effectValues: Record<string, any>;
  onEffectChange: (parameterId: string, value: number | boolean | string) => void;
  getEffectValue: (parameterId: string) => string | number | boolean;
}

export const EffectCard: React.FC<EffectCardProps> = ({
  effect,
  effectValues,
  onEffectChange,
  getEffectValue
}) => {
  const intensityValue = getEffectValue('intensity');
  const displayIntensity = typeof intensityValue === 'number' ? Math.round(intensityValue) : 0;

  return (
    <Card className="bg-black/20 border-white/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-white font-medium text-sm">{effect.name}</h4>
            <p className="text-gray-400 text-xs">{effect.description}</p>
          </div>
          <Badge 
            variant="outline" 
            className="border-crd-green/50 text-crd-green text-xs"
          >
            {displayIntensity}%
          </Badge>
        </div>

        <div className="space-y-3">
          {effect.parameters.map((param) => (
            <EffectParameterControl
              key={param.id}
              parameter={param}
              currentValue={getEffectValue(param.id)}
              onValueChange={(value) => onEffectChange(param.id, value)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
