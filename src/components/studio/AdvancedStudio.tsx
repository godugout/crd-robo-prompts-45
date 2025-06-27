
import React, { useState } from 'react';
import { ArrowLeft, Monitor, Video, Camera, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnvironmentControls } from './controls/EnvironmentControls';
import { MaterialControls } from './controls/MaterialControls';
import { LightingControls } from './controls/LightingControls';
import { AnimationControls } from './controls/AnimationControls';
import { ExportControls } from './controls/ExportControls';
import { Advanced3DViewer } from './viewers/Advanced3DViewer';

const SAMPLE_CARDS = [
  {
    id: 'sample1',
    name: 'Holographic Dragon',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
    type: 'Fantasy'
  },
  {
    id: 'sample2',
    name: 'Chrome Warrior',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=600&fit=crop',
    type: 'Sci-Fi'
  },
  {
    id: 'sample3',
    name: 'Crystal Mage',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop',
    type: 'Magic'
  }
];

export const AdvancedStudio: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState(SAMPLE_CARDS[0]);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('3d');
  const [activePanel, setActivePanel] = useState('environment');

  return (
    <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-[#0a0a0b] to-[#131316]">
      {/* Header */}
      <div className="border-b border-gray-800">
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
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === '2d' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('2d')}
                className="text-white"
              >
                <Monitor className="w-4 h-4 mr-2" />
                2D
              </Button>
              <Button
                variant={viewMode === '3d' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('3d')}
                className="text-white"
              >
                <Video className="w-4 h-4 mr-2" />
                3D
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Card Selection */}
        <div className="w-64 border-r border-gray-800 bg-gray-900/50 p-4">
          <h3 className="text-white font-semibold mb-4">Sample Cards</h3>
          <div className="space-y-3">
            {SAMPLE_CARDS.map((card) => (
              <Card
                key={card.id}
                className={`p-3 cursor-pointer transition-all ${
                  selectedCard.id === card.id
                    ? 'border-crd-green bg-crd-green/10'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
                onClick={() => setSelectedCard(card)}
              >
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full h-20 object-cover rounded mb-2"
                />
                <div className="text-white text-sm font-medium">{card.name}</div>
                <div className="text-gray-400 text-xs">{card.type}</div>
              </Card>
            ))}
          </div>

          <Button className="w-full mt-4 bg-crd-green hover:bg-crd-green/90 text-black">
            <Camera className="w-4 h-4 mr-2" />
            Upload Your Card
          </Button>
        </div>

        {/* Center - 3D Viewer */}
        <div className="flex-1 relative">
          <Advanced3DViewer
            card={selectedCard}
            viewMode={viewMode}
          />
        </div>

        {/* Right Panel - Controls */}
        <div className="w-80 border-l border-gray-800 bg-gray-900/50">
          <Tabs value={activePanel} onValueChange={setActivePanel} className="h-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800">
              <TabsTrigger value="environment" className="text-xs">Env</TabsTrigger>
              <TabsTrigger value="materials" className="text-xs">Materials</TabsTrigger>
              <TabsTrigger value="lighting" className="text-xs">Lighting</TabsTrigger>
              <TabsTrigger value="animation" className="text-xs">Animation</TabsTrigger>
            </TabsList>
            
            <div className="p-4 h-[calc(100%-48px)] overflow-y-auto">
              <TabsContent value="environment" className="mt-0">
                <EnvironmentControls />
              </TabsContent>
              
              <TabsContent value="materials" className="mt-0">
                <MaterialControls />
              </TabsContent>
              
              <TabsContent value="lighting" className="mt-0">
                <LightingControls />
              </TabsContent>
              
              <TabsContent value="animation" className="mt-0">
                <AnimationControls />
              </TabsContent>
            </div>

            {/* Export Panel */}
            <div className="border-t border-gray-800 p-4">
              <ExportControls viewMode={viewMode} />
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
