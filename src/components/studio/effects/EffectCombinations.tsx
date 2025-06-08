
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EffectCombination {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  effects: string[];
  icon: string;
  preview: string;
}

const EFFECT_COMBINATIONS: EffectCombination[] = [
  {
    id: 'tournament-pro',
    name: 'Tournament Pro',
    description: 'Professional tournament-grade effects used in competitive play',
    rarity: 'epic',
    effects: ['holographic', 'metallic'],
    icon: '🏆',
    preview: 'Subtle holo with metallic accents'
  },
  {
    id: 'legendary-rare',
    name: 'Legendary Rare',
    description: 'Ultra-rare combination reserved for the most valuable cards',
    rarity: 'legendary',
    effects: ['prismatic', 'crystal', 'foil'],
    icon: '👑',
    preview: 'Rainbow prism with crystal clarity and gold foil'
  },
  {
    id: 'vintage-collector',
    name: 'Vintage Collector',
    description: 'Timeless aesthetic that never goes out of style',
    rarity: 'rare',
    effects: ['vintage', 'metallic'],
    icon: '🎭',
    preview: 'Aged patina with subtle metallic highlights'
  },
  {
    id: 'cosmic-energy',
    name: 'Cosmic Energy',
    description: 'Out-of-this-world combination for special edition cards',
    rarity: 'epic',
    effects: ['holographic', 'prismatic'],
    icon: '🌌',
    preview: 'Shifting holo with rainbow undertones'
  },
  {
    id: 'crystal-vision',
    name: 'Crystal Vision',
    description: 'Pure, clear effects that showcase the artwork',
    rarity: 'rare',
    effects: ['crystal', 'holographic'],
    icon: '🔮',
    preview: 'Crystal clear with subtle holographic depth'
  },
  {
    id: 'golden-legend',
    name: 'Golden Legend',
    description: 'Luxurious gold finish for premium cards',
    rarity: 'legendary',
    effects: ['foil', 'metallic', 'crystal'],
    icon: '⭐',
    preview: 'Gold foil with metallic sheen and crystal clarity'
  }
];

const getRarityColor = (rarity: string) => {
  const colors = {
    common: 'bg-gray-500',
    rare: 'bg-blue-500',
    epic: 'bg-purple-500',
    legendary: 'bg-yellow-500'
  };
  return colors[rarity as keyof typeof colors] || 'bg-gray-500';
};

interface EffectCombinationsProps {
  onApplyCombination: (combination: EffectCombination) => void;
}

export const EffectCombinations: React.FC<EffectCombinationsProps> = ({ onApplyCombination }) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h4 className="text-white font-medium mb-2">Professional Combinations</h4>
        <p className="text-crd-lightGray text-sm">
          Expertly crafted effect combinations used by professional card designers
        </p>
      </div>

      <div className="grid gap-3">
        {EFFECT_COMBINATIONS.map((combo) => (
          <Card
            key={combo.id}
            className="p-4 bg-editor-tool border-editor-border hover:border-crd-green/50 transition-all cursor-pointer group"
            onClick={() => onApplyCombination(combo)}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{combo.icon}</div>
                  <div>
                    <h5 className="text-white font-medium">{combo.name}</h5>
                    <p className="text-crd-lightGray text-sm">{combo.description}</p>
                  </div>
                </div>
                <Badge className={`${getRarityColor(combo.rarity)} text-white`}>
                  {combo.rarity}
                </Badge>
              </div>

              <div className="text-xs text-crd-lightGray italic">
                "{combo.preview}"
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {combo.effects.map((effect, index) => (
                    <span 
                      key={index}
                      className="text-xs bg-editor-border px-2 py-1 rounded text-crd-lightGray"
                    >
                      {effect}
                    </span>
                  ))}
                </div>
                <Button
                  size="sm"
                  className="bg-crd-green hover:bg-crd-green/90 text-black opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Apply Combo
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-xs text-crd-lightGray p-3 bg-editor-darker rounded border border-editor-border">
        🎨 <strong>Designer Note:</strong> These combinations are based on real-world trading card effects. 
        Each rarity level represents the complexity and visual impact of the effect combination.
      </div>
    </div>
  );
};
