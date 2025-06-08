
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, Settings, X, GripVertical } from 'lucide-react';

export interface EffectLayerData {
  id: string;
  name: string;
  type: 'holographic' | 'metallic' | 'prismatic' | 'vintage' | 'crystal' | 'foil';
  opacity: number;
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light' | 'hard-light' | 'color-dodge' | 'color-burn';
  visible: boolean;
  parameters: Record<string, number>;
}

const BLEND_MODES = [
  { value: 'normal', label: 'Normal' },
  { value: 'multiply', label: 'Multiply' },
  { value: 'screen', label: 'Screen' },
  { value: 'overlay', label: 'Overlay' },
  { value: 'soft-light', label: 'Soft Light' },
  { value: 'hard-light', label: 'Hard Light' },
  { value: 'color-dodge', label: 'Color Dodge' },
  { value: 'color-burn', label: 'Color Burn' }
];

interface EffectLayerProps {
  layer: EffectLayerData;
  isSelected: boolean;
  onUpdate: (layer: EffectLayerData) => void;
  onRemove: (layerId: string) => void;
  onSelect: (layerId: string) => void;
  onToggleVisibility: (layerId: string) => void;
}

export const EffectLayer: React.FC<EffectLayerProps> = ({
  layer,
  isSelected,
  onUpdate,
  onRemove,
  onSelect,
  onToggleVisibility
}) => {
  const updateParameter = (key: string, value: number) => {
    onUpdate({
      ...layer,
      parameters: { ...layer.parameters, [key]: value }
    });
  };

  const updateOpacity = (value: number[]) => {
    onUpdate({ ...layer, opacity: value[0] });
  };

  const updateBlendMode = (blendMode: string) => {
    onUpdate({ ...layer, blendMode: blendMode as EffectLayerData['blendMode'] });
  };

  return (
    <Card 
      className={`p-4 cursor-pointer transition-all ${
        isSelected 
          ? 'bg-crd-green/10 border-crd-green' 
          : 'bg-editor-tool border-editor-border hover:border-crd-green/50'
      }`}
      onClick={() => onSelect(layer.id)}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-crd-lightGray cursor-grab" />
            <span className="text-white font-medium">{layer.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility(layer.id);
              }}
              className="text-crd-lightGray hover:text-white"
            >
              {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(layer.id);
              }}
              className="text-crd-lightGray hover:text-red-400"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Effect Type Badge */}
        <div className="text-xs text-crd-lightGray capitalize bg-editor-darker px-2 py-1 rounded">
          {layer.type} Effect
        </div>

        {isSelected && (
          <div className="space-y-3 pt-2 border-t border-editor-border">
            {/* Opacity Control */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-crd-lightGray text-sm">Opacity</label>
                <span className="text-white text-sm">{layer.opacity}%</span>
              </div>
              <Slider
                value={[layer.opacity]}
                onValueChange={updateOpacity}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* Blend Mode */}
            <div className="space-y-2">
              <label className="text-crd-lightGray text-sm">Blend Mode</label>
              <Select value={layer.blendMode} onValueChange={updateBlendMode}>
                <SelectTrigger className="bg-editor-darker border-editor-border text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BLEND_MODES.map((mode) => (
                    <SelectItem key={mode.value} value={mode.value}>
                      {mode.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Effect Parameters */}
            {Object.entries(layer.parameters).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-crd-lightGray text-sm capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <span className="text-white text-sm">{value}</span>
                </div>
                <Slider
                  value={[value]}
                  onValueChange={(val) => updateParameter(key, val[0])}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
