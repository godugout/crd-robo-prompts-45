import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Star, Grid, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { getCardDimensions, type CardOrientation } from '@/utils/cardDimensions';
import { useResponsiveBreakpoints } from '@/hooks/useResponsiveBreakpoints';

interface VisualEffect {
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
  orientation: CardOrientation;
}

const VISUAL_EFFECTS: VisualEffect[] = [
  {
    id: 'holographic-elite',
    name: 'Holographic Elite',
    category: 'holographic',
    premium: true,
    preview: 'linear-gradient(45deg, #ff006e, #8338ec, #3a86ff)',
    description: 'Shimmering holographic finish with rainbow effects'
  },
  {
    id: 'chrome-professional',
    name: 'Chrome Professional',
    category: 'metallic',
    premium: true,
    preview: 'linear-gradient(135deg, #6b7280 0%, #9ca3af 50%, #d1d5db 100%)',
    description: 'Sleek chrome finish with mirror-like reflections'
  },
  {
    id: 'vintage-gold',
    name: 'Vintage Gold',
    category: 'vintage',
    premium: false,
    preview: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
    description: 'Classic gold treatment with aged styling'
  },
  {
    id: 'neon-cyber',
    name: 'Neon Cyber',
    category: 'modern',
    premium: true,
    preview: 'linear-gradient(135deg, #10b981 0%, #06d6a0 50%, #00f5ff 100%)',
    description: 'Futuristic neon glow with digital aesthetics'
  },
  {
    id: 'royal-purple',
    name: 'Royal Edition',
    category: 'luxury',
    premium: false,
    preview: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
    description: 'Elegant royal treatment with luxury styling'
  },
  {
    id: 'sports-classic',
    name: 'Sports Classic',
    category: 'sports',
    premium: false,
    preview: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)',
    description: 'Traditional sports card design with bold accents'
  }
];

const EFFECT_CATEGORIES = [
  { id: 'all', name: 'All Effects', count: VISUAL_EFFECTS.length },
  { id: 'holographic', name: 'Holographic', count: 1 },
  { id: 'metallic', name: 'Metallic', count: 1 },
  { id: 'vintage', name: 'Vintage', count: 1 },
  { id: 'modern', name: 'Modern', count: 1 },
  { id: 'luxury', name: 'Luxury', count: 1 },
  { id: 'sports', name: 'Sports', count: 1 }
];

export const EnhancedFrameBrowser: React.FC<EnhancedFrameBrowserProps> = ({
  onFrameSelect,
  selectedFrame,
  orientation
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [hoveredEffect, setHoveredEffect] = useState<string | null>(null);
  
  const { isMobile, isTablet } = useResponsiveBreakpoints();
  
  // Responsive items per page
  const itemsPerPage = isMobile ? 2 : isTablet ? 3 : 4;

  const cardDimensions = getCardDimensions(orientation);

  const filteredEffects = VISUAL_EFFECTS.filter(effect => {
    const matchesSearch = effect.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         effect.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || effect.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredEffects.length / itemsPerPage);
  const currentEffects = filteredEffects.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleEffectClick = (effectId: string, effectName: string) => {
    onFrameSelect(effectId);
    toast.success(`Applied ${effectName} effect`, {
      duration: 2000,
      className: 'bg-crd-green text-black'
    });
  };

  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 0));

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-4 md:p-6 border border-white/10">
      {/* Header */}
      <div className={`flex ${isMobile ? 'flex-col gap-3' : 'items-center justify-between'} mb-4 md:mb-6`}>
        <div>
          <h3 className="text-lg md:text-2xl font-bold text-white mb-1">Visual Effects Library</h3>
          <p className="text-gray-300 text-xs md:text-sm">Professional finishes and treatments for your cards</p>
        </div>
        {!isMobile && (
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
        )}
      </div>

      {/* Search and Categories */}
      <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
        <div className="relative">
          <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
          <Input
            placeholder="Search visual effects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 md:pl-12 bg-black/30 border-white/20 text-white placeholder:text-gray-400 h-10 md: h-12 text-sm md:text-lg"
          />
        </div>

        <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {EFFECT_CATEGORIES.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedCategory(category.id);
                setCurrentPage(0);
              }}
              className={`whitespace-nowrap text-xs md:text-sm ${
                selectedCategory === category.id 
                  ? 'bg-crd-green text-black hover:bg-crd-green/90' 
                  : 'border-white/20 text-white hover:bg-white/10'
              }`}
            >
              {category.name}
              <Badge variant="secondary" className="ml-1 md:ml-2 bg-white/20 text-white text-xs">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Effects Grid */}
      <div className="space-y-4">
        <div className={`grid ${
          isMobile ? 'grid-cols-2' : isTablet ? 'grid-cols-3' : 'grid-cols-4'
        } gap-3 md:gap-4`}>
          {currentEffects.map(effect => (
            <Card
              key={effect.id}
              className={`relative cursor-pointer group transition-all duration-300 overflow-hidden bg-black/20 border-white/10 hover:border-crd-green/50 hover:scale-105 ${
                selectedFrame === effect.id ? 'ring-2 ring-crd-green border-crd-green' : ''
              } ${hoveredEffect === effect.id ? 'shadow-2xl shadow-crd-green/20' : ''}`}
              onClick={() => handleEffectClick(effect.id, effect.name)}
              onMouseEnter={() => setHoveredEffect(effect.id)}
              onMouseLeave={() => setHoveredEffect(null)}
            >
              <div 
                className="relative"
                style={{ 
                  aspectRatio: cardDimensions.aspectRatio,
                }}
              >
                <div 
                  className="absolute inset-0 rounded-lg transition-all duration-300"
                  style={{ 
                    background: effect.preview,
                    filter: hoveredEffect === effect.id ? 'brightness(1.2) saturate(1.3)' : 'brightness(1)'
                  }}
                >
                  {/* Effect Content Simulation */}
                  <div className="absolute inset-2 md:inset-4 bg-black/30 rounded flex flex-col items-center justify-center text-white">
                    <div className="w-6 h-4 md:w-8 md:h-6 bg-white/40 rounded mb-1 md:mb-2"></div>
                    <div className="w-8 h-0.5 md:w-12 md:h-1 bg-white/60 rounded mb-0.5 md:mb-1"></div>
                    <div className="w-6 h-0.5 md:w-10 md:h-1 bg-white/40 rounded"></div>
                  </div>
                  
                  {/* Premium Badge */}
                  {effect.premium && (
                    <div className="absolute top-1 right-1 md:top-2 md:right-2">
                      <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current drop-shadow-lg" />
                    </div>
                  )}

                  {/* Selection Indicator */}
                  {selectedFrame === effect.id && (
                    <div className="absolute top-1 left-1 md:top-2 md:left-2 w-4 h-4 md:w-5 md:h-5 bg-crd-green rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-black rounded-full"></div>
                    </div>
                  )}

                  {/* Hover Effect Overlay */}
                  {hoveredEffect === effect.id && (
                    <div className="absolute inset-0 bg-gradient-to-t from-crd-green/20 to-transparent rounded-lg" />
                  )}
                </div>
              </div>
              
              <div className="p-2 md:p-3 bg-black/40 backdrop-blur-sm">
                <h4 className="text-white font-semibold text-xs md:text-sm truncate">{effect.name}</h4>
                <p className="text-gray-300 text-xs truncate mt-0.5 md:mt-1">{effect.description}</p>
                {hoveredEffect === effect.id && !isMobile && (
                  <div className="mt-1 md:mt-2 text-xs text-crd-green">
                    Click to apply this effect
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 md:gap-4 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={currentPage === 0}
              className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50 text-xs md:text-sm"
            >
              <ChevronLeft className="w-3 h-3 md:w-4 md:h-4 mr-0.5 md:mr-1" />
              {!isMobile && "Previous"}
            </Button>
            
            <div className="flex items-center gap-1 md:gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-6 h-6 md:w-8 md:h-8 rounded-full text-xs md:text-sm font-medium transition-colors ${
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
              className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50 text-xs md:text-sm"
            >
              {!isMobile && "Next"}
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4 ml-0.5 md:ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
