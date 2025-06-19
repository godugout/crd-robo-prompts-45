
import React from 'react';
import { EnhancedStudioCardPreview } from './components/EnhancedStudioCardPreview';
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
    showBackgroundRemoval
  } = useStudioState();

  const {
    handleImageUpload,
    handleFrameSelect,
    handleEffectChange,
    handlePhaseChange,
    handleUndo,
    handleToggleBackgroundRemoval
  } = useStudioActions();

  const autoSaveStats = autoSaveService.getStats();

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
              onImageUpload={handleImageUpload}
              onFrameSelect={handleFrameSelect}
              onEffectChange={handleEffectChange}
              onToggleBackgroundRemoval={handleToggleBackgroundRemoval}
              onExportDialogOpen={() => setShowExportDialog(true)}
            />
          </div>

          {/* 3D Preview */}
          <div className="flex-1 bg-black relative">
            <EnhancedStudioCardPreview
              uploadedImage={uploadedImage}
              selectedFrame={selectedFrame}
              effectValues={effectValues}
              processedImage={processedImage}
              isProcessing={isProcessingImage}
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
