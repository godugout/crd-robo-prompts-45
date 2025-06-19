
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

      // Create or update draft with error handling
      try {
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
      } catch (autoSaveError) {
        console.warn('⚠️ Auto-save failed, continuing anyway:', autoSaveError);
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
    
    try {
      triggerAutoSave('frame_select', {
        selectedFrame: frameId,
        processing: {
          ...currentDraft?.processing,
          frameApplied: true
        }
      });
    } catch (error) {
      console.warn('⚠️ Auto-save failed for frame selection:', error);
    }
    
    toast.success(`Frame "${frameId}" applied successfully!`);
  }, [currentDraft, triggerAutoSave, setSelectedFrame]);

  const handleEffectChange = useCallback((effectId: string, value: any) => {
    console.log('✨ Effect changed:', effectId, value);
    const newEffectValues = {
      ...effectValues,
      [effectId]: value
    };
    
    setEffectValues(newEffectValues);
    
    try {
      triggerAutoSave('effect_change', { effectValues: newEffectValues });
    } catch (error) {
      console.warn('⚠️ Auto-save failed for effect change:', error);
    }
  }, [effectValues, triggerAutoSave, setEffectValues]);

  const handlePhaseChange = useCallback((phase: StudioPhase) => {
    console.log('🔄 Phase change:', currentPhase, '->', phase);
    
    // More permissive phase validation - just warn instead of blocking
    if (phase === 'frames' && !uploadedImage) {
      toast.warning('Consider uploading an image first, but you can browse frames');
    }
    
    if (phase === 'effects' && (!uploadedImage || !selectedFrame)) {
      toast.warning('For best results, upload an image and select a frame first');
    }
    
    setCurrentPhase(phase);
    
    try {
      triggerAutoSave('phase_change', {});
    } catch (error) {
      console.warn('⚠️ Auto-save failed for phase change:', error);
    }
  }, [currentPhase, uploadedImage, selectedFrame, triggerAutoSave, setCurrentPhase]);

  const handleUndo = useCallback(() => {
    try {
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
    } catch (error) {
      console.error('❌ Undo failed:', error);
      toast.error('Failed to undo action');
    }
  }, [setCurrentDraft, setUploadedImage, setSelectedFrame, setEffectValues]);

  const handleToggleBackgroundRemoval = useCallback(() => {
    setShowBackgroundRemoval(!showBackgroundRemoval);
    toast.info(`Background removal ${!showBackgroundRemoval ? 'enabled' : 'disabled'}`);
  }, [showBackgroundRemoval, setShowBackgroundRemoval]);

  // Emergency reset function
  const handleReset = useCallback(() => {
    console.log('🔄 Emergency reset triggered');
    
    try {
      // Clear auto-save state
      autoSaveService.clearDraft();
    } catch (error) {
      console.warn('⚠️ Failed to clear auto-save:', error);
    }
    
    try {
      // Clear image processing cache
      imageProcessingService.clearCache();
    } catch (error) {
      console.warn('⚠️ Failed to clear image cache:', error);
    }
    
    // Reset all state
    setCurrentPhase('upload');
    setUploadedImage('');
    setSelectedFrame('');
    setEffectValues({});
    setCurrentDraft(null);
    setProcessedImage(null);
    setIsProcessingImage(false);
    setImageLoadError('');
    setShowBackgroundRemoval(false);
    
    toast.success('Studio reset successfully');
  }, [
    setCurrentPhase, setUploadedImage, setSelectedFrame, setEffectValues,
    setCurrentDraft, setProcessedImage, setIsProcessingImage, 
    setImageLoadError, setShowBackgroundRemoval
  ]);

  return {
    handleImageUpload,
    handleFrameSelect,
    handleEffectChange,
    handlePhaseChange,
    handleUndo,
    handleToggleBackgroundRemoval,
    handleReset
  };
};
