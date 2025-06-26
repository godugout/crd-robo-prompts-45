
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WorkflowNavigation } from './workflow/WorkflowNavigation';
import { FrameSelectionStep } from './steps/FrameSelectionStep';
import { ElementsStep } from './steps/ElementsStep';
import { PreviewStep } from './steps/PreviewStep';
import { EffectsStep } from './steps/EffectsStep';
import { Advanced3DCard } from './3d/Advanced3DCard';
import { useIntegratedCardEditor } from '@/hooks/useIntegratedCardEditor';
import { PreviewControls } from './components/PreviewControls';
import { getFrameById } from './data/enhancedFrames';
import { Save, Eye, Upload } from 'lucide-react';

export const AdvancedCardStudio: React.FC = () => {
  const editor = useIntegratedCardEditor();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);

  if (!editor.user) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-gray-400 mb-6">Please sign in to use the Card Studio</p>
          <Button onClick={() => window.location.href = '/auth/signin'}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const handleStepComplete = (stepIndex: number) => {
    setCompletedSteps(prev => new Set([...prev, stepIndex]));
    if (stepIndex < 3) {
      setCurrentStep(stepIndex + 1);
    }
  };

  const handleFrameSelect = (frameId: string) => {
    editor.selectFrame(frameId);
    const frameData = getFrameById(frameId);
    if (frameData) {
      editor.updateCardData({
        design_metadata: {
          ...editor.cardData.design_metadata,
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
            selectedFrame={editor.selectedFrame}
            onFrameSelect={handleFrameSelect}
            onComplete={() => handleStepComplete(0)}
          />
        );
      case 1:
        return (
          <ElementsStep
            cardData={editor.cardData}
            onUpdateCardData={editor.updateCardData}
            onComplete={() => handleStepComplete(1)}
          />
        );
      case 2:
        return (
          <PreviewStep
            cardData={editor.cardData}
            isPlaying={isPlaying}
            onToggleAnimation={() => setIsPlaying(!isPlaying)}
            onComplete={() => handleStepComplete(2)}
          />
        );
      case 3:
        return (
          <EffectsStep
            effects={[]}
            materials={[]}
            onApplyEffect={() => {}}
            onUpdateMaterial={() => {}}
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
        
        {/* Save Controls */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.saveCard(false)}
            disabled={editor.isSaving}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Save className="w-4 h-4 mr-2" />
            {editor.isSaving ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button
            size="sm"
            onClick={() => editor.publishCard()}
            disabled={editor.isSaving}
            className="bg-crd-green text-black hover:bg-crd-green/90"
          >
            <Eye className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
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
          <div className="p-6">
            {/* Card Info */}
            <div className="mb-6 p-4 bg-white/5 rounded-lg">
              <h3 className="text-white font-medium mb-2">Card Details</h3>
              <input
                type="text"
                value={editor.cardData.title}
                onChange={(e) => editor.updateField('title', e.target.value)}
                className="w-full bg-black/20 border border-white/20 rounded px-3 py-2 text-white mb-2"
                placeholder="Card Title"
              />
              <textarea
                value={editor.cardData.description}
                onChange={(e) => editor.updateField('description', e.target.value)}
                className="w-full bg-black/20 border border-white/20 rounded px-3 py-2 text-white"
                placeholder="Card Description"
                rows={2}
              />
            </div>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-2">
                <Upload className="w-4 h-4 inline mr-2" />
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    editor.handleImageUpload(file);
                  }
                }}
                className="w-full text-white"
              />
            </div>
            
            {renderCurrentStep()}
          </div>
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
                cardData={editor.cardData}
                layers={editor.layers}
                effects={[]}
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
            onToggleAnimation={() => setIsPlaying(!isPlaying)}
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
                Step {currentStep + 1}/4 • {editor.layers.filter(l => l.visible).length} layers
              </div>
              {editor.selectedFrame && (
                <>
                  <div className="text-gray-400">|</div>
                  <div className="text-gray-300">
                    Frame: {getFrameById(editor.selectedFrame)?.name || 'Custom'}
                  </div>
                </>
              )}
              <div className="text-gray-400">|</div>
              <div className="text-gray-300">
                {editor.uploadedImages.length} images uploaded
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
    </div>
  );
};
