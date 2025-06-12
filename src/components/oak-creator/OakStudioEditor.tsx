
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCardEditor } from '@/hooks/useCardEditor';
import { useStudioState } from '@/hooks/useStudioState';
import { ProfessionalToolbar } from '@/components/studio/interface/ProfessionalToolbar';
import { EnhancedExportDialog } from '@/components/studio/export/EnhancedExportDialog';
import { StudioLayout } from '@/components/studio/interface/StudioLayout';
import { StudioCardRenderer } from '@/components/studio/renderer/StudioCardRenderer';
import { StudioMainView } from '@/components/studio/interface/StudioMainView';
import { StudioTabContent } from '@/components/studio/interface/StudioTabContent';
import { useStudioEffects } from '@/components/studio/hooks/useStudioEffects';
import { useStudioProject } from '@/components/studio/hooks/useStudioProject';
import { OAK_STUDIO_CONFIG } from './OakStudioConfig';
import { OakTemplate } from '@/types/oakTemplates';

interface OakStudioEditorProps {
  selectedTemplate: OakTemplate | null;
  onBack: () => void;
}

export const OakStudioEditor: React.FC<OakStudioEditorProps> = ({
  selectedTemplate,
  onBack
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('photo');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCRDBack, setShowCRDBack] = useState(false);
  const [show3DPreview, setShow3DPreview] = useState(true);
  const exportRef = useRef<HTMLDivElement>(null);

  // Studio hooks
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

  // Initialize card editor with Oakland A's defaults
  const cardEditor = useCardEditor({
    initialData: {
      title: selectedTemplate ? `${selectedTemplate.name} Memory Card` : 'Oakland A\'s Memory',
      rarity: 'rare',
      tags: ['oakland-as', 'baseball', 'memory'],
      design_metadata: {
        template_id: selectedTemplate?.id || 'oakland-classic',
        studioSettings: studioState,
        advanced3DEffects,
        oaklandTheme: true
      },
      template_id: selectedTemplate?.id || 'oakland-classic',
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

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCurrentPhoto(url);
      cardEditor.updateCardField('image_url', url);
      setActiveTab('3d-preview');
      toast.success('Photo uploaded! Your Oakland A\'s memory card is ready for customization.');
    }
  };

  const templateForRenderer = selectedTemplate ? {
    id: selectedTemplate.id,
    name: selectedTemplate.name,
    template_data: {
      background_color: selectedTemplate.colors?.primary || '#0f4c3a',
      border_color: selectedTemplate.colors?.secondary || '#ffd700',
      text_color: selectedTemplate.colors?.accent || '#ffffff',
      layout: 'full-bleed' as const,
      style: 'vintage' as const
    }
  } : OAK_STUDIO_CONFIG.templates[0];

  // Oakland A's specific tabs
  const oakTabs = [
    { id: 'photo', label: 'Add Photo', icon: 'Camera' },
    { id: '3d-preview', label: '3D Preview', icon: 'Box' },
    { id: 'effects', label: 'Effects', icon: 'Sparkles' },
    { id: 'lighting', label: 'Lighting', icon: 'Sun' },
    { id: 'export', label: 'Export', icon: 'Download' }
  ];

  return (
    <div className="h-screen bg-[#0f4c3a] flex flex-col">
      {/* Oakland A's themed header - hide in fullscreen */}
      {!isFullscreen && (
        <div className="bg-[#0f4c3a] border-b border-[#ffd700]/20">
          <ProfessionalToolbar
            projectName={projectName || "Oakland A's Memory"}
            onProjectNameChange={setProjectName}
            onSave={() => handleSaveProject(
              cardEditor,
              currentPhoto,
              effectLayers,
              studioState,
              advanced3DEffects,
              templateForRenderer
            )}
            onExport={() => setShowExportDialog(true)}
            onShare={() => toast.success('Share your Oakland A\'s memory!')}
            onBack={onBack}
          />
        </div>
      )}

      <div className={`flex ${isFullscreen ? 'h-full' : 'h-[calc(100vh-4rem)]'}`}>
        {/* Oakland A's themed sidebar - hide in fullscreen */}
        {!isFullscreen && (
          <div className="w-80 bg-[#1a5c47] border-r border-[#ffd700]/20 overflow-y-auto">
            <div className="p-4 border-b border-[#ffd700]/20">
              <h2 className="text-[#ffd700] font-bold text-lg">Oakland A's Studio</h2>
              <p className="text-white/80 text-sm">Create your memory card</p>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="h-full">
              <TabsList className="grid grid-cols-1 h-auto bg-transparent p-2 gap-1">
                {oakTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="w-full justify-start data-[state=active]:bg-[#ffd700] data-[state=active]:text-[#0f4c3a] text-white hover:bg-[#ffd700]/20 transition-colors"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="p-4">
                {oakTabs.map((tab) => (
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
                      setShowVectorEditor={() => {}}
                      setShowExportDialog={setShowExportDialog}
                      setAdvanced3DEffects={setAdvanced3DEffects}
                      onPhotoUpload={() => document.getElementById('oak-photo-upload')?.click()}
                      addEffectLayer={addEffectLayer}
                      updateEffectLayer={updateEffectLayer}
                      removeEffectLayer={removeEffectLayer}
                      toggleLayerVisibility={toggleLayerVisibility}
                      setSelectedLayerId={setSelectedLayerId}
                      updateLighting={updateLighting}
                      updateDesign={updateDesign}
                      updateLayer={(updates) => {
                        if (studioState.selectedLayerId) {
                          updateLayer(studioState.selectedLayerId, updates);
                        }
                      }}
                      addLayer={addLayer}
                      removeLayer={removeLayer}
                      reorderLayers={reorderLayers}
                      selectLayer={selectLayer}
                      applyLightingPreset={applyLightingPreset}
                      handleAddElement={() => {}}
                      handleExport={() => handleExport(exportRef, cardEditor.cardData.title)}
                    />
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          </div>
        )}

        {/* Enhanced main canvas with responsive sizing */}
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
          onPhotoUpload={() => document.getElementById('oak-photo-upload')?.click()}
          onElementSelect={(elementId) => {
            selectLayer(elementId);
            toast.info(`Selected ${elementId} layer`);
          }}
        />
      </div>

      {/* Export dialog */}
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

      {/* Hidden export renderer */}
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
        id="oak-photo-upload"
      />

      {/* Fullscreen exit button when in fullscreen mode */}
      {isFullscreen && (
        <div className="absolute top-4 left-4 z-50">
          <Button
            onClick={() => setIsFullscreen(false)}
            className="bg-[#ffd700] hover:bg-[#ffd700]/90 text-[#0f4c3a] font-bold"
          >
            Exit Fullscreen
          </Button>
        </div>
      )}
    </div>
  );
};
