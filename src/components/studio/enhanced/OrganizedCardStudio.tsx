
import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  ChevronLeft,
  ChevronRight,
  Upload,
  Square,
  Eye,
  Sparkles,
  Settings,
  RotateCw,
  Pause,
  Play
} from 'lucide-react';

// Import our new functional phases
import { UploadPhase } from './phases/UploadPhase';
import { FramePhase } from './phases/FramePhase';
import { EffectsPhase } from './phases/EffectsPhase';
import { StudioPhase } from './phases/StudioPhase';
import { useEnhancedStudio } from './hooks/useEnhancedStudio';
import { Advanced3DCard } from '../3d/Advanced3DCard';

const PHASES = [
  {
    id: 'upload',
    title: 'Upload',
    description: 'Add your images',
    icon: Upload,
    color: 'text-blue-400'
  },
  {
    id: 'frame',
    title: 'Frame',
    description: 'Choose template',
    icon: Square,
    color: 'text-green-400'
  },
  {
    id: 'effects',
    title: 'Effects',
    description: 'Add visual flair',
    icon: Sparkles,
    color: 'text-purple-400'
  },
  {
    id: 'studio',
    title: 'Studio',
    description: 'Fine-tune & export',
    icon: Settings,
    color: 'text-orange-400'
  }
];

export const OrganizedCardStudio: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const {
    // State
    currentPhase,
    completedPhases,
    uploadedImages,
    selectedFrame,
    frameData,
    layers,
    effects,
    cardData,
    selectedLayerId,
    isPlaying,
    fileInputRef,
    
    // Phase Management
    setCurrentPhase,
    completePhase,
    
    // Image Upload
    handleImageUpload,
    triggerImageUpload,
    
    // Frame Management
    selectFrame,
    
    // Layer Management
    addLayer,
    updateLayer,
    removeLayer,
    selectLayer,
    
    // Effects Management
    addEffect,
    updateEffect,
    removeEffect,
    
    // Animation
    toggleAnimation,
    
    // Export & Save
    exportCard,
    saveCard
  } = useEnhancedStudio();

  const currentPhaseData = PHASES[currentPhase];
  const progress = ((completedPhases.size) / PHASES.length) * 100;

  const renderPhaseContent = () => {
    switch (currentPhase) {
      case 0:
        return (
          <UploadPhase
            uploadedImages={uploadedImages}
            onImageUpload={handleImageUpload}
            onComplete={() => completePhase(0)}
            fileInputRef={fileInputRef}
          />
        );
      case 1:
        return (
          <FramePhase
            selectedFrame={selectedFrame}
            frameData={frameData}
            onFrameSelect={selectFrame}
            onComplete={() => completePhase(1)}
          />
        );
      case 2:
        return (
          <EffectsPhase
            effects={effects}
            onAddEffect={addEffect}
            onUpdateEffect={updateEffect}
            onRemoveEffect={removeEffect}
            onComplete={() => completePhase(2)}
            isPlaying={isPlaying}
            onToggleAnimation={toggleAnimation}
          />
        );
      case 3:
        return (
          <StudioPhase
            layers={layers}
            selectedLayerId={selectedLayerId}
            onAddLayer={addLayer}
            onUpdateLayer={updateLayer}
            onRemoveLayer={removeLayer}
            onSelectLayer={selectLayer}
            onExport={exportCard}
            onSave={saveCard}
          />
        );
      default:
        return null;
    }
  };

  const canNavigateToPhase = (phaseIndex: number) => {
    if (phaseIndex === 0) return true;
    return completedPhases.has(phaseIndex - 1);
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
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">
            Progress: {Math.round(progress)}%
          </div>
          <div className="w-32 bg-gray-700 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Phase Navigation */}
      <div className="h-20 bg-black/30 backdrop-blur-xl border-b border-white/10 flex items-center justify-center px-6">
        <div className="flex items-center space-x-1">
          {PHASES.map((phase, index) => {
            const Icon = phase.icon;
            const isActive = currentPhase === index;
            const isCompleted = completedPhases.has(index);
            const canNavigate = canNavigateToPhase(index);
            
            return (
              <React.Fragment key={phase.id}>
                <Button
                  variant="ghost"
                  onClick={() => canNavigate && setCurrentPhase(index)}
                  disabled={!canNavigate}
                  className={`h-auto p-4 flex flex-col items-center space-y-1 ${
                    isActive 
                      ? 'text-cyan-400 bg-cyan-400/10' 
                      : isCompleted 
                        ? 'text-green-400 hover:text-white'
                        : canNavigate
                          ? 'text-gray-400 hover:text-white'
                          : 'text-gray-600 cursor-not-allowed'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    isActive 
                      ? 'border-cyan-400 bg-cyan-400/20' 
                      : isCompleted 
                        ? 'border-green-400 bg-green-400/20'
                        : canNavigate
                          ? 'border-gray-600 bg-gray-800'
                          : 'border-gray-700 bg-gray-900'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-xs">{phase.title}</div>
                    <div className="text-xs opacity-70">{phase.description}</div>
                  </div>
                </Button>
                
                {index < PHASES.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-gray-600 mx-2" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-9rem)]">
        {/* Left Sidebar - Phase Content */}
        <div className="w-96 bg-black/30 backdrop-blur-xl border-r border-white/10 overflow-y-auto custom-scrollbar">
          {renderPhaseContent()}
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="w-full h-full">
            <Canvas
              ref={canvasRef}
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
              
              {/* Professional Lighting */}
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
              
              {/* 3D Card with Effects */}
              <Advanced3DCard
                cardData={cardData}
                layers={layers}
                effects={effects}
                materials={[]}
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
                autoRotate={isPlaying && currentPhase === 2}
                autoRotateSpeed={1}
                dampingFactor={0.05}
                enableDamping={true}
              />
            </Canvas>
          </div>

          {/* 3D Controls Overlay */}
          <div className="absolute bottom-4 right-4 bg-black/90 backdrop-blur-md p-3 rounded-xl z-10 border border-white/20">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleAnimation}
                className="border-white/20 text-white hover:bg-white/10"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <div className="text-white text-sm">
                3D Preview
              </div>
            </div>
          </div>

          {/* Phase Indicator Overlay */}
          <div className="absolute top-4 left-4 bg-black/90 backdrop-blur-md p-3 rounded-xl z-10 border border-white/20">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${currentPhaseData.color.replace('text-', 'bg-')}`} />
              <span className="text-white text-sm font-medium">
                {currentPhaseData.title} Phase
              </span>
            </div>
          </div>

          {/* Status Info Overlay */}
          <div className="absolute bottom-4 left-4 bg-black/90 backdrop-blur-md p-3 rounded-xl z-10 border border-white/20">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white">Live Preview</span>
              </div>
              <div className="text-gray-400">|</div>
              <div className="text-gray-300">
                {layers.filter(l => l.visible).length} layers
              </div>
              <div className="text-gray-400">|</div>
              <div className="text-gray-300">
                {effects.filter(e => e.enabled).length} effects
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
