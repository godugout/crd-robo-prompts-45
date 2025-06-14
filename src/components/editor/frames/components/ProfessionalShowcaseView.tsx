
import React, { useState, useRef } from 'react';
import { 
  Search, 
  Filter, 
  Heart, 
  Zap, 
  Eye, 
  RotateCcw, 
  Crop, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Settings,
  Download,
  Share2,
  Upload,
  Grid,
  Layers,
  Palette,
  Sliders,
  Image as ImageIcon,
  Target,
  Copy,
  Move3D
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { FramePreview } from './FramePreview';
import type { MinimalistFrame } from '../data/minimalistFrames';

interface ProfessionalShowcaseViewProps {
  frames: MinimalistFrame[];
  currentIndex: number;
  uploadedImage?: string;
  isDragActive: boolean;
  onFrameSelect: (index: number) => void;
  onImageUpload: (imageUrl: string) => void;
  getRootProps: () => any;
  getInputProps: () => any;
}

export const ProfessionalShowcaseView: React.FC<ProfessionalShowcaseViewProps> = ({
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
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [imageAdjustments, setImageAdjustments] = useState({
    brightness: [100],
    contrast: [100],
    saturation: [100],
    blur: [0],
    opacity: [100]
  });
  const [frameAdjustments, setFrameAdjustments] = useState({
    rotation: [0],
    scale: [100],
    offsetX: [0],
    offsetY: [0]
  });
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
    }
  };

  const updateImageAdjustment = (key: string, value: number[]) => {
    setImageAdjustments(prev => ({ ...prev, [key]: value }));
  };

  const updateFrameAdjustment = (key: string, value: number[]) => {
    setFrameAdjustments(prev => ({ ...prev, [key]: value }));
  };

  const resetAdjustments = () => {
    setImageAdjustments({
      brightness: [100],
      contrast: [100],
      saturation: [100],
      blur: [0],
      opacity: [100]
    });
    setFrameAdjustments({
      rotation: [0],
      scale: [100],
      offsetX: [0],
      offsetY: [0]
    });
  };

  return (
    <div className="w-full h-full bg-gray-900 text-white">
      {/* Top Toolbar */}
      <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium">Card Studio Pro</span>
          </div>
          <div className="h-4 w-px bg-gray-600" />
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Frame: {currentFrame.name}</span>
            <span>•</span>
            <span>{currentIndex + 1} of {frames.length}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
            <Download className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white" onClick={() => setShowAdvanced(!showAdvanced)}>
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100%-3rem)]">
        {/* Left Panel - Frame Selection */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
          {/* Search and Filters */}
          <div className="p-4 border-b border-gray-700">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search frames..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex gap-1">
              {categories.map(category => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? 'default' : 'ghost'}
                  size="sm"
                  className={`flex-1 text-xs ${
                    selectedCategory === category 
                      ? 'bg-purple-600 text-white hover:bg-purple-700' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Frame Strip */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {frames.slice(0, 6).map((frame, index) => (
                <button
                  key={frame.id}
                  onClick={() => onFrameSelect(index)}
                  className={`flex-shrink-0 w-12 h-16 rounded overflow-hidden border-2 transition-all ${
                    index === currentIndex 
                      ? 'border-purple-500 scale-110' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <FramePreview frame={frame} imageUrl={uploadedImage} size="small" />
                </button>
              ))}
            </div>
          </div>

          {/* Frame Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 gap-3">
              {filteredFrames.map((frame, index) => {
                const originalIndex = frames.findIndex(f => f.id === frame.id);
                return (
                  <div
                    key={frame.id}
                    className={`relative cursor-pointer transition-all duration-200 rounded-lg overflow-hidden ${
                      originalIndex === currentIndex
                        ? 'ring-2 ring-purple-500 scale-105'
                        : 'hover:scale-102 hover:ring-1 hover:ring-gray-500'
                    } bg-gray-700`}
                    onClick={() => onFrameSelect(originalIndex)}
                  >
                    <div className="aspect-[5/7]">
                      <FramePreview frame={frame} imageUrl={uploadedImage} size="medium" />
                    </div>
                    <div className="p-2 bg-gray-800">
                      <h4 className="text-white text-xs font-medium truncate">{frame.name}</h4>
                      <p className="text-gray-400 text-xs truncate">{frame.category}</p>
                    </div>
                    {originalIndex === currentIndex && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center Panel - Main Preview */}
        <div className="flex-1 flex flex-col">
          {/* Canvas Area */}
          <div className="flex-1 flex items-center justify-center bg-gray-850 relative" {...getRootProps()}>
            <input {...getInputProps()} />
            
            {/* Main Preview */}
            <div className="relative w-full max-w-lg">
              <FramePreview
                frame={currentFrame}
                imageUrl={uploadedImage}
                size="large"
                isDragActive={isDragActive}
              />
              
              {/* Navigation Arrows */}
              <Button
                onClick={() => onFrameSelect(currentIndex === 0 ? frames.length - 1 : currentIndex - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/20 text-white hover:bg-black/80"
                size="sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => onFrameSelect((currentIndex + 1) % frames.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/20 text-white hover:bg-black/80"
                size="sm"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>

              {/* Floating Tools */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button size="sm" variant="ghost" className="bg-black/60 text-white hover:bg-black/80">
                  <Move3D className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="bg-black/60 text-white hover:bg-black/80">
                  <Crop className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="bg-black/60 text-white hover:bg-black/80">
                  <Target className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Upload Button */}
            {!uploadedImage && (
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
            )}
          </div>

          {/* Bottom Info Bar */}
          <div className="h-12 bg-gray-800 border-t border-gray-700 flex items-center justify-between px-4">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>Resolution: 1024×1024</span>
              <span>•</span>
              <span>Format: PNG</span>
              <span>•</span>
              <span>Quality: High</span>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel - Advanced Controls */}
        {showAdvanced && (
          <div className="w-80 bg-gray-800 border-l border-gray-700">
            <Tabs defaultValue="image" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3 bg-gray-700 m-2">
                <TabsTrigger value="image" className="data-[state=active]:bg-purple-600">
                  <ImageIcon className="w-4 h-4 mr-1" />
                  Image
                </TabsTrigger>
                <TabsTrigger value="frame" className="data-[state=active]:bg-purple-600">
                  <Layers className="w-4 h-4 mr-1" />
                  Frame
                </TabsTrigger>
                <TabsTrigger value="effects" className="data-[state=active]:bg-purple-600">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Effects
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto p-4">
                <TabsContent value="image" className="space-y-4 mt-0">
                  <Card className="bg-gray-700 border-gray-600">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-sm">Image Adjustments</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(imageAdjustments).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <label className="text-gray-300 capitalize">{key}</label>
                            <span className="text-white">{value[0]}{key === 'blur' ? 'px' : '%'}</span>
                          </div>
                          <Slider
                            value={value}
                            onValueChange={(val) => updateImageAdjustment(key, val)}
                            min={key === 'blur' ? 0 : key === 'opacity' ? 0 : 0}
                            max={key === 'blur' ? 20 : key === 'opacity' ? 100 : 200}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Button onClick={resetAdjustments} variant="outline" size="sm" className="w-full border-gray-600 text-gray-300">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset All
                  </Button>
                </TabsContent>

                <TabsContent value="frame" className="space-y-4 mt-0">
                  <Card className="bg-gray-700 border-gray-600">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-sm">Frame Transform</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(frameAdjustments).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <label className="text-gray-300 capitalize">{key}</label>
                            <span className="text-white">
                              {value[0]}{key === 'rotation' ? '°' : key === 'scale' ? '%' : 'px'}
                            </span>
                          </div>
                          <Slider
                            value={value}
                            onValueChange={(val) => updateFrameAdjustment(key, val)}
                            min={key === 'rotation' ? -180 : key === 'scale' ? 50 : -100}
                            max={key === 'rotation' ? 180 : key === 'scale' ? 200 : 100}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="effects" className="space-y-4 mt-0">
                  <Card className="bg-gray-700 border-gray-600">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-sm">Visual Effects</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-center text-gray-400 py-8">
                        <Sparkles className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Advanced effects</p>
                        <p className="text-xs">Coming soon</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        )}
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
