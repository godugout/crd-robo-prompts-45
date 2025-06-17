
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Star, Grid, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface Frame {
  id: string;
  name: string;
  category: string;
  premium: boolean;
  preview: string;
  description: string;
}

interface EnhancedFrameBrowserProps {
  onFrameSelect: (frameId: string) => void;
  selectedFrame?: string;
}

const ENHANCED_FRAMES: Frame[] = [
  {
    id: 'holographic-elite',
    name: 'Holographic Elite',
    category: 'premium',
    premium: true,
    preview: 'linear-gradient(45deg, #ff006e, #8338ec, #3a86ff)',
    description: 'Shimmering holographic effect with premium styling'
  },
  {
    id: 'chrome-professional',
    name: 'Chrome Professional',
    category: 'modern',
    premium: true,
    preview: 'linear-gradient(135deg, #6b7280 0%, #9ca3af 50%, #d1d5db 100%)',
    description: 'Sleek chrome finish with metallic effects'
  },
  {
    id: 'vintage-gold',
    name: 'Vintage Gold',
    category: 'vintage',
    premium: false,
    preview: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
    description: 'Classic gold design with vintage styling'
  },
  {
    id: 'neon-cyber',
    name: 'Neon Cyber',
    category: 'futuristic',
    premium: true,
    preview: 'linear-gradient(135deg, #10b981 0%, #06d6a0 50%, #00f5ff 100%)',
    description: 'Futuristic neon glow with cyber aesthetics'
  },
  {
    id: 'royal-purple',
    name: 'Royal Edition',
    category: 'luxury',
    premium: false,
    preview: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
    description: 'Elegant royal purple with luxury styling'
  },
  {
    id: 'sports-classic',
    name: 'Sports Classic',
    category: 'sports',
    premium: false,
    preview: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)',
    description: 'Traditional sports card design'
  }
];

export const EnhancedFrameBrowser: React.FC<EnhancedFrameBrowserProps> = ({
  onFrameSelect,
  selectedFrame
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  const categories = [
    { id: 'all', name: 'All', count: ENHANCED_FRAMES.length },
    { id: 'premium', name: 'Premium', count: 3 },
    { id: 'sports', name: 'Sports', count: 1 },
    { id: 'vintage', name: 'Vintage', count: 1 },
    { id: 'modern', name: 'Modern', count: 1 }
  ];

  const filteredFrames = ENHANCED_FRAMES.filter(frame => {
    const matchesSearch = frame.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || frame.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredFrames.length / itemsPerPage);
  const currentFrames = filteredFrames.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleFrameClick = (frameId: string, frameName: string) => {
    onFrameSelect(frameId);
    toast.success(`Applied ${frameName} frame`, {
      duration: 2000,
      className: 'bg-crd-green text-black'
    });
  };

  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 0));

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">Professional Frames</h3>
          <p className="text-gray-300 text-sm">Choose from our curated collection of premium card templates</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
            <Star className="w-4 h-4 mr-2" />
            Favorites
          </Button>
        </div>
      </div>

      {/* Search and Categories */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search premium frames..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 bg-black/30 border-white/20 text-white placeholder:text-gray-400 h-12 text-lg"
          />
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedCategory(category.id);
                setCurrentPage(0);
              }}
              className={`whitespace-nowrap ${
                selectedCategory === category.id 
                  ? 'bg-crd-green text-black hover:bg-crd-green/90' 
                  : 'border-white/20 text-white hover:bg-white/10'
              }`}
            >
              {category.name}
              <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Frame Grid - Horizontal Layout */}
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-4">
          {currentFrames.map(frame => (
            <Card
              key={frame.id}
              className={`relative cursor-pointer group transition-all duration-300 overflow-hidden bg-black/20 border-white/10 hover:border-crd-green/50 hover:scale-105 ${
                selectedFrame === frame.id ? 'ring-2 ring-crd-green border-crd-green' : ''
              }`}
              onClick={() => handleFrameClick(frame.id, frame.name)}
            >
              <div className="aspect-[3/4] relative">
                <div 
                  className="absolute inset-0 rounded-lg"
                  style={{ background: frame.preview }}
                >
                  {/* Frame Content Simulation */}
                  <div className="absolute inset-4 bg-black/30 rounded flex flex-col items-center justify-center text-white">
                    <div className="w-8 h-6 bg-white/40 rounded mb-2"></div>
                    <div className="w-12 h-1 bg-white/60 rounded mb-1"></div>
                    <div className="w-10 h-1 bg-white/40 rounded"></div>
                  </div>
                  
                  {/* Premium Badge */}
                  {frame.premium && (
                    <div className="absolute top-2 right-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current drop-shadow-lg" />
                    </div>
                  )}

                  {/* Selection Indicator */}
                  {selectedFrame === frame.id && (
                    <div className="absolute top-2 left-2 w-5 h-5 bg-crd-green rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-3 bg-black/40 backdrop-blur-sm">
                <h4 className="text-white font-semibold text-sm truncate">{frame.name}</h4>
                <p className="text-gray-300 text-xs truncate mt-1">{frame.description}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={currentPage === 0}
              className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                    currentPage === i 
                      ? 'bg-crd-green text-black' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
