
import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import { EnhancedAssetCard } from './EnhancedAssetCard';

interface Asset {
  id: string;
  name: string;
  thumbnail: string;
  url?: string;
  category: string;
  tags?: string[];
  size?: { width: number; height: number };
}

interface EnhancedAssetsSectionProps {
  assets: Asset[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const EnhancedAssetsSection = ({ 
  assets, 
  searchQuery, 
  onSearchChange 
}: EnhancedAssetsSectionProps) => {
  const [enhancedAssets, setEnhancedAssets] = useState<Asset[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    // Load enhanced assets from the global asset integration
    if ((window as any).availableAssets) {
      setEnhancedAssets((window as any).availableAssets);
    }
  }, []);

  const allAssets = [...assets, ...enhancedAssets];

  // Get available categories
  const categories = ['all', ...Array.from(new Set(allAssets.map(asset => asset.category)))];

  // Get available tags
  const allTags = Array.from(new Set(allAssets.flatMap(asset => asset.tags || [])));

  const filteredAssets = allAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (asset.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => (asset.tags || []).includes(tag));
    
    return matchesSearch && matchesCategory && matchesTags;
  });

  const getAssetsByCategory = (category: string) => {
    if (category === 'all') return filteredAssets;
    return filteredAssets.filter(asset => asset.category === category);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="space-y-4">
      {/* Enhanced Search */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cardshow-lightGray w-4 h-4" />
          <Input
            placeholder="Search assets by name or tags..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-editor-tool border-editor-border text-cardshow-white"
          />
        </div>
        
        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-cardshow-lightGray">
              <Filter className="w-3 h-3" />
              <span>Filter by tags:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {allTags.slice(0, 8).map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "secondary"}
                  className={`cursor-pointer text-xs transition-colors ${
                    selectedTags.includes(tag) 
                      ? 'bg-crd-green text-white' 
                      : 'bg-editor-tool text-cardshow-lightGray hover:bg-editor-border'
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="bg-editor-darker w-full grid grid-cols-3">
          <TabsTrigger value="all" className="text-xs">All ({allAssets.length})</TabsTrigger>
          <TabsTrigger value="tech" className="text-xs">Tech ({getAssetsByCategory('tech').length})</TabsTrigger>
          <TabsTrigger value="nature" className="text-xs">Nature ({getAssetsByCategory('nature').length})</TabsTrigger>
        </TabsList>
        
        <div className="mt-4">
          <ScrollArea className="h-[500px] pr-2">
            <div className="grid grid-cols-2 gap-3">
              {getAssetsByCategory(selectedCategory).map((asset) => (
                <EnhancedAssetCard key={asset.id} asset={asset} />
              ))}
            </div>
            
            {getAssetsByCategory(selectedCategory).length === 0 && (
              <div className="text-center py-8 text-cardshow-lightGray">
                <p className="text-sm">No assets found</p>
                <p className="text-xs mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </Tabs>
    </div>
  );
};
