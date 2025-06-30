
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MetacollectionUniverse } from '../collections/MetacollectionUniverse';
import { ARCreationStudio } from './ARCreationStudio';
import { TimeLapseCreationSystem } from './TimeLapseCreationSystem';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, Smartphone, Clock, 
  Sparkles as GalaxyIcon, Infinity, Dna 
} from 'lucide-react';

// Mock data for demonstration
const mockCollections = [
  {
    id: '1',
    title: 'Epic Sports Legends',
    theme: 'sports' as const,
    cards: [
      { id: '1', title: 'Jordan Rookie', rarity: 'legendary', tags: ['basketball', 'rookie'], created_at: '2023-01-01' },
      { id: '2', title: 'Brady Championship', rarity: 'epic', tags: ['football', 'champion'], created_at: '2023-02-01' }
    ],
    dna: {
      creativity: 0.8,
      rarity: 0.9,
      theme_coherence: 0.85,
      artistic_style: ['vintage', 'championship'],
      color_palette: ['#ffd700', '#ff4444', '#0066cc'],
      interaction_patterns: ['synergy', 'rivalry'],
      evolution_potential: 0.7,
      genetic_stability: 0.8
    },
    environment: 'stadium',
    relationships: [
      { cardId1: '1', cardId2: '2', type: 'synergy' as const, strength: 0.8 }
    ]
  },
  {
    id: '2',
    title: 'Mystical Realm',
    theme: 'fantasy' as const,
    cards: [
      { id: '3', title: 'Dragon Lord', rarity: 'legendary', tags: ['dragon', 'fire'], created_at: '2023-03-01' },
      { id: '4', title: 'Ice Wizard', rarity: 'rare', tags: ['wizard', 'ice'], created_at: '2023-04-01' }
    ],
    dna: {
      creativity: 0.95,
      rarity: 0.7,
      theme_coherence: 0.9,
      artistic_style: ['magical', 'elemental'],
      color_palette: ['#a855f7', '#3b82f6', '#ef4444'],
      interaction_patterns: ['rivalry', 'evolution'],
      evolution_potential: 0.9,
      genetic_stability: 0.6
    },
    environment: 'magical_realm',
    relationships: [
      { cardId1: '3', cardId2: '4', type: 'rivalry' as const, strength: 0.9 }
    ]
  }
];

export const EnhancementForge: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState('universe');
  const [collections, setCollections] = useState(mockCollections);

  const handleCollectionUpdate = (updatedCollection: any) => {
    setCollections(prev => 
      prev.map(c => c.id === updatedCollection.id ? updatedCollection : c)
    );
  };

  const handleCardInteraction = (type: string, data: any) => {
    console.log(`Card interaction: ${type}`, data);
    // Handle various card interactions, analytics, etc.
  };

  const handleCardCreate = (cardData: any) => {
    console.log('New card created:', cardData);
    // Add to appropriate collection based on genetics/theme
  };

  const handlePortalActivate = (cardId: string) => {
    console.log('Portal activated for card:', cardId);
    // Handle cross-device card sharing
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/50">
            <Sparkles className="w-4 h-4 mr-2" />
            Enhancement Forge
          </Badge>
          
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
            <Infinity className="w-3 h-3 mr-1" />
            Infinite Gallery
          </Badge>
        </div>
      </div>

      {/* Feature Tabs */}
      <div className="absolute top-16 left-4 z-50">
        <Tabs value={activeFeature} onValueChange={setActiveFeature} orientation="vertical">
          <TabsList className="bg-black/50 backdrop-blur border-white/10 flex-col h-auto">
            <TabsTrigger value="universe" className="flex items-center gap-2 w-full justify-start">
              <GalaxyIcon className="w-4 h-4" />
              Metacollection Universe
            </TabsTrigger>
            <TabsTrigger value="ar" className="flex items-center gap-2 w-full justify-start">
              <Smartphone className="w-4 h-4" />
              AR Creation Studio
            </TabsTrigger>
            <TabsTrigger value="timelapse" className="flex items-center gap-2 w-full justify-start">
              <Clock className="w-4 h-4" />
              Time-Lapse Creation
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <div className="w-full h-full pl-48">
        {activeFeature === 'universe' && (
          <MetacollectionUniverse
            collections={collections}
            onCollectionUpdate={handleCollectionUpdate}
            onCardInteraction={handleCardInteraction}
          />
        )}

        {activeFeature === 'ar' && (
          <ARCreationStudio
            onCardCreate={handleCardCreate}
            onPortalActivate={handlePortalActivate}
          />
        )}

        {activeFeature === 'timelapse' && (
          <TimeLapseCreationSystem
            onTransformationScheduled={(data) => {
              console.log('Transformation scheduled:', data);
            }}
            onEvolutionCompleted={(data) => {
              console.log('Evolution complete:', data);
            }}
          />
        )}
      </div>

      {/* Feature Info Panel */}
      <div className="absolute bottom-4 right-4 z-50">
        <Card className="p-4 bg-black/50 backdrop-blur border-white/10 max-w-sm">
          {activeFeature === 'universe' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <GalaxyIcon className="w-5 h-5 text-purple-400" />
                <span className="text-white font-medium">Metacollection Universe</span>
              </div>
              <p className="text-gray-300 text-sm">
                Explore infinite 3D galleries with neural network environments, 
                living card interactions, and genetic collection evolution.
              </p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  <Dna className="w-3 h-3 mr-1" />
                  DNA System
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Seasonal Events
                </Badge>
              </div>
            </div>
          )}

          {activeFeature === 'ar' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium">AR Creation Studio</span>
              </div>
              <p className="text-gray-300 text-sm">
                Design cards in physical space with gesture controls, 
                environmental effects, and cross-device portals.
              </p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  WebXR
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Gestures
                </Badge>
              </div>
            </div>
          )}

          {activeFeature === 'timelapse' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-400" />
                <span className="text-white font-medium">Time-Lapse Creation</span>
              </div>
              <p className="text-gray-300 text-sm">
                Schedule card transformations over time based on real-world 
                events, sports scores, and astronomical phenomena.
              </p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  Scheduling
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Evolution
                </Badge>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
