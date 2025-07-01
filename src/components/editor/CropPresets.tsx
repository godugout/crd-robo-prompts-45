
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CropPreset {
  id: string;
  name: string;
  ratio: number;
  description: string;
}

interface CropPresetsProps {
  onPresetSelect: (preset: CropPreset) => void;
  currentRatio?: number;
}

export const CropPresets: React.FC<CropPresetsProps> = ({ onPresetSelect, currentRatio }) => {
  const presets: CropPreset[] = [
    { id: 'card', name: 'Trading Card', ratio: 2.5 / 3.5, description: '2.5:3.5' },
    { id: 'closeup', name: 'Close-up', ratio: 1 / 1.2, description: '5:6' },
    { id: 'portrait', name: 'Portrait', ratio: 3 / 4, description: '3:4' },
    { id: 'wide', name: 'Wide Shot', ratio: 4 / 3, description: '4:3' },
    { id: 'square', name: 'Square', ratio: 1, description: '1:1' },
    { id: 'business', name: 'Business Card', ratio: 3.5 / 2, description: '3.5:2' }
  ];

  const isActive = (preset: CropPreset) => {
    if (!currentRatio) return false;
    return Math.abs(currentRatio - preset.ratio) < 0.05;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-white font-medium text-sm">Crop Presets</h4>
        <Badge variant="outline" className="text-xs text-crd-lightGray border-editor-border">
          Quick Select
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.id}
            onClick={() => onPresetSelect(preset)}
            variant={isActive(preset) ? "default" : "outline"}
            size="sm"
            className={`flex flex-col h-auto py-2 px-3 ${
              isActive(preset)
                ? 'bg-crd-green text-black'
                : 'border-editor-border text-crd-lightGray hover:text-white hover:border-crd-green/50'
            }`}
          >
            <span className="font-medium text-xs">{preset.name}</span>
            <span className="text-xs opacity-70">{preset.description}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
