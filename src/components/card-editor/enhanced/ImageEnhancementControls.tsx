
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface ImageEnhancementControlsProps {
  enhancements: {
    brightness: number;
    contrast: number;
    saturation: number;
    sharpness: number;
  };
  onEnhancementsChange: (enhancements: any) => void;
}

export const ImageEnhancementControls: React.FC<ImageEnhancementControlsProps> = ({
  enhancements,
  onEnhancementsChange
}) => {
  const updateEnhancement = (key: keyof typeof enhancements, value: number) => {
    onEnhancementsChange({
      ...enhancements,
      [key]: value
    });
  };

  const resetEnhancements = () => {
    onEnhancementsChange({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      sharpness: 100
    });
  };

  const enhancementControls = [
    { key: 'brightness', label: 'Brightness', min: 0, max: 200, step: 1 },
    { key: 'contrast', label: 'Contrast', min: 0, max: 200, step: 1 },
    { key: 'saturation', label: 'Saturation', min: 0, max: 200, step: 1 },
    { key: 'sharpness', label: 'Sharpness', min: 0, max: 200, step: 1 }
  ];

  return (
    <Card className="bg-editor-darker border-editor-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-white">Image Enhancements</h4>
          <Button
            onClick={resetEnhancements}
            variant="outline"
            size="sm"
            className="border-editor-border text-crd-lightGray hover:text-white"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
        </div>
        
        <div className="space-y-4">
          {enhancementControls.map(control => (
            <div key={control.key}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-crd-lightGray">{control.label}</label>
                <span className="text-xs text-white">
                  {enhancements[control.key as keyof typeof enhancements]}%
                </span>
              </div>
              <Slider
                value={[enhancements[control.key as keyof typeof enhancements]]}
                onValueChange={([value]) => updateEnhancement(control.key as keyof typeof enhancements, value)}
                min={control.min}
                max={control.max}
                step={control.step}
                className="w-full"
              />
            </div>
          ))}
        </div>

        {/* Quick Presets */}
        <div className="mt-4 pt-4 border-t border-editor-border">
          <h5 className="text-xs font-medium text-white mb-2">Quick Presets</h5>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => onEnhancementsChange({ brightness: 110, contrast: 110, saturation: 105, sharpness: 110 })}
              variant="outline"
              size="sm"
              className="text-xs border-editor-border text-crd-lightGray hover:text-white"
            >
              Enhance
            </Button>
            <Button
              onClick={() => onEnhancementsChange({ brightness: 95, contrast: 90, saturation: 85, sharpness: 100 })}
              variant="outline"
              size="sm"
              className="text-xs border-editor-border text-crd-lightGray hover:text-white"
            >
              Vintage
            </Button>
            <Button
              onClick={() => onEnhancementsChange({ brightness: 105, contrast: 120, saturation: 130, sharpness: 115 })}
              variant="outline"
              size="sm"
              className="text-xs border-editor-border text-crd-lightGray hover:text-white"
            >
              Vivid
            </Button>
            <Button
              onClick={() => onEnhancementsChange({ brightness: 100, contrast: 80, saturation: 70, sharpness: 100 })}
              variant="outline"
              size="sm"
              className="text-xs border-editor-border text-crd-lightGray hover:text-white"
            >
              Soft
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
