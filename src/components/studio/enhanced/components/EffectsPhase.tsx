
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Sparkles, Zap, Star, Chrome } from 'lucide-react';

interface EffectsPhaseProps {
  selectedFrame?: string;
  onEffectChange: (effectId: string, value: number) => void;
}

const EFFECT_CATEGORIES = [
  {
    id: 'holographic',
    name: 'Holographic',
    icon: Sparkles,
    color: 'bg-gradient-to-r from-pink-500 to-purple-500',
    description: 'Rainbow shifting prismatic effect'
  },
  {
    id: 'metallic',
    name: 'Metallic',
    icon: Chrome,
    color: 'bg-gradient-to-r from-gray-400 to-gray-600',
    description: 'Chrome and metallic finishes'
  },
  {
    id: 'premium',
    name: 'Premium',
    icon: Star,
    color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    description: 'Gold and luxury treatments'
  },
  {
    id: 'energy',
    name: 'Energy',
    icon: Zap,
    color: 'bg-gradient-to-r from-blue-400 to-cyan-500',
    description: 'Glowing and electric effects'
  }
];

export const EffectsPhase: React.FC<EffectsPhaseProps> = ({
  selectedFrame,
  onEffectChange
}) => {
  const [selectedCategory, setSelectedCategory] = useState('holographic');
  const [effectValues, setEffectValues] = useState<Record<string, number>>({});

  const handleEffectChange = (effectId: string, value: number[]) => {
    const newValue = value[0];
    setEffectValues(prev => ({ ...prev, [effectId]: newValue }));
    onEffectChange(effectId, newValue);
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-300 mb-4">
        Apply visual effects and materials to enhance your card.
      </div>

      {/* Effect Categories */}
      <div className="grid grid-cols-2 gap-3">
        {EFFECT_CATEGORIES.map((category) => (
          <Card
            key={category.id}
            className={`cursor-pointer transition-all duration-300 ${
              selectedCategory === category.id 
                ? 'ring-2 ring-crd-green border-crd-green bg-black/40' 
                : 'bg-black/20 border-white/10 hover:border-white/20'
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center`}>
                  <category.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm">{category.name}</h3>
                  <p className="text-gray-400 text-xs">{category.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Effect Controls */}
      <Card className="bg-black/20 border-white/10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">
              {EFFECT_CATEGORIES.find(c => c.id === selectedCategory)?.name} Effects
            </h3>
            <Badge variant="outline" className="border-crd-green/50 text-crd-green">
              Active
            </Badge>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-300">Intensity</label>
                <span className="text-xs text-crd-green">
                  {effectValues[`${selectedCategory}_intensity`] || 0}%
                </span>
              </div>
              <Slider
                value={[effectValues[`${selectedCategory}_intensity`] || 0]}
                onValueChange={(value) => handleEffectChange(`${selectedCategory}_intensity`, value)}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-300">Coverage</label>
                <span className="text-xs text-crd-green">
                  {effectValues[`${selectedCategory}_coverage`] || 50}%
                </span>
              </div>
              <Slider
                value={[effectValues[`${selectedCategory}_coverage`] || 50]}
                onValueChange={(value) => handleEffectChange(`${selectedCategory}_coverage`, value)}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {selectedCategory === 'holographic' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-300">Rainbow Shift</label>
                  <span className="text-xs text-crd-green">
                    {effectValues[`${selectedCategory}_shift`] || 30}%
                  </span>
                </div>
                <Slider
                  value={[effectValues[`${selectedCategory}_shift`] || 30]}
                  onValueChange={(value) => handleEffectChange(`${selectedCategory}_shift`, value)}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-crd-green/50 text-crd-green hover:bg-crd-green/10"
            >
              Apply Preset Effect
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
