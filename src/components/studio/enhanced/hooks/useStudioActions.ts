
import { useCallback } from 'react';
import { imageProcessingService } from '@/services/imageProcessing/ImageProcessingService';
import { autoSaveService } from '@/services/autosave/AutoSaveService';
import { toast } from 'sonner';
import { useStudioState } from './useStudioState';

type StudioPhase = 'upload' | 'frames' | 'effects' | 'layers' | 'export';

export const useStudioActions = () => {
  const {
    currentPhase,
    setCurrentPhase,
    uploadedImage,
    selectedFrame,
    effectValues,
    setEffectValues,
    setUploadedImage,
    setSelectedFrame,
    setProcessedImage,
    setCurrentDraft,
    setIsProcessingImage,
    setImageLoadError,
    setShowBackgroundRemoval,
    showBackgroundRemoval,
    currentDraft,
    triggerAutoSave
  } = useStudioState();

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
  }, [currentPhase, currentDraft, showBackgroundRemoval, setIsProcessingImage, setImageLoadError, setProcessedImage, setUploadedImage, setCurrentDraft, setCurrentPhase]);

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
  }, [currentDraft, triggerAutoSave, setSelectedFrame]);

  const handleEffectChange = useCallback((effectId: string, value: any) => {
    console.log('✨ Effect changed:', effectId, value);
    const newEffectValues = {
      ...effectValues,
      [effectId]: value
    };
    
    setEffectValues(newEffectValues);
    triggerAutoSave('effect_change', { effectValues: newEffectValues });
  }, [effectValues, triggerAutoSave, setEffectValues]);

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
    triggerAutoSave('phase_change', {});
  }, [currentPhase, uploadedImage, selectedFrame, triggerAutoSave, setCurrentPhase]);

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
  }, [setCurrentDraft, setUploadedImage, setSelectedFrame, setEffectValues]);

  const handleToggleBackgroundRemoval = useCallback(() => {
    setShowBackgroundRemoval(!showBackgroundRemoval);
    toast.info(`Background removal ${!showBackgroundRemoval ? 'enabled' : 'disabled'}`);
  }, [showBackgroundRemoval, setShowBackgroundRemoval]);

  return {
    handleImageUpload,
    handleFrameSelect,
    handleEffectChange,
    handlePhaseChange,
    handleUndo,
    handleToggleBackgroundRemoval
  };
};
