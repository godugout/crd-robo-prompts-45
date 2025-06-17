
import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Star, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
  const [hoveredFrame, setHoveredFrame] = useState<string | null>(null);
  
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

  const handleFrameSelect = (frame: Frame) => {
    onFrameSelect(frame.id);
    toast.success(`Applied ${frame.name} frame`);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
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
            handleFrameSelect(filteredFrames[currentIndex]);
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
    <div className={`h-full flex flex-col bg-black/30 backdrop-blur-sm ${className}`}>
      {/* Header Section */}
      <div className="p-4 border-b border-white/10">
        <h3 className="text-white font-semibold text-lg mb-4">Card Frames</h3>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search frames..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-black/40 border-white/20 text-white text-sm placeholder:text-gray-400"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={`text-xs h-7 px-3 ${
                selectedCategory === category.id 
                  ? 'bg-crd-green text-black hover:bg-crd-green/90' 
                  : 'border-white/20 text-white hover:bg-white/10 bg-transparent'
              }`}
            >
              {category.name} ({category.count})
            </Button>
          ))}
        </div>
      </div>

      {/* Frames Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          {filteredFrames.map(frame => (
            <div
              key={frame.id}
              className={`relative group cursor-pointer transition-all duration-200 ${
                selectedFrame === frame.id
                  ? 'ring-2 ring-crd-green shadow-lg scale-105'
                  : 'hover:scale-105 hover:shadow-md'
              }`}
              onClick={() => handleFrameSelect(frame)}
              onMouseEnter={() => setHoveredFrame(frame.id)}
              onMouseLeave={() => setHoveredFrame(null)}
            >
              {/* Frame Preview */}
              <div 
                className="aspect-[3/4] rounded-lg border-2 border-white/20 group-hover:border-crd-green/50 transition-colors overflow-hidden relative"
                style={{ background: frame.preview }}
              >
                {/* Mock card content */}
                <div className="absolute inset-3 bg-black/20 rounded flex items-center justify-center">
                  <div className="text-white text-xs font-bold text-center">
                    <div className="w-8 h-6 bg-white/30 rounded mb-2 mx-auto"></div>
                    <div className="w-12 h-1 bg-white/50 rounded mx-auto"></div>
                  </div>
                </div>
                
                {/* Premium badge */}
                {frame.premium && (
                  <div className="absolute top-2 right-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  </div>
                )}
                
                {/* Selection indicator */}
                {selectedFrame === frame.id && (
                  <div className="absolute top-2 left-2 w-5 h-5 bg-crd-green rounded-full shadow-lg flex items-center justify-center">
                    <Check className="w-3 h-3 text-black" />
                  </div>
                )}
              </div>
              
              {/* Frame Info - Now directly below frame */}
              <div className="mt-2 text-center">
                <h4 className="text-white text-sm font-medium truncate">{frame.name}</h4>
                <p className="text-gray-400 text-xs truncate capitalize">{frame.category}</p>
              </div>
              
              {/* Enhanced Hover Tooltip */}
              {hoveredFrame === frame.id && (
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-20 pointer-events-none border border-white/20">
                  <div className="font-medium">{frame.name}</div>
                  <div className="text-gray-300 mt-1">{frame.description}</div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Results info */}
        <div className="text-xs text-gray-400 text-center mt-6 pb-4">
          {filteredFrames.length} frame{filteredFrames.length !== 1 ? 's' : ''} • Use arrow keys to navigate
        </div>
      </div>
    </div>
  );
};
