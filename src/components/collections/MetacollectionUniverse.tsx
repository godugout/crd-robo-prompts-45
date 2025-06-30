import React, { useState, useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import { ConstellationGallery } from './ConstellationGallery';
import { MuseumMode } from './MuseumMode';
import { LivingCollectionsSystem } from './LivingCollectionsSystem';
import { CollectionGeneticsEngine } from './CollectionGeneticsEngine';
import { SeasonalEventManager } from './SeasonalEventManager';
import { CollectionsErrorBoundary } from './enhanced/CollectionsErrorBoundary';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, Building2 as MuseumIcon, 
  Zap, Dna, Calendar, 
  Play, Pause, Settings 
} from 'lucide-react';

interface Collection {
  id: string;
  title: string;
  theme: 'sports' | 'fantasy' | 'nature' | 'tech' | 'art';
  cards: Array<{
    id: string;
    title: string;
    rarity: string;
    tags: string[];
    created_at: string;
  }>;
  dna: {
    creativity: number;
    rarity: number;
    theme_coherence: number;
    artistic_style: string[];
    color_palette: string[];
    interaction_patterns: string[];
    evolution_potential: number;
    genetic_stability: number;
  };
  environment: string;
  relationships: Array<{
    cardId1: string;
    cardId2: string;
    type: 'synergy' | 'rivalry' | 'complement' | 'evolution';
    strength: number;
  }>;
}

interface MetacollectionUniverseProps {
  collections: Collection[];
  onCollectionUpdate: (collection: Collection) => void;
  onCardInteraction: (type: string, data: any) => void;
}

export const MetacollectionUniverse: React.FC<MetacollectionUniverseProps> = ({
  collections,
  onCollectionUpdate,
  onCardInteraction
}) => {
  const [activeMode, setActiveMode] = useState<'constellation' | 'museum' | 'living' | 'genetics' | 'seasonal'>('constellation');
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const environmentSettings = useMemo(() => {
    return {
      sports: { preset: 'stadium', intensity: 1.2 },
      fantasy: { preset: 'forest', intensity: 0.8 },
      nature: { preset: 'park', intensity: 1.0 },
      tech: { preset: 'city', intensity: 1.4 },
      art: { preset: 'studio', intensity: 0.9 }
    };
  }, []);

  const handleCollectionSelect = (collection: Collection) => {
    setSelectedCollection(collection);
    onCardInteraction('collection_selected', { collectionId: collection.id });
  };

  const handleModeChange = (mode: typeof activeMode) => {
    setIsLoading(true);
    setActiveMode(mode);
    onCardInteraction('mode_changed', { mode });
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleCollectionEvolution = (collectionId: string, newState: any) => {
    const collection = collections.find(c => c.id === collectionId);
    if (collection) {
      const updatedCollection = {
        ...collection,
        dna: { ...collection.dna, ...newState }
      };
      onCollectionUpdate(updatedCollection);
    }
  };

  // Generate constellation pattern for the first collection or create a default
  const constellationPattern = useMemo(() => {
    if (collections.length === 0) return [];
    
    const collection = selectedCollection || collections[0];
    return collection.cards.map((card, index) => {
      const angle = (index / collection.cards.length) * Math.PI * 2;
      const radius = 10 + Math.random() * 5;
      
      return {
        id: card.id,
        position: [
          Math.cos(angle) * radius,
          Math.sin(angle) * radius * 0.5,
          Math.sin(angle) * radius
        ] as [number, number, number],
        rarity: card.rarity,
        connections: []
      };
    });
  }, [collections, selectedCollection]);

  const activeCollection = selectedCollection || (collections.length > 0 ? collections[0] : null);

  // Simple fallback for when WebGL fails
  const SimpleFallback = () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Card className="p-8 bg-black/50 backdrop-blur border-white/10 max-w-md text-center">
        <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h3 className="text-white text-lg font-semibold mb-2">
          Metacollection Universe
        </h3>
        <p className="text-white/80 text-sm mb-4">
          3D features are loading or not available on this device.
        </p>
        <div className="space-y-2">
          <p className="text-white/60 text-xs">
            Collections: {collections.length}
          </p>
          <p className="text-white/60 text-xs">
            Mode: {activeMode}
          </p>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header Controls */}
      <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/50">
            <Sparkles className="w-4 h-4 mr-2" />
            Metacollection Universe
          </Badge>
          
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
            {collections.length} Collections
          </Badge>

          {isLoading && (
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
              Loading...
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant={activeMode === 'constellation' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleModeChange('constellation')}
            disabled={isLoading}
          >
            <Sparkles className="w-4 h-4 mr-1" />
            Constellation
          </Button>
          <Button 
            variant={activeMode === 'museum' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleModeChange('museum')}
            disabled={isLoading}
          >
            <MuseumIcon className="w-4 h-4 mr-1" />
            Museum
          </Button>
          <Button 
            variant={activeMode === 'living' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleModeChange('living')}
            disabled={isLoading}
          >
            <Zap className="w-4 h-4 mr-1" />
            Living
          </Button>
        </div>
      </div>

      {/* Main Canvas with Error Boundary */}
      <CollectionsErrorBoundary fallbackComponent={<SimpleFallback />}>
        <Canvas 
          ref={canvasRef}
          className="w-full h-full"
          camera={{ position: [0, 10, 20], fov: 75 }}
          gl={{ antialias: true, alpha: false }}
          onCreated={(state) => {
            // Ensure WebGL context is properly initialized
            state.gl.setClearColor('#0f0f23');
          }}
        >
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Stars 
            radius={300} 
            depth={60} 
            count={1000} 
            factor={7} 
            saturation={0} 
            fade={true}
          />
          
          <OrbitControls 
            enablePan={true} 
            enableZoom={true} 
            enableRotate={true}
            maxDistance={100}
            minDistance={5}
          />

          {/* Render active mode */}
          {activeMode === 'constellation' && activeCollection && (
            <ConstellationGallery
              collection={activeCollection}
              pattern={constellationPattern}
              environment={{ type: activeCollection.theme }}
              viewMode="infinite"
              onCardInteraction={onCardInteraction}
            />
          )}

          {activeMode === 'museum' && (
            <MuseumMode
              collections={collections}
              onCollectionUpdate={onCollectionUpdate}
            />
          )}

          {activeMode === 'living' && (
            <LivingCollectionsSystem
              collections={collections}
              onCardInteraction={onCardInteraction}
              onCollectionEvolution={handleCollectionEvolution}
            />
          )}

          {activeMode === 'genetics' && (
            <CollectionGeneticsEngine
              collections={collections}
              onGeneticAnalysis={(data) => onCardInteraction('genetic_analysis', data)}
              onEvolutionTrigger={onCollectionUpdate}
            />
          )}

          {activeMode === 'seasonal' && (
            <SeasonalEventManager
              collections={collections}
              onSeasonalEffect={(effect) => onCardInteraction('seasonal_effect', effect)}
            />
          )}

          <Environment preset="night" />
        </Canvas>
      </CollectionsErrorBoundary>

      {/* Collection Info Panel */}
      {selectedCollection && (
        <div className="absolute bottom-4 right-4 z-50">
          <Card className="p-4 bg-black/50 backdrop-blur border-white/10 max-w-sm">
            <h3 className="text-white font-medium mb-2">{selectedCollection.title}</h3>
            <p className="text-gray-300 text-sm mb-3">
              {selectedCollection.cards.length} cards • {selectedCollection.theme} theme
            </p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Creativity</span>
                <span className="text-crd-green">{Math.round(selectedCollection.dna.creativity * 100)}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Coherence</span>
                <span className="text-crd-green">{Math.round(selectedCollection.dna.theme_coherence * 100)}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Evolution</span>
                <span className="text-crd-green">{Math.round(selectedCollection.dna.evolution_potential * 100)}%</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
