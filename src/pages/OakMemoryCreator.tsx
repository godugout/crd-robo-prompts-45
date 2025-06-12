
import React, { useState } from 'react';
import { ArrowLeft, Grid3X3, Search, ZoomIn, ZoomOut, Maximize, Type, Palette, Sparkles, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Template {
  id: string;
  name: string;
  thumbnail: string;
  category: string;
}

const SAMPLE_TEMPLATES: Template[] = [
  { id: '1', name: 'Classic A\'s', thumbnail: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=200&h=150&fit=crop', category: 'Classic' },
  { id: '2', name: 'Vintage Green', thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&h=150&fit=crop', category: 'Vintage' },
  { id: '3', name: 'Gold Edition', thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=150&fit=crop', category: 'Premium' },
  { id: '4', name: 'Stadium View', thumbnail: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=200&h=150&fit=crop', category: 'Stadium' },
  { id: '5', name: 'Player Card', thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=150&fit=crop', category: 'Players' },
  { id: '6', name: 'Team Spirit', thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200&h=150&fit=crop', category: 'Team' },
];

const CATEGORIES = ['All', 'Classic', 'Vintage', 'Premium', 'Stadium', 'Players', 'Team'];

export const OakMemoryCreator: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoom, setZoom] = useState(100);

  const filteredTemplates = SAMPLE_TEMPLATES.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Top Header */}
      <header className="h-[60px] bg-[#0f4c3a] border-b border-[#0f4c3a]/20 flex items-center justify-between px-4 z-10">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-[#ffd700] hover:bg-[#0f4c3a]/80 hover:text-[#ffd700]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div className="w-8 h-8 rounded-full bg-[#ffd700] flex items-center justify-center">
            <span className="text-[#0f4c3a] font-bold text-sm">A</span>
          </div>
          
          <h1 className="text-[#ffd700] font-semibold text-lg hidden sm:block">
            Oakland A's Memory Creator
          </h1>
          <h1 className="text-[#ffd700] font-semibold text-sm sm:hidden">
            A's Memories
          </h1>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="border-[#ffd700] text-[#ffd700] hover:bg-[#ffd700] hover:text-[#0f4c3a] hidden md:flex"
          >
            2D Preview
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="border-[#ffd700] text-[#ffd700] hover:bg-[#ffd700] hover:text-[#0f4c3a]"
          >
            <Share2 className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Share</span>
          </Button>
          <Button 
            size="sm"
            className="bg-[#ffd700] text-[#0f4c3a] hover:bg-[#ffd700]/90 font-medium"
          >
            <Download className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Save Memory</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-80 bg-[#1a1a1a] border-r border-gray-800 flex flex-col overflow-hidden">
          {/* Templates Header */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <Grid3X3 className="w-5 h-5 text-orange-500" />
              <h2 className="text-white font-semibold">Templates</h2>
            </div>

            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-[#ffd700] focus:ring-[#ffd700]"
              />
            </div>

            {/* Category Filter Tags */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {CATEGORIES.map((category) => (
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
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="grid grid-cols-2 gap-3">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="group cursor-pointer bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-[#ffd700] transition-all duration-200 hover:scale-105"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                    />
                  </div>
                  <div className="p-2">
                    <h3 className="text-white text-sm font-medium truncate">
                      {template.name}
                    </h3>
                    <p className="text-gray-400 text-xs">
                      {template.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Canvas Area */}
        <main className="flex-1 bg-gray-100 flex flex-col relative">
          {/* Canvas Container */}
          <div className="flex-1 flex items-center justify-center p-8 relative">
            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-white rounded-lg shadow-lg p-2 z-10">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                className="hover:bg-gray-100"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium min-w-[3rem] text-center">
                {zoom}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                className="hover:bg-gray-100"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <div className="w-px h-4 bg-gray-300 mx-1" />
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-gray-100"
              >
                <Maximize className="w-4 h-4" />
              </Button>
            </div>

            {/* Canvas Placeholder */}
            <div 
              className="bg-white rounded-lg shadow-2xl border-2 border-dashed border-gray-300 flex items-center justify-center"
              style={{
                width: `${(400 * zoom) / 100}px`,
                height: `${(600 * zoom) / 100}px`,
                maxWidth: '90%',
                maxHeight: '80%',
              }}
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#0f4c3a] flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#ffd700] font-bold text-2xl">A</span>
                </div>
                <p className="text-gray-500 text-lg font-medium">
                  Select a template to begin
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Choose from Oakland A's themed designs
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Toolbar */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-center justify-center gap-6">
              <Button
                variant="ghost"
                className="flex flex-col items-center gap-1 h-auto py-2 px-4 hover:bg-gray-100"
              >
                <Type className="w-5 h-5" />
                <span className="text-xs">Text</span>
              </Button>
              
              <Button
                variant="ghost"
                className="flex flex-col items-center gap-1 h-auto py-2 px-4 hover:bg-gray-100"
              >
                <Palette className="w-5 h-5" />
                <span className="text-xs">Colors</span>
              </Button>
              
              <Button
                variant="ghost"
                className="flex flex-col items-center gap-1 h-auto py-2 px-4 hover:bg-gray-100"
              >
                <Sparkles className="w-5 h-5" />
                <span className="text-xs">Effects</span>
              </Button>
              
              <div className="w-px h-8 bg-gray-300" />
              
              <Button
                className="bg-[#0f4c3a] text-[#ffd700] hover:bg-[#0f4c3a]/90 px-6"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OakMemoryCreator;
