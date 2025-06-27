
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Filter, Star, Sparkles, Zap, Gem, Chrome, Grid } from 'lucide-react';
import { ENHANCED_FRAME_TEMPLATES, EnhancedFrameTemplate } from './EnhancedFrameTemplates';
import { FramePreviewRenderer } from './FramePreviewRenderer';
import './FrameEffects.css';

interface EnhancedFrameSelectorProps {
  selectedFrame?: string;
  onFrameSelect: (frameId: string) => void;
  onComplete?: () => void;
}

const CATEGORIES = [
  { id: 'all', name: 'All Frames', icon: Grid, count: ENHANCED_FRAME_TEMPLATES.length },
  { id: 'Modern', name: 'Modern', icon: Grid, count: ENHANCED_FRAME_TEMPLATES.filter(f => f.category === 'Modern').length },
  { id: 'Classic Sports', name: 'Sports', icon: Star, count: ENHANCED_FRAME_TEMPLATES.filter(f => f.category === 'Classic Sports').length },
  { id: 'Vintage Ornate', name: 'Vintage', icon: Gem, count: ENHANCED_FRAME_TEMPLATES.filter(f => f.category === 'Vintage Ornate').length },
  { id: 'Holographic', name: 'Holographic', icon: Sparkles, count: ENHANCED_FRAME_TEMPLATES.filter(f => f.category === 'Holographic').length },
  { id: 'Chrome', name: 'Chrome', icon: Chrome, count: ENHANCED_FRAME_TEMPLATES.filter(f => f.category === 'Chrome').length },
  { id: 'Crystal', name: 'Crystal', icon: Zap, count: ENHANCED_FRAME_TEMPLATES.filter(f => f.category === 'Crystal').length }
];

const RARITY_COLORS = {
  Common: 'bg-gray-500',
  Rare: 'bg-blue-500',
  Epic: 'bg-purple-500',
  Legendary: 'bg-yellow-500'
};

export const EnhancedFrameSelector: React.FC<EnhancedFrameSelectorProps> = ({
  selectedFrame,
  onFrameSelect,
  onComplete
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');

  const filteredFrames = ENHANCED_FRAME_TEMPLATES.filter(frame => {
    const matchesSearch = frame.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         frame.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || frame.category === selectedCategory;
    const matchesRarity = selectedRarity === 'all' || frame.rarity === selectedRarity;
    return matchesSearch && matchesCategory && matchesRarity;
  });

  const handleFrameSelect = (frame: EnhancedFrameTemplate) => {
    onFrameSelect(frame.id);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Choose Your Frame</h3>
          <p className="text-gray-400">Select a professional template with stunning visual effects</p>
        </div>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search frame templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-black/40 border-white/20 text-white placeholder:text-gray-400"
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(category => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={`text-xs ${
                selectedCategory === category.id 
                  ? 'bg-crd-green text-black hover:bg-crd-green/90' 
                  : 'border-white/20 text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-3 h-3 mr-1" />
              {category.name}
              <Badge variant="secondary" className="ml-2 text-xs bg-white/20">
                {category.count}
              </Badge>
            </Button>
          );
        })}
      </div>

      {/* Rarity Filter */}
      <div className="flex gap-2">
        <span className="text-sm text-gray-400 self-center mr-2">Rarity:</span>
        {['all', 'Common', 'Rare', 'Epic', 'Legendary'].map(rarity => (
          <Button
            key={rarity}
            variant={selectedRarity === rarity ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedRarity(rarity)}
            className={`text-xs ${
              selectedRarity === rarity 
                ? 'bg-crd-green text-black' 
                : 'border-white/20 text-white hover:bg-white/10'
            }`}
          >
            {rarity === 'all' ? 'All' : rarity}
          </Button>
        ))}
      </div>

      {/* Frame Grid */}
      <ScrollArea className="h-96">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFrames.map(frame => {
            const isSelected = selectedFrame === frame.id;
            
            return (
              <Card
                key={frame.id}
                className={`cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'ring-2 ring-crd-green bg-crd-green/10 scale-105' 
                    : 'bg-black/30 border-white/20 hover:border-crd-green/50 hover:bg-black/40'
                }`}
                onClick={() => handleFrameSelect(frame)}
              >
                <CardContent className="p-4">
                  {/* Frame Preview */}
                  <div className="mb-4 flex justify-center">
                    <FramePreviewRenderer
                      template={frame}
                      width={160}
                      height={224}
                      showContent={true}
                    />
                  </div>

                  {/* Frame Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-white text-sm">{frame.name}</h4>
                      {isSelected && (
                        <div className="w-5 h-5 bg-crd-green rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-black rounded-full"></div>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-400 leading-relaxed">{frame.description}</p>
                    
                    {/* Badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge 
                        variant="outline" 
                        className="text-xs border-white/20 text-gray-300"
                      >
                        {frame.category}
                      </Badge>
                      <Badge 
                        className={`text-xs text-white ${RARITY_COLORS[frame.rarity]}`}
                      >
                        {frame.rarity}
                      </Badge>
                      
                      {/* Effect Badges */}
                      {frame.effects.holographic && (
                        <Badge className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30">
                          <Sparkles className="w-2 h-2 mr-1" />
                          Holo
                        </Badge>
                      )}
                      {frame.effects.metallic && (
                        <Badge className="text-xs bg-gray-500/20 text-gray-300 border-gray-500/30">
                          <Chrome className="w-2 h-2 mr-1" />
                          Metal
                        </Badge>
                      )}
                      {frame.effects.crystal && (
                        <Badge className="text-xs bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                          <Gem className="w-2 h-2 mr-1" />
                          Crystal
                        </Badge>
                      )}
                      {frame.effects.animated && (
                        <Badge className="text-xs bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                          <Zap className="w-2 h-2 mr-1" />
                          Animated
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>

      {/* No Results */}
      {filteredFrames.length === 0 && (
        <div className="text-center py-12">
          <Grid className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-400 mb-2">No frames found</h4>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Continue Button */}
      {selectedFrame && onComplete && (
        <div className="pt-6 border-t border-white/10">
          <Button 
            onClick={onComplete}
            className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-semibold py-3"
          >
            Continue with Selected Frame
          </Button>
        </div>
      )}
    </div>
  );
};
