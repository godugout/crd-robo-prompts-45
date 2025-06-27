
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConstellationGallery } from './ConstellationGallery';
import { MuseumMode } from './MuseumMode';
import { LivingCollectionsSystem } from './LivingCollectionsSystem';
import { SeasonalEventManager } from './SeasonalEventManager';
import { CollectionGeneticsEngine } from './CollectionGeneticsEngine';
import { 
  Galaxy, Sparkles, Museum, Dna, 
  Calendar, Wand2, Eye, Settings 
} from 'lucide-react';

interface Collection {
  id: string;
  title: string;
  cards: any[];
  theme: 'sports' | 'fantasy' | 'sci-fi' | 'vintage' | 'art';
  dna: CollectionDNA;
  environment: string;
  relationships: CollectionRelationship[];
}

interface CollectionDNA {
  creativity: number;
  rarity: number;
  theme_coherence: number;
  artistic_style: string[];
  color_palette: string[];
  interaction_patterns: string[];
}

interface CollectionRelationship {
  cardId1: string;
  cardId2: string;
  type: 'synergy' | 'rivalry' | 'complement' | 'evolution';
  strength: number;
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
  const [activeMode, setActiveMode] = useState<'constellation' | 'museum' | 'living' | 'genetics'>('constellation');
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [viewMode, setViewMode] = useState<'infinite' | 'focused'>('infinite');
  const [seasonalEffects, setSeasonalEffects] = useState(true);
  
  const canvasRef = useRef<HTMLDivElement>(null);

  // Neural network environment generation
  const generateEnvironment = (collection: Collection) => {
    const { theme, dna } = collection;
    
    switch (theme) {
      case 'sports':
        return {
          type: 'stadium',
          lighting: 'stadium_floodlights',
          atmosphere: 'energetic',
          sounds: ['crowd_cheers', 'whistle_blows'],
          effects: ['confetti', 'fireworks']
        };
      case 'fantasy':
        return {
          type: 'magical_realm',
          lighting: 'mystical_glow',
          atmosphere: 'enchanted',
          sounds: ['mystical_chimes', 'dragon_roars'],
          effects: ['magic_particles', 'floating_runes']
        };
      case 'sci-fi':
        return {
          type: 'space_station',
          lighting: 'neon_holographic',
          atmosphere: 'futuristic',
          sounds: ['tech_hums', 'laser_sounds'],
          effects: ['data_streams', 'holograms']
        };
      case 'vintage':
        return {
          type: 'antique_gallery',
          lighting: 'warm_amber',
          atmosphere: 'nostalgic',
          sounds: ['classical_music', 'clock_ticking'],
          effects: ['dust_motes', 'aged_patina']
        };
      default:
        return {
          type: 'cosmic_void',
          lighting: 'stellar',
          atmosphere: 'infinite',
          sounds: ['cosmic_ambience'],
          effects: ['star_dust', 'nebula_clouds']
        };
    }
  };

  // Collection constellation patterns
  const generateConstellationPattern = (collection: Collection) => {
    const cards = collection.cards;
    const positions = [];
    
    // Create constellation based on card relationships and rarity
    cards.forEach((card, index) => {
      const angle = (index / cards.length) * Math.PI * 2;
      const radius = card.rarity === 'legendary' ? 15 : card.rarity === 'rare' ? 10 : 5;
      const height = Math.sin(index * 0.5) * 3;
      
      positions.push({
        id: card.id,
        position: [
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        ],
        rarity: card.rarity,
        connections: collection.relationships
          .filter(r => r.cardId1 === card.id || r.cardId2 === card.id)
          .map(r => ({
            target: r.cardId1 === card.id ? r.cardId2 : r.cardId1,
            type: r.type,
            strength: r.strength
          }))
      });
    });
    
    return positions;
  };

  const currentEnvironment = useMemo(() => {
    return selectedCollection ? generateEnvironment(selectedCollection) : null;
  }, [selectedCollection]);

  const handleModeChange = (mode: string) => {
    setActiveMode(mode as any);
    onCardInteraction('mode_change', { mode, collection: selectedCollection });
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'constellation': return <Galaxy className="w-4 h-4" />;
      case 'museum': return <Museum className="w-4 h-4" />;
      case 'living': return <Wand2 className="w-4 h-4" />;
      case 'genetics': return <Dna className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'sports': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'fantasy': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'sci-fi': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'vintage': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Universe Controls Header */}
      <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/50">
            <Sparkles className="w-3 h-3 mr-1" />
            Metacollection Universe
          </Badge>
          
          {selectedCollection && (
            <Badge className={getThemeColor(selectedCollection.theme)}>
              {selectedCollection.title}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={seasonalEffects ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSeasonalEffects(!seasonalEffects)}
          >
            <Calendar className="w-4 h-4 mr-1" />
            Seasonal
          </Button>
          
          <Button
            variant={viewMode === 'infinite' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode(viewMode === 'infinite' ? 'focused' : 'infinite')}
          >
            <Settings className="w-4 h-4 mr-1" />
            {viewMode === 'infinite' ? 'Infinite' : 'Focused'}
          </Button>
        </div>
      </div>

      {/* Collection Selection Sidebar */}
      <div className="absolute left-4 top-20 bottom-4 w-80 z-40">
        <Card className="h-full bg-black/50 backdrop-blur border-white/10 p-4">
          <div className="space-y-4 h-full">
            <h3 className="text-white font-bold text-lg">Collections</h3>
            
            <div className="space-y-2 flex-1 overflow-y-auto">
              {collections.map((collection) => (
                <Card
                  key={collection.id}
                  className={`p-3 cursor-pointer border transition-all ${
                    selectedCollection?.id === collection.id
                      ? 'bg-purple-500/20 border-purple-500/50'
                      : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50'
                  }`}
                  onClick={() => setSelectedCollection(collection)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">{collection.title}</div>
                      <div className="text-gray-400 text-sm">{collection.cards.length} cards</div>
                    </div>
                    <Badge className={getThemeColor(collection.theme)}>
                      {collection.theme}
                    </Badge>
                  </div>
                  
                  {collection.dna && (
                    <div className="mt-2 flex gap-1">
                      <div className="text-xs text-gray-400">
                        DNA: {Math.round(collection.dna.creativity * 100)}% Creative
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Mode Selection Tabs */}
      <div className="absolute right-4 top-20 z-40">
        <Tabs value={activeMode} onValueChange={handleModeChange} orientation="vertical">
          <TabsList className="bg-black/50 backdrop-blur border-white/10">
            <TabsTrigger value="constellation" className="flex items-center gap-2">
              {getModeIcon('constellation')}
              Constellation
            </TabsTrigger>
            <TabsTrigger value="museum" className="flex items-center gap-2">  
              {getModeIcon('museum')}
              Museum
            </TabsTrigger>
            <TabsTrigger value="living" className="flex items-center gap-2">
              {getModeIcon('living')}
              Living
            </TabsTrigger>
            <TabsTrigger value="genetics" className="flex items-center gap-2">
              {getModeIcon('genetics')}
              Genetics
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main 3D Universe Canvas */}
      <div ref={canvasRef} className="w-full h-full">
        <Canvas
          camera={{ position: [0, 10, 20], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
        >
          {/* Universal Lighting */}
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 10, 5]} intensity={0.7} />
          
          {/* Starfield Background */}
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          {/* Dynamic Environment */}
          <Environment preset="night" />
          
          {/* Mode-Specific Content */}
          {activeMode === 'constellation' && selectedCollection && (
            <ConstellationGallery
              collection={selectedCollection}
              pattern={generateConstellationPattern(selectedCollection)}
              environment={currentEnvironment}
              viewMode={viewMode}
              onCardInteraction={onCardInteraction}
            />
          )}
          
          {activeMode === 'museum' && selectedCollection && (
            <MuseumMode
              collection={selectedCollection}
              environment={currentEnvironment}
              onCardInteraction={onCardInteraction}
            />
          )}
          
          {activeMode === 'living' && selectedCollection && (
            <LivingCollectionsSystem
              collection={selectedCollection}
              onCardInteraction={onCardInteraction}
              onCollectionUpdate={onCollectionUpdate}
            />
          )}
          
          {activeMode === 'genetics' && selectedCollection && (
            <CollectionGeneticsEngine
              collection={selectedCollection}
              onCollectionUpdate={onCollectionUpdate}
              onCardInteraction={onCardInteraction}
            />
          )}
          
          {/* Universal Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={100}
            autoRotate={viewMode === 'infinite'}
            autoRotateSpeed={0.2}
          />
        </Canvas>
      </div>

      {/* Seasonal Event Overlay */}
      {seasonalEffects && (
        <SeasonalEventManager
          collections={collections}
          onSeasonalEffect={(effect) => onCardInteraction('seasonal_effect', effect)}
        />
      )}
    </div>
  );
};
