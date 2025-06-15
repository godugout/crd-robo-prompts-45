
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Star, Grid, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { EXTRACTED_FRAMES } from '../frames/ExtractedFrameConfigs';

interface EnhancedFrameSelectorProps {
  onFrameSelect: (frameId: string) => void;
  selectedFrame?: string;
}

const FRAME_CATEGORIES = [
  { id: 'all', name: 'All Frames', count: 12 },
  { id: 'sports', name: 'Sports Cards', count: 6 },
  { id: 'vintage', name: 'Vintage Style', count: 3 },
  { id: 'modern', name: 'Modern Edge', count: 2 },
  { id: 'holographic', name: 'Holographic', count: 1 }
];

const ENHANCED_FRAMES = [
  {
    id: 'classic-sports',
    name: 'Classic Sports',
    category: 'sports',
    premium: false,
    preview: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)',
    description: 'Traditional sports card design with bold borders'
  },
  {
    id: 'holographic-modern',
    name: 'Holographic Pro',
    category: 'holographic',
    premium: true,
    preview: 'linear-gradient(45deg, #ff006e, #8338ec, #3a86ff)',
    description: 'Shimmering holographic effect with modern styling'
  },
  {
    id: 'vintage-ornate',
    name: 'Vintage Gold',
    category: 'vintage',
    premium: false,
    preview: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
    description: 'Ornate vintage design with gold accents'
  },
  {
    id: 'chrome-edition',
    name: 'Chrome Elite',
    category: 'modern',
    premium: true,
    preview: 'linear-gradient(135deg, #6b7280 0%, #9ca3af 50%, #d1d5db 100%)',
    description: 'Sleek chrome finish with metallic effects'
  },
  {
    id: 'neon-cyber',
    name: 'Neon Cyber',
    category: 'modern',
    premium: true,
    preview: 'linear-gradient(135deg, #10b981 0%, #06d6a0 50%, #00f5ff 100%)',
    description: 'Futuristic neon glow with cyber aesthetics'
  },
  {
    id: 'royal-purple',
    name: 'Royal Edition',
    category: 'vintage',
    premium: false,
    preview: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
    description: 'Elegant royal purple with regal styling'
  }
];

export const EnhancedFrameSelector: React.FC<EnhancedFrameSelectorProps> = ({
  onFrameSelect,
  selectedFrame
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFavorites, setShowFavorites] = useState(false);

  const filteredFrames = ENHANCED_FRAMES.filter(frame => {
    const matchesSearch = frame.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         frame.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || frame.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFrameClick = (frameId: string, frameName: string) => {
    onFrameSelect(frameId);
    toast.success(`Applied ${frameName} frame`);
  };

  return (
    <div className="h-64 bg-editor-dark border-t border-editor-border">
      <div className="p-4 border-b border-editor-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">Card Frames</h3>
          <div className="flex gap-2">
            <Button
              variant={showFavorites ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFavorites(!showFavorites)}
              className="text-xs"
            >
              <Star className="w-3 h-3 mr-1" />
              Favorites
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <Filter className="w-3 h-3 mr-1" />
              Filter
            </Button>
          </div>
        </div>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search frames..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-editor-tool border-editor-border text-white"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {FRAME_CATEGORIES.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={`text-xs whitespace-nowrap ${
                selectedCategory === category.id 
                  ? 'bg-crd-green text-black' 
                  : 'border-editor-border text-white hover:bg-editor-border'
              }`}
            >
              {category.name}
              <Badge variant="secondary" className="ml-1 text-xs">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      <div className="p-4 overflow-y-auto">
        <div className="grid grid-cols-6 gap-3">
          {filteredFrames.map(frame => (
            <div
              key={frame.id}
              className={`relative cursor-pointer group ${
                selectedFrame === frame.id ? 'ring-2 ring-crd-green' : ''
              }`}
              onClick={() => handleFrameClick(frame.id, frame.name)}
            >
              <div 
                className="aspect-[3/4] rounded-lg border-2 border-editor-border group-hover:border-crd-green transition-colors"
                style={{ background: frame.preview }}
              >
                <div className="absolute inset-2 bg-black/20 rounded flex items-center justify-center">
                  <div className="text-white text-xs font-bold text-center">
                    <div className="w-8 h-6 bg-white/30 rounded mb-1"></div>
                    <div className="w-12 h-1 bg-white/50 rounded"></div>
                  </div>
                </div>
                
                {frame.premium && (
                  <div className="absolute top-1 right-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  </div>
                )}
              </div>
              
              <div className="mt-1 text-center">
                <p className="text-white text-xs font-medium truncate">{frame.name}</p>
                <p className="text-crd-lightGray text-xs truncate">{frame.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
