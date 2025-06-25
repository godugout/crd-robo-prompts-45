
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Layers, 
  Sparkles, 
  Wand2, 
  Palette, 
  Image as ImageIcon,
  Type,
  Shapes,
  Zap,
  Save,
  Share2,
  Eye,
  Settings,
  Download,
  Undo,
  Redo,
  Play,
  Pause
} from 'lucide-react';
import { LayerPanel } from './panels/LayerPanel';
import { EffectsPanel } from './panels/EffectsPanel';
import { MaterialsPanel } from './panels/MaterialsPanel';
import { PropertiesPanel } from './panels/PropertiesPanel';
import { AssetsPanel } from './panels/AssetsPanel';
import { Advanced3DCard } from './3d/Advanced3DCard';
import { useAdvancedCardStudio } from './hooks/useAdvancedCardStudio';
import { StudioToolbar } from './components/StudioToolbar';
import { PreviewControls } from './components/PreviewControls';

export const AdvancedCardStudio: React.FC = () => {
  const {
    cardData,
    layers,
    effects,
    materials,
    selectedLayer,
    history,
    isPlaying,
    updateCardData,
    addLayer,
    updateLayer,
    removeLayer,
    selectLayer,
    applyEffect,
    updateMaterial,
    undo,
    redo,
    save,
    toggleAnimation
  } = useAdvancedCardStudio();

  const [activePanel, setActivePanel] = useState<'layers' | 'effects' | 'materials' | 'properties' | 'assets'>('layers');
  const [previewMode, setPreviewMode] = useState<'design' | 'preview' | 'vr'>('design');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Studio Header */}
      <div className="h-16 bg-black/20 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Card Studio Pro
          </h1>
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
            AI Enhanced
          </Badge>
        </div>
        
        <StudioToolbar
          onUndo={undo}
          onRedo={redo}
          onSave={save}
          canUndo={history.canUndo}
          canRedo={history.canRedo}
        />
      </div>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar - Tools & Panels */}
        <motion.div 
          className="w-80 bg-black/30 backdrop-blur-xl border-r border-white/10"
          initial={{ x: -320 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Tabs value={activePanel} onValueChange={(value) => setActivePanel(value as any)} className="h-full">
            <TabsList className="grid w-full grid-cols-5 bg-black/40 m-2">
              <TabsTrigger value="layers" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
                <Layers className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="effects" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                <Sparkles className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="materials" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                <Palette className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="properties" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                <Settings className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="assets" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
                <ImageIcon className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>

            <div className="p-4 h-[calc(100%-5rem)] overflow-y-auto custom-scrollbar">
              <TabsContent value="layers" className="mt-0">
                <LayerPanel
                  layers={layers}
                  selectedLayer={selectedLayer}
                  onAddLayer={addLayer}
                  onUpdateLayer={updateLayer}
                  onRemoveLayer={removeLayer}
                  onSelectLayer={selectLayer}
                />
              </TabsContent>

              <TabsContent value="effects" className="mt-0">
                <EffectsPanel
                  effects={effects}
                  onApplyEffect={applyEffect}
                />
              </TabsContent>

              <TabsContent value="materials" className="mt-0">
                <MaterialsPanel
                  materials={materials}
                  onUpdateMaterial={updateMaterial}
                />
              </TabsContent>

              <TabsContent value="properties" className="mt-0">
                <PropertiesPanel
                  cardData={cardData}
                  selectedLayer={selectedLayer}
                  onUpdateCard={updateCardData}
                  onUpdateLayer={updateLayer}
                />
              </TabsContent>

              <TabsContent value="assets" className="mt-0">
                <AssetsPanel />
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>

        {/* Main Canvas Area */}
        <div className="flex-1 relative">
          {/* Preview Mode Selector */}
          <div className="absolute top-4 left-4 z-10">
            <div className="flex bg-black/40 backdrop-blur-md rounded-lg p-1">
              {(['design', 'preview', 'vr'] as const).map((mode) => (
                <Button
                  key={mode}
                  onClick={() => setPreviewMode(mode)}
                  variant={previewMode === mode ? "default" : "ghost"}
                  size="sm"
                  className={previewMode === mode ? "bg-cyan-500 text-black" : "text-white hover:bg-white/10"}
                >
                  {mode === 'design' && <Palette className="w-4 h-4 mr-1" />}
                  {mode === 'preview' && <Eye className="w-4 h-4 mr-1" />}
                  {mode === 'vr' && <Zap className="w-4 h-4 mr-1" />}
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* 3D Canvas */}
          <div className="w-full h-full bg-gradient-to-br from-gray-900 via-purple-900/20 to-cyan-900/20">
            <Canvas
              ref={canvasRef}
              camera={{ position: [0, 0, 5], fov: 50 }}
              gl={{ 
                antialias: true, 
                alpha: true,
                powerPreference: "high-performance"
              }}
            >
              <PerspectiveCamera makeDefault position={[0, 0, 5]} />
              
              {/* Advanced Lighting Setup */}
              <ambientLight intensity={0.2} />
              <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
              <pointLight position={[-10, -10, -5]} intensity={0.5} color="#00ffff" />
              <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.8} />
              
              {/* HDR Environment */}
              <Environment preset="studio" />
              
              {/* Advanced 3D Card */}
              <Advanced3DCard
                cardData={cardData}
                layers={layers}
                effects={effects}
                materials={materials}
                isPlaying={isPlaying}
                previewMode={previewMode}
              />
              
              {/* Controls */}
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                maxDistance={10}
                minDistance={2}
              />
            </Canvas>
          </div>

          {/* Preview Controls */}
          <PreviewControls
            isPlaying={isPlaying}
            onToggleAnimation={toggleAnimation}
            previewMode={previewMode}
            onPreviewModeChange={setPreviewMode}
          />
        </div>

        {/* Right Sidebar - Timeline & Advanced Controls */}
        <motion.div 
          className="w-80 bg-black/30 backdrop-blur-xl border-l border-white/10"
          initial={{ x: 320 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="p-4 h-full">
            <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Advanced Controls
            </h3>
            
            {/* Real-time Stats */}
            <Card className="bg-black/40 border-white/10 p-4 mb-4">
              <h4 className="text-sm font-medium mb-2 text-cyan-400">Performance</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Render Time:</span>
                  <span className="text-green-400">16ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Polygons:</span>
                  <span className="text-blue-400">2.1k</span>
                </div>
                <div className="flex justify-between">
                  <span>Effects:</span>
                  <span className="text-purple-400">{effects.length}</span>
                </div>
              </div>
            </Card>

            {/* AI Assistant */}
            <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 p-4 mb-4">
              <div className="flex items-center mb-2">
                <Wand2 className="w-4 h-4 mr-2 text-purple-400" />
                <h4 className="text-sm font-medium text-purple-400">AI Assistant</h4>
              </div>
              <p className="text-xs text-gray-300 mb-3">
                Enhance your card with AI-powered suggestions
              </p>
              <div className="space-y-2">
                <Button size="sm" className="w-full bg-purple-500 hover:bg-purple-600">
                  Generate Effects
                </Button>
                <Button size="sm" variant="outline" className="w-full border-purple-500 text-purple-400">
                  Optimize Design
                </Button>
              </div>
            </Card>

            {/* Export Options */}
            <Card className="bg-black/40 border-white/10 p-4">
              <h4 className="text-sm font-medium mb-3 text-green-400">Export</h4>
              <div className="space-y-2">
                <Button size="sm" className="w-full bg-green-500 hover:bg-green-600">
                  <Download className="w-4 h-4 mr-2" />
                  4K Render
                </Button>
                <Button size="sm" variant="outline" className="w-full border-green-500 text-green-400">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Online
                </Button>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};
