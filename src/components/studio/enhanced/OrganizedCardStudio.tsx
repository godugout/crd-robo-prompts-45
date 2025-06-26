
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Upload, 
  Image, 
  Sparkles, 
  Palette, 
  Settings,
  Play,
  Pause,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Save,
  Share2
} from 'lucide-react';
import { toast } from 'sonner';
import { Enhanced3DCardRenderer } from '@/components/3d/Enhanced3DCardRenderer';
import { Live3DPreview } from '@/components/studio/Live3DPreview';
import { EnhancedUploadZone } from './EnhancedUploadZone';

export const OrganizedCardStudio: React.FC = () => {
  // Core state
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [selectedFrame, setSelectedFrame] = useState<string>('classic');
  const [currentPhoto, setCurrentPhoto] = useState<File | null>(null);
  
  // 3D Effects state
  const [effects, setEffects] = useState({
    holographic: 0,
    metallic: 0.2,
    chrome: 0,
    particles: false
  });
  
  // Card data
  const [cardData, setCardData] = useState({
    title: 'Custom Trading Card',
    rarity: 'Rare',
    description: 'Created with Card Studio'
  });

  // Default images for immediate preview
  const defaultImages = {
    front: '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png',
    back: '/lovable-uploads/b3f6335f-9e0a-4a64-a665-15d04f456d50.png'
  };

  // Set default image on mount
  useEffect(() => {
    if (!uploadedImage) {
      setUploadedImage(defaultImages.front);
    }
  }, []);

  const handleImageUpload = (imageUrl: string) => {
    console.log('OrganizedCardStudio: Image uploaded:', imageUrl);
    setUploadedImage(imageUrl);
    toast.success('Image uploaded! Preview updated automatically.');
  };

  const handleEffectChange = (effectName: string, value: number | boolean) => {
    setEffects(prev => ({
      ...prev,
      [effectName]: value
    }));
  };

  const frames = [
    { id: 'classic', name: 'Classic', preview: '/lovable-uploads/3adf916a-0f96-4c37-a1bb-72235f0a299f.png' },
    { id: 'modern', name: 'Modern', preview: '/lovable-uploads/49b61ce3-8589-45b1-adb7-2594a81ab97b.png' },
    { id: 'vintage', name: 'Vintage', preview: '/lovable-uploads/50e48a4f-d7f6-46df-b6bb-93287588484d.png' },
    { id: 'holographic', name: 'Holographic', preview: '/lovable-uploads/95a44939-2aae-4c52-94be-6e6d9a5d0853.png' }
  ];

  const handleSaveCard = () => {
    toast.success('Card saved to your collection!');
  };

  const handleShareCard = () => {
    toast.success('Card shared successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Card Studio</h1>
              <p className="text-gray-400 text-sm">Create premium 3D trading cards</p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={handleSaveCard}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Card
              </Button>
              <Button 
                onClick={handleShareCard}
                className="bg-crd-green hover:bg-crd-green/90 text-black font-medium"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-1 space-y-6">
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-black/40">
                <TabsTrigger value="upload" className="text-white">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </TabsTrigger>
                <TabsTrigger value="frames" className="text-white">
                  <Image className="w-4 h-4 mr-2" />
                  Frames
                </TabsTrigger>
                <TabsTrigger value="effects" className="text-white">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Effects
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-4">
                <Card className="bg-black/40 border-white/20 p-4">
                  <EnhancedUploadZone
                    onImageUpload={handleImageUpload}
                    uploadedImage={uploadedImage}
                  />
                </Card>
              </TabsContent>

              <TabsContent value="frames" className="space-y-4">
                <Card className="bg-black/40 border-white/20 p-4">
                  <h3 className="text-white font-medium mb-4">Card Frames</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {frames.map((frame) => (
                      <button
                        key={frame.id}
                        onClick={() => setSelectedFrame(frame.id)}
                        className={`relative p-3 rounded-lg border-2 transition-all ${
                          selectedFrame === frame.id
                            ? 'border-crd-green bg-crd-green/10'
                            : 'border-white/20 hover:border-white/40'
                        }`}
                      >
                        <div className="aspect-[3/4] bg-gray-800 rounded mb-2 overflow-hidden">
                          <img 
                            src={frame.preview} 
                            alt={frame.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-white text-xs">{frame.name}</span>
                        {selectedFrame === frame.id && (
                          <Badge className="absolute -top-2 -right-2 bg-crd-green text-black text-xs">
                            Active
                          </Badge>
                        )}
                      </button>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="effects" className="space-y-4">
                <Card className="bg-black/40 border-white/20 p-4">
                  <h3 className="text-white font-medium mb-4">3D Effects</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-white text-sm">Holographic</label>
                        <span className="text-crd-green text-xs">
                          {Math.round(effects.holographic * 100)}%
                        </span>
                      </div>
                      <Slider
                        value={[effects.holographic]}
                        onValueChange={([value]) => handleEffectChange('holographic', value)}
                        max={1}
                        step={0.1}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-white text-sm">Metallic</label>
                        <span className="text-crd-green text-xs">
                          {Math.round(effects.metallic * 100)}%
                        </span>
                      </div>
                      <Slider
                        value={[effects.metallic]}
                        onValueChange={([value]) => handleEffectChange('metallic', value)}
                        max={1}
                        step={0.1}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-white text-sm">Chrome</label>
                        <span className="text-crd-green text-xs">
                          {Math.round(effects.chrome * 100)}%
                        </span>
                      </div>
                      <Slider
                        value={[effects.chrome]}
                        onValueChange={([value]) => handleEffectChange('chrome', value)}
                        max={1}
                        step={0.1}
                        className="w-full"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-white text-sm">Particle Effects</label>
                      <Switch
                        checked={effects.particles}
                        onCheckedChange={(checked) => handleEffectChange('particles', checked)}
                      />
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Center - 3D Preview */}
          <div className="lg:col-span-2">
            <Card className="bg-black/40 border-white/20 h-[600px]">
              <Live3DPreview
                frontImage={uploadedImage}
                backImage={defaultImages.back}
                selectedFrame={selectedFrame}
                effects={effects}
                cardData={cardData}
                className="w-full h-full"
              />
            </Card>
          </div>
        </div>

        {/* Card Details */}
        <div className="mt-8">
          <Card className="bg-black/40 border-white/20 p-6">
            <h3 className="text-white font-medium mb-4">Card Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-white text-sm mb-2 block">Card Title</label>
                <input
                  type="text"
                  value={cardData.title}
                  onChange={(e) => setCardData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-black/60 border border-white/20 rounded-lg px-3 py-2 text-white"
                  placeholder="Enter card title"
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Rarity</label>
                <select
                  value={cardData.rarity}
                  onChange={(e) => setCardData(prev => ({ ...prev, rarity: e.target.value }))}
                  className="w-full bg-black/60 border border-white/20 rounded-lg px-3 py-2 text-white"
                >
                  <option value="Common">Common</option>
                  <option value="Uncommon">Uncommon</option>
                  <option value="Rare">Rare</option>
                  <option value="Epic">Epic</option>
                  <option value="Legendary">Legendary</option>
                </select>
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Description</label>
                <input
                  type="text"
                  value={cardData.description}
                  onChange={(e) => setCardData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-black/60 border border-white/20 rounded-lg px-3 py-2 text-white"
                  placeholder="Card description"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
