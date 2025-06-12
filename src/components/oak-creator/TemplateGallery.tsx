import React, { useState, useMemo } from 'react';
import { Search, Filter, Grid3X3, TrendingUp, Clock, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TemplateCard } from './TemplateCard';
import { SAMPLE_OAK_TEMPLATES, TEMPLATE_CATEGORIES } from '@/data/oakTemplateData';
import { OakTemplate, TemplateCategory } from '@/types/oakTemplates';

interface TemplateGalleryProps {
  selectedTemplate?: string;
  onSelectTemplate?: (template: OakTemplate) => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  selectedTemplate,
  onSelectTemplate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'recent' | 'trending' | 'all'>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Filter and sort templates
  const filteredTemplates = useMemo(() => {
    let filtered = SAMPLE_OAK_TEMPLATES.map(template => ({
      ...template,
      isFavorite: favorites.has(template.id)
    }));

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query) ||
        t.tags.some(tag => tag.toLowerCase().includes(query)) ||
        t.era?.toLowerCase().includes(query)
      );
    }

    // Sort by view mode
    switch (viewMode) {
      case 'trending':
        filtered = filtered.filter(t => t.isTrending).concat(
          filtered.filter(t => !t.isTrending)
        );
        break;
      case 'recent':
        filtered = filtered.sort((a, b) => {
          if (a.lastUsed && b.lastUsed) {
            return new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime();
          }
          if (a.lastUsed) return -1;
          if (b.lastUsed) return 1;
          return 0;
        });
        break;
      default:
        // Keep original order for 'all'
        break;
    }

    return filtered;
  }, [selectedCategory, searchQuery, viewMode, favorites]);

  const handleFavorite = (template: OakTemplate) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(template.id)) {
        newFavorites.delete(template.id);
      } else {
        newFavorites.add(template.id);
      }
      return newFavorites;
    });
  };

  const trendingCount = filteredTemplates.filter(t => t.isTrending).length;
  const recentCount = filteredTemplates.filter(t => t.lastUsed).length;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <Grid3X3 className="w-5 h-5 text-orange-500" />
          <h2 className="text-white font-semibold">Templates</h2>
          <Badge variant="outline" className="text-gray-400 border-gray-600">
            {filteredTemplates.length}
          </Badge>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-[#ffd700] focus:ring-[#ffd700]"
          />
        </div>

        {/* View Mode Buttons */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={viewMode === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('all')}
            className={viewMode === 'all' ? 'bg-[#ffd700] text-[#0f4c3a]' : 'text-gray-300 hover:text-white'}
          >
            All
          </Button>
          <Button
            variant={viewMode === 'trending' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('trending')}
            className={viewMode === 'trending' ? 'bg-[#ffd700] text-[#0f4c3a]' : 'text-gray-300 hover:text-white'}
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            Trending ({trendingCount})
          </Button>
          <Button
            variant={viewMode === 'recent' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('recent')}
            className={viewMode === 'recent' ? 'bg-[#ffd700] text-[#0f4c3a]' : 'text-gray-300 hover:text-white'}
          >
            <Clock className="w-4 h-4 mr-1" />
            Recent ({recentCount})
          </Button>
        </div>

        {/* Category Filter Tags */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {TEMPLATE_CATEGORIES.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`cursor-pointer whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-[#ffd700] text-[#0f4c3a] hover:bg-[#ffd700]/90'
                  : 'border-gray-600 text-gray-300 hover:border-[#ffd700] hover:text-[#ffd700]'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Template Grid */}
      <ScrollArea className="flex-1 p-4">
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplate === template.id}
                onSelect={onSelectTemplate}
                onFavorite={handleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <Filter className="w-8 h-8 text-gray-500 mb-2" />
            <p className="text-gray-400 text-sm">No templates found</p>
            <p className="text-gray-500 text-xs">Try adjusting your filters</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
