
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SimpleCardRenderer } from './SimpleCardRenderer';

const EFFECT_PRESETS = [
  {
    id: 'none',
    name: 'None',
    description: 'Clean, no effects',
    effects: { holographic: 0, metallic: 0, chrome: 0 }
  },
  {
    id: 'subtle',
    name: 'Subtle Shine',
    description: 'Light metallic finish',
    effects: { holographic: 0, metallic: 0.3, chrome: 0.1 }
  },
  {
    id: 'holographic',
    name: 'Holographic',
    description: 'Rainbow holographic effect',
    effects: { holographic: 0.7, metallic: 0.2, chrome: 0 }
  },
  {
    id: 'chrome',
    name: 'Chrome Elite',
    description: 'Mirror chrome finish',
    effects: { holographic: 0, metallic: 0.8, chrome: 0.9 }
  },
  {
    id: 'premium',
    name: 'Premium Mix',
    description: 'Holographic + metallic',
    effects: { holographic: 0.5, metallic: 0.6, chrome: 0.3 }
  }
];

const RARITY_OPTIONS = [
  { value: 'common', label: 'Common', color: '#6b7280' },
  { value: 'uncommon', label: 'Uncommon', color: '#10b981' },
  { value: 'rare', label: 'Rare', color: '#3b82f6' },
  { value: 'epic', label: 'Epic', color: '#8b5cf6' },
  { value: 'legendary', label: 'Legendary', color: '#f59e0b' }
];

interface SimpleCardCustomizerProps {
  cardData: any;
  uploadedImage: string;
  onUpdateCardData: (updates: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export const SimpleCardCustomizer: React.FC<SimpleCardCustomizerProps> = ({
  cardData,
  uploadedImage,
  onUpdateCardData,
  onNext,
  onBack
}) => {
  const handleEffectPresetChange = (presetId: string) => {
    const preset = EFFECT_PRESETS.find(p => p.id === presetId);
    if (preset) {
      onUpdateCardData({ 
        effectPreset: presetId,
        effects: preset.effects 
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Customization Panel */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Customize Your Card</h2>
          <p className="text-gray-400">Add text, select effects, and set the rarity</p>
        </div>

        <Card className="p-6 bg-gray-800/50 border-gray-700">
          <div className="space-y-6">
            {/* Card Title */}
            <div>
              <Label htmlFor="title" className="text-white mb-2 block">Card Title</Label>
              <Input
                id="title"
                value={cardData.title || ''}
                onChange={(e) => onUpdateCardData({ title: e.target.value })}
                placeholder="Enter card title..."
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            {/* Card Description */}
            <div>
              <Label htmlFor="description" className="text-white mb-2 block">Description</Label>
              <Input
                id="description"
                value={cardData.description || ''}
                onChange={(e) => onUpdateCardData({ description: e.target.value })}
                placeholder="Card description..."
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            {/* Rarity Selection */}
            <div>
              <Label className="text-white mb-2 block">Rarity</Label>
              <Select 
                value={cardData.rarity || 'common'} 
                onValueChange={(value) => onUpdateCardData({ rarity: value })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select rarity" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {RARITY_OPTIONS.map((rarity) => (
                    <SelectItem 
                      key={rarity.value} 
                      value={rarity.value}
                      className="text-white hover:bg-gray-700"
                    >
                      <span className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: rarity.color }}
                        />
                        {rarity.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Effect Presets */}
            <div>
              <Label className="text-white mb-3 block">Visual Effects</Label>
              <div className="grid grid-cols-1 gap-3">
                {EFFECT_PRESETS.map((preset) => (
                  <Card
                    key={preset.id}
                    className={`
                      cursor-pointer transition-all duration-200 p-3
                      ${cardData.effectPreset === preset.id
                        ? 'border-crd-green bg-crd-green/10'
                        : 'border-gray-600 hover:border-crd-green/50'
                      }
                    `}
                    onClick={() => handleEffectPresetChange(preset.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-white font-medium">{preset.name}</h4>
                        <p className="text-gray-400 text-sm">{preset.description}</p>
                      </div>
                      {cardData.effectPreset === preset.id && (
                        <div className="w-4 h-4 bg-crd-green rounded-full" />
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            onClick={onBack}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Back to Frames
          </Button>
          <Button
            onClick={onNext}
            className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
          >
            Preview Card
          </Button>
        </div>
      </div>

      {/* Live Preview */}
      <div className="h-96 lg:h-full">
        <SimpleCardRenderer
          imageUrl={uploadedImage}
          effects={cardData.effects || { holographic: 0, metallic: 0, chrome: 0 }}
        />
      </div>
    </div>
  );
};
