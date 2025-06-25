
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Grid, Star, Filter } from 'lucide-react';
import { ENHANCED_FRAMES, getFramesByCategory, EnhancedFrameData } from '../data/enhancedFrames';

interface FrameSelectionStepProps {
  selectedFrame?: string;
  onFrameSelect: (frameId: string) => void;
  onComplete: () => void;
}

const CATEGORIES = [
  { id: 'all', name: 'All Frames', count: ENHANCED_FRAMES.length },
  { id: 'sports', name: 'Sports', count: ENHANCED_FRAMES.filter(f => f.category === 'sports').length },
  { id: 'modern', name: 'Modern', count: ENHANCED_FRAMES.filter(f => f.category === 'modern').length },
  { id: 'vintage', name: 'Vintage', count: ENHANCED_FRAMES.filter(f => f.category === 'vintage').length },
  { id: 'fantasy', name: 'Fantasy', count: ENHANCED_FRAMES.filter(f => f.category === 'fantasy').length },
  { id: 'minimal', name: 'Minimal', count: ENHANCED_FRAMES.filter(f => f.category === 'minimal').length }
];

export const FrameSelectionStep: React.FC<FrameSelectionStepProps> = ({
  selectedFrame,
  onFrameSelect,
  onComplete
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredFrames = getFramesByCategory(selectedCategory).filter(frame =>
    frame.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    frame.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFrameSelect = (frame: EnhancedFrameData) => {
    onFrameSelect(frame.id);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Choose Your Frame</h3>
          <p className="text-gray-400 text-sm">Select a professional card template to get started</p>
        </div>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search frames..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-black/40 border-white/20 text-white placeholder:text-gray-400"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(category => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className={`text-xs ${
              selectedCategory === category.id 
                ? 'bg-cyan-500 text-black hover:bg-cyan-400' 
                : 'border-white/20 text-white hover:bg-white/10'
            }`}
          >
            {category.name}
            <Badge variant="secondary" className="ml-2 text-xs bg-white/20">
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Frame Grid */}
      <ScrollArea className="h-96">
        <div className="grid grid-cols-2 gap-4">
          {filteredFrames.map(frame => (
            <div
              key={frame.id}
              className={`relative cursor-pointer group rounded-lg border-2 transition-all duration-200 ${
                selectedFrame === frame.id
                  ? 'border-cyan-400 bg-cyan-400/10 scale-105' 
                  : 'border-white/20 hover:border-white/40 hover:bg-white/5'
              }`}
              onClick={() => handleFrameSelect(frame)}
            >
              <div className="aspect-[3/4] p-4 flex flex-col justify-between">
                {/* Frame Preview */}
                <div 
                  className="flex-1 rounded-lg border-2 flex items-center justify-center mb-3 relative overflow-hidden"
                  style={{ 
                    borderColor: frame.template_data.colors.primary,
                    backgroundColor: frame.template_data.colors.background 
                  }}
                >
                  {/* Preview zones */}
                  <div className="w-full h-full relative">
                    <div 
                      className="absolute bg-gray-300 rounded opacity-60"
                      style={{
                        left: `${(frame.template_data.zones.image.x / 300) * 100}%`,
                        top: `${(frame.template_data.zones.image.y / 420) * 100}%`,
                        width: `${(frame.template_data.zones.image.width / 300) * 100}%`,
                        height: `${(frame.template_data.zones.image.height / 420) * 100}%`
                      }}
                    />
                    <div 
                      className="absolute text-xs font-bold flex items-center justify-center"
                      style={{
                        left: `${(frame.template_data.zones.title.x / 300) * 100}%`,
                        top: `${(frame.template_data.zones.title.y / 420) * 100}%`,
                        width: `${(frame.template_data.zones.title.width / 300) * 100}%`,
                        height: `${(frame.template_data.zones.title.height / 420) * 100}%`,
                        backgroundColor: frame.template_data.colors.primary,
                        color: frame.template_data.colors.text
                      }}
                    >
                      TITLE
                    </div>
                  </div>
                  
                  {/* Effects indicators */}
                  {frame.template_data.effects.holographic && (
                    <div className="absolute top-1 right-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                    </div>
                  )}
                </div>
                
                {/* Frame Info */}
                <div className="text-center">
                  <p className="text-white text-sm font-medium truncate">{frame.name}</p>
                  <p className="text-gray-400 text-xs truncate">{frame.description}</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Badge 
                      variant="outline" 
                      className="text-xs border-white/20 text-gray-300"
                    >
                      {frame.category}
                    </Badge>
                    {frame.template_data.effects.holographic && (
                      <Badge className="text-xs bg-yellow-500 text-black">
                        Premium
                      </Badge>
                    )}
                  </div>
                </div>

                {selectedFrame === frame.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-black rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {filteredFrames.length === 0 && (
        <div className="text-center py-8">
          <Grid className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-sm">No frames found</p>
          <p className="text-gray-500 text-xs">Try adjusting your search or category filter</p>
        </div>
      )}

      {/* Continue Button */}
      {selectedFrame && (
        <div className="pt-4 border-t border-white/10">
          <Button 
            onClick={onComplete}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-medium"
          >
            Continue to Elements
          </Button>
        </div>
      )}
    </div>
  );
};
