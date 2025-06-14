
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Sparkles } from 'lucide-react';
import { FrameRenderer } from '../../frames/FrameRenderer';

interface FrameOption {
  id: string;
  name: string;
  category: string;
  description: string;
  isPremium?: boolean;
}

const FRAME_OPTIONS: FrameOption[] = [
  {
    id: 'classic-sports',
    name: 'Classic Sports',
    category: 'Sports',
    description: 'Traditional sports card design with clean borders'
  },
  {
    id: 'holographic-modern',
    name: 'Holographic Modern',
    category: 'Modern',
    description: 'Futuristic design with holographic effects',
    isPremium: true
  },
  {
    id: 'vintage-ornate',
    name: 'Vintage Ornate',
    category: 'Vintage',
    description: 'Elegant vintage design with decorative elements'
  },
  {
    id: 'donruss-special',
    name: 'Special Edition',
    category: 'Premium',
    description: 'Premium design with special finishing',
    isPremium: true
  },
  {
    id: 'donruss-rookie',
    name: 'Rookie Card',
    category: 'Sports',
    description: 'Perfect for rookie and prospect cards'
  },
  {
    id: 'chrome-edition',
    name: 'Chrome Edition',
    category: 'Modern',
    description: 'Sleek chrome finish with metallic accents',
    isPremium: true
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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(FRAME_OPTIONS.map(f => f.category)))];
  
  const filteredFrames = FRAME_OPTIONS.filter(frame => {
    const matchesSearch = frame.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         frame.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || frame.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex h-full">
      {/* Frame Selection */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-white mb-3">Choose Your Frame Style</h3>
            <p className="text-gray-400 text-lg">
              Select a professional frame design for your card. Each frame is optimized for different card types.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search frame styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-editor-dark border border-editor-border rounded-lg text-white placeholder-gray-400 focus:border-crd-green focus:outline-none"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-editor-dark border border-editor-border rounded-lg text-white focus:border-crd-green focus:outline-none"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Frame Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFrames.map((frame) => (
              <div
                key={frame.id}
                className={`relative group cursor-pointer transition-all duration-300 ${
                  selectedFrame === frame.id
                    ? 'ring-2 ring-crd-green shadow-lg shadow-crd-green/20'
                    : 'hover:scale-105 hover:shadow-xl'
                }`}
                onClick={() => onFrameSelect(frame.id)}
              >
                <div className="bg-editor-dark rounded-xl border border-editor-border overflow-hidden">
                  {/* Frame Preview */}
                  <div className="aspect-[5/7] bg-gray-800 relative overflow-hidden">
                    <FrameRenderer
                      frameId={frame.id}
                      title="SAMPLE CARD"
                      subtitle="Preview Text"
                      width={240}
                      height={336}
                    />
                    
                    {/* Premium Badge */}
                    {frame.isPremium && (
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center">
                        <Sparkles className="w-3 h-3 mr-1" />
                        PREMIUM
                      </div>
                    )}

                    {/* Selection Indicator */}
                    {selectedFrame === frame.id && (
                      <div className="absolute inset-0 bg-crd-green/10 flex items-center justify-center">
                        <div className="bg-crd-green text-black px-4 py-2 rounded-full font-semibold">
                          Selected
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Frame Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-semibold text-lg">{frame.name}</h4>
                      <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                        {frame.category}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {frame.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredFrames.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-12 h-12 mx-auto mb-4" />
                <p className="text-lg">No frames found matching your criteria</p>
                <p className="text-sm">Try adjusting your search or filter</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Frame Preview */}
      <div className="w-80 bg-editor-darker border-l border-editor-border p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Selected Frame</h4>
        
        {selectedFrame ? (
          <div className="space-y-4">
            <div className="aspect-[5/7] bg-gray-800 rounded-lg overflow-hidden">
              <FrameRenderer
                frameId={selectedFrame}
                title="YOUR CARD"
                subtitle="Your content will appear here"
                width={280}
                height={392}
              />
            </div>
            
            <div className="space-y-2">
              <h5 className="text-white font-medium">
                {FRAME_OPTIONS.find(f => f.id === selectedFrame)?.name}
              </h5>
              <p className="text-gray-400 text-sm">
                {FRAME_OPTIONS.find(f => f.id === selectedFrame)?.description}
              </p>
            </div>

            <div className="pt-3 border-t border-gray-700">
              <p className="text-gray-400 text-xs mb-3">Next Step:</p>
              <p className="text-white text-sm">
                Upload your image to see how it looks in this frame
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <div className="w-16 h-16 bg-gray-700 rounded mx-auto mb-4"></div>
            <p className="text-sm">Select a frame to see preview</p>
          </div>
        )}
      </div>
    </div>
  );
};
