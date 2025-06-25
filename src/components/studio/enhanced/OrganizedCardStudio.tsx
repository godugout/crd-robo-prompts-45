
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { 
  Upload, 
  Frame, 
  Sparkles, 
  Palette, 
  Download, 
  Play, 
  Pause,
  RotateCw,
  Save,
  Undo,
  Redo,
  Eye,
  Settings
} from 'lucide-react';
import { Advanced3DCard } from '../3d/Advanced3DCard';
import { useAdvancedCardStudio } from '../hooks/useAdvancedCardStudio';

export const OrganizedCardStudio: React.FC = () => {
  const {
    cardData,
    layers,
    effects,
    materials,
    selectedFrame,
    history,
    isPlaying,
    updateCardData,
    selectFrame,
    applyEffect,
    updateMaterial,
    undo,
    redo,
    save,
    toggleAnimation
  } = useAdvancedCardStudio();

  const [currentPhase, setCurrentPhase] = useState<'upload' | 'frame' | 'effects' | 'studio'>('upload');
  const [activeTab, setActiveTab] = useState('design');

  const phases = [
    { id: 'upload', label: 'Upload', icon: Upload, description: 'Add your images' },
    { id: 'frame', label: 'Frame', icon: Frame, description: 'Choose template' },
    { id: 'effects', label: 'Effects', icon: Sparkles, description: 'Add visual magic' },
    { id: 'studio', label: 'Studio', icon: Palette, description: 'Fine-tune design' }
  ];

  const renderPhaseContent = () => {
    switch (currentPhase) {
      case 'upload':
        return (
          <div className="space-y-6 p-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Upload Your Images</h3>
              <p className="text-gray-400">Start by uploading your card images or photos</p>
            </div>
            
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center hover:border-gray-500 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-2">Drag & drop your images here</p>
              <p className="text-gray-500 text-sm">or click to browse files</p>
              <Button className="mt-4 bg-cyan-500 hover:bg-cyan-400 text-black">
                Choose Files
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-square bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center">
                  <span className="text-gray-500">Image {i}</span>
                </div>
              ))}
            </div>

            <Button 
              onClick={() => setCurrentPhase('frame')}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-medium"
            >
              Continue to Frame Selection
            </Button>
          </div>
        );

      case 'frame':
        return (
          <div className="space-y-6 p-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Choose Your Frame</h3>
              <p className="text-gray-400">Select a professional template</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {['Sports Classic', 'Modern Holographic', 'Vintage Collection', 'Chrome Edition'].map((frame) => (
                <Card key={frame} className="bg-gray-800 border-gray-700 p-4 cursor-pointer hover:bg-gray-750 transition-colors">
                  <div className="aspect-[3/4] bg-gray-700 rounded mb-3 flex items-center justify-center">
                    <Frame className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-white font-medium text-sm">{frame}</p>
                </Card>
              ))}
            </div>

            <Button 
              onClick={() => setCurrentPhase('effects')}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-medium"
            >
              Continue to Effects
            </Button>
          </div>
        );

      case 'effects':
        return (
          <div className="space-y-6 p-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Add Visual Effects</h3>
              <p className="text-gray-400">Enhance your card with premium effects</p>
            </div>

            <div className="space-y-4">
              {[
                { name: 'Holographic Foil', description: 'Rainbow shimmer effect', premium: true },
                { name: 'Chrome Metallic', description: 'Mirror-like finish', premium: true },
                { name: 'Particle Glow', description: 'Magical sparkles', premium: false },
                { name: 'Energy Aura', description: 'Glowing outline', premium: false }
              ].map((effect) => (
                <Card key={effect.name} className="bg-gray-800 border-gray-700 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium">{effect.name}</p>
                        {effect.premium && (
                          <Badge className="bg-yellow-500 text-black text-xs">Premium</Badge>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">{effect.description}</p>
                    </div>
                    <Button size="sm" variant="outline" className="border-gray-600">
                      Apply
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <Button 
              onClick={() => setCurrentPhase('studio')}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-medium"
            >
              Open Professional Studio
            </Button>
          </div>
        );

      case 'studio':
        return (
          <div className="h-full flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="bg-gray-800 border-b border-gray-700">
                <TabsTrigger value="design" className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Design
                </TabsTrigger>
                <TabsTrigger value="effects" className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Effects
                </TabsTrigger>
                <TabsTrigger value="export" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </TabsTrigger>
              </TabsList>

              <TabsContent value="design" className="flex-1 p-6 space-y-4">
                <h4 className="text-lg font-semibold text-white">Design Controls</h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Card Title</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                      value={cardData.title}
                      onChange={(e) => updateCardData({ title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Description</label>
                    <textarea 
                      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white h-20"
                      value={cardData.description}
                      onChange={(e) => updateCardData({ description: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Rarity</label>
                    <select 
                      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                      value={cardData.rarity}
                      onChange={(e) => updateCardData({ rarity: e.target.value as any })}
                    >
                      <option value="common">Common</option>
                      <option value="uncommon">Uncommon</option>
                      <option value="rare">Rare</option>
                      <option value="epic">Epic</option>
                      <option value="legendary">Legendary</option>
                    </select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="effects" className="flex-1 p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Active Effects</h4>
                <p className="text-gray-400">Fine-tune your visual effects here</p>
              </TabsContent>

              <TabsContent value="export" className="flex-1 p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Export Options</h4>
                <div className="space-y-4">
                  <Button className="w-full bg-green-600 hover:bg-green-500">
                    Export High Quality PNG
                  </Button>
                  <Button className="w-full bg-blue-600 hover:bg-blue-500">
                    Export for Print
                  </Button>
                  <Button className="w-full bg-purple-600 hover:bg-purple-500">
                    Save to Gallery
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Header */}
      <div className="h-16 bg-black/20 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Enhanced Card Studio
          </h1>
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
            Professional
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={undo} disabled={!history.canUndo}>
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={redo} disabled={!history.canRedo}>
            <Redo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={save}>
            <Save className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Phase Navigation */}
      <div className="h-20 bg-black/30 backdrop-blur-xl border-b border-white/10 flex items-center justify-center">
        <div className="flex items-center space-x-1">
          {phases.map((phase, index) => (
            <React.Fragment key={phase.id}>
              <Button
                variant="ghost"
                onClick={() => setCurrentPhase(phase.id as any)}
                className={`flex items-center space-x-3 px-6 py-3 rounded-lg transition-all ${
                  currentPhase === phase.id 
                    ? 'bg-cyan-500 text-black' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  currentPhase === phase.id 
                    ? 'border-black bg-black/20' 
                    : 'border-gray-600'
                }`}>
                  <phase.icon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="font-medium">{phase.label}</div>
                  <div className="text-xs opacity-70">{phase.description}</div>
                </div>
              </Button>
              {index < phases.length - 1 && (
                <div className="w-8 h-px bg-gray-600 mx-2" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-9rem)]">
        {/* Left Sidebar */}
        <motion.div
          className="w-96 bg-black/30 backdrop-blur-xl border-r border-white/10 overflow-y-auto"
          initial={{ x: -384 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {renderPhaseContent()}
        </motion.div>

        {/* Main Canvas Area */}
        <div className="flex-1 relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="w-full h-full">
            <Canvas
              shadows
              camera={{ position: [0, 0, 8], fov: 45 }}
              gl={{ 
                antialias: true, 
                alpha: true,
                preserveDrawingBuffer: true 
              }}
              dpr={[1, 2]}
            >
              <PerspectiveCamera makeDefault position={[0, 0, 8]} />
              
              {/* Enhanced Lighting */}
              <ambientLight intensity={0.4} />
              <directionalLight 
                position={[10, 10, 5]} 
                intensity={1} 
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
              />
              <pointLight position={[-10, -10, -10]} intensity={0.5} />
              <spotLight
                position={[0, 10, 0]}
                angle={0.15}
                penumbra={1}
                intensity={0.3}
                castShadow
              />
              
              <Environment preset="studio" />
              
              {/* 3D Card */}
              <Advanced3DCard
                cardData={cardData}
                layers={layers}
                effects={effects}
                materials={materials}
                isPlaying={isPlaying}
                previewMode="design"
              />
              
              {/* Camera Controls */}
              <OrbitControls
                enablePan={false}
                enableZoom={true}
                enableRotate={true}
                minDistance={3}
                maxDistance={12}
                autoRotate={isPlaying}
                autoRotateSpeed={1}
                dampingFactor={0.05}
                enableDamping={true}
              />
            </Canvas>
          </div>

          {/* Preview Controls Overlay */}
          <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-md p-4 rounded-xl z-10 border border-white/20">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleAnimation}
                className="text-white hover:bg-white/10"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <RotateCw className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Status Bar */}
          <div className="absolute bottom-4 left-4 bg-black/90 backdrop-blur-md p-4 rounded-xl z-10 border border-white/20">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white">Live Preview</span>
              </div>
              <div className="text-gray-400">|</div>
              <div className="text-gray-300">
                Phase: {currentPhase} • {layers.filter(l => l.visible).length} layers
              </div>
              <div className="text-gray-400">|</div>
              <div className="text-gray-300">
                {effects.filter(e => e.enabled).length} effects active
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
