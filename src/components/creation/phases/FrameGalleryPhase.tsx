
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Sparkles, Crown, Zap } from 'lucide-react';

const FRAME_CATEGORIES = [
  {
    id: 'sports-classic',
    name: 'Sports Classic',
    category: 'Sports',
    rarity: 'common',
    effects: ['metallic'],
    preview: 'linear-gradient(135deg, #1f2937, #374151)',
    icon: Star,
    price: 'Free'
  },
  {
    id: 'holographic-premium',
    name: 'Holographic Premium',
    category: 'Premium',
    rarity: 'epic',
    effects: ['holographic', 'rainbow'],
    preview: 'linear-gradient(135deg, #ec4899, #8b5cf6, #06b6d4)',
    icon: Sparkles,
    price: '500 Credits'
  },
  {
    id: 'chrome-refractor',
    name: 'Chrome Refractor',
    category: 'Modern',
    rarity: 'rare',
    effects: ['chrome', 'reflection'],
    preview: 'linear-gradient(135deg, #6b7280, #9ca3af, #d1d5db)',
    icon: Zap,
    price: '250 Credits'
  },
  {
    id: 'gold-foil-deluxe',
    name: 'Gold Foil Deluxe',
    category: 'Luxury',
    rarity: 'legendary',
    effects: ['foil', 'shimmer'],
    preview: 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)',
    icon: Crown,
    price: '1000 Credits'
  }
];

interface FrameGalleryPhaseProps {
  selectedFrame: any;
  onFrameSelect: (frame: any) => void;
}

export const FrameGalleryPhase: React.FC<FrameGalleryPhaseProps> = ({
  selectedFrame,
  onFrameSelect
}) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="cardshow-hero-text mb-4">Choose Your Frame</h2>
        <p className="cardshow-body-text max-w-2xl mx-auto">
          Select the perfect foundation for your card. Each frame comes with unique effects and styling options.
        </p>
      </div>

      {/* Frame Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {FRAME_CATEGORIES.map(frame => (
          <Card
            key={frame.id}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-cardshow-hover ${
              selectedFrame?.id === frame.id
                ? 'ring-2 ring-cardshow-primary bg-cardshow-primary/10'
                : 'hover:ring-1 hover:ring-cardshow-primary/50'
            }`}
            onClick={() => onFrameSelect(frame)}
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Frame Preview */}
                <div className="relative">
                  <div 
                    className="aspect-[3/4] rounded-lg flex items-center justify-center"
                    style={{ background: frame.preview }}
                  >
                    <frame.icon className="w-12 h-12 text-white/80" />
                  </div>
                  
                  {selectedFrame?.id === frame.id && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-cardshow-primary rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>

                {/* Frame Info */}
                <div>
                  <h4 className="font-bold text-cardshow-light text-lg mb-2">
                    {frame.name}
                  </h4>
                  
                  <div className="flex items-center justify-between mb-3">
                    <Badge 
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        frame.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' :
                        frame.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400 border-purple-500/50' :
                        frame.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' :
                        'bg-gray-500/20 text-gray-400 border-gray-500/50'
                      }`}
                    >
                      {frame.rarity}
                    </Badge>
                    <span className="text-sm font-semibold text-cardshow-green">
                      {frame.price}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="cardshow-label-text">Effects Included:</div>
                    <div className="flex flex-wrap gap-1">
                      {frame.effects.map(effect => (
                        <Badge key={effect} variant="secondary" className="text-xs bg-cardshow-dark-100 text-cardshow-light-700">
                          {effect}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selection Summary */}
      {selectedFrame && (
        <Card className="bg-cardshow-primary/10 border-cardshow-primary/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-cardshow-light text-lg mb-1">
                  Selected: {selectedFrame.name}
                </h4>
                <p className="cardshow-body-text">
                  {selectedFrame.category} frame with {selectedFrame.effects.length} built-in effects
                </p>
              </div>
              <Badge className="bg-cardshow-primary/20 text-cardshow-primary border-cardshow-primary/50 px-4 py-2">
                Ready for Image Upload
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
