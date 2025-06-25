
import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Layers, 
  Sparkles, 
  Wand2, 
  Palette, 
  Image as ImageIcon, 
  Zap, 
  Share2, 
  Eye, 
  Settings, 
  Download 
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

  const [activePanel, setActivePanel] = useState('layers');
  const [previewMode, setPreviewMode] = useState<'design' | 'preview' | 'vr'>('design');
  const canvasRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Header */}
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

      {/* Main Content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar */}
        <motion.div
          className="w-80 bg-black/30 backdrop-blur-xl border-r border-white/10"
          initial={{ x: -320 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Tabs value={activePanel} onValueChange={(value) => setActivePanel(value)} className="h-full">
            <TabsList className="grid w-full grid-cols-5 bg-black/40 m-2">
              <TabsTrigger 
                value="layers" 
                className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black"
              >
                <Layers className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger 
                value="effects" 
                className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
              >
                <Sparkles className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger 
                value="materials" 
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                <Palette className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger 
                value="properties" 
                className="data-[state=active]:bg-green-500 data-[state=active]:text-black"
              >
                <Settings className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger 
                value="assets" 
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                <ImageIcon className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>

            <div className="p-4 h-[calc(100%-4rem)] overflow-y-auto custom-scrollbar">
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
                  onUpdateCardData={updateCardData}
                />
              </TabsContent>

              <TabsContent value="assets" className="mt-0">
                <AssetsPanel />
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>

        {/* Main Canvas Area */}
        <div className="flex-1 relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div ref={canvasRef} className="w-full h-full">
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
              
              {/* Lighting */}
              <ambientLight intensity={0.4} />
              <directionalLight 
                position={[10, 10, 5]} 
                intensity={1} 
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
              />
              <pointLight position={[-10, -10, -10]} intensity={0.5} />
              
              <Environment preset="studio" />
              
              {/* 3D Card */}
              <Advanced3DCard
                cardData={cardData}
                layers={layers}
                effects={effects}
                materials={materials}
                isPlaying={isPlaying}
                previewMode={previewMode}
              />
              
              {/* Camera Controls */}
              <OrbitControls
                enablePan={false}
                enableZoom={true}
                enableRotate={true}
                minDistance={3}
                maxDistance={12}
                autoRotate={previewMode === 'preview'}
                autoRotateSpeed={1}
              />
            </Canvas>
          </div>

          {/* Preview Controls Overlay */}
          <PreviewControls
            isPlaying={isPlaying}
            previewMode={previewMode}
            onToggleAnimation={toggleAnimation}
            onModeChange={setPreviewMode}
          />

          {/* Status Bar */}
          <div className="absolute bottom-4 left-4 bg-black/90 backdrop-blur-md p-3 rounded-xl z-10 border border-white/20">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white">Live Preview</span>
              </div>
              <div className="text-gray-400">|</div>
              <div className="text-gray-300">
                {layers.filter(l => l.visible).length} layers • {effects.filter(e => e.enabled).length} effects
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};
