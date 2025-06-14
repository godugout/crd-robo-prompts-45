
import React, { useState, useRef } from 'react';
import { Search, Filter, Heart, Zap, Eye, RotateCcw, Crop, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { FramePreview } from './FramePreview';
import type { MinimalistFrame } from '../data/minimalistFrames';

interface EnhancedShowcaseViewProps {
  frames: MinimalistFrame[];
  currentIndex: number;
  uploadedImage?: string;
  isDragActive: boolean;
  onFrameSelect: (index: number) => void;
  onImageUpload: (imageUrl: string) => void;
  getRootProps: () => any;
  getInputProps: () => any;
}

export const EnhancedShowcaseView: React.FC<EnhancedShowcaseViewProps> = ({
  frames,
  currentIndex,
  uploadedImage,
  isDragActive,
  onFrameSelect,
  onImageUpload,
  getRootProps,
  getInputProps
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [recentUploads, setRecentUploads] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const categories = ['all', 'minimal', 'classic', 'modern', 'fun'];
  const currentFrame = frames[currentIndex];

  const filteredFrames = frames.filter(frame => {
    const matchesSearch = frame.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         frame.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || frame.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onImageUpload(url);
      setRecentUploads(prev => [url, ...prev.slice(0, 4)]);
    }
  };

  const toggleFavorite = (frameId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(frameId)) {
        newFavorites.delete(frameId);
      } else {
        newFavorites.add(frameId);
      }
      return newFavorites;
    });
  };

  const getFrameBorderRadius = (frame: MinimalistFrame) => {
    if (frame.borderStyle.includes('border-0') || 
        frame.borderStyle.includes('border-2') || 
        frame.borderStyle.includes('border-4')) {
      return 'rounded-none';
    }
    return 'rounded-lg';
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="grid grid-cols-5 gap-6 h-full">
        
        {/* Enhanced Large Preview - 40% width (2 of 5 columns) */}
        <div className="col-span-2 flex flex-col">
          <div className="flex-1 flex items-center justify-center relative group" {...getRootProps()}>
            <input {...getInputProps()} />
            
            {/* Main Preview */}
            <div className="relative w-full max-w-md">
              <FramePreview
                frame={currentFrame}
                imageUrl={uploadedImage}
                size="large"
                isDragActive={isDragActive}
              />
              
              {/* Floating Action Buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="sm" variant="outline" className="bg-black/60 border-white/20 text-white hover:bg-black/80">
                  <Crop className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" className="bg-black/60 border-white/20 text-white hover:bg-black/80">
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" className="bg-black/60 border-white/20 text-white hover:bg-black/80">
                  <Sparkles className="w-4 h-4" />
                </Button>
              </div>

              {/* Frame Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <h3 className="text-white font-medium text-sm">{currentFrame.name}</h3>
                <p className="text-gray-300 text-xs">{currentFrame.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">{currentFrame.category}</Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleFavorite(currentFrame.id)}
                    className="p-1 h-auto"
                  >
                    <Heart className={`w-3 h-3 ${favorites.has(currentFrame.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                  </Button>
                </div>
              </div>

              {/* Navigation Arrows */}
              <Button
                onClick={() => onFrameSelect(currentIndex === 0 ? frames.length - 1 : currentIndex - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 border border-white/20 text-white hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity"
                size="sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => onFrameSelect((currentIndex + 1) % frames.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 border border-white/20 text-white hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity"
                size="sm"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Try Another Image Button */}
            {uploadedImage && (
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-crd-green hover:bg-crd-green/90 text-black"
                size="sm"
              >
                Try Another Image
              </Button>
            )}
          </div>
        </div>

        {/* Enhanced Frame Selection Panel - 35% width (2 of 5 columns) */}
        <div className="col-span-2 bg-black/20 backdrop-blur-sm rounded-2xl p-4 flex flex-col">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-white text-lg font-semibold mb-2">Frame Gallery</h3>
            
            {/* Search and Filters */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search frames..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              
              {/* Category Tabs */}
              <div className="flex gap-1">
                {categories.map(category => (
                  <Button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    className={`flex-1 text-xs ${
                      selectedCategory === category 
                        ? 'bg-crd-green text-black' 
                        : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Navigation Strip */}
          <div className="mb-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {frames.slice(0, 8).map((frame, index) => (
                <button
                  key={frame.id}
                  onClick={() => onFrameSelect(index)}
                  className={`flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentIndex 
                      ? 'border-crd-green scale-110 shadow-lg' 
                      : 'border-gray-600 hover:border-gray-400'
                  }`}
                >
                  <FramePreview frame={frame} imageUrl={uploadedImage} size="small" />
                </button>
              ))}
            </div>
          </div>

          {/* Frame Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 gap-3">
              {filteredFrames.map((frame, index) => {
                const originalIndex = frames.findIndex(f => f.id === frame.id);
                return (
                  <div
                    key={frame.id}
                    className={`relative cursor-pointer transition-all duration-200 ${
                      originalIndex === currentIndex
                        ? 'ring-2 ring-crd-green scale-105 z-10'
                        : 'hover:scale-102 hover:ring-1 hover:ring-gray-500'
                    } ${getFrameBorderRadius(frame)} overflow-hidden bg-gray-800/30 backdrop-blur-sm`}
                    onClick={() => onFrameSelect(originalIndex)}
                  >
                    <div className="aspect-[5/7]">
                      <FramePreview
                        frame={frame}
                        imageUrl={uploadedImage}
                        size="medium"
                      />
                    </div>
                    
                    {/* Frame Details */}
                    <div className="p-2 bg-gray-900/90">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white text-xs font-medium truncate">{frame.name}</h4>
                          <p className="text-gray-400 text-xs truncate">{frame.category}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {favorites.has(frame.id) && (
                            <Heart className="w-3 h-3 fill-red-500 text-red-500" />
                          )}
                          <Zap className="w-3 h-3 text-yellow-500" />
                        </div>
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {originalIndex === currentIndex && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-crd-green rounded-full flex items-center justify-center">
                        <span className="text-black text-xs font-bold">✓</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Enhanced Assets Panel - 25% width (1 of 5 columns) */}
        <div className="col-span-1 bg-black/20 backdrop-blur-sm rounded-2xl p-4 flex flex-col">
          <div className="mb-4">
            <h3 className="text-white text-lg font-semibold mb-2">Assets</h3>
            <p className="text-gray-400 text-sm">Upload and manage your images</p>
          </div>

          {/* Upload Area */}
          <div
            className="border-2 border-dashed border-gray-600 hover:border-crd-green rounded-xl p-4 text-center cursor-pointer transition-colors mb-4"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-crd-green/20 flex items-center justify-center">
              <Eye className="w-4 h-4 text-crd-green" />
            </div>
            <p className="text-gray-300 text-sm">Upload New Image</p>
            <p className="text-gray-500 text-xs mt-1">JPG, PNG up to 10MB</p>
          </div>

          {/* Recent Uploads */}
          {recentUploads.length > 0 && (
            <div className="mb-4">
              <h4 className="text-white text-sm font-medium mb-2">Recent Uploads</h4>
              <div className="space-y-2">
                {recentUploads.map((url, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors"
                    onClick={() => onImageUpload(url)}
                  >
                    <img src={url} alt="Recent upload" className="w-8 h-8 rounded object-cover" />
                    <span className="text-gray-300 text-xs flex-1">Upload {index + 1}</span>
                    {uploadedImage === url && (
                      <div className="w-2 h-2 bg-crd-green rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Image Tools */}
          {uploadedImage && (
            <div className="mb-4">
              <h4 className="text-white text-sm font-medium mb-2">Quick Tools</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Crop className="w-3 h-3 mr-1" />
                  Crop
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Rotate
                </Button>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="mt-auto pt-4 border-t border-gray-600">
            <div className="text-xs text-gray-400 space-y-1">
              <div className="flex justify-between">
                <span>Total Frames:</span>
                <span>{frames.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Favorites:</span>
                <span>{favorites.size}</span>
              </div>
              <div className="flex justify-between">
                <span>Current:</span>
                <span>{currentIndex + 1}/{frames.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};
