import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Advanced3DCard } from './3d/Advanced3DCard';
import { PreviewControls } from '@/components/studio/components/PreviewControls';
import { WorkflowNavigation } from '@/components/studio/workflow/WorkflowNavigation';
import { useAdvancedCardStudio } from '@/components/studio/hooks/useAdvancedCardStudio';
import { useIntegratedCardEditor } from '@/hooks/useIntegratedCardEditor';
import { Button } from '@/components/ui/button';

import { LayerPanel } from './layers/LayerPanel';
import { EffectPanel } from './effects/EffectPanel';

export const AdvancedCardStudio = () => {
  const {
    cardData,
    layers,
    effects,
    materials,
    selectedLayer,
    selectedFrame,
    history,
    isPlaying,
    updateCardData,
    addLayer,
    updateLayer,
    removeLayer,
    selectLayer,
    selectFrame,
    applyEffect,
    updateMaterial,
    undo,
    redo,
    save,
    toggleAnimation
  } = useAdvancedCardStudio();

  const {
    user,
    cardData: editorCardData,
    updateField,
    selectFrame: editorSelectFrame,
    handleImageUpload,
    saveCard,
    publishCard,
    isSaving
  } = useIntegratedCardEditor();

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [sidePanel, setSidePanel< 'layers' | 'effects' | null>('layers');

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Authentication Required</h2>
          <p className="text-gray-700">Please sign in to access the card studio.</p>
        </div>
      </div>
    );
  }

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    if (step > 0) {
      setCompletedSteps(prev => new Set([...prev, step - 1]));
    }
  };

  const handleFrameSelect = (frameId: string) => {
    selectFrame(frameId);
    editorSelectFrame(frameId);
    setCompletedSteps(prev => new Set([...prev, 0]));
  };

  const handleImageUploadWrapper = async (file: File) => {
    await handleImageUpload(file);
    
    // Add image layer if it doesn't exist
    const hasImageLayer = layers.some(layer => layer.type === 'image');
    if (!hasImageLayer) {
      addLayer('image');
    }
  };

  const handleEffectAdd = (type: 'holographic' | 'chrome' | 'glow' | 'particle' | 'distortion') => {
    applyEffect({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      type,
      enabled: true,
      intensity: 50,
      parameters: type === 'glow' ? { color: '#ffd700' } : {}
    });
  };

  const handleEffectUpdate = (effectId: string, updates: any) => {
    // Update effect logic here
    console.log('Updating effect:', effectId, updates);
  };

  const handleEffectRemove = (effectId: string) => {
    // Remove effect logic here
    console.log('Removing effect:', effectId);
  };

  const handleSave = async () => {
    // Sync data between studio and editor
    updateField('title', cardData.title);
    updateField('description', cardData.description);
    updateField('rarity', cardData.rarity as any);
    updateField('design_metadata', { layers, effects, selectedFrame });
    
    const success = await saveCard();
    if (success) {
      console.log('Card saved successfully');
    }
  };

  const handlePublish = async () => {
    // Sync data and publish
    updateField('title', cardData.title);
    updateField('description', cardData.description);
    updateField('rarity', cardData.rarity as any);
    updateField('design_metadata', { layers, effects, selectedFrame });
    updateField('is_public', true);
    
    const success = await publishCard();
    if (success) {
      console.log('Card published successfully');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-crd-dark via-crd-mediumGray to-crd-dark">
      <WorkflowNavigation
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepChange={handleStepChange}
      />

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* 3D Preview */}
          <div className="flex-1 relative">
            <Canvas
              camera={{ position: [0, 0, 5], fov: 50 }}
              style={{ background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)' }}
            >
              <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4a9eff" />
                
                <Advanced3DCard
                  cardData={{
                    title: cardData.title,
                    description: cardData.description,
                    image_url: editorCardData.image_url,
                    rarity: cardData.rarity,
                    design_metadata: cardData.design_metadata
                  }}
                  layers={layers}
                  effects={effects}
                  materials={materials}
                  isPlaying={isPlaying}
                  previewMode="full"
                />
                
                <OrbitControls
                  enablePan={false}
                  enableZoom={true}
                  maxDistance={10}
                  minDistance={2}
                />
              </Suspense>
            </Canvas>

            <PreviewControls
              isPlaying={isPlaying}
              previewMode="full"
              onToggleAnimation={toggleAnimation}
              onModeChange={() => {}}
            />
          </div>

          {/* Bottom Toolbar */}
          <div className="h-16 bg-black/90 backdrop-blur-md border-t border-white/10 flex items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <Button
                variant={sidePanel === 'layers' ? 'default' : 'ghost'}
                onClick={() => setSidePanel(sidePanel === 'layers' ? null : 'layers')}
                className="text-white"
              >
                Layers
              </Button>
              <Button
                variant={sidePanel === 'effects' ? 'default' : 'ghost'}
                onClick={() => setSidePanel(sidePanel === 'effects' ? null : 'effects')}
                className="text-white"
              >
                Effects
              </Button>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={isSaving}
                className="border-white/20 text-white hover:bg-white/10"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
              <Button
                onClick={handlePublish}
                disabled={isSaving}
                className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
              >
                {isSaving ? 'Publishing...' : 'Publish Card'}
              </Button>
            </div>
          </div>
        </div>

        {/* Side Panels */}
        {sidePanel === 'layers' && (
          <LayerPanel
            layers={layers}
            selectedLayerId={selectedLayer}
            onLayerSelect={selectLayer}
            onLayerUpdate={updateLayer}
            onLayerRemove={removeLayer}
            onAddLayer={addLayer}
          />
        )}

        {sidePanel === 'effects' && (
          <EffectPanel
            effects={effects}
            onEffectAdd={handleEffectAdd}
            onEffectUpdate={handleEffectUpdate}
            onEffectRemove={handleEffectRemove}
          />
        )}
      </div>
    </div>
  );
};
