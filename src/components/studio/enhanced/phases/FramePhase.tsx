
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, Crown, Star } from 'lucide-react';
import { ENHANCED_FRAMES, getFramesByCategory, type EnhancedFrameData } from '../data/enhancedFrames';

interface FramePhaseProps {
  selectedFrame?: string;
  frameData?: EnhancedFrameData;
  onFrameSelect: (frameId: string) => void;
  onComplete: () => void;
}

const FRAME_CATEGORIES = [
  { id: 'all', name: 'All Frames', icon: Sparkles },
  { id: 'sports', name: 'Sports', icon: Star },
  { id: 'trading', name: 'Trading', icon: Crown },
  { id: 'modern', name: 'Modern', icon: Sparkles },
  { id: 'vintage', name: 'Vintage', icon: Star },
  { id: 'fantasy', name: 'Fantasy', icon: Crown },
  { id: 'minimal', name: 'Minimal', icon: Sparkles }
];

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'text-gray-400';
    case 'uncommon': return 'text-green-400';
    case 'rare': return 'text-blue-400';
    case 'epic': return 'text-purple-400';
    case 'legendary': return 'text-yellow-400';
    default: return 'text-gray-400';
  }
};

const getEffectBadges = (effects: any) => {
  const badges = [];
  if (effects.holographic) badges.push('Holographic');
  if (effects.foil) badges.push('Foil');
  if (effects.metallic) badges.push('Metallic');
  if (effects.gradient) badges.push('Gradient');
  return badges;
};

export const FramePhase: React.FC<FramePhaseProps> = ({
  selectedFrame,
  frameData,
  onFrameSelect,
  onComplete
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const frames = getFramesByCategory(selectedCategory);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-2">Choose Your Frame</h3>
        <p className="text-gray-400 text-sm">
          Select a frame template that defines your card's layout and style.
        </p>
      </div>

      {/* Category Filters */}
      <div className="space-y-3">
        <label className="text-white text-sm font-medium">Frame Categories</label>
        <div className="grid grid-cols-3 gap-2">
          {FRAME_CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`h-auto p-3 flex flex-col ${
                  selectedCategory === category.id 
                    ? 'bg-crd-green text-black' 
                    : 'border-white/20 text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4 mb-1" />
                <span className="text-xs font-medium">{category.name}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Frame Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-white text-sm font-medium">
            Available Frames ({frames.length})
          </label>
          {selectedFrame && (
            <Badge className="bg-crd-green/20 text-crd-green border-crd-green/30">
              <Check className="w-3 h-3 mr-1" />
              Selected
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto">
          {frames.map((frame) => (
            <Card
              key={frame.id}
              className={`p-4 cursor-pointer transition-all ${
                selectedFrame === frame.id
                  ? 'bg-crd-green/10 border-crd-green'
                  : 'bg-black/30 border-white/10 hover:border-crd-green/50'
              }`}
              onClick={() => onFrameSelect(frame.id)}
            >
              <div className="flex items-start space-x-4">
                {/* Frame Preview */}
                <div className={`w-16 h-20 rounded-lg flex-shrink-0 border-2 relative`}
                     style={{
                       backgroundColor: frame.template_data.colors.background,
                       borderColor: frame.template_data.borders.outer.color
                     }}>
                  {/* Mini frame visualization */}
                  <div className="absolute inset-2 rounded"
                       style={{
                         backgroundColor: frame.template_data.colors.primary,
                         opacity: 0.3
                       }}>
                  </div>
                  <div className="absolute inset-1 border rounded"
                       style={{
                         borderColor: frame.template_data.colors.accent
                       }}>
                  </div>
                  
                  {selectedFrame === frame.id && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-crd-green rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-black" />
                    </div>
                  )}
                </div>

                {/* Frame Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-white font-medium truncate">{frame.name}</h4>
                    <Badge variant="outline" className="border-white/20 text-white text-xs">
                      {frame.category}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                    {frame.description}
                  </p>
                  
                  {/* Supported Rarities */}
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-gray-500 text-xs">Rarities:</span>
                    {frame.rarity_support.slice(0, 3).map((rarity) => (
                      <span key={rarity} className={`text-xs ${getRarityColor(rarity)}`}>
                        {rarity}
                      </span>
                    ))}
                    {frame.rarity_support.length > 3 && (
                      <span className="text-gray-500 text-xs">+{frame.rarity_support.length - 3}</span>
                    )}
                  </div>
                  
                  {/* Effect Badges */}
                  <div className="flex flex-wrap gap-1">
                    {getEffectBadges(frame.template_data.effects).map((effect) => (
                      <Badge 
                        key={effect}
                        className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs"
                      >
                        {effect}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Selected Frame Details */}
      {frameData && (
        <Card className="bg-black/20 border-white/10 p-4">
          <h4 className="text-white font-medium mb-3">Frame Details</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Layout:</span>
              <p className="text-white capitalize">{frameData.template_data.layout}</p>
            </div>
            <div>
              <span className="text-gray-400">Primary Color:</span>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded border border-white/20"
                  style={{ backgroundColor: frameData.template_data.colors.primary }}
                />
                <span className="text-white font-mono text-xs">
                  {frameData.template_data.colors.primary}
                </span>
              </div>
            </div>
            <div>
              <span className="text-gray-400">Border Style:</span>
              <p className="text-white capitalize">{frameData.template_data.borders.outer.style}</p>
            </div>
            <div>
              <span className="text-gray-400">Effects:</span>
              <p className="text-white">{getEffectBadges(frameData.template_data.effects).length} active</p>
            </div>
          </div>
        </Card>
      )}

      {/* Continue Button */}
      {selectedFrame && (
        <div className="pt-4 border-t border-white/10">
          <Button 
            onClick={onComplete}
            className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-medium"
          >
            Continue to Effects
          </Button>
        </div>
      )}
    </div>
  );
};
