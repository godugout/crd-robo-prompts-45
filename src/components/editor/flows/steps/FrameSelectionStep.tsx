
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface Frame {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  description: string;
  style: 'sports' | 'trading' | 'full-bleed' | 'vintage' | 'modern';
}

const SAMPLE_FRAMES: Frame[] = [
  {
    id: 'sports-classic',
    name: 'Classic Sports Card',
    category: 'Sports Cards',
    thumbnail: '/api/placeholder/200/280',
    description: 'Traditional sports card layout with stats area',
    style: 'sports'
  },
  {
    id: 'trading-modern',
    name: 'Modern Trading Card',
    category: 'Trading Cards',
    thumbnail: '/api/placeholder/200/280',
    description: 'Contemporary design with clean lines',
    style: 'trading'
  },
  {
    id: 'full-bleed-simple',
    name: 'Full Bleed Image',
    category: 'Full Bleed',
    thumbnail: '/api/placeholder/200/280',
    description: 'Edge-to-edge image with minimal text overlay',
    style: 'full-bleed'
  },
  {
    id: 'vintage-ornate',
    name: 'Vintage Ornate',
    category: 'Vintage',
    thumbnail: '/api/placeholder/200/280',
    description: 'Classic ornate border with elegant details',
    style: 'vintage'
  }
];

interface FrameSelectionStepProps {
  selectedFrame?: string;
  onFrameSelect: (frameId: string) => void;
}

export const FrameSelectionStep: React.FC<FrameSelectionStepProps> = ({
  selectedFrame,
  onFrameSelect
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...new Set(SAMPLE_FRAMES.map(frame => frame.category))];

  const filteredFrames = SAMPLE_FRAMES.filter(frame => {
    const matchesSearch = frame.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         frame.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || frame.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex h-full">
      {/* Frame Selection */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">Choose Your Frame</h3>
          <p className="text-gray-400">
            Select a frame style that matches your vision. You can always change this later.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search frames..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-editor-dark border-editor-border text-white"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-editor-dark border border-editor-border rounded text-white"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Frame Grid */}
        <ScrollArea className="h-[calc(100vh-400px)]">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFrames.map((frame) => (
              <div
                key={frame.id}
                onClick={() => onFrameSelect(frame.id)}
                className={`cursor-pointer group transition-all duration-200 ${
                  selectedFrame === frame.id 
                    ? 'ring-2 ring-crd-green' 
                    : 'hover:scale-105'
                }`}
              >
                <div className="bg-editor-dark rounded-lg overflow-hidden border border-editor-border">
                  <div className="aspect-[5/7] bg-gray-800 relative">
                    {/* Placeholder for frame thumbnail */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gray-700 rounded mx-auto mb-2"></div>
                        <span className="text-xs">Frame Preview</span>
                      </div>
                    </div>
                    {selectedFrame === frame.id && (
                      <div className="absolute top-2 right-2 bg-crd-green text-black rounded-full w-6 h-6 flex items-center justify-center">
                        ✓
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-white mb-1">{frame.name}</h4>
                    <p className="text-gray-400 text-sm">{frame.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Live Preview */}
      <div className="w-80 bg-editor-dark border-l border-editor-border p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Preview</h4>
        <div className="aspect-[5/7] bg-gray-800 rounded-lg flex items-center justify-center">
          {selectedFrame ? (
            <div className="text-center text-gray-400">
              <div className="w-16 h-16 bg-gray-700 rounded mx-auto mb-4"></div>
              <p className="text-sm">
                {SAMPLE_FRAMES.find(f => f.id === selectedFrame)?.name}
              </p>
              <p className="text-xs mt-2">
                Upload an image to see how it looks in this frame
              </p>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p className="text-sm">Select a frame to see preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
