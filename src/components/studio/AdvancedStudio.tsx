
import React, { useState } from 'react';
import { ArrowLeft, Monitor, Video, Camera, Settings, Layers, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AdvancedStudioProvider, useAdvancedStudio } from '@/contexts/AdvancedStudioContext';
import { EnhancedEnvironmentControls } from './controls/EnhancedEnvironmentControls';
import { EnhancedMaterialControls } from './controls/EnhancedMaterialControls';
import { EnhancedLightingControls } from './controls/EnhancedLightingControls';
import { AnimationControls } from './controls/AnimationControls';
import { ExportControls } from './controls/ExportControls';
import { Professional3DViewer } from './viewers/Professional3DViewer';
import { EffectPanel } from './effects/EffectPanel';

const SAMPLE_CARDS = [
  {
    id: 'sample1',
    name: 'Holographic Dragon',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
    type: 'Fantasy',
    rarity: 'legendary'
  },
  {
    id: 'sample2',
    name: 'Chrome Warrior',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=600&fit=crop',
    type: 'Sci-Fi',
    rarity: 'epic'
  },
  {
    id: 'sample3',
    name: 'Crystal Mage',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop',
    type: 'Magic',
    rarity: 'rare'
  },
  {
    id: 'sample4',
    name: 'Neon Assassin',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=600&fit=crop',
    type: 'Cyberpunk',
    rarity: 'uncommon'
  }
];

const StudioContent: React.FC = () => {
  const { state, setSelectedCard, setViewMode, addEffectLayer, updateEffectLayer, removeEffectLayer } = useAdvancedStudio();
  const [activePanel, setActivePanel] = useState('environment');
  const [showEffectPanel, setShowEffectPanel] = useState(false);

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'bg-gray-500',
      uncommon: 'bg-green-500',
      rare: 'bg-blue-500',
      epic: 'bg-purple-500',
      legendary: 'bg-orange-500'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-[#0a0a0b] to-[#131316]">
      {/* Enhanced Header */}
      <div className="border-b border-gray-800 bg-black/30 backdrop-blur-sm">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => window.location.href = '/'}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-white">Advanced Studio</h1>
                <p className="text-sm text-gray-400">Professional 3D card presentation and showcase</p>
              </div>
            </div>
            
            {/* Enhanced View Mode Toggle */}
            <div className="flex items-center gap-3">
              <Badge className="bg-crd-green/20 text-crd-green border-crd-green/50">
                {state.effectLayers.filter(l => l.enabled).length} Effects Active
              </Badge>
              <div className="flex items-center gap-2 bg-black/50 rounded-lg p-1">
                <Button
                  variant={state.viewMode === '2d' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('2d')}
                  className="text-white h-8"
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  2D
                </Button>
                <Button
                  variant={state.viewMode === '3d' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('3d')}
                  className="text-white h-8"
                >
                  <Video className="w-4 h-4 mr-2" />
                  3D
                </Button>
              </div>
              <Button
                variant={showEffectPanel ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowEffectPanel(!showEffectPanel)}
                className="text-white"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Effects
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Enhanced Left Panel - Card Selection */}
        <div className="w-72 border-r border-gray-800 bg-gray-900/50 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Sample Cards</h3>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
              {SAMPLE_CARDS.length}
            </Badge>
          </div>
          
          <div className="flex-1 space-y-3 overflow-y-auto">
            {SAMPLE_CARDS.map((card) => (
              <Card
                key={card.id}
                className={`p-3 cursor-pointer transition-all duration-300 ${
                  state.selectedCard?.id === card.id
                    ? 'border-crd-green bg-crd-green/10 shadow-lg shadow-crd-green/25'
                    : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'
                }`}
                onClick={() => setSelectedCard(card)}
              >
                <div className="relative">
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-full h-24 object-cover rounded mb-3"
                  />
                  <Badge className={`absolute top-2 right-2 ${getRarityColor(card.rarity)} text-white text-xs`}>
                    {card.rarity}
                  </Badge>
                </div>
                <div className="text-white text-sm font-medium mb-1">{card.name}</div>
                <div className="text-gray-400 text-xs flex items-center justify-between">
                  <span>{card.type}</span>
                  {state.selectedCard?.id === card.id && (
                    <span className="text-crd-green text-xs">• Selected</span>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <Button className="w-full mt-4 bg-crd-green hover:bg-crd-green/90 text-black">
            <Camera className="w-4 h-4 mr-2" />
            Upload Your Card
          </Button>
        </div>

        {/* Center - Enhanced 3D Viewer */}
        <div className="flex-1 relative">
          <Professional3DViewer />
        </div>

        {/* Right Panel - Enhanced Controls */}
        <div className="w-80 border-l border-gray-800 bg-gray-900/50 flex flex-col">
          <Tabs value={activePanel} onValueChange={setActivePanel} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800 m-4 mb-0">
              <TabsTrigger value="environment" className="text-xs">Env</TabsTrigger>
              <TabsTrigger value="materials" className="text-xs">Materials</TabsTrigger>
              <TabsTrigger value="lighting" className="text-xs">Lighting</TabsTrigger>
              <TabsTrigger value="animation" className="text-xs">Animation</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 p-4 overflow-y-auto">
              <TabsContent value="environment" className="mt-0">
                <EnhancedEnvironmentControls />
              </TabsContent>
              
              <TabsContent value="materials" className="mt-0">
                <EnhancedMaterialControls />
              </TabsContent>
              
              <TabsContent value="lighting" className="mt-0">
                <EnhancedLightingControls />
              </TabsContent>
              
              <TabsContent value="animation" className="mt-0">
                <AnimationControls />
              </TabsContent>
            </div>

            {/* Enhanced Export Panel */}
            <div className="border-t border-gray-800 p-4">
              <ExportControls viewMode={state.viewMode} />
            </div>
          </Tabs>
        </div>

        {/* Effect Panel Overlay */}
        {showEffectPanel && (
          <div className="absolute right-80 top-0 bottom-0 z-50">
            <EffectPanel
              effects={state.effectLayers}
              onEffectAdd={(type) => addEffectLayer({
                type,
                enabled: true,
                intensity: 50,
                opacity: 100,
                blendMode: 'normal',
                parameters: {}
              })}
              onEffectUpdate={updateEffectLayer}
              onEffectRemove={removeEffectLayer}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const AdvancedStudio: React.FC = () => {
  return (
    <AdvancedStudioProvider>
      <StudioContent />
    </AdvancedStudioProvider>
  );
};
