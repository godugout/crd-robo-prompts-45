
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Grid, Star } from 'lucide-react';
import { toast } from 'sonner';

interface FrameOption {
  id: string;
  name: string;
  description: string;
  category: 'minimal' | 'classic' | 'modern' | 'fun';
  borderStyle: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

const STUDIO_FRAMES: FrameOption[] = [
  {
    id: 'clean-white',
    name: 'Clean White',
    description: 'Pure and simple',
    category: 'minimal',
    borderStyle: 'border-2 border-gray-200',
    backgroundColor: 'bg-white',
    textColor: 'text-gray-900',
    accentColor: 'bg-gray-100'
  },
  {
    id: 'soft-shadow',
    name: 'Soft Shadow',
    description: 'Subtle depth',
    category: 'minimal',
    borderStyle: 'shadow-lg border border-gray-100',
    backgroundColor: 'bg-white',
    textColor: 'text-gray-800',
    accentColor: 'bg-gray-50'
  },
  {
    id: 'simple-black',
    name: 'Simple Black',
    description: 'Bold and clean',
    category: 'classic',
    borderStyle: 'border-2 border-black',
    backgroundColor: 'bg-black',
    textColor: 'text-white',
    accentColor: 'bg-gray-900'
  },
  {
    id: 'rounded-modern',
    name: 'Rounded Modern',
    description: 'Friendly curves',
    category: 'modern',
    borderStyle: 'border-2 border-blue-200 rounded-xl',
    backgroundColor: 'bg-blue-50',
    textColor: 'text-blue-900',
    accentColor: 'bg-blue-100'
  },
  {
    id: 'neon-edge',
    name: 'Neon Edge',
    description: 'Vibrant accent',
    category: 'fun',
    borderStyle: 'border-2 border-cyan-400 shadow-lg shadow-cyan-400/20',
    backgroundColor: 'bg-gray-900',
    textColor: 'text-white',
    accentColor: 'bg-cyan-400/10'
  },
  {
    id: 'warm-cream',
    name: 'Warm Cream',
    description: 'Cozy and inviting',
    category: 'minimal',
    borderStyle: 'border-2 border-orange-200',
    backgroundColor: 'bg-orange-50',
    textColor: 'text-orange-900',
    accentColor: 'bg-orange-100'
  }
];

const CATEGORIES = [
  { id: 'all', name: 'All Frames', count: STUDIO_FRAMES.length },
  { id: 'minimal', name: 'Minimal', count: STUDIO_FRAMES.filter(f => f.category === 'minimal').length },
  { id: 'classic', name: 'Classic', count: STUDIO_FRAMES.filter(f => f.category === 'classic').length },
  { id: 'modern', name: 'Modern', count: STUDIO_FRAMES.filter(f => f.category === 'modern').length },
  { id: 'fun', name: 'Fun', count: STUDIO_FRAMES.filter(f => f.category === 'fun').length }
];

interface FramesPanelProps {
  selectedFrame?: string;
  onFrameSelect: (frameId: string) => void;
}

export const FramesPanel: React.FC<FramesPanelProps> = ({
  selectedFrame,
  onFrameSelect
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredFrames = STUDIO_FRAMES.filter(frame => {
    const matchesSearch = frame.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         frame.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || frame.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFrameSelect = (frameId: string, frameName: string) => {
    onFrameSelect(frameId);
    toast.success(`Applied ${frameName} frame`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Card Frames</h3>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
          <Star className="w-4 h-4" />
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
            <Badge variant="secondary" className="ml-1 text-xs bg-white/20">
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Frame Grid */}
      <ScrollArea className="h-96">
        <div className="grid grid-cols-2 gap-3">
          {filteredFrames.map(frame => (
            <div
              key={frame.id}
              className={`relative cursor-pointer group rounded-lg border-2 transition-all duration-200 ${
                selectedFrame === frame.id
                  ? 'border-cyan-400 bg-cyan-400/10' 
                  : 'border-white/20 hover:border-white/40 hover:bg-white/5'
              }`}
              onClick={() => handleFrameSelect(frame.id, frame.name)}
            >
              <div className="aspect-[3/4] p-3 flex flex-col justify-between">
                {/* Frame Preview */}
                <div 
                  className={`flex-1 rounded ${frame.borderStyle} ${frame.backgroundColor} flex items-center justify-center mb-2`}
                >
                  <div className={`w-8 h-6 ${frame.accentColor} rounded opacity-60`}></div>
                </div>
                
                {/* Frame Info */}
                <div className="text-center">
                  <p className="text-white text-xs font-medium truncate">{frame.name}</p>
                  <p className="text-gray-400 text-xs truncate">{frame.description}</p>
                  <Badge 
                    variant="outline" 
                    className="mt-1 text-xs border-white/20 text-gray-300"
                  >
                    {frame.category}
                  </Badge>
                </div>

                {selectedFrame === frame.id && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-cyan-400 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
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
    </div>
  );
};
