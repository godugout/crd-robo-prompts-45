
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface EffectParameter {
  id: string;
  name: string;
  type: 'slider' | 'toggle' | 'select';
  min?: number;
  max?: number;
  step?: number;
  defaultValue: number | boolean | string;
  options?: { value: string; label: string }[];
}

interface EffectParameterControlProps {
  parameter: EffectParameter;
  currentValue: string | number | boolean;
  onValueChange: (value: number | boolean | string) => void;
}

export const EffectParameterControl: React.FC<EffectParameterControlProps> = ({
  parameter,
  currentValue,
  onValueChange
}) => {
  if (parameter.type === 'slider') {
    const sliderValue = typeof currentValue === 'number' ? currentValue : (parameter.defaultValue as number);
    
    return (
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm text-gray-300">{parameter.name}</label>
          <span className="text-xs text-crd-green">
            {Math.round(sliderValue)}
            {parameter.id === 'intensity' ? '%' : ''}
          </span>
        </div>
        <Slider
          value={[sliderValue]}
          onValueChange={([value]) => onValueChange(value)}
          min={parameter.min || 0}
          max={parameter.max || 100}
          step={parameter.step || 1}
          className="w-full"
        />
      </div>
    );
  }

  if (parameter.type === 'toggle') {
    const toggleValue = typeof currentValue === 'boolean' ? currentValue : Boolean(parameter.defaultValue);
    
    return (
      <div className="flex items-center justify-between">
        <label className="text-sm text-gray-300">{parameter.name}</label>
        <Button
          onClick={() => onValueChange(!toggleValue)}
          variant={toggleValue ? "default" : "outline"}
          size="sm"
          className={toggleValue ? "bg-crd-green text-black" : "border-white/20 text-white"}
        >
          {toggleValue ? 'ON' : 'OFF'}
        </Button>
      </div>
    );
  }

  if (parameter.type === 'select' && parameter.options) {
    const selectValue = typeof currentValue === 'string' ? currentValue : String(parameter.defaultValue);
    
    return (
      <div>
        <label className="text-sm text-gray-300 mb-2 block">{parameter.name}</label>
        <div className="grid grid-cols-2 gap-1">
          {parameter.options.map((option) => (
            <Button
              key={option.value}
              onClick={() => onValueChange(option.value)}
              variant={selectValue === option.value ? "default" : "outline"}
              size="sm"
              className={
                selectValue === option.value 
                  ? "bg-crd-green text-black text-xs" 
                  : "border-white/20 text-white hover:bg-white/10 text-xs"
              }
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
