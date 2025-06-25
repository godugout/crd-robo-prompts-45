
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { WorkflowNavigation } from './workflow/WorkflowNavigation';
import { FrameSelectionStep } from './steps/FrameSelectionStep';
import { ElementsStep } from './steps/ElementsStep';
import { PreviewStep } from './steps/PreviewStep';
import { EffectsStep } from './steps/EffectsStep';
import { Advanced3DCard } from './3d/Advanced3DCard';
import { useAdvancedCardStudio } from './hooks/useAdvancedCardStudio';
import { StudioToolbar } from './components/StudioToolbar';
import { PreviewControls } from './components/PreviewControls';
import { getFrameById } from './data/enhancedFrames';

export const AdvancedCardStudio: React.FC = () => {
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

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const handleStepComplete = (stepIndex: number) => {
    setCompletedSteps(prev => new Set([...prev, stepIndex]));
    if (stepIndex < 3) {
      setCurrentStep(stepIndex + 1);
    }
  };

  const handleFrameSelect = (frameId: string) => {
    selectFrame(frameId);
    const frameData = getFrameById(frameId);
    if (frameData) {
      updateCardData({
        design_metadata: {
          ...cardData.design_metadata,
          template: frameData.template_data
        }
      });
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <FrameSelectionStep
            selectedFrame={selectedFrame}
            onFrameSelect={handleFrameSelect}
            onComplete={() => handleStepComplete(0)}
          />
        );
      case 1:
        return (
          <ElementsStep
            cardData={cardData}
            onUpdateCardData={updateCardData}
            onComplete={() => handleStepComplete(1)}
          />
        );
      case 2:
        return (
          <PreviewStep
            cardData={cardData}
            isPlaying={isPlaying}
            onToggleAnimation={toggleAnimation}
            onComplete={() => handleStepComplete(2)}
          />
        );
      case 3:
        return (
          <EffectsStep
            effects={effects}
            materials={materials}
            onApplyEffect={applyEffect}
            onUpdateMaterial={updateMaterial}
            onComplete={() => handleStepComplete(3)}
          />
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
            Professional Card Studio
          </h1>
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
            Premium Tools
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

      {/* Workflow Navigation */}
      <WorkflowNavigation
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepChange={setCurrentStep}
      />

      {/* Main Content */}
      <div className="flex h-[calc(100vh-8rem)]">
        {/* Left Sidebar - Step Content */}
        <motion.div
          className="w-96 bg-black/30 backdrop-blur-xl border-r border-white/10 overflow-y-auto"
          initial={{ x: -384 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {renderCurrentStep()}
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
          <PreviewControls
            isPlaying={isPlaying}
            previewMode="design"
            onToggleAnimation={toggleAnimation}
            onModeChange={() => {}}
          />

          {/* Enhanced Status Bar */}
          <div className="absolute bottom-4 left-4 bg-black/90 backdrop-blur-md p-4 rounded-xl z-10 border border-white/20">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white">Live Preview</span>
              </div>
              <div className="text-gray-400">|</div>
              <div className="text-gray-300">
                Step {currentStep + 1}/4 • {layers.filter(l => l.visible).length} layers
              </div>
              {selectedFrame && (
                <>
                  <div className="text-gray-400">|</div>
                  <div className="text-gray-300">
                    Frame: {getFrameById(selectedFrame)?.name || 'Custom'}
                  </div>
                </>
              )}
              <div className="text-gray-400">|</div>
              <div className="text-gray-300">
                {effects.filter(e => e.enabled).length} effects active
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-md p-3 rounded-xl z-10 border border-white/20">
            <div className="flex items-center space-x-2">
              <div className="text-white text-sm font-medium">
                {Math.round(((completedSteps.size) / 4) * 100)}% Complete
              </div>
              <div className="w-20 bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300"
                  style={{ width: `${(completedSteps.size / 4) * 100}%` }}
                />
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
