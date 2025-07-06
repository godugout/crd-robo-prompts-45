import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EnhancedCardViewer } from '@/components/viewer/EnhancedCardViewer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, RotateCcw, Sparkles, Gem, Zap } from 'lucide-react';
import type { CardData } from '@/types/card';

// Demo card data
const demoCards: CardData[] = [
  {
    id: '1',
    title: 'Legendary Phoenix',
    image_url: '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png',
    rarity: 'legendary',
    tags: [],
    design_metadata: {},
    visibility: 'public',
    creator_attribution: {},
    publishing_options: {
      marketplace_listing: false,
      crd_catalog_inclusion: false,
      print_available: false,
      pricing: { currency: 'USD' }
    },
    is_public: true
  },
  {
    id: '2', 
    title: 'Crystal Dragon',
    image_url: '/lovable-uploads/50e48a4f-d7f6-46df-b6bb-93287588484d.png',
    rarity: 'epic',
    tags: [],
    design_metadata: {},
    visibility: 'public',
    creator_attribution: {},
    publishing_options: {
      marketplace_listing: false,
      crd_catalog_inclusion: false,
      print_available: false,
      pricing: { currency: 'USD' }
    },
    is_public: true
  },
  {
    id: '3',
    title: 'Golden Warrior',
    image_url: '/lovable-uploads/8aec29c2-2d7a-42a1-8fc8-4a27a7964d41.png',
    rarity: 'rare',
    tags: [],
    design_metadata: {},
    visibility: 'public',
    creator_attribution: {},
    publishing_options: {
      marketplace_listing: false,
      crd_catalog_inclusion: false,
      print_available: false,
      pricing: { currency: 'USD' }
    },
    is_public: true
  }
];

const frameTypes = [
  { key: 'THIN_BORDER', name: 'Thin Border', description: 'Classic thin frame' },
  { key: 'THICK_BORDER', name: 'Thick Border', description: 'Premium thick frame' },
  { key: 'GRADED_CASE', name: 'Graded Case', description: 'Professional grading case' },
  { key: 'PREMIUM_CASE', name: 'Premium Case', description: 'Ultra premium display case' }
];

const effectPresets = [
  {
    name: 'Holographic',
    icon: Sparkles,
    effects: { holographic: { intensity: 85 } },
    description: 'Rainbow shifting patterns'
  },
  {
    name: 'Chrome',
    icon: Gem,
    effects: { chrome: { intensity: 90 } },
    description: 'Mirror-like metallic finish'
  },
  {
    name: 'Gold Foil',
    icon: Zap,
    effects: { gold: { intensity: 80 } },
    description: 'Luxurious gold metallic'
  },
  {
    name: 'Crystal',
    icon: Gem,
    effects: { crystal: { intensity: 75 } },
    description: 'Translucent crystal effect'
  },
  {
    name: 'Prizm Combo',
    icon: Sparkles,
    effects: { 
      holographic: { intensity: 60 },
      prizm: { intensity: 70 },
      chrome: { intensity: 40 }
    },
    description: 'Multi-effect combination'
  }
];

export const InteractiveDemo: React.FC = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedFrame, setSelectedFrame] = useState('GRADED_CASE');
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [effectValues, setEffectValues] = useState<Record<string, any>>({});
  const [demoProgress, setDemoProgress] = useState(0);

  const currentCard = demoCards[currentCardIndex];

  // Auto-play demo
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setDemoProgress(prev => {
        const newProgress = (prev + 1) % 100;
        
        // Change effects and frames at different intervals
        if (newProgress % 25 === 0) {
          const presetIndex = Math.floor(newProgress / 25);
          const preset = effectPresets[presetIndex % effectPresets.length];
          setEffectValues(preset.effects);
        }
        
        if (newProgress % 50 === 0) {
          setSelectedFrame(frameTypes[Math.floor(newProgress / 50) % frameTypes.length].key);
        }
        
        if (newProgress === 0) {
          setCurrentCardIndex(prev => (prev + 1) % demoCards.length);
        }
        
        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const handleEffectChange = (effectName: string, properties: any) => {
    setEffectValues(prev => ({
      ...prev,
      [effectName]: properties
    }));
  };

  const applyPreset = (preset: typeof effectPresets[0]) => {
    setEffectValues(preset.effects);
  };

  const resetDemo = () => {
    setEffectValues({});
    setSelectedFrame('GRADED_CASE');
    setCurrentCardIndex(0);
    setDemoProgress(0);
    setIsAutoPlay(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Interactive Card Demo</h1>
              <p className="text-muted-foreground mt-1">
                Experience photorealistic effects and advanced framing in real-time
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="px-3 py-1">
                {isAutoPlay ? 'Auto-Playing' : 'Manual Control'}
              </Badge>
              
              <Button
                variant={isAutoPlay ? "destructive" : "default"}
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className="gap-2"
              >
                {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isAutoPlay ? 'Pause' : 'Auto Play'}
              </Button>
              
              <Button variant="outline" onClick={resetDemo} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </div>
          
          {/* Progress bar for auto-play */}
          {isAutoPlay && (
            <div className="mt-3">
              <div className="w-full bg-secondary/30 rounded-full h-2">
                <div 
                  className="h-2 bg-primary rounded-full transition-all duration-200"
                  style={{ width: `${demoProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card Viewer - Main Display */}
          <div className="lg:col-span-2">
            <Card className="border-border bg-card backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-foreground">
                  <span>3D Card Viewer</span>
                  <Badge variant="outline" className="text-foreground border-border bg-background">
                    {currentCard.title} - <span className="capitalize">{currentCard.rarity}</span>
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[4/3] bg-gradient-to-br from-background/80 to-secondary/20 rounded-lg overflow-hidden border border-border/20">
                  {/* Simple 3D Card Display using Canvas */}
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-background via-secondary/10 to-background">
                    <div className="relative max-w-xs transform transition-transform hover:scale-105">
                      {/* Card Container with Frame Effect */}
                      <div className={`relative ${
                        selectedFrame === 'GRADED_CASE' ? 'p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl' :
                        selectedFrame === 'PREMIUM_CASE' ? 'p-6 bg-gradient-to-br from-gold-800/20 to-gold-900/20 rounded-lg shadow-xl border-2 border-yellow-500/30' :
                        selectedFrame === 'THICK_BORDER' ? 'p-4 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg shadow-lg' :
                        'p-2 bg-gradient-to-br from-gray-600 to-gray-700 rounded shadow-md'
                      }`}>
                        {/* Card Image */}
                        <div className="relative">
                          <img
                            src={currentCard.image_url}
                            alt={currentCard.title}
                            className="w-full h-auto rounded-lg shadow-lg"
                            style={{
                              filter: `
                                ${effectValues.holographic?.intensity ? `hue-rotate(${effectValues.holographic.intensity * 3.6}deg) saturate(${1 + effectValues.holographic.intensity / 100})` : ''}
                                ${effectValues.chrome?.intensity ? `brightness(${1 + effectValues.chrome.intensity / 200}) contrast(${1 + effectValues.chrome.intensity / 100})` : ''}
                                ${effectValues.gold?.intensity ? `sepia(${effectValues.gold.intensity / 2}%) saturate(${1 + effectValues.gold.intensity / 50}) hue-rotate(30deg)` : ''}
                              `.trim()
                            }}
                          />
                          
                          {/* Effect Overlays */}
                          {effectValues.holographic?.intensity > 0 && (
                            <div 
                              className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-green-500/20 rounded-lg mix-blend-overlay"
                              style={{ opacity: effectValues.holographic.intensity / 100 }}
                            />
                          )}
                          
                          {effectValues.chrome?.intensity > 0 && (
                            <div 
                              className="absolute inset-0 bg-gradient-to-br from-gray-300/30 via-white/20 to-gray-400/30 rounded-lg mix-blend-hard-light"
                              style={{ opacity: effectValues.chrome.intensity / 100 }}
                            />
                          )}
                          
                          {effectValues.gold?.intensity > 0 && (
                            <div 
                              className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 via-yellow-300/20 to-yellow-600/30 rounded-lg mix-blend-multiply"
                              style={{ opacity: effectValues.gold.intensity / 100 }}
                            />
                          )}
                        </div>
                        
                        {/* Frame Labels */}
                        {selectedFrame === 'GRADED_CASE' && (
                          <div className="absolute top-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                            PSA 10
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Card Selection */}
            <Card className="border-border bg-card backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-foreground">Card Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {demoCards.map((card, index) => (
                    <Button
                      key={card.id}
                      variant={index === currentCardIndex ? "default" : "outline"}
                      onClick={() => setCurrentCardIndex(index)}
                      className="justify-start text-left h-auto p-3"
                    >
                      <div>
                        <div className="font-medium text-foreground">{card.title}</div>
                        <div className="text-xs text-muted-foreground capitalize">{card.rarity}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Frame Selection */}
            <Card className="border-border bg-card backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-foreground">Frame Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {frameTypes.map((frame) => (
                    <Button
                      key={frame.key}
                      variant={selectedFrame === frame.key ? "default" : "outline"}
                      onClick={() => setSelectedFrame(frame.key)}
                      className="w-full justify-start text-left h-auto p-3"
                    >
                      <div>
                        <div className="font-medium text-foreground">{frame.name}</div>
                        <div className="text-xs text-muted-foreground">{frame.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Effect Presets */}
            <Card className="border-border bg-card backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-foreground">Effect Presets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {effectPresets.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      onClick={() => applyPreset(preset)}
                      className="w-full justify-start text-left gap-3 h-auto p-3 hover:bg-accent"
                    >
                      <preset.icon className="w-4 h-4 text-primary" />
                      <div>
                        <div className="font-medium text-foreground">{preset.name}</div>
                        <div className="text-xs text-muted-foreground">{preset.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Custom Effect Controls */}
            <Card className="border-border bg-card backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-foreground">Custom Effects</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="holographic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-muted">
                    <TabsTrigger value="holographic" className="text-foreground">Holographic</TabsTrigger>
                    <TabsTrigger value="metallic" className="text-foreground">Metallic</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="holographic" className="space-y-4 mt-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">Holographic Intensity</label>
                      <Slider
                        value={[effectValues.holographic?.intensity || 0]}
                        onValueChange={([value]) => handleEffectChange('holographic', { intensity: value })}
                        max={100}
                        step={1}
                        className="mt-2"
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        Current: {effectValues.holographic?.intensity || 0}%
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="metallic" className="space-y-4 mt-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">Chrome Intensity</label>
                      <Slider
                        value={[effectValues.chrome?.intensity || 0]}
                        onValueChange={([value]) => handleEffectChange('chrome', { intensity: value })}
                        max={100}
                        step={1}
                        className="mt-2"
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        Current: {effectValues.chrome?.intensity || 0}%
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Gold Intensity</label>
                      <Slider
                        value={[effectValues.gold?.intensity || 0]}
                        onValueChange={([value]) => handleEffectChange('gold', { intensity: value })}
                        max={100}
                        step={1}
                        className="mt-2"
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        Current: {effectValues.gold?.intensity || 0}%
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feature Showcase */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">System Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Sparkles className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Photorealistic Effects</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced shader-based effects with realistic material properties
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Gem className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Multi-Layer System</h3>
                <p className="text-sm text-muted-foreground">
                  Complex layering with proper z-ordering and blending modes
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Zap className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Frame Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Professional grading cases with realistic depth and materials
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Play className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Real-Time Control</h3>
                <p className="text-sm text-muted-foreground">
                  Interactive adjustments with immediate visual feedback
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};