
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Crown, Star, Zap } from 'lucide-react';

interface FrameCategory {
  id: string;
  name: string;
  frames: FrameTemplate[];
}

interface FrameTemplate {
  id: string;
  name: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  effects: string[];
  preview: string;
  description: string;
}

interface ProfessionalFrameGalleryProps {
  selectedFrame: string;
  onFrameSelect: (frameId: string) => void;
}

const FRAME_CATEGORIES: FrameCategory[] = [
  {
    id: 'sports-classic',
    name: 'Sports Classic',
    frames: [
      { id: 'sports-1', name: 'Baseball Heritage', category: 'sports-classic', rarity: 'common', effects: [], preview: '🏟️', description: 'Classic baseball card style' },
      { id: 'sports-2', name: 'Basketball Elite', category: 'sports-classic', rarity: 'rare', effects: ['metallic'], preview: '🏀', description: 'Premium basketball design' }
    ]
  },
  {
    id: 'holographic-premium',
    name: 'Holographic Premium',
    frames: [
      { id: 'holo-1', name: 'Rainbow Prism', category: 'holographic-premium', rarity: 'epic', effects: ['holographic', 'rainbow'], preview: '🌈', description: 'Full rainbow holographic effect' },
      { id: 'holo-2', name: 'Crystal Matrix', category: 'holographic-premium', rarity: 'legendary', effects: ['holographic', 'crystal'], preview: '💎', description: 'Multi-faceted crystal hologram' }
    ]
  },
  {
    id: 'chrome-refractor',
    name: 'Chrome Refractor',
    frames: [
      { id: 'chrome-1', name: 'Silver Chrome', category: 'chrome-refractor', rarity: 'rare', effects: ['chrome', 'metallic'], preview: '🪩', description: 'Mirror-finish chrome surface' },
      { id: 'chrome-2', name: 'Black Chrome', category: 'chrome-refractor', rarity: 'epic', effects: ['chrome', 'black'], preview: '⚫', description: 'Premium black chrome finish' }
    ]
  },
  {
    id: 'gold-foil',
    name: 'Gold Foil',
    frames: [
      { id: 'gold-1', name: 'Golden Legacy', category: 'gold-foil', rarity: 'epic', effects: ['gold', 'foil'], preview: '🥇', description: 'Luxurious gold foil stamping' },
      { id: 'gold-2', name: 'Rose Gold Elite', category: 'gold-foil', rarity: 'legendary', effects: ['gold', 'rose'], preview: '🌹', description: 'Exclusive rose gold treatment' }
    ]
  },
  {
    id: 'vintage-tobacco',
    name: 'Vintage Tobacco',
    frames: [
      { id: 'vintage-1', name: '1952 Classic', category: 'vintage-tobacco', rarity: 'common', effects: ['vintage'], preview: '📜', description: 'Authentic tobacco card reproduction' },
      { id: 'vintage-2', name: 'Heritage Sepia', category: 'vintage-tobacco', rarity: 'rare', effects: ['vintage', 'sepia'], preview: '🎞️', description: 'Sepia-toned vintage style' }
    ]
  },
  {
    id: 'crystal-prism',
    name: 'Crystal Prism',
    frames: [
      { id: 'crystal-1', name: 'Diamond Cut', category: 'crystal-prism', rarity: 'epic', effects: ['crystal', 'prism'], preview: '💍', description: 'Multi-faceted crystal effect' },
      { id: 'crystal-2', name: 'Sapphire Matrix', category: 'crystal-prism', rarity: 'legendary', effects: ['crystal', 'sapphire'], preview: '💙', description: 'Blue sapphire crystal pattern' }
    ]
  },
  {
    id: 'minimal-modern',
    name: 'Minimal Modern',
    frames: [
      { id: 'minimal-1', name: 'Clean Lines', category: 'minimal-modern', rarity: 'common', effects: [], preview: '⬜', description: 'Simple, elegant modern design' },
      { id: 'minimal-2', name: 'Gradient Edge', category: 'minimal-modern', rarity: 'rare', effects: ['gradient'], preview: '🌈', description: 'Subtle gradient accents' }
    ]
  },
  {
    id: 'neon-cyberpunk',
    name: 'Neon Cyberpunk',
    frames: [
      { id: 'neon-1', name: 'Electric Blue', category: 'neon-cyberpunk', rarity: 'rare', effects: ['neon', 'blue'], preview: '⚡', description: 'Electric blue neon glow' },
      { id: 'neon-2', name: 'Pink Synthwave', category: 'neon-cyberpunk', rarity: 'epic', effects: ['neon', 'pink'], preview: '🌸', description: 'Retro synthwave aesthetic' }
    ]
  }
];

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'text-[#777E90] bg-[#777E90]/20';
    case 'rare': return 'text-[#27AE60] bg-[#27AE60]/20';
    case 'epic': return 'text-[#3772FF] bg-[#3772FF]/20';
    case 'legendary': return 'text-[#F97316] bg-[#F97316]/20';
    default: return 'text-[#777E90] bg-[#777E90]/20';
  }
};

const getRarityIcon = (rarity: string) => {
  switch (rarity) {
    case 'common': return Star;
    case 'rare': return Sparkles;
    case 'epic': return Zap;
    case 'legendary': return Crown;
    default: return Star;
  }
};

export const ProfessionalFrameGallery: React.FC<ProfessionalFrameGalleryProps> = ({
  selectedFrame,
  onFrameSelect
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFrames = selectedCategory === 'all' 
    ? FRAME_CATEGORIES.flatMap(cat => cat.frames)
    : FRAME_CATEGORIES.find(cat => cat.id === selectedCategory)?.frames || [];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-[#FCFCFD] tracking-tight">
          Choose Your Frame
        </h2>
        <p className="text-lg text-[#777E90] max-w-2xl mx-auto">
          Select from 8 professional categories with built-in effects and rarity indicators
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3">
        <Button
          onClick={() => setSelectedCategory('all')}
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          className={`text-sm font-semibold ${
            selectedCategory === 'all' 
              ? 'bg-[#3772FF] text-white' 
              : 'border-[#353945] text-[#777E90] hover:text-[#FCFCFD] hover:bg-[#353945]'
          }`}
        >
          All Categories
        </Button>
        {FRAME_CATEGORIES.map((category) => (
          <Button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            className={`text-sm font-semibold ${
              selectedCategory === category.id 
                ? 'bg-[#3772FF] text-white' 
                : 'border-[#353945] text-[#777E90] hover:text-[#FCFCFD] hover:bg-[#353945]'
            }`}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Frame Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredFrames.map((frame) => {
          const RarityIcon = getRarityIcon(frame.rarity);
          return (
            <Card
              key={frame.id}
              className={`p-6 cursor-pointer transition-all duration-300 border-2 ${
                selectedFrame === frame.id
                  ? 'border-[#3772FF] bg-[#3772FF]/10 shadow-lg shadow-[#3772FF]/20'
                  : 'border-[#353945] bg-[#23262F] hover:border-[#3772FF]/50 hover:bg-[#23262F]/80'
              }`}
              onClick={() => onFrameSelect(frame.id)}
            >
              {/* Preview */}
              <div className="aspect-[5/7] bg-gradient-to-br from-[#353945] to-[#23262F] rounded-lg mb-4 flex items-center justify-center text-4xl">
                {frame.preview}
              </div>

              {/* Frame Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-[#FCFCFD] text-sm">{frame.name}</h3>
                  {selectedFrame === frame.id && (
                    <div className="w-2 h-2 bg-[#3772FF] rounded-full"></div>
                  )}
                </div>

                <p className="text-xs text-[#777E90]">{frame.description}</p>

                {/* Rarity Badge */}
                <Badge className={`${getRarityColor(frame.rarity)} text-xs font-semibold capitalize`}>
                  <RarityIcon className="w-3 h-3 mr-1" />
                  {frame.rarity}
                </Badge>

                {/* Effects */}
                {frame.effects.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {frame.effects.map((effect) => (
                      <Badge key={effect} variant="secondary" className="text-xs bg-[#353945] text-[#B1B5C3]">
                        {effect}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
