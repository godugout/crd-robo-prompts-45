
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCardEditor } from '@/hooks/useCardEditor';
import { useStudioState } from '@/hooks/useStudioState';
import { DEFAULT_TEMPLATES } from '@/components/editor/wizard/wizardConfig';
import { ProfessionalToolbar } from './interface/ProfessionalToolbar';
import { EnhancedExportDialog } from './export/EnhancedExportDialog';
import { StudioLayout } from './interface/StudioLayout';
import { VectorGraphicsEngine } from './advanced/VectorGraphicsEngine';
import { StudioCardRenderer } from './renderer/StudioCardRenderer';
import { STUDIO_TABS } from './interface/StudioTabs';
import { StudioTabContent } from './interface/StudioTabContent';
import { StudioMainView } from './interface/StudioMainView';
import { useStudioEffects } from './hooks/useStudioEffects';
import { useStudioProject } from './hooks/useStudioProject';

export const CardStudio: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('photo');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState(DEFAULT_TEMPLATES[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCRDBack, setShowCRDBack] = useState(false);
  const [show3DPreview, setShow3DPreview] = useState(false);
  const [showVectorEditor, setShowVectorEditor] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  // Custom hooks
  const {
    effectLayers,
    selectedLayerId,
    advanced3DEffects,
    setSelectedLayerId,
    setAdvanced3DEffects,
    addEffectLayer,
    updateEffectLayer,
    removeEffectLayer,
    toggleLayerVisibility
  } = useStudioEffects();

  const {
    projectName,
    isExporting,
    setProjectName,
    handleSaveProject,
    handleExport
  } = useStudioProject();

  // Studio state management
  const {
    studioState,
    updateLighting,
    updateDesign,
    updateLayer,
    addLayer,
    removeLayer,
    reorderLayers,
    selectLayer,
    applyLightingPreset
  } = useStudioState();

  const cardEditor = useCardEditor({
    initialData: {
      title: 'My Studio Card',
      rarity: 'rare',
      tags: ['studio', 'professional', 'advanced'],
      design_metadata: {
        ...selectedTemplate.template_data,
        studioSettings: studioState,
        advanced3DEffects
      },
      template_id: selectedTemplate.id,
      visibility: 'private',
      creator_attribution: { collaboration_type: 'solo' },
      publishing_options: {
        marketplace_listing: false,
        crd_catalog_inclusion: true,
        print_available: true,
        pricing: { currency: 'USD' },
        distribution: { limited_edition: false }
      }
    },
    autoSave: true
  });

  // Update card editor when studio state changes
  useEffect(() => {
    cardEditor.updateDesignMetadata('studioSettings', studioState);
    cardEditor.updateDesignMetadata('advanced3DEffects', advanced3DEffects);
  }, [studioState, advanced3DEffects]);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCurrentPhoto(url);
      cardEditor.updateCardField('image_url', url);
      setActiveTab('3d-preview');
      toast.success('Photo uploaded! Try the enhanced 3D preview and vector tools.');
    }
  };

  const handleImageProcessed = (processedUrl: string) => {
    setCurrentPhoto(processedUrl);
    cardEditor.updateCardField('image_url', processedUrl);
    toast.success('Image processing complete!');
  };

  const handleAddElement = (type: string) => {
    if (type === 'vector') {
      setShowVectorEditor(true);
      toast.success('Vector editor opened!');
    } else {
      toast.success(`${type} element will be added to the card`);
    }
  };

  // Wrapper functions to match expected signatures
  const handleUpdateLayer = (updates: any) => {
    if (studioState.selectedLayerId) {
      updateLayer(studioState.selectedLayerId, updates);
    }
  };

  const handleReorderLayers = (layers: any[]) => {
    // Convert array-based reorder to index-based for the hook
    layers.forEach((layer, index) => {
      const currentIndex = studioState.layers.findIndex(l => l.id === layer.id);
      if (currentIndex !== index && currentIndex !== -1) {
        reorderLayers(currentIndex, index);
      }
    });
  };

  const templateForRenderer = {
    id: selectedTemplate.id,
    name: selectedTemplate.name,
    template_data: selectedTemplate.template_data
  };

  return (
    <StudioLayout>
      {/* Professional Header with Toolbar */}
      <ProfessionalToolbar
        projectName={projectName}
        onProjectNameChange={setProjectName}
        onSave={() => handleSaveProject(
          cardEditor,
          currentPhoto,
          effectLayers,
          studioState,
          advanced3DEffects,
          selectedTemplate
        )}
        onExport={() => setShowExportDialog(true)}
        onShare={() => toast.success('Share feature coming soon!')}
        onBack={() => navigate('/cards')}
      />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Enhanced Sidebar with tabs */}
        <div className="w-80 bg-editor-dark border-r border-editor-border overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="h-full">
            <TabsList className="grid grid-cols-1 h-auto bg-transparent p-2 gap-1">
              {STUDIO_TABS.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="w-full justify-start data-[state=active]:bg-crd-green data-[state=active]:text-black text-white hover:bg-editor-border transition-colors"
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                  {tab.category === 'advanced' && (
                    <span className="ml-auto text-xs bg-crd-green text-black px-1.5 py-0.5 rounded-full">
                      NEW
                    </span>
                  )}
                  {tab.category === 'effects' && effectLayers.length > 0 && (
                    <span className="ml-auto text-xs bg-crd-purple text-white px-1.5 py-0.5 rounded-full">
                      {effectLayers.filter(l => l.visible).length}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="p-4 border-t border-editor-border">
              {STUDIO_TABS.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="mt-0">
                  <StudioTabContent
                    activeTab={activeTab}
                    currentPhoto={currentPhoto}
                    cardData={cardEditor.cardData}
                    advanced3DEffects={advanced3DEffects}
                    effectLayers={effectLayers}
                    selectedLayerId={selectedLayerId}
                    studioState={studioState}
                    show3DPreview={show3DPreview}
                    showCRDBack={showCRDBack}
                    isFullscreen={isFullscreen}
                    isExporting={isExporting}
                    setShow3DPreview={setShow3DPreview}
                    setShowCRDBack={setShowCRDBack}
                    setIsFullscreen={setIsFullscreen}
                    setShowVectorEditor={setShowVectorEditor}
                    setShowExportDialog={setShowExportDialog}
                    setAdvanced3DEffects={setAdvanced3DEffects}
                    onPhotoUpload={() => document.getElementById('photo-upload')?.click()}
                    addEffectLayer={addEffectLayer}
                    updateEffectLayer={updateEffectLayer}
                    removeEffectLayer={removeEffectLayer}
                    toggleLayerVisibility={toggleLayerVisibility}
                    setSelectedLayerId={setSelectedLayerId}
                    updateLighting={updateLighting}
                    updateDesign={updateDesign}
                    updateLayer={handleUpdateLayer}
                    addLayer={addLayer}
                    removeLayer={removeLayer}
                    reorderLayers={handleReorderLayers}
                    selectLayer={selectLayer}
                    applyLightingPreset={applyLightingPreset}
                    handleAddElement={handleAddElement}
                    handleExport={() => handleExport(exportRef, cardEditor.cardData.title)}
                  />
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>

        {/* Enhanced Main Canvas */}
        <StudioMainView
          show3DPreview={show3DPreview}
          showCRDBack={showCRDBack}
          isFullscreen={isFullscreen}
          currentPhoto={currentPhoto}
          cardData={cardEditor.cardData}
          advanced3DEffects={advanced3DEffects}
          templateForRenderer={templateForRenderer}
          studioState={studioState}
          setShow3DPreview={setShow3DPreview}
          setShowCRDBack={setShowCRDBack}
          setIsFullscreen={setIsFullscreen}
          onPhotoUpload={() => document.getElementById('photo-upload')?.click()}
          onElementSelect={(elementId) => {
            selectLayer(elementId);
            toast.info(`Selected ${elementId} layer`);
          }}
        />
      </div>

      {/* Advanced Modals */}
      {showVectorEditor && (
        <div className="fixed inset-0 bg-black z-50">
          <div className="h-full">
            <VectorGraphicsEngine
              width={750}
              height={1050}
              onElementsChange={(elements) => {
                console.log('Vector elements updated:', elements);
              }}
              onExport={(dataUrl) => {
                console.log('Vector design exported:', dataUrl);
                setShowVectorEditor(false);
                toast.success('Vector design exported!');
              }}
            />
          </div>
          <Button
            onClick={() => setShowVectorEditor(false)}
            className="absolute top-4 right-4 bg-crd-green hover:bg-crd-green/90 text-black"
          >
            Close Vector Editor
          </Button>
        </div>
      )}

      {showExportDialog && (
        <EnhancedExportDialog
          cardData={cardEditor.cardData}
          currentPhoto={currentPhoto}
          effectLayers={effectLayers}
          showCRDBack={showCRDBack}
          onClose={() => setShowExportDialog(false)}
          onExport={() => handleExport(exportRef, cardEditor.cardData.title)}
        />
      )}

      {/* Hidden Export Renderer */}
      <div ref={exportRef} className="absolute -left-[9999px] -top-[9999px] pointer-events-none">
        <StudioCardRenderer
          template={templateForRenderer}
          cardData={cardEditor.cardData}
          currentPhoto={currentPhoto}
          studioState={studioState}
          dimensions={{ width: 750, height: 1050 }}
        />
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
        id="photo-upload"
      />
    </StudioLayout>
  );
};
