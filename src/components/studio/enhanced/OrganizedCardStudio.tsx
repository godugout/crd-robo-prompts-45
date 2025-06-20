
import React from 'react';
import { AdaptiveCardPreview } from './components/AdaptiveCardPreview';
import { QuickActions } from './components/QuickActions';
import { ExportDialog } from './components/ExportDialog';
import { StudioMainHeader } from './components/StudioMainHeader';
import { PhaseNavigation } from './components/PhaseNavigation';
import { PhaseContentRenderer } from './components/PhaseContentRenderer';
import { useStudioState } from './hooks/useStudioState';
import { useStudioActions } from './hooks/useStudioActions';
import { autoSaveService } from '@/services/autosave/AutoSaveService';

export const OrganizedCardStudio: React.FC = () => {
  const {
    currentPhase,
    uploadedImage,
    selectedFrame,
    effectValues,
    showExportDialog,
    setShowExportDialog,
    processedImage,
    currentDraft,
    isProcessingImage,
    imageLoadError,
    showBackgroundRemoval,
    cardOrientation,
    setCardOrientation
  } = useStudioState();

  const {
    handleImageUpload,
    handleFrameSelect,
    handleEffectChange,
    handlePhaseChange,
    handleUndo,
    handleToggleBackgroundRemoval,
    handleReset
  } = useStudioActions();

  const autoSaveStats = autoSaveService.getStats();

  // Create a simplified image upload handler for the preview component
  const handlePreviewImageUpload = () => {
    // Trigger the file input or upload modal
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        await handleImageUpload(imageUrl);
      }
    };
    fileInput.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-editor-dark via-black to-editor-dark">
      {/* Enhanced Studio Header */}
      <StudioMainHeader
        currentPhase={currentPhase}
        onUndo={handleUndo}
      />

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Phase Navigation */}
        <PhaseNavigation
          currentPhase={currentPhase}
          uploadedImage={uploadedImage}
          selectedFrame={selectedFrame}
          onPhaseChange={handlePhaseChange}
          onReset={handleReset}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Controls Panel */}
          <div className="w-96 bg-editor-tool border-r border-editor-border overflow-y-auto">
            <PhaseContentRenderer
              currentPhase={currentPhase}
              uploadedImage={uploadedImage}
              selectedFrame={selectedFrame}
              effectValues={effectValues}
              processedImage={processedImage}
              isProcessingImage={isProcessingImage}
              imageLoadError={imageLoadError}
              showBackgroundRemoval={showBackgroundRemoval}
              cardOrientation={cardOrientation}
              onImageUpload={handleImageUpload}
              onFrameSelect={handleFrameSelect}
              onEffectChange={handleEffectChange}
              onToggleBackgroundRemoval={handleToggleBackgroundRemoval}
              onOrientationChange={setCardOrientation}
              onExportDialogOpen={() => setShowExportDialog(true)}
            />
          </div>

          {/* Adaptive Preview */}
          <div className="flex-1 bg-black relative">
            <AdaptiveCardPreview
              currentPhase={currentPhase}
              uploadedImage={uploadedImage}
              selectedFrame={selectedFrame}
              effectValues={effectValues}
              processedImage={processedImage}
              isProcessing={isProcessingImage}
              cardOrientation={cardOrientation}
              onImageUpload={handlePreviewImageUpload}
            />
          </div>
        </div>

        {/* Right Sidebar - Quick Actions */}
        <div className="w-64 bg-editor-tool border-l border-editor-border">
          <QuickActions
            uploadedImage={uploadedImage}
            selectedFrame={selectedFrame}
            effectValues={effectValues}
            onExport={() => setShowExportDialog(true)}
            currentDraft={currentDraft}
            autoSaveStats={autoSaveStats}
          />
        </div>
      </div>

      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        cardData={{
          uploadedImage,
          selectedFrame,
          effectValues
        }}
      />
    </div>
  );
};
