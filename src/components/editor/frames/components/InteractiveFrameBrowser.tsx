
import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CompactFrameSelector } from './CompactFrameSelector';

interface Frame {
  id: string;
  name: string;
  category: string;
  premium: boolean;
  preview: string;
  description: string;
}

interface InteractiveFrameBrowserProps {
  frames: Frame[];
  selectedFrame: string;
  onFrameSelect: (frameId: string) => void;
  className?: string;
}

const MOCK_FRAMES: Frame[] = [
  {
    id: 'classic-sports',
    name: 'Classic Sports',
    category: 'sports',
    premium: false,
    preview: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)',
    description: 'Traditional sports card design with bold borders'
  },
  {
    id: 'holographic-pro',
    name: 'Holographic Pro',
    category: 'holographic',
    premium: true,
    preview: 'linear-gradient(45deg, #ff006e, #8338ec, #3a86ff)',
    description: 'Shimmering holographic effect with modern styling'
  },
  {
    id: 'vintage-gold',
    name: 'Vintage Gold',
    category: 'vintage',
    premium: false,
    preview: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
    description: 'Ornate vintage design with gold accents'
  },
  {
    id: 'chrome-elite',
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

export const InteractiveFrameBrowser: React.FC<InteractiveFrameBrowserProps> = ({
  frames: propFrames,
  selectedFrame,
  onFrameSelect,
  className = ""
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Use provided frames or fallback to mock frames
  const frames = propFrames.length > 0 ? propFrames : MOCK_FRAMES;
  
  const categories = [
    { id: 'all', name: 'All', count: frames.length },
    { id: 'sports', name: 'Sports', count: frames.filter(f => f.category === 'sports').length },
    { id: 'vintage', name: 'Vintage', count: frames.filter(f => f.category === 'vintage').length },
    { id: 'modern', name: 'Modern', count: frames.filter(f => f.category === 'modern').length },
    { id: 'holographic', name: 'Holographic', count: frames.filter(f => f.category === 'holographic').length }
  ].filter(cat => cat.count > 0);

  const filteredFrames = frames.filter(frame => {
    const matchesSearch = frame.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         frame.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || frame.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return; // Don't interfere with input fields
      
      const currentIndex = filteredFrames.findIndex(f => f.id === selectedFrame);
      let nextIndex = currentIndex;
      
      switch (e.key) {
        case 'ArrowRight':
          nextIndex = (currentIndex + 1) % filteredFrames.length;
          break;
        case 'ArrowLeft':
          nextIndex = currentIndex > 0 ? currentIndex - 1 : filteredFrames.length - 1;
          break;
        case 'ArrowDown':
          nextIndex = Math.min(currentIndex + 3, filteredFrames.length - 1);
          break;
        case 'ArrowUp':
          nextIndex = Math.max(currentIndex - 3, 0);
          break;
        case 'Enter':
          if (currentIndex >= 0) {
            onFrameSelect(filteredFrames[currentIndex].id);
          }
          return;
        default:
          return;
      }
      
      if (nextIndex !== currentIndex && filteredFrames[nextIndex]) {
        onFrameSelect(filteredFrames[nextIndex].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredFrames, selectedFrame, onFrameSelect]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and Controls */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search frames..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-editor-tool border-editor-border text-white text-sm"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-1 overflow-x-auto pb-1">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`text-xs whitespace-nowrap h-7 px-2 ${
                  selectedCategory === category.id 
                    ? 'bg-crd-green text-black' 
                    : 'border-editor-border text-white hover:bg-editor-border'
                }`}
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
          
          <div className="flex gap-1">
            <Button
              variant={viewMode === 'grid' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="w-8 h-7 p-0"
            >
              <Grid className="w-3 h-3" />
            </Button>
            <Button
              variant={viewMode === 'list' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('list')}
              className="w-8 h-7 p-0"
            >
              <List className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Frame Selector */}
      <CompactFrameSelector
        frames={filteredFrames}
        selectedFrame={selectedFrame}
        onFrameSelect={onFrameSelect}
      />
      
      {/* Results info */}
      <div className="text-xs text-crd-lightGray text-center">
        {filteredFrames.length} frame{filteredFrames.length !== 1 ? 's' : ''} • Use arrow keys to navigate
      </div>
    </div>
  );
};
