
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Image, Sparkles, Layers, Settings, Eye, Download, Wand2, History, RotateCcw } from 'lucide-react';
import { UploadPhase } from './components/UploadPhase';
import { FrameSelectionPhase } from './components/FrameSelectionPhase';
import { EffectControlsPhase } from './components/EffectControlsPhase';
import { EnhancedStudioCardPreview } from './components/EnhancedStudioCardPreview';
import { StudioHeader } from './components/StudioHeader';
import { QuickActions } from './components/QuickActions';
import { LayerManager } from './components/LayerManager';
import { ExportDialog } from './components/ExportDialog';
import { imageProcessingService, ProcessedImage } from '@/services/imageProcessing/ImageProcessingService';
import { autoSaveService, CardDraft } from '@/services/autosave/AutoSaveService';
import { toast } from 'sonner';

type StudioPhase = 'upload' | 'frames' | 'effects' | 'layers' | 'export';

export const OrganizedCardStudio: React.FC = () => {
  // Core state
  const [currentPhase, setCurrentPhase] = useState<StudioPhase>('upload');
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [selectedFrame, setSelectedFrame] = useState<string>('');
  const [effectValues, setEffectValues] = useState<Record<string, any>>({});
  const [showExportDialog, setShowExportDialog] = useState(false);
  
  // Enhanced state for new features
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [currentDraft, setCurrentDraft] = useState<CardDraft | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [imageLoadError, setImageLoadError] = useState<string>('');
  const [showBackgroundRemoval, setShowBackgroundRemoval] = useState(false);
  
  // Auto-save tracking
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSaveTimeRef = useRef<number>(0);

  // Initialize from existing draft
  useEffect(() => {
    const existingDraft = autoSaveService.getCurrentDraft();
    if (existingDraft) {
      console.log('📋 Loading existing draft:', existingDraft.id);
      setCurrentDraft(existingDraft);
      setUploadedImage(existingDraft.uploadedImage || '');
      setSelectedFrame(existingDraft.selectedFrame || '');
      setEffectValues(existingDraft.effectValues || {});
      
      if (existingDraft.uploadedImage) {
        setCurrentPhase('frames');
      }
      
      toast.success('Resumed previous session');
    }
  }, []);

  // Auto-save functionality
  const triggerAutoSave = useCallback((action: string, updates: Partial<CardDraft>) => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      if (currentDraft) {
        autoSaveService.updateDraft(updates, action);
        lastSaveTimeRef.current = Date.now();
        console.log('💾 Auto-saved:', action);
      }
    }, 300); // Auto-save after 300ms of inactivity
  }, [currentDraft]);

  // Enhanced image upload handler with processing
  const handleImageUpload = useCallback(async (imageUrl: string) => {
    console.log('🔄 Processing uploaded image:', imageUrl);
    setIsProcessingImage(true);
    setImageLoadError('');
    
    try {
      // Validate the image first
      const isValid = await imageProcessingService.isImageValid(imageUrl);
      if (!isValid) {
        throw new Error('Invalid or corrupted image file');
      }

      // Process the image (with optional background removal)
      const processed = await imageProcessingService.processImage(imageUrl, {
        removeBackground: showBackgroundRemoval
      });

      setProcessedImage(processed);
      setUploadedImage(processed.processedUrl);

      // Create or update draft
      if (!currentDraft) {
        const newDraft = autoSaveService.createDraft(processed.processedUrl);
        setCurrentDraft(newDraft);
      } else {
        autoSaveService.updateDraft({
          uploadedImage: processed.processedUrl,
          processing: {
            ...currentDraft.processing,
            imageValidated: true,
            backgroundRemoved: !processed.hasBackground
          }
        }, 'image_upload');
      }

      // Auto-advance to frames phase
      if (currentPhase === 'upload') {
        setCurrentPhase('frames');
      }
      
      toast.success('Image processed successfully! Now select a frame.');
    } catch (error) {
      console.error('❌ Image processing failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process image';
      setImageLoadError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessingImage(false);
    }
  }, [currentPhase, currentDraft, showBackgroundRemoval]);

  const handleFrameSelect = useCallback((frameId: string) => {
    console.log('🖼️ Frame selected:', frameId);
    setSelectedFrame(frameId);
    
    triggerAutoSave('frame_select', {
      selectedFrame: frameId,
      processing: {
        ...currentDraft?.processing,
        frameApplied: true
      }
    });
    
    toast.success(`Frame "${frameId}" applied successfully!`);
  }, [currentDraft, triggerAutoSave]);

  const handleEffectChange = useCallback((effectId: string, value: any) => {
    console.log('✨ Effect changed:', effectId, value);
    const newEffectValues = {
      ...effectValues,
      [effectId]: value
    };
    
    setEffectValues(newEffectValues);
    triggerAutoSave('effect_change', { effectValues: newEffectValues });
  }, [effectValues, triggerAutoSave]);

  const handlePhaseChange = useCallback((phase: StudioPhase) => {
    console.log('🔄 Phase change:', currentPhase, '->', phase);
    
    // Validate phase change requirements
    if (phase === 'frames' && !uploadedImage) {
      toast.error('Please upload an image first');
      return;
    }
    
    if (phase === 'effects' && (!uploadedImage || !selectedFrame)) {
      toast.error('Please upload an image and select a frame first');
      return;
    }
    
    setCurrentPhase(phase);
    triggerAutoSave('phase_change', { metadata: { ...currentDraft?.metadata, currentPhase: phase } });
  }, [currentPhase, uploadedImage, selectedFrame, currentDraft, triggerAutoSave]);

  const handleUndo = useCallback(() => {
    if (autoSaveService.canUndo()) {
      const success = autoSaveService.undo();
      if (success) {
        const updatedDraft = autoSaveService.getCurrentDraft();
        if (updatedDraft) {
          setCurrentDraft(updatedDraft);
          setUploadedImage(updatedDraft.uploadedImage || '');
          setSelectedFrame(updatedDraft.selectedFrame || '');
          setEffectValues(updatedDraft.effectValues || {});
          toast.success('Action undone');
        }
      }
    } else {
      toast.info('Nothing to undo');
    }
  }, []);

  const handleToggleBackgroundRemoval = useCallback(() => {
    setShowBackgroundRemoval(!showBackgroundRemoval);
    toast.info(`Background removal ${!showBackgroundRemoval ? 'enabled' : 'disabled'}`);
  }, [showBackgroundRemoval]);

  const renderPhaseContent = () => {
    switch (currentPhase) {
      case 'upload':
        return (
          <UploadPhase
            uploadedImage={uploadedImage}
            onImageUpload={handleImageUpload}
            isProcessing={isProcessingImage}
            error={imageLoadError}
            showBackgroundRemoval={showBackgroundRemoval}
            onToggleBackgroundRemoval={handleToggleBackgroundRemoval}
          />
        );
        
      case 'frames':
        return (
          <FrameSelectionPhase
            selectedFrame={selectedFrame}
            onFrameSelect={handleFrameSelect}
            uploadedImage={uploadedImage}
            processedImage={processedImage}
          />
        );
        
      case 'effects':
        return (
          <EffectControlsPhase
            effectValues={effectValues}
            onEffectChange={handleEffectChange}
            uploadedImage={uploadedImage}
            selectedFrame={selectedFrame}
          />
        );
        
      case 'layers':
        return (
          <LayerManager
            uploadedImage={uploadedImage}
            selectedFrame={selectedFrame}
            effectValues={effectValues}
          />
        );
        
      case 'export':
        return (
          <div className="p-6 text-center">
            <h3 className="text-white text-xl mb-4">Ready to Export</h3>
            <Button
              onClick={() => setShowExportDialog(true)}
              className="bg-crd-green hover:bg-crd-green/90 text-black"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Card
            </Button>
          </div>
        );
        
      default:
        return null;
    }
  };

  // Auto-save status indicator
  const autoSaveStats = autoSaveService.getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-editor-dark via-black to-editor-dark">
      {/* Enhanced Studio Header */}
      <div className="border-b border-editor-border bg-editor-dark/50 backdrop-blur-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-white text-xl font-bold">Enhanced Card Studio</h1>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Phase: {currentPhase}</span>
              {autoSaveStats.saveCount > 0 && (
                <>
                  <span>•</span>
                  <span>Saves: {autoSaveStats.saveCount}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleUndo}
              disabled={!autoSaveService.canUndo()}
              className="text-white border-white/20 hover:bg-white/10"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Undo
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Phase Navigation */}
        <div className="w-16 bg-editor-dark border-r border-editor-border flex flex-col items-center py-4 space-y-4">
          {[
            { phase: 'upload' as StudioPhase, icon: Upload, label: 'Upload' },
            { phase: 'frames' as StudioPhase, icon: Image, label: 'Frames' },
            { phase: 'effects' as StudioPhase, icon: Sparkles, label: 'Effects' },
            { phase: 'layers' as StudioPhase, icon: Layers, label: 'Layers' },
            { phase: 'export' as StudioPhase, icon: Download, label: 'Export' }
          ].map(({ phase, icon: Icon, label }) => {
            const isDisabled = (phase === 'frames' && !uploadedImage) ||
                              (phase === 'effects' && (!uploadedImage || !selectedFrame));
            
            return (
              <Button
                key={phase}
                variant="ghost"
                size="sm"
                onClick={() => !isDisabled && handlePhaseChange(phase)}
                disabled={isDisabled}
                className={`w-12 h-12 p-0 rounded-lg transition-all ${
                  currentPhase === phase
                    ? 'bg-crd-green text-black'
                    : 'text-white hover:bg-white/10'
                } ${isDisabled ? 'opacity-30 cursor-not-allowed' : ''}`}
                title={label}
              >
                <Icon className="w-5 h-5" />
              </Button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Controls Panel */}
          <div className="w-96 bg-editor-tool border-r border-editor-border overflow-y-auto">
            {renderPhaseContent()}
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
