
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Star, Sparkles, Crown, Diamond } from 'lucide-react';

const ENHANCED_FRAMES = [
  {
    id: 'holographic-premium',
    name: 'Holographic Premium',
    category: 'Modern',
    rarity: 'Legendary',
    effects: ['holographic', 'shimmer', 'rainbow'],
    preview: 'linear-gradient(45deg, #ff006e, #8338ec, #3a86ff)',
    description: 'Prismatic holographic effect with animated rainbow shifts'
  },
  {
    id: 'chrome-refractor',
    name: 'Chrome Refractor',
    category: 'Modern',
    rarity: 'Epic',
    effects: ['chrome', 'metallic', 'reflection'],
    preview: 'linear-gradient(135deg, #6b7280, #9ca3af, #d1d5db)',
    description: 'Mirror-finish chrome with sharp light reflections'
  },
  {
    id: 'gold-foil-classic',
    name: 'Gold Foil Classic',
    category: 'Vintage',
    rarity: 'Rare',
    effects: ['foil', 'metallic', 'sparkle'],
    preview: 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)',
    description: 'Traditional gold foil with vintage appeal'
  },
  {
    id: 'crystal-prism',
    name: 'Crystal Prism',
    category: 'Premium',
    rarity: 'Legendary',
    effects: ['crystal', 'prism', 'dispersion'],
    preview: 'linear-gradient(60deg, #06d6a0, #00f5ff, #8b5cf6)',
    description: 'Crystal facet effects with light dispersion'
  },
  {
    id: 'sports-classic-blue',
    name: 'Sports Classic',
    category: 'Sports',
    rarity: 'Common',
    effects: ['border', 'shadow'],
    preview: 'linear-gradient(135deg, #1e3a8a, #3b82f6, #60a5fa)',
    description: 'Traditional sports card with professional borders'
  },
  {
    id: 'neon-cyberpunk',
    name: 'Neon Cyberpunk',
    category: 'Modern',
    rarity: 'Epic',
    effects: ['neon', 'glow', 'pulse'],
    preview: 'linear-gradient(135deg, #10b981, #06d6a0, #00f5ff)',
    description: 'Futuristic neon glow with pulsing animations'
  },
  {
    id: 'vintage-tobacco',
    name: 'Vintage Tobacco',
    category: 'Vintage',
    rarity: 'Rare',
    effects: ['aged', 'sepia', 'texture'],
    preview: 'linear-gradient(135deg, #92400e, #d97706, #f59e0b)',
    description: 'Classic tobacco card aesthetic with aged textures'
  },
  {
    id: 'minimal-modern',
    name: 'Minimal Modern',
    category: 'Modern',
    rarity: 'Common',
    effects: ['clean', 'shadow'],
    preview: 'linear-gradient(135deg, #f8fafc, #e2e8f0, #cbd5e1)',
    description: 'Clean modern design with subtle shadows'
  }
];

const CATEGORIES = ['All', 'Modern', 'Vintage', 'Sports', 'Premium'];

interface FrameGalleryPhaseProps {
  selectedFrame: any;
  onFrameSelect: (frame: any) => void;
}

export const FrameGalleryPhase: React.FC<FrameGalleryPhaseProps> = ({
  selectedFrame,
  onFrameSelect
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFrames = ENHANCED_FRAMES.filter(frame => {
    const matchesSearch = frame.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         frame.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || frame.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return <Crown className="w-4 h-4 text-yellow-400" />;
      case 'Epic': return <Diamond className="w-4 h-4 text-purple-400" />;
      case 'Rare': return <Star className="w-4 h-4 text-blue-400" />;
      default: return <Sparkles className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'Epic': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'Rare': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold theme-text-primary mb-2">Choose Your Frame</h2>
        <p className="theme-text-muted">Start with a professional frame that defines your card's style and effects</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search frames..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {CATEGORIES.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-crd-green text-black" : ""}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Frame Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredFrames.map(frame => (
          <Card
            key={frame.id}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedFrame?.id === frame.id
                ? 'border-crd-green bg-crd-green/10 shadow-lg shadow-crd-green/20'
                : 'theme-border hover:border-crd-green/50'
            }`}
            onClick={() => onFrameSelect(frame)}
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Frame Preview */}
                <div className="relative">
                  <div 
                    className="aspect-[5/7] rounded-lg border-2 border-white/20"
                    style={{ background: frame.preview }}
                  >
                    <div className="absolute inset-4 bg-black/20 rounded flex items-center justify-center">
                      <div className="text-white text-xs font-bold text-center space-y-1">
                        <div className="w-12 h-8 bg-white/30 rounded mx-auto mb-2"></div>
                        <div className="w-16 h-1 bg-white/50 rounded mx-auto"></div>
                        <div className="w-10 h-1 bg-white/40 rounded mx-auto"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Rarity Badge */}
                  <div className="absolute top-2 right-2">
                    <Badge className={`text-xs ${getRarityColor(frame.rarity)}`}>
                      {getRarityIcon(frame.rarity)}
                      {frame.rarity}
                    </Badge>
                  </div>
                </div>

                {/* Frame Info */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium theme-text-primary text-sm">{frame.name}</h4>
                    {selectedFrame?.id === frame.id && (
                      <div className="w-5 h-5 bg-crd-green rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-black rounded-full"></div>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs theme-text-muted mb-2 line-clamp-2">
                    {frame.description}
                  </p>
                  
                  {/* Effects Tags */}
                  <div className="flex flex-wrap gap-1">
                    {frame.effects.slice(0, 3).map(effect => (
                      <Badge key={effect} variant="secondary" className="text-xs">
                        {effect}
                      </Badge>
                    ))}
                    {frame.effects.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{frame.effects.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedFrame && (
        <Card className="theme-bg-accent border-crd-green/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium theme-text-primary">Selected: {selectedFrame.name}</h4>
                <p className="text-sm theme-text-muted">Ready to add your image</p>
              </div>
              <Badge className={getRarityColor(selectedFrame.rarity)}>
                {getRarityIcon(selectedFrame.rarity)}
                {selectedFrame.rarity}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
